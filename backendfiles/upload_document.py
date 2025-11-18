import os
import pandas as pd
from datetime import datetime

class UploadDocumentService:
    def __init__(self):
        # Folder and Excel file setup
        self.data_folder = os.path.join(os.getcwd(), 'data')
        os.makedirs(self.data_folder, exist_ok=True)
        self.excel_path = os.path.join(self.data_folder, 'expenses.xlsx')

        # Create Excel file with headers if it doesn’t exist
        if not os.path.exists(self.excel_path):
            df = pd.DataFrame(columns=[
                "Username",
                "Date",
                "Category",
                "Description",
                "Payment Method",
                "Amount",
                "Notes",
                "Recorded At"
            ])
            df.to_excel(self.excel_path, index=False)

    def save_expense(self, username, date, category, description, payment_method, amount, notes):
        """Save new expense record into the Excel file."""
        new_entry = {
            "Username": username,
            "Date": date,
            "Category": category,
            "Description": description,
            "Payment Method": payment_method,
            "Amount": float(amount),
            "Notes": notes,
            "Recorded At": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        df_existing = pd.read_excel(self.excel_path)
        df_updated = pd.concat([df_existing, pd.DataFrame([new_entry])], ignore_index=True)
        df_updated.to_excel(self.excel_path, index=False)

        return self.excel_path

    def get_all_expenses(self):
        """Retrieve all expenses as a DataFrame."""
        if os.path.exists(self.excel_path):
            return pd.read_excel(self.excel_path)
        else:
            return pd.DataFrame()
