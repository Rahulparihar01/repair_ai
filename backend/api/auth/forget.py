# user_registration.py
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from db.crud.Forget import forgetpassword
from schemas.user import Forgetpassword


class Forget:
    def __init__(self, session: Session):
        self.session = session
        self.crud_user = forgetpassword(session)

    def forget_password(self, request: Forgetpassword):
        user = self.crud_user.get_user_by_email(request.email)
        if user:
            otp_code = self.crud_user.create_otp(request.email)
            email_check = self.crud_user.send_otp_email(request.email, otp_code)
            if email_check == "Email sent successfully":
                return {"message": "OTP sent successfully"}
            else:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email is not valid")
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Email is not registered")
