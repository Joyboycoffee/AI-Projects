from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app.models import User
from app.schemas import CheckoutSessionRequest, CheckoutSessionResponse
from app.utils.security import get_current_active_user
from app.services.stripe_service import stripe_service

router = APIRouter(prefix="/api/payments", tags=["Payments"])


@router.post("/create-checkout-session", response_model=CheckoutSessionResponse)
async def create_checkout_session(
    request: CheckoutSessionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a Stripe checkout session for subscription."""

    try:
        session_data = await stripe_service.create_checkout_session(
            user=current_user,
            price_id=request.price_id,
            success_url=request.success_url,
            cancel_url=request.cancel_url
        )

        # Save customer ID to user
        db.commit()

        return CheckoutSessionResponse(
            session_id=session_data["session_id"],
            url=session_data["url"]
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/create-portal-session")
async def create_portal_session(
    return_url: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a Stripe customer portal session."""

    try:
        url = await stripe_service.create_portal_session(
            user=current_user,
            return_url=return_url
        )

        return {"url": url}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="Stripe-Signature"),
    db: Session = Depends(get_db)
):
    """Handle Stripe webhook events."""

    payload = await request.body()

    success = await stripe_service.handle_webhook(payload, stripe_signature, db)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Webhook handling failed"
        )

    return {"received": True}


@router.get("/subscription-status")
async def get_subscription_status(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user's subscription status."""

    return {
        "plan": current_user.plan,
        "downloads_used": current_user.downloads_used,
        "downloads_limit": current_user.downloads_limit,
        "downloads_remaining": max(0, current_user.downloads_limit - current_user.downloads_used),
        "is_pro": current_user.plan == "pro"
    }
