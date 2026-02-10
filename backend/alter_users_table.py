from database.db_connection import get_db_connection

alter_sql = """
ALTER TABLE users
MODIFY password VARCHAR(255) NOT NULL;
"""

try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(alter_sql)
    conn.commit()
    print("users.password column altered to VARCHAR(255)")
except Exception as e:
    print("Error altering users table:", e)
finally:
    try:
        cursor.close()
        conn.close()
    except:
        pass
