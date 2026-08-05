from sqlalchemy import Column, Integer, String, DateTime, Boolean, BIGINT, ForeignKey, JSON,Enum,Float,Sequence
from sqlalchemy.orm import relationship
from db.base import Base
from sqlalchemy.sql import func
import datetime
import enum
import uuid

class User(Base):
    __tablename__ = "newuser"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    number = Column(BIGINT, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashcode = Column(String)
    role=Column(String,nullable=False)
    subscription_plan=Column(String,nullable=False)
    subscription_period=Column(String)
    verification = Column(Boolean, default=False)
    otps = relationship("OTP", back_populates="user", cascade="all, delete-orphan")
    google_signins = relationship("Signin_with_google", back_populates="user", cascade="all, delete-orphan")
    images = relationship("Image", back_populates="user", cascade="all, delete-orphan")
    profile = relationship("User_profile", back_populates="user", cascade="all, delete-orphan")
    nofity=relationship('Notification',back_populates='user', cascade="all, delete-orphan")
    image_count=relationship("Image_count",back_populates="user",cascade="all, delete-orphan")
    subscription_payments = relationship("SubscriptionPayment", back_populates="user")

class OTP(Base):
    __tablename__ = "otps"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, ForeignKey('newuser.email'), index=True)
    otp_code = Column(Integer)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime)
    user = relationship("User", back_populates="otps")

    def __init__(self, email, otp_code):
        self.email = email
        self.otp_code = otp_code
        self.created_at = datetime.datetime.utcnow()
        self.expires_at = self.created_at + datetime.timedelta(minutes=1)  # OTP valid for 5 minutes

class Signin_with_google(Base):
    __tablename__ = "signup_with_google"
    id = Column(Integer, primary_key=True, index=True)
    authid = Column(String, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, ForeignKey('newuser.email'), nullable=False)
    role=Column(String,nullable=False)
    subscription_plan=Column(String,nullable=False)
    subscription_period=Column(String)
    user = relationship("User", back_populates="google_signins")


class Image(Base):
    __tablename__ = 'image_datastore'
    id = Column(Integer, primary_key=True, index=True)
    image_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey('newuser.id'), nullable=False)
    user_email = Column(String, nullable=False)
    user = relationship("User", back_populates="images")


class User_profile(Base):
    __tablename__ = 'user_profile'
    id = Column(Integer, primary_key=True, index=True)
    image = Column(String, nullable=False)  # Store the image path as a string
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey('newuser.id'), nullable=False)
    email = Column (String,nullable=True)
    user = relationship("User", back_populates="profile")

class Notification(Base):
    __tablename__ = 'notification'
    id = Column(Integer, primary_key=True, index=True)
    email = Column (String,nullable=False)
    filename = Column(String, nullable=False)
    role=Column(String,nullable=False)
    subscription_plan=Column(String,nullable=False)
    subscription_period=Column(String)
    user_id = Column(Integer, ForeignKey('newuser.id'), nullable=False)
    status = Column(String,nullable=False)
    created_date = Column(DateTime, default=func.now(), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User", back_populates="nofity")


class Guestlogin(Base):
    __tablename__ = 'Guestlogin'
    id = Column(Integer, primary_key=True, index=True)
    name=Column(String,nullable=False)
    email=Column(String,nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
class Image_count(Base):
    __tablename__ = 'image_count'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('newuser.id'), nullable=False)
    user_email = Column(String, nullable=False)
    video_count =Column(Integer,default=0)
    subscription_plan=Column(String)
    subscription_period=Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User", back_populates="image_count")

    
class Add_to_cart(Base):
    __tablename__ = "add_to_cart"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, Sequence('product_id_seq', start=100000, increment=1), unique=True, nullable=False) 
    imagename = Column(String, index=True)
    price=Column(Integer,nullable=False)
    total_price=Column(Integer)
    size=Column(String,nullable=False)
    quantity=Column(Integer,nullable=False)
    email = Column(String, index=True,nullable=False)
    created_date = Column(DateTime, default=func.now(), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class orderstatus_new(enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPING"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class Form_data(Base):
    __tablename__ = 'form_data'
    id = Column(Integer, primary_key=True, index=True)
    firstName=Column(String,nullable=False)
    lastName=Column(String,nullable=False)
    aptNumber=Column(String,nullable=False)
    email=Column(String,nullable=False)
    mobileNumber = Column(BIGINT, nullable=False)
    streetAddress =Column(String,nullable =False)
    city=Column(String,nullable=False)
    state=Column(String,nullable=False)
    country=Column(String,nullable=False)
    zipCode=Column(String,nullable=False)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey('newuser.id'), nullable=False)
    # status = Column(String, default="PENDING", nullable=False)
    # payment_transaction_id = Column(String, nullable=True)  
    # product_id = Column(Integer, ForeignKey('add_to_cart.id'), nullable=False)  # Reference to the product
    # # product_price=Column(Integer,ForeignKey("add_to_cart.price"),nullable=False)
    # product = relationship("Add_to_cart")  # Relationship to Add_to_cart
    user = relationship("User")

class SubscriptionPayment(Base):
    __tablename__ = "subscription_payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("newuser.id"))
    price = Column(Integer)
    selected_option = Column(String)
    payment_status = Column(String)
    subscription_plan = Column(String)
    created_date = Column(DateTime, default=func.now(), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="subscription_payments")



# class Order(Base):
#     __tablename__ = "orders"

#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, index=True)
#     status = Column(Enum(orderstatus_new ), default=orderstatus_new .PENDING)
#     created_at = Column(DateTime, default=datetime.datetime.utcnow)
#     created_date = Column(DateTime, default=func.now(), nullable=False)
#     updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
#     estimated_delivery = Column(DateTime, nullable=True)
#     tracking_number = Column(String, nullable=True)
#     shipping_address = Column(String)
#     total_amount = Column(Float)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    # status = Column(Enum(orderstatus_new), default=orderstatus_new .PENDING)
    status = Column(Enum(orderstatus_new ), default=orderstatus_new .PENDING)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_date = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    estimated_delivery = Column(DateTime, nullable=True)
    tracking_number = Column(String, nullable=True)
    transectionId=Column(String,nullable=True)
    shipping_address = Column(String)
    total_amount = Column(Float)


def generate_unique_id():
    return str(uuid.uuid4())

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=generate_unique_id)
    name = Column(String, index=True)
    price = Column(Float, nullable=False)
    size = Column(String, nullable=False)
    created_date = Column(DateTime, default=func.now(), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    stock = Column(Integer, default=0)
    image_id = Column(String, nullable=True)
    # order = relationship("Order", back_populates="products")

class Buy_proudct(Base):
    __tablename__="Buy_product"
    id = Column(Integer, primary_key=True, index=True)
    Product_id=Column(String,nullable=False)
    quantity=Column(Integer,nullable=False)
    Product_name = Column(String, index=True)
    price = Column(Float, nullable=False)
    size=Column(String,nullable=False)
    total_price=Column(Integer,nullable=False)
    payment_status=Column(String,default="pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("newuser.id"), nullable=True)
    user_email = Column(String, nullable=True)
    service_category = Column(String, nullable=False)
    device_name = Column(String, nullable=False)
    fault_description = Column(String, nullable=True)
    status = Column(String, default="BOOKED")
    price = Column(Float, default=199.0)
    technician_name = Column(String, default="Alex Morgan (Verified Engineer)")
    technician_phone = Column(String, default="+1 (555) 234-5678")
    address = Column(String, default="742 Evergreen Terrace, Suite 4B")
    scheduled_date = Column(String, nullable=True)
    time_slot = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AIDiagnosisRecord(Base):
    __tablename__ = "ai_diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("newuser.id"), nullable=True)
    device_category = Column(String, nullable=False)
    issue_description = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    fault_type = Column(String, nullable=False)
    severity = Column(String, default="Medium")
    cost_estimate_range = Column(String, nullable=False)
    recommended_action = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class UserSubscription(Base):
    __tablename__ = "user_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("newuser.id"), nullable=False)
    plan_name = Column(String, nullable=False)
    visits_remaining = Column(Integer, default=3)
    cleanings_remaining = Column(Integer, default=1)
    status = Column(String, default="Active")
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)