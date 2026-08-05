from sqlalchemy.orm import Session
import random
from db.models.auth import User,Signin_with_google,OTP
from api.auth.util import get_hashed_password,verify_password
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Logincrud:
    def __init__(self, session: Session):
        self.session = session

    def get_user_by_email(self, email: str):
        return self.session.query(User).filter_by(email=email).first()

    def get_google_user_by_email(self, email: str):
        return self.session.query(Signin_with_google).filter_by(email=email).first()

    def delete_user(self, user: User):
        self.session.delete(user)
        self.session.commit()

    def create_user(self, name: str, number: str, email: str, password: str):
        encrypted_password = get_hashed_password(password)
        new_user = User(name=name, number=number, email=email, hashcode=encrypted_password)
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

    def get_otp_entry(self, email: str, otp_code: str):
        return self.session.query(OTP).filter_by(email=email, otp_code=otp_code).first()

    def delete_otp_entry(self, otp_entry: OTP):
        self.session.delete(otp_entry)
        self.session.commit()

    def verify_user_email(self, email: str):
        user_entry = self.get_user_by_email(email)
        if user_entry:
            user_entry.verification = True
            self.session.add(user_entry)
            self.session.commit()
            return user_entry
        return None

    def delete_user_by_email(self, email: str):
        user_entry = self.get_user_by_email(email)
        if user_entry:
            self.session.delete(user_entry)
            self.session.commit()

    def verify_password(self, plain_password: str, hashed_password: str):
        return verify_password(plain_password, hashed_password)

    def needs_password_update(self, hashed_password: str):
        return pwd_context.needs_update(hashed_password)

    def update_user_password(self, user: User, password: str):
        user.hashcode = get_hashed_password(password)
        self.session.commit()