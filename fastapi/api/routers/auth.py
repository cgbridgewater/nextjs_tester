# Import necessary modules and components
from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from dotenv import load_dotenv
import os
from models import User  # Import User model from models
from deps import db_dependency, bcrypt_context  # Import dependencies for database and bcrypt context

# Load environment variables from a .env file
load_dotenv()

# Initialize a FastAPI router for authentication related endpoints
router = APIRouter(
    prefix='/auth',  # Prefix for authentication routes
    tags=['auth']    # Tags for organizing routes in documentation
)

# Define secret key and algorithm from environment variables
SECRET_KEY = os.getenv('AUTH_SECRET_KEY')
ALGORITHM = os.getenv('AUTH_ALGORITHM')

# Pydantic model for the user creation request
class UserCreateRequest(BaseModel):
    username: str  # Username field
    password: str  # Password field

# Pydantic model for the token response
class Token(BaseModel):
    access_token: str  # Access token field
    token_type: str    # Token type (usually "bearer")

# Function to authenticate a user given a username and password
def authenticate_user(username: str, password: str, db):
    # Query the database for the user with the given username
    user = db.query(User).filter(User.username == username).first()
    # If the user does not exist, return False
    if not user:
        return False
    # Verify the password against the stored hashed password using bcrypt
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    # If authentication is successful, return the user object
    return user

# Function to create a JSON Web Token (JWT) for a user
def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    # Prepare the payload with the user's username and ID
    encode = {'sub': username, 'id': user_id}
    # Set the expiration time for the token
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})  # Add expiration time to the payload
    # Encode the payload using the secret key and algorithm
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

# Endpoint to create a new user; should be called with POST request
@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: UserCreateRequest):
    # Create a new User model with the provided username and hashed password
    create_user_model = User(
        username=create_user_request.username,
        hashed_password=bcrypt_context.hash(create_user_request.password)  # Hash the password before storing
    )
    db.add(create_user_model)  # Add the user model to the database session
    db.commit()  # Commit the transaction to save the user to the database

# Endpoint to log in and obtain an access token
@router.post('/token', response_model=Token)  # Specify that the response will be of type Token
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    # Authenticate the user using the provided form data
    user = authenticate_user(form_data.username, form_data.password, db)
    # If authentication fails, raise an HTTP 401 Unauthorized exception
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user")
    # Create an access token with a 20 minute expiration
    token = create_access_token(user.username, user.id, timedelta(minutes=20))
    
    # Return the access token and its type
    return {'access_token': token, 'token_type': 'bearer'}
