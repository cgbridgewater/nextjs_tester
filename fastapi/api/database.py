# Import necessary components from SQLAlchemy
from sqlalchemy import create_engine  # Used to create a new SQLAlchemy Engine instance
from sqlalchemy.ext.declarative import declarative_base  # Used to create a base class for declarative models
from sqlalchemy.orm import sessionmaker  # Used to create a new session factory

# Define the database URL for an SQLite database named 'workout_app.db'
# 'sqlite:///' indicates a SQLite database file
SQL_ALCHEMY_DATABASE_URL = 'sqlite:///workout_app.db'

# Create an SQLAlchemy Engine instance that will manage the connection to the database
# 'connect_args={'check_same_thread': False}' allows us to use the connection in different threads
engine = create_engine(SQL_ALCHEMY_DATABASE_URL, connect_args={'check_same_thread': False})

# Create a configured "Session" class, which will be used to establish connections to the database
# autocommit=False: transactions will only be committed explicitly
# autoflush=False: flushing of the session will not happen automatically
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for all declarative models 
# This base class maintains a catalog of classes and tables relative to that base
Base = declarative_base()
