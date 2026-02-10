from database.db_connection import get_db_connection

create_resume_table_sql = """
CREATE TABLE IF NOT EXISTS resumes (
    resume_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    template_id INT,
    education TEXT,
    skills TEXT,
    experience TEXT,
    projects TEXT,
    ai_content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB;
"""

try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(create_resume_table_sql)
    conn.commit()
    print("resumes table created or already exists")
except Exception as e:
    print("Error creating resumes table:", e)
finally:
    try:
        cursor.close()
        conn.close()
    except:
        pass
