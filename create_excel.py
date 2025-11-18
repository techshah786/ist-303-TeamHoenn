import pandas as pd
import os

data_dir = os.path.join(os.getcwd(), 'data')
os.makedirs(data_dir, exist_ok=True)

excel_path = os.path.join(data_dir, 'expenses.xlsx')

columns = [
    "Username", "Date", "Category", "Description",
    "Payment Method", "Amount", "Notes", "Recorded At"
]

# Create empty DataFrame with correct headers
df = pd.DataFrame(columns=columns)
df.to_excel(excel_path, index=False)

print(f"✅ Created Excel file at: {excel_path}")

