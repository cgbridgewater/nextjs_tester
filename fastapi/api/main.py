# Import the FastAPI framework and necessary components
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers for handling authentication, workouts, and routines
from routers import auth, workouts, routines

# Import the database components
from database import Base, engine

# Create an instance of the FastAPI application
app = FastAPI()

# Create all database tables defined in the ORM (using Base) 
# This will run only once when the application starts
Base.metadata.create_all(bind=engine)

# Add CORS (Cross-Origin Resource Sharing) middleware to the FastAPI application
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],  # Allow requests from this origin
    allow_credentials=True,                    # Allow credentials to be sent
    allow_methods=['*'],                       # Allow all HTTP methods
    allow_headers=['*'],                       # Allow all headers
)

# Define a health check route
@app.get("/")  # This handles GET requests to the root URL
def health_check():
    return 'Health check complete'  # Returns a simple message for health check

# Include external routers for different functionalities
# This modularizes the code and separates concerns
app.include_router(auth.router)        # Include routes for authentication
app.include_router(workouts.router)    # Include routes for workouts
app.include_router(routines.router)     # Include routes for workout routines
