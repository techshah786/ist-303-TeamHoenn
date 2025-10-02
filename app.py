from flask import Flask, render_template, request, redirect, url_for, session
import db  

app = Flask(__name__)
app.secret_key = "supersecretkey123"  # Required for session management

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = db.check_login(username, password)

        if user:
            session['user'] = username   # ✅ Store session
            return redirect(url_for('home'))
        else:
            if db.user_exists(username):
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
            session['user'] = username   # ✅ Auto login after signup
            return redirect(url_for('home'))

    return render_template('signup.html', error=error)

@app.route('/home')
def home():
    if 'user' not in session:   # ✅ Protect route
        return redirect(url_for('login'))
    return render_template('home.html', user=session['user'])

@app.route('/logout')
def logout():
    session.pop('user', None)   # ✅ Clear session
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)

