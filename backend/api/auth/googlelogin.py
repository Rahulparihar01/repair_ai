from sqlalchemy.orm import Session
from schemas.user import Signin_google
from fastapi import HTTPException,status
from db.crud.Googlelogin import Login
from sqlalchemy.exc import IntegrityError

class Logingoogle:
    def __init__(self, session: Session):
        self.session = session
        self.crud_user = Login(session)

    def signin_with_google(self, request: Signin_google):
        try:
            return self.crud_user.signin_with_google(request.authId, request.name, request.email,request.role,request.subscription_plan)
        except IntegrityError as e:
            self.session.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Integrity error: {str(e)}")
        except Exception as e:
            self.session.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))