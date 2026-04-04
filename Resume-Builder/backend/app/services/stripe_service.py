import stripe
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.config import get_settings
from app.models import User, Payment

settings = get_settings()

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeService:
    def __init__(self):
        self.stripe = stripe

    async def create_customer(self, user: User) -> str:
        """Create a Stripe customer for a user."""
        try:
            customer = self.stripe.Customer.create(
                email=user.email,
                name=user.name,
                metadata={
                    "user_id": str(user.id)
                }
            )
            return customer.id
        except Exception as e:
            raise Exception(f"Failed to create Stripe customer: {str(e)}")

    async def create_checkout_session(
        self,
        user: User,
        price_id: str,
        success_url: str,
        cancel_url: str
    ) -> Dict[str, Any]:
        """Create a Stripe checkout session for subscription."""
        try:
            # Create customer if not exists
            if not user.stripe_customer_id:
                customer_id = await self.create_customer(user)
                user.stripe_customer_id = customer_id

            session = self.stripe.checkout.Session.create(
                customer=user.stripe_customer_id,
                payment_method_types=["card"],
                line_items=[{
                    "price": price_id,
                    "quantity": 1,
                }],
                mode="subscription",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={
                    "user_id": str(user.id)
                }
            )

            return {
                "session_id": session.id,
                "url": session.url
            }

        except Exception as e:
            raise Exception(f"Failed to create checkout session: {str(e)}")

    async def create_portal_session(self, user: User, return_url: str) -> str:
        """Create a Stripe customer portal session."""
        try:
            if not user.stripe_customer_id:
                raise Exception("No Stripe customer found")

            session = self.stripe.billing_portal.Session.create(
                customer=user.stripe_customer_id,
                return_url=return_url
            )

            return session.url

        except Exception as e:
            raise Exception(f"Failed to create portal session: {str(e)}")

    async def handle_webhook(self, payload: bytes, sig_header: str, db: Session) -> bool:
        """Handle Stripe webhook events."""
        try:
            event = self.stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )

            if event["type"] == "checkout.session.completed":
                session = event["data"]["object"]
                await self._handle_checkout_completed(session, db)

            elif event["type"] == "customer.subscription.updated":
                subscription = event["data"]["object"]
                await self._handle_subscription_updated(subscription, db)

            elif event["type"] == "customer.subscription.deleted":
                subscription = event["data"]["object"]
                await self._handle_subscription_deleted(subscription, db)

            return True

        except Exception as e:
            print(f"Webhook error: {e}")
            return False

    async def _handle_checkout_completed(self, session: Dict, db: Session):
        """Handle successful checkout completion."""
        user_id = int(session["metadata"]["user_id"])
        user = db.query(User).filter(User.id == user_id).first()

        if user:
            user.plan = "pro"
            user.stripe_subscription_id = session.get("subscription")
            user.downloads_limit = 999999  # Unlimited for pro

            # Create payment record
            payment = Payment(
                user_id=user.id,
                stripe_session_id=session["id"],
                stripe_subscription_id=session.get("subscription"),
                status="completed",
                plan="pro"
            )
            db.add(payment)
            db.commit()

    async def _handle_subscription_updated(self, subscription: Dict, db: Session):
        """Handle subscription updates."""
        customer_id = subscription["customer"]
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()

        if user:
            status = subscription["status"]
            if status in ["active", "trialing"]:
                user.plan = "pro"
            elif status in ["canceled", "unpaid", "past_due"]:
                user.plan = "free"
                user.downloads_limit = 1

            db.commit()

    async def _handle_subscription_deleted(self, subscription: Dict, db: Session):
        """Handle subscription cancellation."""
        customer_id = subscription["customer"]
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()

        if user:
            user.plan = "free"
            user.stripe_subscription_id = None
            user.downloads_limit = 1
            db.commit()


# Singleton instance
stripe_service = StripeService()
