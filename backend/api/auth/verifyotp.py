from sqlalchemy.orm import Session
from db.crud.otpverify_crud import crudverify
from fastapi import HTTPException, status
from schemas.user import  OTPVerification
from datetime import datetime

class verification:
    def __init__(self, session: Session):
        self.session = session
        self.crud_user = crudverify(session)
        
    def verify_otp(self, request: OTPVerification):
        otp_entry = self.crud_user.get_otp_entry(request.email, request.otp)

        if not otp_entry:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP. Please enter a valid OTP")

        if otp_entry.expires_at < datetime.utcnow():
            self.crud_user.delete_otp_entry(otp_entry)
            self.crud_user.delete_user_by_email(request.email)
            
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="The OTP link has expired. Please request a new OTP")

        verified_user = self.crud_user.verify_user_email(request.email)

        if verified_user:
            self.crud_user.delete_otp_entry(otp_entry)

            return {"message": "OTP verified successfully."}

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")