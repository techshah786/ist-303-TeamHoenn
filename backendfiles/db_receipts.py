import mysql.connector

def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="12345",
        database="user_management"
    )
    return conn


def insert_receipt(user_id, merchant, receipt_date, total, category_summary, raw_file_path):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO receipts (user_id, merchant, receipt_date, total, category_summary, raw_file_path)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (user_id, merchant, receipt_date, total, category_summary, raw_file_path)
    )
    conn.commit()
    receipt_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return receipt_id


def get_receipts_by_user(user_id):
    """Retrieve all receipts uploaded by a specific user."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM receipts WHERE user_id=%s ORDER BY created_at DESC", (user_id,))
    receipts = cursor.fetchall()
    cursor.close()
    conn.close()
    return receipts


def insert_receipt_item(receipt_id, item_name, category, quantity, price):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO receipt_items (receipt_id, item_name, category, quantity, price)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (receipt_id, item_name, category, quantity, price)
    )
    conn.commit()
    cursor.close()
    conn.close()


def get_items_by_receipt(receipt_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM receipt_items WHERE receipt_id=%s", (receipt_id,))
    items = cursor.fetchall()
    cursor.close()
    conn.close()
    return items
