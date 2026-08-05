from fastapi import APIRouter
from fastapi import Depends
from schemas.user import (
    UserCreate,
    OTPVerification,
    Login,
    Forgetpassword,
    Reset_password,
    Signin_google,
    Guest
)
from db.models.auth import Guestlogin
from sqlalchemy.orm import Session
from db.utils import get_session
from api.auth.util import create_access_token,create_refresh_token
from api.auth.userdetails import UserRegistration
from api.auth.logindetails import Userlogin
from api.auth.verifyotp import verification
from api.auth.forget import Forget
from api.auth.resetdetails import Resetpassword
from api.auth.googlelogin import Logingoogle
router = APIRouter()

@router.post("/register")
async def register_user(user: UserCreate, session: Session = Depends(get_session)):
    user_registration = UserRegistration(session)
    return user_registration.register_user(user)

@router.post("/verify-otp")
async def verify_otp(request: OTPVerification, session: Session = Depends(get_session)):
    verify = verification(session)
    return verify.verify_otp(request)


@router.post('/login')
async def login(request: Login, db: Session = Depends(get_session)):
    user_login = Userlogin(db)
    return user_login.login(request)

@router.post("/forget")
async def forget(request: Forgetpassword, session: Session = Depends(get_session)):
    password_forget = Forget(session)
    return password_forget.forget_password(request)

@router.post("/reset_password")
async def reset(request: Reset_password, session: Session = Depends(get_session)):
    user_registration = Resetpassword(session)
    return user_registration.reset_password(request)

@router.post('/signup_with_google')
async def signin_google(request: Signin_google, session: Session = Depends(get_session)):
    user_registration = Logingoogle(session)
    return user_registration.signin_with_google(request)


@router.post('/loginAsGuest')
async def gestlogin(request: Guest, session: Session = Depends(get_session)):
    access_token = create_access_token(request.email)
    refresh_token = create_refresh_token(request.email)
    
    user1 = Guestlogin(name=request.name, email=request.email)
    session.add(user1)
    session.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "data": {
            "id": user1.id,
            'name': request.name,
            "email": request.email,
            "role": request.role
        }
    }