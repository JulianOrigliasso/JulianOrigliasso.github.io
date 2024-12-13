from app.core.database import engine
from app.models.user import User
from app.models.property import Property
from app.core.database import Base

def reset_database():
    print('Dropping all tables...')
    Base.metadata.drop_all(bind=engine)
    print('Creating all tables...')
    Base.metadata.create_all(bind=engine)
    print('Done!')

if __name__ == "__main__":
    reset_database()
