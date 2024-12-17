from sqlalchemy import create_engine, text
import os
import sys

def verify_mysql_connection(host, user, password, database):
    try:
        # Construct database URL
        db_url = f"mysql://{user}:{password}@{host}/{database}"

        # Create engine
        engine = create_engine(db_url)

        # Try to connect and execute a simple query
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✓ Database connection successful")

            # Check if we can create tables
            connection.execute(text("CREATE TABLE IF NOT EXISTS test_table (id INT)"))
            print("✓ Table creation permissions verified")

            # Clean up
            connection.execute(text("DROP TABLE IF EXISTS test_table"))
            print("✓ Table deletion permissions verified")

        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python verify_mysql.py <host> <user> <password> <database>")
        sys.exit(1)

    host = sys.argv[1]
    user = sys.argv[2]
    password = sys.argv[3]
    database = sys.argv[4]

    if verify_mysql_connection(host, user, password, database):
        print("\nMySQL setup verification completed successfully!")
    else:
        print("\nMySQL setup verification failed!")
        sys.exit(1)
