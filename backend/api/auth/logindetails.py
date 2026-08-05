from api.auth.util import create_access_token, create_refresh_token
from sqlalchemy.orm import Session
from db.crud.login_crud import Logincrud
from fastapi import HTTPException,status
from schemas.user import Login
from passlib.exc import UnknownHashError

class Userlogin:
    def __init__(self, session: Session):
        self.session = session
        self.crud_user = Logincrud(session)

    def login(self, request: Login):
        user = self.crud_user.get_user_by_email(request.email)
        if user is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found, Please sign up.")

        if not user.verification:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Email not verified. Please verify your email before logging in.")

        if user.hashcode is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="User is already registered with Google. Please sign in with Google.")

        try:
            if not self.crud_user.verify_password(request.password, user.hashcode):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect password, please try again")
            else:
                if self.crud_user.needs_password_update(user.hashcode):
                    self.crud_user.update_user_password(user, request.password)

        except UnknownHashError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="It looks like you signed in with Google previously. Please sign in with Google.")

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "data": {
                'id': user.id,
                'name': user.name,
                'number': user.number,
                "email": user.email,
                "role":user.role,
                "subscription_plan":user.subscription_plan,
            }
        }