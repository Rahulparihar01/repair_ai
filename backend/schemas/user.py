from pydantic import BaseModel
from typing import Optional,List

class UserCreate(BaseModel):
    name: str
    number: int
    email: str
    password: str
    confirmPassword: str
    role:str
    subscription_plan:str


class User(UserCreate):
    hashed_password: str


class Login(BaseModel):
    email: str
    password: str


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str


class OTPVerification(BaseModel):
    otp: int
    email: str


class Forgetpassword(BaseModel):
    email: str


class Reset_password(BaseModel):
    email: str
    password: str
    confirmPassword: str


class Signin_google(BaseModel):
    name: str
    email: str
    authId: str
    role:str
    subscription_plan:str


class Guest(BaseModel):
    name:str
    email:str
    role:str


class Add_to_carts(BaseModel):
    Image_Name:str
    size:str
    price:int
    quantity:int

class update_quantity(BaseModel):
    product_id:str
    quantity:int

class buy_product_detail(BaseModel):
    product_id:str
    quantity:int
    imagename:str
    email:str
    price :int
    size:str
    total_price:int
    
class Form_datail(BaseModel):
    firstName:str
    lastName:str
    email:str
    mobileNumber:int
    streetAddress:str
    aptNumber:str
    city:str
    state:str
    country:str
    zipCode:str


class subscribe_pay_status(BaseModel):
    price:int
    selectedOption:str
    paymentStatus:str
    SubscriptionPlan:str

class OrderResponse(BaseModel):
    order_id: int
    status: str
    created_at: str
    updated_at: str
    estimated_delivery: Optional[str] = None
    tracking_number: Optional[str] = None  # Allowing None
    shipping_address: str
    total_amount: float

class OrderCreateRequest(BaseModel):
    product_id: int
    quantity: int
    shipping_address: str
    estimated_delivery: Optional[str] = None

class ProductDetail(BaseModel):
    product_id: int
    quantity: int
    price: float
    size: str
    total_price: float
    imagename: str
    email: str


class AddressDetail(BaseModel):
    form_id: int


class PaymentDetail(BaseModel):
    payment_status: str
    transectionId: str


class OrderCreateRequest(BaseModel):
    productDetails: List[ProductDetail]
    subTotal: float
    Address: AddressDetail
    Payment: PaymentDetail



class ProductCreate(BaseModel):
    image_id: int
    name: str
    price: float
    size: str
    stock: int