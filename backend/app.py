from flask import Flask
# from flask_cors import CORS
from flask_cors import CORS

from database.db_connection import get_db_connection
from flask import Flask, request, jsonify
import bcrypt
from ai.ai_stub import generate_resume_content


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


# AI Content Generation endpoint
# @app.route("/generate-ai-content", methods=["POST"])
# def generate_ai_content():
#     data = request.json

#     role = data.get("role")
#     skills = data.get("skills")
#     experience = data.get("experience")

#     if not all([role, skills, experience]):
#         return jsonify({"error": "All fields are required"}), 400

#     ai_text = generate_resume_content(role, skills, experience)

#     return jsonify({
#         "ai_content": ai_text
#     }), 200


# if __name__ == "__main__":
#     app.run(debug=True)

# from flask import request, jsonify
# from ai.gemini_service import generate_ai_content

# @app.route("/generate-ai-content", methods=["POST"])
# def generate_ai():

#     try:
#         data = request.get_json()

#         if not data:
#             return jsonify({"error": "No JSON data received"}), 400

#         job_title = data.get("job_title")

#         if not job_title:
#             return jsonify({"error": "job_title is required"}), 400

#         ai_text = generate_ai_content(job_title)

#         return jsonify({
#             "success": True,
#             "content": ai_text
#         })

#     except Exception as e:
#         print("AI ERROR:", str(e))
#         return jsonify({"error": str(e)}), 500



from flask import request, jsonify
from ai.gemini_service import generate_ai_content

# @app.route("/generate-ai-content", methods=["POST"])
# def generate_ai_content_route():

#     try:
#         data = request.get_json()

#         print("Received data:", data)

#         if not data:
#             return jsonify({"error": "No JSON received"}), 400

#         job_title = data.get("job_title")

#         if not job_title:
#             return jsonify({"error": "job_title missing"}), 400

#         ai_text = generate_ai_content(job_title)

#         print("AI Generated:", ai_text)

#         return jsonify({
#             "content": ai_text
#         }), 200

#     except Exception as e:
#         print("ERROR:", str(e))
#         return jsonify({"error": str(e)}), 500

# @app.route("/generate-ai-content", methods=["POST"])
# def generate_ai_content_route():

#     data = request.get_json()

#     job_title = data.get("job_title")

#     ai_data = generate_ai_content(job_title)

#     return jsonify(ai_data)


# @app.route("/generate-ai-content", methods=["POST"])
# def generate_ai_content_route():

#     try:
#         data = request.get_json()

#         if not data:
#             return jsonify({
#                 "summary": "",
#                 "skills": [],
#                 "experience": ""
#             })

#         job_title = data.get("job_title", "Professional")

#         ai_data = generate_ai_content(job_title)

#         return jsonify(ai_data)

#     except Exception as e:

#         print("AI ERROR:", str(e))

#         return jsonify({
#             "summary": f"Motivated {job_title} with strong technical skills.",
#             "skills": ["Communication", "Problem Solving"],
#             "experience": "Worked on various academic and personal projects."
#         })

# new new AI route with fallback to ensure we always return something even if AI fails
@app.route("/generate-ai-content", methods=["POST"])
def generate_ai_content_route():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "summary": "Motivated professional with strong skills.",
                "skills": ["Communication", "Problem Solving"],
                "experience": "Worked on academic and personal projects."
            })

        job_title = data.get("job_title", "Professional")

        ai_data = generate_ai_content(job_title)

        print("AI DATA:", ai_data)

        # Ensure ai_data is always valid
        if not ai_data:
            return jsonify({
                "summary": f"Motivated {job_title} with strong analytical and technical skills.",
                "skills": ["Communication", "Teamwork", "Problem Solving"],
                "experience": f"Worked on projects related to {job_title}."
            })

        # Ensure keys exist
        return jsonify({
            "summary": ai_data.get("summary", f"Motivated {job_title} with strong professional skills."),
            "skills": ai_data.get("skills", ["Communication", "Problem Solving", "Teamwork"]),
            "experience": ai_data.get("experience", f"Worked on projects related to {job_title}.")
        })

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "summary": "Motivated professional with strong skills.",
            "skills": ["Communication", "Teamwork"],
            "experience": "Worked on academic and personal projects."
        })


if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(host="127.0.0.1", port=5000, debug=True)

