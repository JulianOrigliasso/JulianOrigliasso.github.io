from app.core.database import engine
from app.models.user import User
from app.models.property import Property
from sqlalchemy import inspect

def check_database():
    inspector = inspect(engine)
    print('Database Tables:', inspector.get_table_names())
    
    if 'users' in inspector.get_table_names():
        print('\nUser Table Columns:')
        for column in inspector.get_columns('users'):
            print(f'- {column["name"]}: {column["type"]}')
    else:
        print('\nUsers table not found!')

if __name__ == "__main__":
    check_database()
