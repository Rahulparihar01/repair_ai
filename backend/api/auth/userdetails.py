
from fastapi import HTTPException, Depends, status

from sqlalchemy.orm import Session
from db.crud.user_crud import CRUDUser
from api.auth.otp_send import send_otp_email


class UserRegistration:
    def __init__(self, session: Session):
        self.session = session
        self.crud_user = CRUDUser(session)

    def register_user(self, user):
        existing_user = self.crud_user.get_user_by_email(user.email)
        existing_google_user = self.crud_user.get_google_user_by_email(user.email)

        if existing_user and existing_user.verification:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email ID already registered - please Login")
        if existing_google_user:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email ID already registered - please Login")

        if existing_user:
            self.crud_user.delete_user(existing_user)

        new_user = self.crud_user.create_user(user.name, user.number, user.email, user.password,user.role,user.subscription_plan)
        otp_code = self.crud_user.create_otp(user.email)

        email_check = send_otp_email(user.email, otp_code)
        if email_check == "Email sent successfully":
            return {"message": "User created successfully"}
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email is not valid")