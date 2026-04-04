from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)

    # Subscription plan: free, pro
    plan = Column(String, default="free")

    # Stripe customer id
    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)

    # Track downloads for free plan
    downloads_used = Column(Integer, default=0)
    downloads_limit = Column(Integer, default=1)  # Free plan: 1 download

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
