from flask import Flask, request, jsonify
from flask_cors import CORS
from database.db_connection import get_db_connection
import bcrypt
from ai.gemini_service import generate_ai_content

app = Flask(__name__)
CORS(app)


# =========================
# Home Route
# =========================
@app.route("/")
def home():
    try:
        conn = get_db_connection()
        conn.close()
        return "Backend + MySQL Connected Successfully"
    except Exception as e:
        return f"Database connection failed: {e}"


# =========================
# USER AUTH ROUTES
# =========================

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")

    if not all([first_name, last_name, email, password, phone]):
        return jsonify({"error": "All fields are required"}), 400

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already registered"}), 409

        cursor.execute("""
            INSERT INTO users (first_name, last_name, email, password, phone, status)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (first_name, last_name, email, hashed_password, phone, "active"))

        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"error": "Email and password required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT user_id, password FROM users WHERE email = %s", (email,))
        row = cursor.fetchone()

        if not row:
            return jsonify({"error": "User not found"}), 404

        user_id, stored_hash = row

        if bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8")):
            return jsonify({"message": "Login successful", "user_id": user_id}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# =========================
# ADMIN AUTH ROUTE
# =========================

@app.route("/admin-login", methods=["POST"])
def admin_login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"error": "Email and password required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT admin_id, admin_password FROM admin WHERE admin_email = %s",
            (email,)
        )

        row = cursor.fetchone()

        if not row:
            return jsonify({"error": "Admin not found"}), 404

        admin_id, stored_hash = row

        if bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8")):
            return jsonify({
                "message": "Admin login successful",
                "admin_id": admin_id
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# =========================
# ADMIN DASHBOARD ROUTES
# =========================

# @app.route("/admin/users", methods=["GET"])
# def get_all_users():
#     try:
#         conn = get_db_connection()
#         cursor = conn.cursor(dictionary=True)

#         cursor.execute("""
#             SELECT user_id, first_name, last_name, email, phone, status, created_at
#             FROM users
#         """)
#         users = cursor.fetchall()

#         return jsonify(users), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#     finally:
#         cursor.close()
#         conn.close()

@app.route("/admin/users", methods=["GET"])
def get_all_users():

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get query parameters
        search = request.args.get("search", "")
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 5))
        offset = (page - 1) * limit

        # Base query
        base_query = """
            SELECT user_id, first_name, last_name, email, phone, status, created_at
            FROM users
        """

        count_query = "SELECT COUNT(*) FROM users"

        params = []

        # If search provided
        if search:
            base_query += """
                WHERE first_name LIKE %s 
                OR last_name LIKE %s 
                OR email LIKE %s
            """
            count_query += """
                WHERE first_name LIKE %s 
                OR last_name LIKE %s 
                OR email LIKE %s
            """
            search_term = f"%{search}%"
            params.extend([search_term, search_term, search_term])

        # Add pagination
        base_query += " LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cursor.execute(base_query, tuple(params))
        users = cursor.fetchall()

        # Count total records
        if search:
            cursor.execute(count_query, (search_term, search_term, search_term))
        else:
            cursor.execute(count_query)

        total_records = cursor.fetchone()["COUNT(*)"]
        total_pages = (total_records + limit - 1) // limit

        return jsonify({
            "users": users,
            "total_pages": total_pages,
            "current_page": page
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route("/admin/resumes", methods=["GET"])
def get_all_resumes():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT r.resume_id, r.user_id, u.first_name, u.last_name,
                   r.template_id, r.created_at
            FROM resumes r
            JOIN users u ON r.user_id = u.user_id
        """)
        resumes = cursor.fetchall()

        return jsonify(resumes), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


@app.route("/admin/delete-user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM resumes WHERE user_id = %s", (user_id,))
        cursor.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
        conn.commit()

        return jsonify({"message": "User deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


@app.route("/admin/stats", methods=["GET"])
def admin_stats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM users")
        total_users = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM resumes")
        total_resumes = cursor.fetchone()[0]

        return jsonify({
            "total_users": total_users,
            "total_resumes": total_resumes
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Monthly stats route
@app.route("/admin/monthly-stats", methods=["GET"])
def monthly_stats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Users per month
        cursor.execute("""
            SELECT MONTH(created_at) AS month, COUNT(*) 
            FROM users
            GROUP BY MONTH(created_at)
        """)
        user_data = cursor.fetchall()

        # Resumes per month
        cursor.execute("""
            SELECT MONTH(created_at) AS month, COUNT(*) 
            FROM resumes
            GROUP BY MONTH(created_at)
        """)
        resume_data = cursor.fetchall()

        return jsonify({
            "users": user_data,
            "resumes": resume_data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# =========================
# AI ROUTE
# =========================

@app.route("/generate-ai-content", methods=["POST"])
def generate_ai_content_route():
    try:
        data = request.get_json()
        job_title = data.get("job_title", "Professional")

        ai_data = generate_ai_content(job_title)

        if not ai_data:
            return jsonify({
                "summary": f"Motivated {job_title} with strong professional skills.",
                "skills": ["Communication", "Teamwork"],
                "experience": f"Worked on projects related to {job_title}."
            })

        return jsonify(ai_data)

    except Exception as e:
        print("AI ERROR:", e)
        return jsonify({
            "summary": "Motivated professional with strong skills.",
            "skills": ["Communication", "Teamwork"],
            "experience": "Worked on academic and personal projects."
        })


if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(host="127.0.0.1", port=5000, debug=True)
