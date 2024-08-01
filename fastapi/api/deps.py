# Import necessary modules and classes
from typing import Annotated  # For type annotations
from sqlalchemy.orm import Session  # For database session management
from fastapi import Depends, HTTPException, status  # For handling dependencies and exceptions in FastAPI
from fastapi.security import OAuth2PasswordBearer  # For OAuth2 password bearer token authentication
from passlib.context import CryptContext  # For password hashing and verification
from jose import jwt, JWTError  # For creating and verifying JSON Web Tokens (JWT)
from dotenv import load_dotenv  # For loading environment variables from a .env file
import os  # For interacting with the operating system
from database import SessionLocal  # Assuming session management for database interactions is defined in database.py

# Load environment variables from a .env file
load_dotenv()

# Retrieve secret key and algorithm from environment variables for JWT encoding/decoding
SECRET_KEY = os.getenv('AUTH_SECRET_KEY')
ALGORITHM = os.getenv('AUTH_ALGORITHM')

# Function to get a database session
def get_db():
    db = SessionLocal()  # Create a new database session
    try:
        yield db  # Yield the database session for use in the request
    finally:
        db.close()  # Ensure the session is closed after use

# Annotated dependency for injecting the database session
db_dependency = Annotated[Session, Depends(get_db)]

# Set up password hashing context using bcrypt algorithm
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# Define OAuth2 password bearer for token authentication
oath2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

# Annotated dependency for injecting the OAuth2 bearer token
oath2_bearer_dependency = Annotated[str, Depends(oath2_bearer)]

# Function to get the current user from the supplied token
async def get_current_user(token: oath2_bearer_dependency):
    try:
        # Decode the JWT using the secret key and algorithm
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Extract username and user_id from the token payload
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        
        # Check if username and user_id are present; raise an exception if not
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
        
        # Return user information as a dictionary
        return {'username': username, 'id': user_id}
    except JWTError:
        # Handle JWT decoding errors and raise an unauthorized exception
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')

# Annotated dependency for injecting the current user information
user_dependency = Annotated[dict, Depends(get_current_user)]
