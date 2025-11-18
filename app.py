from flask import Flask, render_template, request, redirect, url_for, session, send_file
import os
import db
from backendfiles.weekly_report import WeeklyReportService
from backendfiles.monthly_report import MonthlyReportService
from backendfiles.yearly_report import YearlyReportService
from backendfiles.upload_document import UploadDocumentService

app = Flask(__name__)
app.secret_key = "supersecretkey123"

# ----------------------------------------------------
# INDEX
# ----------------------------------------------------
@app.route('/')
def index():
    return redirect(url_for('login'))


# ----------------------------------------------------
# LOGIN / SIGNUP / LOGOUT
# ----------------------------------------------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = db.check_login(username, password)

        if user:
            session['user'] = username
            return redirect(url_for('home'))
        elif db.user_exists(username):
            error = "Incorrect password. Please try again."
        else:
            return redirect(url_for('signup'))

    return render_template('login.html', error=error)


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        first_name = request.form['first_name']
        last_name = request.form['last_name']

        if db.user_exists(username):
            error = "User already exists. Please login."
        else:
            db.create_user(username, first_name, last_name, password)
            session['user'] = username
            return redirect(url_for('home'))

    return render_template('signup.html', error=error)


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))


# ----------------------------------------------------
# HOME
# ----------------------------------------------------
@app.route('/home')
def home():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('home.html', user=session['user'], active_page='home')


# ----------------------------------------------------
# REPORTS
# ----------------------------------------------------
@app.route('/weekly')
def weekly_report():
    if 'user' not in session:
        return redirect(url_for('login'))

    service = WeeklyReportService()
    data = service.get_weekly_data()
    return render_template('weekly.html', user=session['user'], active_page='weekly', data=data)


@app.route('/monthly')
def monthly_report():
    if 'user' not in session:
        return redirect(url_for('login'))

    service = MonthlyReportService()
    data = service.get_monthly_data()
    return render_template('monthly.html', user=session['user'], active_page='monthly', data=data)


@app.route('/yearly')
def yearly_report():
    if 'user' not in session:
        return redirect(url_for('login'))

    service = YearlyReportService()
    data = service.get_yearly_data()
    return render_template('yearly.html', user=session['user'], active_page='yearly', data=data)


# ----------------------------------------------------
# ADD EXPENSE FORM (UPLOAD)
# ----------------------------------------------------
@app.route('/upload', methods=['GET', 'POST'])
def upload_docs():
    if 'user' not in session:
        return redirect(url_for('login'))

    service = UploadDocumentService()
    message = None

    if request.method == 'POST':
        date = request.form.get('date')
        category = request.form.get('category')
        description = request.form.get('description')
        payment_method = request.form.get('payment_method')
        amount = request.form.get('amount')
        notes = request.form.get('notes')

        if not date or not category or not amount:
            message = "⚠️ Please fill in required fields: Date, Category, and Amount."
        else:
            file_path = service.save_expense(
                session['user'],
                date,
                category,
                description,
                payment_method,
                amount,
                notes
            )
            message = f"✅ Expense saved successfully to {os.path.basename(file_path)}."

    return render_template('upload.html', user=session['user'], active_page='upload', message=message)


# ----------------------------------------------------
# VIEW RECORDS
# ----------------------------------------------------
@app.route('/records', methods=['GET'])
def view_records():
    if 'user' not in session:
        return redirect(url_for('login'))

    service = UploadDocumentService()
    df = service.get_all_expenses()

    # Convert dataframe to list of dicts for template rendering
    records = df.to_dict(orient='records') if not df.empty else []
    message = None if not df.empty else "No expense records found."

    return render_template(
        'records.html',
        user=session['user'],
        active_page='records',
        records=records,
        message=message
    )


# ----------------------------------------------------
# DOWNLOAD EXCEL
# ----------------------------------------------------
@app.route('/download_excel', methods=['GET'])
def download_excel():
    if 'user' not in session:
        return redirect(url_for('login'))

    file_path = os.path.join(os.getcwd(), 'data', 'expenses.xlsx')
    if not os.path.exists(file_path):
        return "No data file found.", 404

    return send_file(file_path, as_attachment=True)


# ----------------------------------------------------
# RUN APP
# ----------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True)
