#!/usr/bin/env python
"""
IST 303 TeamHoenn - Financial Tracker Application
Entry point for the Flask application
"""

from app import create_app, db

# Create Flask app instance
app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Create database tables if they don't exist
        db.create_all()
    
    # Run the development server
    print("Starting Financial Tracker Application...")
    print("Open http://localhost:5000 in your browser")
    app.run(debug=True, host='0.0.0.0', port=5000)
