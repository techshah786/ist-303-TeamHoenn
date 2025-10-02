
import mysql.connector

# Function to get a database connection
def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",       # Replace with your MySQL username
        password="12345", # Replace with your MySQL password
        database="user_management"
    )
    return conn

# Function to check login
def check_login(user_id, password):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE user_id=%s AND password=%s", (user_id, password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

# Function to check if user exists
def user_exists(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE user_id=%s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

# Function to create a new user
def create_user(user_id, first_name, last_name, password):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (user_id, first_name, last_name, password) VALUES (%s, %s, %s, %s)",
        (user_id, first_name, last_name, password)
    )
    conn.commit()
    cursor.close()
    conn.close()



