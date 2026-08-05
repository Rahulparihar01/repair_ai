from sqlalchemy.orm import Session
from db.models.auth import User
from api.auth.util import get_hashed_password
from passlib.context import CryptContext
from fastapi import HTTPException,status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Resetpassword:
    def __init__(self, session: Session):
        self.session = session
     
    def get_user_by_email(self, email: str):
        return self.session.query(User).filter_by(email=email).first()
    
    def reset_password(self, email: str, password: str, confirm_password: str):
        user = self.get_user_by_email(email)
        if user:
            if password == confirm_password:
                encrypted_password = get_hashed_password(password)
                user.hashcode = encrypted_password
                self.session.commit()
                return {"message": "Password updated successfully"}
            else:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Passwords do not match")
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Email not found in database")