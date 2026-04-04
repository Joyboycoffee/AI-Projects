"use client";

import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import {
  Sparkles,
  Zap,
  FileText,
  Download,
  Shield,
  Palette,
  Clock,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Optimization",
    description:
      "Let our AI enhance your resume content with professional language and ATS-friendly keywords.",
  },
  {
    icon: Palette,
    title: "Beautiful Templates",
    description:
      "Choose from modern, professional templates designed by HR experts to make a lasting impression.",
  },
  {
    icon: Shield,
    title: "ATS-Friendly",
    description:
      "Our resumes are optimized to pass through Applicant Tracking Systems and reach human recruiters.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Build a professional resume in under 10 minutes with our intuitive drag-and-drop interface.",
  },
  {
    icon: Download,
    title: "PDF Export",
    description:
      "Download your resume as a high-quality PDF ready to send to employers and job boards.",
  },
  {
    icon: Globe,
    title: "Cloud Storage",
    description:
      "Access your resumes from anywhere. Your data is securely stored and always available.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Everything you need to create a standout resume and land your dream job
          </p>
        </FadeIn>

        {/* Features Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-6 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted">{feature.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
