from db.models.auth import User,Signin_with_google,OTP
from api.auth.util import get_hashed_password
import random
from sqlalchemy.orm import Session

class CRUDUser:
    def __init__(self, session: Session):
        self.session = session

    def get_user_by_email(self, email: str):
        return self.session.query(User).filter_by(email=email).first()

    def get_google_user_by_email(self, email: str):
        return self.session.query(Signin_with_google).filter_by(email=email).first()

    def delete_user(self, user: User):
        self.session.delete(user)
        self.session.commit()

    def create_user(self, name: str, number: str, email: str, password: str,role:str,subscription_plan:str):
        encrypted_password = get_hashed_password(password)
        new_user = User(name=name, number=number, email=email, hashcode=encrypted_password,role=role,subscription_plan=subscription_plan)
        self.session.add(new_user)
        self.session.commit()
        self.session.refresh(new_user)
        return new_user

    def create_otp(self, email: str):
        otp_code = ''.join([str(random.randint(0, 9)) for _ in range(4)])
        otp_entry = OTP(email=email, otp_code=otp_code)
        self.session.add(otp_entry)
        self.session.commit()
        return otp_code