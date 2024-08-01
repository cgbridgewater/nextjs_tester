from pydantic import BaseModel  # Importing BaseModel for data validation and serialization
from typing import List, Optional  # Importing List and Optional types for type hinting
from fastapi import APIRouter  # Importing APIRouter to create route handlers for the API
from sqlalchemy.orm import joinedload  # Importing joinedload for optimizing database queries
from models import Workout, Routine  # Importing Workout and Routine models for database interactions
from deps import db_dependency, user_dependency  # Importing dependencies for database and user context

# Creating an instance of APIRouter with a prefix and tagging for grouping routes
router = APIRouter(
    prefix='/routines',  # Prefix for all routes handled by this router
    tags=['routines']    # Tags for documentation purposes
)

# Pydantic model for base routine data
class RoutineBase(BaseModel):
    name: str  # Name of the routine (required)
    description: Optional[str] = None  # Description of the routine (optional)

# Pydantic model for creating a routine that includes a list of workout IDs
class RoutineCreate(RoutineBase):
    workouts: List[int] = []  # List of workout IDs associated with the routine, default is an empty list

# Route for getting all routines associated with the authenticated user
@router.get("/")  # GET request to the root of /routines
def get_routines(db: db_dependency, user: user_dependency):
    # Querying the database for routines belonging to the authenticated user
    return db.query(Routine).options(joinedload(Routine.workouts)).filter(Routine.user_id == user.get('id')).all()

# Route for creating a new routine
@router.post("/")  # POST request to create a new routine
def create_routine(db: db_dependency, user: user_dependency, routine: RoutineCreate):
    # Creating a new Routine object with provided data and associating it with the user
    db_routine = Routine(name=routine.name, description=routine.description, user_id=user.get('id'))
    
    # Looping through each workout ID to fetch the corresponding Workout object
    for workout_id in routine.workouts:
        workout = db.query(Workout).filter(Workout.id == workout_id).first()  # Fetching workout by ID
        if workout:  # If the workout exists, append it to the routine's workouts
            db_routine.workouts.append(workout)
    
    # Adding the new routine to the session and committing it to the database
    db.add(db_routine)
    db.commit()
    db.refresh(db_routine)  # Refreshing the instance to get the updated data from the database
    
    # Fetching the newly created routine with its workouts included
    db_routines = db.query(Routine).options(joinedload(Routine.workouts)).filter(Routine.id == db_routine.id).first()
    return db_routines  # Returning the newly created routine with workouts

# Route for deleting a routine by ID
@router.delete('/')  # DELETE request to remove a routine
def delete_routine(db: db_dependency, user: user_dependency, routine_id: int):
    # Querying the database for the routine to be deleted
    db_routine = db.query(Routine).filter(Routine.id == routine_id).first()
    if db_routine:  # If the routine exists, delete it
        db.delete(db_routine)  # Remove the routine from the session
        db.commit()  # Commit the changes to the database
    
    return db_routine  # Returning the deleted routine (or None if it didn't exist)
