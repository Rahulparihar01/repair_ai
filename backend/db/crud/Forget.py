# crud.py
from sqlalchemy.orm import Session
import random
from db.models.auth import User, OTP
from api.auth.otp_send import  forget_otp_email

class forgetpassword:
    def __init__(self, session: Session):
        self.session = session

    def get_user_by_email(self, email: str):
        return self.session.query(User).filter_by(email=email).first()

    def create_otp(self, email: str):
        otp_code = ''.join([str(random.randint(0, 9)) for _ in range(4)])
        otp_entry = OTP(email=email, otp_code=otp_code)
        self.session.add(otp_entry)
        self.session.commit()
        return otp_code

    def send_otp_email(self, email: str, otp_code: str):
        # Implement your email sending logic here
        return forget_otp_email(email, otp_code)
