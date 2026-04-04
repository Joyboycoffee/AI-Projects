"use client";

import Link from "next/link";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { HoverScale } from "@/components/animations/hover-scale";
import {
  Palette,
  Check,
  Sparkles,
  Eye,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design perfect for tech roles. Features a bold header with gradient accents.",
    features: ["Bold gradient header", "Clean typography", "Skills highlighted with tags", "Perfect for tech"],
    color: "from-indigo-500 to-purple-600",
    popular: true,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant layout for creative professionals who want content to shine.",
    features: ["Clean sans-serif typography", "Subtle borders", "Focus on content", "Great for creatives"],
    color: "from-gray-400 to-gray-600",
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Traditional format ideal for corporate positions. Classic and timeless.",
    features: ["Serif typography", "Traditional layout", "Corporate-ready", "ATS-optimized"],
    color: "from-slate-700 to-slate-900",
    popular: false,
  },
];

function TemplatePreview({ color }: { color: string }) {
  return (
    <div className="aspect-[3/4] bg-white dark:bg-zinc-900 rounded-lg overflow-hidden">
      <div className="h-full p-4 space-y-2">
        <div className={`h-16 rounded bg-gradient-to-r ${color}`} />
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
        <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded mt-4" />
        <div className="space-y-1">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="min-h-screen">
      <DashboardSidebar />

      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Templates</h1>
                <p className="text-muted">Choose from our professionally designed resume templates</p>
              </div>
            </div>
          </FadeIn>

          {/* Templates Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templates.map((template) => (
              <StaggerItem key={template.id}>
                <HoverScale scale={1.01}>
                  <Card className="overflow-hidden h-full">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <TemplatePreview color={template.color} />
                      </div>

                      <div className="p-6 pt-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {template.name}
                          </h3>
                          {template.popular && (
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                              Popular
                            </span>
                          )}
                        </div>

                        <p className="text-muted text-sm mb-4">{template.description}</p>

                        <ul className="space-y-2 mb-6">
                          {template.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-foreground/80">
                              <Check className="w-4 h-4 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="flex gap-3">
                          <Link href={`/dashboard/builder?template=${template.id}`} className="flex-1">
                            <Button className="w-full">
                              <Sparkles className="w-4 h-4 mr-2" />
                              Use Template
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </main>
    </div>
  );
}
