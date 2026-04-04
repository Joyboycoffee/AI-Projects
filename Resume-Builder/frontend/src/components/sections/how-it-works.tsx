"use client";

import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { UserPlus, Edit3, Sparkles, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up for free and start building your professional resume in seconds.",
  },
  {
    number: "02",
    icon: Edit3,
    title: "Fill Your Details",
    description: "Add your experience, education, and skills with our easy-to-use form.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "AI Optimization",
    description: "Let our AI enhance your content with professional language and keywords.",
  },
  {
    number: "04",
    icon: Download,
    title: "Download & Apply",
    description: "Export as PDF and start applying to your dream jobs immediately.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Four simple steps to your perfect resume
          </p>
        </FadeIn>

        {/* Steps */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StaggerItem key={index}>
              <div className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50" />
                )}

                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-2 text-6xl font-bold text-foreground/5">
                    {step.number}
                  </div>

                  <div className="glass-card p-6 pt-8 relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>

                    <p className="text-muted">{step.description}</p>
                  </div>
                </motion.div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
