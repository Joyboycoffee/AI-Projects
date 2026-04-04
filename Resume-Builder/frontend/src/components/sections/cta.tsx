"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/animations/gradient-text";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <motion.div
            className="glass-card p-12 md:p-16 text-center relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-50" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Build Your
                <br />
                <GradientText>Dream Resume?</GradientText>
              </h2>

              <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
                Join thousands of job seekers who have transformed their careers
                with our AI-powered resume builder.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="group">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Building Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted mt-6">
                No credit card required. Start for free.
              </p>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
