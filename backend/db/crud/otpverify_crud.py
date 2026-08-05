from db.models.auth import User,OTP
from sqlalchemy.orm import Session

class crudverify:
    def __init__(self, session: Session):
        self.session = session

    def get_otp_entry(self, email: str, otp_code: str):
        return self.session.query(OTP).filter_by(email=email, otp_code=otp_code).first()
    
    def get_user_by_email(self, email: str):
        return self.session.query(User).filter_by(email=email).first()

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
            
    def delete_user_by_email(self, email: str):
        user_entry = self.get_user_by_email(email)
        if user_entry:
            self.session.delete(user_entry)
            self.session.commit()
