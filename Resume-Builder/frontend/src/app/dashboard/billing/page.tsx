"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { GradientText } from "@/components/animations/gradient-text";
import { paymentApi } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import {
  CreditCard,
  Download,
  Sparkles,
  Check,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await paymentApi.getSubscriptionStatus();
      setSubscription(response.data);
    } catch (error) {
      console.error("Failed to load subscription", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await paymentApi.createCheckoutSession({
        price_id: "price_pro_monthly", // Replace with actual Stripe price ID
        success_url: `${window.location.origin}/dashboard/billing?success=true`,
        cancel_url: `${window.location.origin}/dashboard/billing`,
      });

      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Failed to start checkout");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await paymentApi.createPortalSession(
        `${window.location.origin}/dashboard/billing`
      );
      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Failed to open customer portal");
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for trying out",
      features: [
        "1 Resume Download",
        "3 Templates",
        "Basic Editor",
        "PDF Export",
      ],
      current: user?.plan === "free",
    },
    {
      name: "Pro",
      price: "$9",
      period: "/month",
      description: "For serious job seekers",
      features: [
        "Unlimited Downloads",
        "All Templates",
        "AI Optimization",
        "ATS Keywords",
        "Cover Letters",
        "Priority Support",
      ],
      current: user?.plan === "pro",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardSidebar />

      <main className="ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Billing & Subscription</h1>
              <p className="text-muted">Manage your subscription and billing details</p>
            </div>
          </FadeIn>

          {/* Current Status */}
          <FadeIn delay={0.1}>
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <CreditCard className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted">Current Plan</p>
                      <h2 className="text-2xl font-bold text-foreground capitalize">
                        {user?.plan} Plan
                      </h2>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted">Downloads Remaining</p>
                    <p className="text-2xl font-bold text-foreground">
                      {subscription?.downloads_remaining ?? user?.downloads_limit}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Plans */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {plans.map((plan) => (
                <motion.div
                  key={plan.name}
                  whileHover={{ y: -4 }}
                  className={`relative ${plan.popular ? "md:-mt-2" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-4 py-1 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-full">
                        Best Value
                      </span>
                    </div>
                  )}

                  <Card
                    className={`h-full ${
                      plan.current ? "border-primary" : ""
                    } ${plan.popular ? "shadow-xl shadow-primary/20" : ""}`}
                  >
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <p className="text-muted">{plan.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-muted">{plan.period}</span>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground/80">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {plan.current ? (
                        <Button
                          variant="secondary"
                          className="w-full"
                          disabled={plan.name === "Free"}
                          onClick={handleManageSubscription}
                        >
                          {plan.name === "Free" ? "Current Plan" : "Manage Subscription"}
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={handleUpgrade}
                          disabled={plan.name === "Free"}
                        >
                          {plan.name === "Free" ? "Downgrade" : "Upgrade"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
