from sqlalchemy import create_engine, text
from app.core.config import settings
from app.core.database import Base
from app.models import user, property, profiles  # Import all models to ensure they're registered

def reset_database():
    print('Dropping all tables...')
    engine = create_engine(settings.DATABASE_URL)

    # Drop and recreate schema with force
    with engine.connect() as connection:
        # Terminate all other connections
        connection.execute(text("""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = current_database()
            AND pid <> pg_backend_pid();
        """))
        connection.execute(text("DROP SCHEMA public CASCADE"))
        connection.execute(text("CREATE SCHEMA public"))
        connection.commit()

    # Create all tables
    print('Creating base tables...')
    Base.metadata.create_all(bind=engine)
    print('Done!')

if __name__ == "__main__":
    reset_database()
