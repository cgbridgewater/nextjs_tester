# Import required components from SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base  # Import Base from the database module which is a declarative base

# Define an association table for the many-to-many relationship 
# between Workout and Routine
workout_routine_association = Table(
    'workout_routine',  # table name
    Base.metadata,      # metadata associated with the base class
    Column('workout_id', Integer, ForeignKey('workouts.id')),  # Foreign key referencing Workout
    Column('routine_id', Integer, ForeignKey('routines.id'))   # Foreign key referencing Routine
)

# Define the User model following the SQLAlchemy schema
class User(Base):
    __tablename__ = 'users'  # table name in the database
    id = Column(Integer, primary_key=True, index=True)  # Primary key column (user ID)
    username = Column(String, unique=True, index=True)   # Unique username for each user
    hashed_password = Column(String)  # Column to store the hashed password

# Define the Workout model
class Workout(Base):
    __tablename__ = 'workouts'  # table name in the database
    id = Column(Integer, primary_key=True, index=True)  # Primary key column (workout ID)
    user_id = Column(Integer, ForeignKey('users.id'))  # Foreign key linking to User
    name = Column(String, index=True)  # Name of the workout
    description = Column(String, index=True)  # Description of the workout
    # Many-to-many relationship with Routine via the association table
    routines = relationship('Routine', secondary=workout_routine_association, back_populates='workouts')

# Define the Routine model
class Routine(Base):
    __tablename__ = 'routines'  # table name in the database
    id = Column(Integer, primary_key=True, index=True)  # Primary key column (routine ID)
    user_id = Column(Integer, ForeignKey('users.id'))  # Foreign key linking to User
    name = Column(String, index=True)  # Name of the routine
    description = Column(String, index=True)  # Description of the routine
    # Many-to-many relationship with Workout via the association table
    workouts = relationship('Workout', secondary=workout_routine_association, back_populates='routines')

# Explicitly defining the relationship on the Workout class (not necessary as it's already defined above)
Workout.routines = relationship('Routine', secondary=workout_routine_association, back_populates='workouts')
