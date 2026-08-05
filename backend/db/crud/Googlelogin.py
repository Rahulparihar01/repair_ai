from sqlalchemy.orm import Session
from api.auth.util import create_access_token,create_refresh_token
from db.models.auth import Signin_with_google,User
class Login:
    def __init__(self, session: Session):
        self.session = session
    def get_user_by_email(self, email: str):
        return self.session.query(User).filter_by(email=email).first()

    def get_google_user_by_authid(self, authid: str):
        return self.session.query(Signin_with_google).filter_by(authid=authid).first()
    
    def create_user(self, name: str, number: int, email: str, hashcode: str,role:str,subscription_plan:str, verification: bool):
        new_user = User(name=name, number=number, email=email, hashcode=hashcode, role=role,subscription_plan=subscription_plan,verification=verification)
        self.session.add(new_user)
        self.session.commit()
        self.session.refresh(new_user)
        return new_user

    def create_google_user(self, authid: str, name: str, email: str,role:str,subscription_plan:str):
        google_user = Signin_with_google(authid=authid, name=name, email=email,role=role,subscription_plan=subscription_plan)
        self.session.add(google_user)
        self.session.commit()
        return google_user

    def signin_with_google(self, authid: str, name: str, email: str,role:str,subscription_plan:str):
        google_user = self.get_google_user_by_authid(authid)
        if google_user:
            access_token = create_access_token(google_user.authid)
            refresh_token = create_refresh_token(google_user.authid)
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "data": {
                    'id': google_user.authid,
                    'name': google_user.name,
                    "email": google_user.email,
                    "role":google_user.role,
                    "subscription_plan":google_user.subscription_plan
                }
            }

        existing_user = self.get_user_by_email(email)
        if not existing_user:
            self.create_user(name, 0, email, None,role,subscription_plan,True)
        
        self.create_google_user(authid, name, email,role,subscription_plan)
        
        access_token = create_access_token(authid)
        refresh_token = create_refresh_token(authid)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "data": {
                'id': authid,
                'name': name,
                "email": email,
                "role":role,
                "subscription_plan":subscription_plan
            }
        }