from database.db_connection import get_db_connection

create_table_sql = """
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARBINARY(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
"""

try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(create_table_sql)
    conn.commit()
    print("users table created or already exists")
except Exception as e:
    print("Error creating users table:", e)
finally:
    try:
        cursor.close()
        conn.close()
    except:
        pass
