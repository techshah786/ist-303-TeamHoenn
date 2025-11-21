from setuptools import setup, find_packages

setup(
    name='financial-tracker',
    version='1.0.0',
    packages=find_packages(),
    install_requires=[
        'Flask',
        'Flask-SQLAlchemy',
        'pytest',
        'pytest-cov',
    ],
)
