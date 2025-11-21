# How to Run IST 303 TeamHoenn Application

## Quick Start (5 minutes)

```bash
# Clone the repository
git clone https://github.com/techshah786/ist-303-TeamHoenn.git
cd ist-303-TeamHoenn

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python run.py

# Open browser to http://localhost:5000
```

---

## Detailed Setup Instructions

### Prerequisites

Before starting, ensure you have:

- **Python 3.8 or higher** installed
  ```bash
  python --version
  ```
  
- **pip** (Python package manager)
  ```bash
  pip --version
  ```

- **Git** for cloning the repository
  ```bash
  git --version
  ```

- **~500 MB** free disk space

- **Text editor or IDE** (VS Code, PyCharm, Sublime, etc.)

---

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/techshah786/ist-303-TeamHoenn.git
cd ist-303-TeamHoenn
```

This downloads the project to your computer and navigates into the directory.

**Expected output:**
```
Cloning into 'ist-303-TeamHoenn'...
remote: Enumerating objects: ...
Receiving objects: 100% ...
```

---

### Step 2: Create Virtual Environment

A virtual environment isolates project dependencies from your system Python.

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows (Command Prompt):**
```bash
python -m venv venv
venv\Scripts\activate
```

**On Windows (PowerShell):**
```bash
python -m venv venv
venv\Scripts\Activate.ps1
```

**Verification:**
You should see `(venv)` prefix in your terminal prompt:
```
(venv) user@computer ist-303-TeamHoenn %
```

---

### Step 3: Upgrade pip (Recommended)

```bash
pip install --upgrade pip
```

This ensures you have the latest pip version for better package management.

---

### Step 4: Install Dependencies

Install all required Python packages:

```bash
pip install -r requirements.txt
```

**Expected output:**
```
Collecting Flask==2.3.2
  Using cached Flask-2.3.2-py3-none-any.whl
Installing collected packages: Werkzeug, Jinja2, Flask, ...
Successfully installed [package list]
```

**What gets installed:**
- Flask (web framework)
- SQLAlchemy (database ORM)
- Flask-SQLAlchemy (Flask + SQLAlchemy integration)
- pytest (testing framework)
- pytest-cov (test coverage tool)
- python-dotenv (environment variables)
- Any other project-specific packages

---

### Step 5: Environment Configuration (If Needed)

If the project uses a `.env` file for configuration:

```bash
# Copy example environment file
cp .env.example .env

# Edit with your configuration (optional for basic setup)
nano .env
```

Common variables to configure:
```
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///app.db
SECRET_KEY=your-secret-key-here
```

---

### Step 6: Initialize Database (If Applicable)

If the project uses a database:

```bash
# Create database tables
python -c "from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all()"

# OR if there's a setup script
python setup_db.py

# OR if using Flask migrations
flask db upgrade
```

**Expected output:**
```
Database tables created successfully
```

**Verification:**
Check that `app.db` or similar database file was created:
```bash
ls -la *.db
```

---

### Step 7: Run the Application

Start the Flask development server:

```bash
python run.py
```

**Alternative command:**
```bash
flask run
```

**Expected output:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
 * Restarting with reloader
 * Debugger is active!
```

---

### Step 8: Access the Application

Open your web browser and navigate to:

```
http://localhost:5000
```

**Expected behavior:**
- ✅ Application loads without errors
- ✅ Homepage displays correctly
- ✅ Navigation menu works
- ✅ No 404 or 500 errors

**Common URLs:**
- Home: `http://localhost:5000/`
- Login: `http://localhost:5000/login`
- Dashboard: `http://localhost:5000/dashboard`
- [Add your app-specific URLs]

---

### Step 9: Stop the Application

To stop the running server, press:

```bash
CTRL + C
```

**Expected output:**
```
Shutting down Flask development server
```

---

## Running Tests

### Run All Tests

```bash
pytest
```

**Expected output:**
```
======================== test session starts =========================
collected 15 items

tests/test_app.py .....                                        [ 33%]
tests/test_models.py .....                                     [ 66%]
tests/test_routes.py .....                                     [100%]

======================= 15 passed in 0.52s ==========================
```

### Run Tests with Coverage

```bash
pytest --cov=app
```

**Expected output:**
```
======================== test session starts =========================
collected 15 items

tests/test_app.py .....                                        [ 33%]
tests/test_models.py .....                                     [ 66%]
tests/test_routes.py .....                                     [100%]

----------- coverage: platform linux -- Python 3.11.x -----------
Name              Stmts   Miss  Cover
--------------------------------------
app/__init__.py       10      2    80%
app/models.py         45      3    93%
app/routes.py         60      5    92%
--------------------------------------
TOTAL               145     11    92%

======================= 15 passed in 0.52s ==========================
```

### Generate HTML Coverage Report

```bash
pytest --cov=app --cov-report=html
open htmlcov/index.html  # On macOS
```

This creates a detailed HTML report in the `htmlcov/` directory.

---

## Troubleshooting

### Issue: "python command not found"

**Solution:** Use `python3` instead on some systems:
```bash
python3 run.py
```

Or check if Python is in your PATH:
```bash
which python
```

---

### Issue: "Permission denied" on venv/bin/activate

**Solution:** Make the file executable:
```bash
chmod +x venv/bin/activate
source venv/bin/activate
```

---

### Issue: "ModuleNotFoundError: No module named 'flask'"

**Solution:** Ensure virtual environment is activated:
```bash
# Check if (venv) appears in prompt
# If not, run:
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

Then reinstall dependencies:
```bash
pip install -r requirements.txt
```

---

### Issue: "Port 5000 already in use"

**Solution:** Use a different port:
```bash
flask run --port 5001
```

Or kill the process using port 5000:
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

### Issue: "Database locked" error

**Solution:** Delete the database file and reinitialize:
```bash
rm app.db
python -c "from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all()"
```

---

### Issue: Tests failing

**Solution:** Ensure test database is clean:
```bash
# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_app.py -v

# Run with detailed output on failures
pytest -vv --tb=short
```

---

## Project Structure

```
ist-303-TeamHoenn/
├── app/                          # Main application package
│   ├── __init__.py              # App initialization & configuration
│   ├── models.py                # Database models
│   ├── routes.py                # URL routes & views
│   ├── forms.py                 # Flask-WTF forms (if used)
│   └── templates/               # HTML templates
│       ├── base.html            # Base template
│       ├── index.html           # Home page
│       ├── login.html           # Login page
│       └── [other templates]
│
├── tests/                        # Test suite
│   ├── __init__.py
│   ├── test_app.py              # App tests
│   ├── test_models.py           # Model tests
│   ├── test_routes.py           # Route tests
│   └── conftest.py              # Pytest configuration
│
├── docs/                         # Documentation
│   ├── SETUP.md                 # Setup instructions
│   ├── TESTING.md               # Testing documentation
│   ├── BURNDOWN.csv             # Sprint burndown
│   └── LESSONS_LEARNED.md       # Team retrospective
│
├── run.py                        # Application entry point
├── config.py                     # Configuration file
├── requirements.txt              # Python dependencies
├── .env.example                  # Example environment variables
├── .gitignore                    # Git ignore rules
├── .github/workflows/            # CI/CD workflows
│   └── ci.yml                    # GitHub Actions workflow
├── README.md                     # Project documentation
└── .git/                         # Git repository
```

---

## Environment Variables Reference

If using `.env` file, common variables:

```bash
# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=True

# Database
DATABASE_URL=sqlite:///app.db
# OR for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/dbname

# Security
SECRET_KEY=your-super-secret-key-change-in-production

# Email (if applicable)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# External APIs (if applicable)
API_KEY=your-api-key-here
```

---

## Common Development Commands

```bash
# Activate virtual environment
source venv/bin/activate

# Deactivate virtual environment
deactivate

# Install new package
pip install package-name

# Update requirements file
pip freeze > requirements.txt

# Run specific test
pytest tests/test_models.py::test_user_creation -v

# Run development server with live reload
flask run --reload

# Access Flask shell for debugging
flask shell

# Reset database
rm app.db && python -c "from app import create_app, db; ..."
```

---

## Performance Tips

1. **Use `.env` file** for sensitive data (never commit)
2. **Keep requirements.txt updated** after adding packages
3. **Run tests frequently** during development
4. **Use debugger** with `FLASK_DEBUG=True`
5. **Monitor database** for query performance
6. **Use virtual environment** for isolation

---

## Next Steps

After successfully running the application:

1. ✅ Explore the user interface
2. ✅ Review the code structure in `app/`
3. ✅ Run the test suite: `pytest`
4. ✅ Check coverage: `pytest --cov=app`
5. ✅ Read the documentation in `docs/`
6. ✅ Review the burndown chart
7. ✅ Check out the GitHub Actions CI/CD

---

## Additional Resources

- **Flask Documentation:** https://flask.palletsprojects.com/
- **SQLAlchemy ORM:** https://docs.sqlalchemy.org/
- **pytest Documentation:** https://docs.pytest.org/
- **GitHub Actions:** https://docs.github.com/en/actions
- **Virtual Environments:** https://docs.python.org/3/tutorial/venv.html

---

## Support & Questions

If you encounter issues:

1. Check this guide's "Troubleshooting" section
2. Review GitHub Issues in the repository
3. Check `docs/` folder for additional documentation
4. Review test files for usage examples
5. Check application logs for error messages

---

**Last Updated:** November 20, 2025  
**Python Version:** 3.8+  
**Flask Version:** 2.3.2+  
**Status:** ✅ Ready for deployment
