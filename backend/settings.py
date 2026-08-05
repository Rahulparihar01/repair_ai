"""Runtime configuration for the application.

Set ``DATABASE_URL`` in the environment to use MySQL, PostgreSQL, or another
SQLAlchemy-supported database. A local SQLite database is used for development.
"""

import os


db_url = os.getenv("DATABASE_URL", "sqlite:///./auth_app.db")
