"""
Financial Tracker Flask Application
"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Initialize extensions
db = SQLAlchemy()

def create_app(config=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///financial_tracker.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    if config:
        app.config.update(config)
    
    # Initialize extensions with app
    db.init_app(app)
    
    # Register routes (if you have them)
    # from app import routes
    # app.register_blueprint(routes.bp)
    
    @app.route('/')
    def index():
        return '<h1>Financial Tracker - Welcome!</h1><p>Application is running successfully.</p>'
    
    return app
