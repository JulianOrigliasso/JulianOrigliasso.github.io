from sqlalchemy import create_engine, text
import os
import sys
from pathlib import Path

# Add the parent directory to Python path to import app modules
sys.path.append(str(Path(__file__).parent.parent))

from app.core.database import Base
from app.models import property, transaction, user  # Import all models to ensure they're registered with Base

def init_db(host, user, password, database):
    try:
        # Construct database URL
        db_url = f"mysql://{user}:{password}@{host}/{database}"

        # Create engine
        engine = create_engine(db_url)

        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✓ All database tables created successfully")

        return True
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python mysql_migration.py <host> <user> <password> <database>")
        sys.exit(1)

    host = sys.argv[1]
    user = sys.argv[2]
    password = sys.argv[3]
    database = sys.argv[4]

    if init_db(host, user, password, database):
        print("\nMySQL database initialization completed successfully!")
    else:
        print("\nMySQL database initialization failed!")
        sys.exit(1)
