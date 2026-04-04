from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class PaymentCreate(BaseModel):
    amount: Decimal
    currency: str = "usd"
    plan: str = "pro"


class PaymentResponse(BaseModel):
    id: int
    user_id: int
    stripe_session_id: Optional[str]
    stripe_payment_intent_id: Optional[str]
    amount: Optional[Decimal]
    currency: str
    status: str
    plan: str
    created_at: datetime

    class Config:
        from_attributes = True


class CheckoutSessionRequest(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str


class CheckoutSessionResponse(BaseModel):
    session_id: str
    url: str
