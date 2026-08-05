from db.crud.Reset import Resetpassword as password
from sqlalchemy.orm import Session
from schemas.user import Reset_password

class Resetpassword:
    def __init__(self, session: Session):
        self.session = session
        self.crud_user = password(session)
    
    def reset_password(self, request: Reset_password):
        return self.crud_user.reset_password(request.email, request.password, request.confirmPassword)