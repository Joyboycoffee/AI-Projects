"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/animations/gradient-text";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    period: "/month",
    features: [
      "1 Resume Download",
      "3 Templates",
      "Basic Sections",
      "PDF Export",
      "Email Support",
    ],
    cta: "Get Started",
    variant: "secondary" as const,
    popular: false,
  },
  {
    name: "Pro",
    description: "For serious job seekers",
    price: "$9",
    period: "/month",
    features: [
      "Unlimited Downloads",
      "All Templates",
      "AI Optimization",
      "ATS Keywords",
      "Priority Support",
      "Cover Letter Builder",
      "LinkedIn Import",
    ],
    cta: "Start Pro Trial",
    variant: "primary" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams and organizations",
    price: "Custom",
    period: "",
    features: [
      "Everything in Pro",
      "Team Collaboration",
      "Custom Branding",
      "API Access",
      "Dedicated Support",
      "SSO Integration",
    ],
    cta: "Contact Sales",
    variant: "secondary" as const,
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Simple, Transparent <GradientText>Pricing</GradientText>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Choose the plan that's right for you. No hidden fees.
          </p>
        </FadeIn>

        {/* Pricing Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Popular
                    </span>
                  </div>
                )}

                <div
                  className={`h-full glass-card p-8 ${
                    plan.popular ? "border-primary/50 shadow-xl shadow-primary/20" : ""
                  }`}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-muted">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>
                    <Button
                      variant={plan.variant}
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
