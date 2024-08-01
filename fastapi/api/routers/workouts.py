# Import necessary libraries from Pydantic and FastAPI
from pydantic import BaseModel  # BaseModel is used for creating data models
from typing import Optional  # Optional is used for type hinting to indicate that a value can be None
from fastapi import APIRouter, status  # APIRouter is used for routing and managing endpoints in FastAPI

# Import the Workout model and dependency functions
from models import Workout  # Assuming Workout is a model representing a workout in the database
from deps import db_dependency, user_dependency  # Database and user dependencies for handling requests

# Create a new router for workouts with a common prefix and associated tags for API documentation
router = APIRouter(
    prefix='/workouts',  # All routes in this router will be prefixed with '/workouts'
    tags=['workouts']  # Tags for OpenAPI documentation, grouping these routes under 'workouts'
)

# Base model for workout data that will be used during creation and validation
class WorkoutBase(BaseModel):
    name: str  # Required field for the name of the workout
    description: Optional[str] = None  # Optional field for a description of the workout

# Model for creating a workout, inheriting from WorkoutBase
class WorkoutCreate(WorkoutBase):
    pass  # No additional fields, just using the parent class

# Define a GET endpoint to retrieve a single workout by its ID
@router.get('/')
def get_workout(db: db_dependency, user: user_dependency, workout_id: int):
    # Query the database for a workout with the specified ID
    return db.query(Workout).filter(Workout.id == workout_id).first()

# Define a GET endpoint to retrieve all workouts
@router.get('/workouts')
def get_workouts(db: db_dependency, user: user_dependency):
    # Query the database to get all workout records
    return db.query(Workout).all()

# Define a POST endpoint to create a new workout
@router.post("/", status_code=status.HTTP_201_CREATED)  # Return 201 status code on successful creation
def create_workout(db: db_dependency, user: user_dependency, workout: WorkoutCreate):
    # Create a new Workout instance using the validated data from the request body
    db_workout = Workout(**workout.model_dump(), user_id=user.get('id'))  # Include the user ID
    # Add the new workout to the session
    db.add(db_workout)
    # Commit the session to save the new workout in the database
    db.commit()
    # Refresh the workout instance to get updated data from the database
    db.refresh(db_workout)
    # Return the newly created workout
    return db_workout

# Define a DELETE endpoint to remove a workout by its ID
@router.delete("/")
def delete_workout(db: db_dependency, user: user_dependency, workout_id: int):
    # Query the database to find the workout to delete
    db_workout = db.query(Workout).filter(Workout.id == workout_id).first()
    # If the workout exists, delete it
    if db_workout:
        db.delete(db_workout)  # Mark the workout for deletion
        db.commit()  # Commit the session to apply the deletion
    # Return the deleted workout or None if it was not found
    return db_workout