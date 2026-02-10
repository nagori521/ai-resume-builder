from flask import Flask
from flask_cors import CORS
from database.db_connection import get_db_connection
from flask import Flask, request, jsonify
import bcrypt


app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    try:
        conn = get_db_connection()
        return "Backend file + Database files connected successfully"
    except Exception as e:
        return f"Database connection failed: {e}"


#signup route

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

    # Hash password
    # Hash password and store as UTF-8 string so it fits VARCHAR columns
    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if email already exists
        cursor.execute(
            "SELECT user_id FROM users WHERE email = %s",
            (email,)
        )
        if cursor.fetchone():
            return jsonify({"error": "Email already registered"}), 409

        # Insert user
        cursor.execute(
            """
            INSERT INTO users (first_name, last_name, email, password, phone, status)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (first_name, last_name, email, hashed_password, phone, "active")
        )

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
        return jsonify({"error": "Email and password are required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT user_id, password FROM users WHERE email = %s",
            (email,)
        )
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "User not found"}), 404

        user_id, stored_hash = row
        if isinstance(stored_hash, bytes):
            stored_hash = stored_hash.decode("utf-8")

        if bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8")):
            return jsonify({"message": "Login successful", "user_id": user_id}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


# Resume CRUD routes

@app.route("/save-resume", methods=["POST"])
def save_resume():
    data = request.json
    user_id = data.get("user_id")
    template_id = data.get("template_id", 1)
    education = data.get("education", "")
    skills = data.get("skills", "")
    experience = data.get("experience", "")
    projects = data.get("projects", "")
    ai_content = data.get("ai_content", "")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            """
            INSERT INTO resumes (user_id, template_id, education, skills, experience, projects, ai_content)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (user_id, template_id, education, skills, experience, projects, ai_content)
        )
        
        conn.commit()
        resume_id = cursor.lastrowid
        
        return jsonify({"message": "Resume saved successfully", "resume_id": resume_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


@app.route("/get-resume/<int:resume_id>", methods=["GET"])
def get_resume(resume_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT resume_id, user_id, template_id, education, skills, experience, projects, ai_content, created_at, updated_at FROM resumes WHERE resume_id = %s",
            (resume_id,)
        )
        
        row = cursor.fetchone()
        
        if not row:
            return jsonify({"error": "Resume not found"}), 404
        
        resume = {
            "resume_id": row[0],
            "user_id": row[1],
            "template_id": row[2],
            "education": row[3],
            "skills": row[4],
            "experience": row[5],
            "projects": row[6],
            "ai_content": row[7],
            "created_at": str(row[8]),
            "updated_at": str(row[9])
        }
        
        return jsonify(resume), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


@app.route("/update-resume/<int:resume_id>", methods=["PUT"])
def update_resume(resume_id):
    data = request.json
    education = data.get("education")
    skills = data.get("skills")
    experience = data.get("experience")
    projects = data.get("projects")
    ai_content = data.get("ai_content")
    template_id = data.get("template_id")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if resume exists
        cursor.execute("SELECT user_id FROM resumes WHERE resume_id = %s", (resume_id,))
        if not cursor.fetchone():
            return jsonify({"error": "Resume not found"}), 404
        
        # Build update query dynamically
        updates = []
        params = []
        
        if education is not None:
            updates.append("education = %s")
            params.append(education)
        if skills is not None:
            updates.append("skills = %s")
            params.append(skills)
        if experience is not None:
            updates.append("experience = %s")
            params.append(experience)
        if projects is not None:
            updates.append("projects = %s")
            params.append(projects)
        if ai_content is not None:
            updates.append("ai_content = %s")
            params.append(ai_content)
        if template_id is not None:
            updates.append("template_id = %s")
            params.append(template_id)
        
        if not updates:
            return jsonify({"error": "No fields to update"}), 400
        
        params.append(resume_id)
        
        query = "UPDATE resumes SET " + ", ".join(updates) + " WHERE resume_id = %s"
        cursor.execute(query, params)
        conn.commit()
        
        return jsonify({"message": "Resume updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


@app.route("/delete-resume/<int:resume_id>", methods=["DELETE"])
def delete_resume(resume_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if resume exists
        cursor.execute("SELECT user_id FROM resumes WHERE resume_id = %s", (resume_id,))
        if not cursor.fetchone():
            return jsonify({"error": "Resume not found"}), 404
        
        cursor.execute("DELETE FROM resumes WHERE resume_id = %s", (resume_id,))
        conn.commit()
        
        return jsonify({"message": "Resume deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


if __name__ == "__main__":
    app.run(debug=True)

