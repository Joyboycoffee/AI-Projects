"use client";

import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { HoverScale } from "@/components/animations/hover-scale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const templates = [
  {
    name: "Modern",
    description: "Clean and contemporary design perfect for tech roles",
    color: "from-primary to-secondary",
    preview: "modern",
  },
  {
    name: "Minimal",
    description: "Simple and elegant layout for creative professionals",
    color: "from-secondary to-accent",
    preview: "minimal",
  },
  {
    name: "Professional",
    description: "Traditional format ideal for corporate positions",
    color: "from-accent to-primary",
    preview: "professional",
  },
];

function TemplatePreview({ template }: { template: string }) {
  return (
    <div className="aspect-[3/4] bg-white dark:bg-zinc-900 rounded-lg p-4 overflow-hidden">
      <div className="h-full space-y-2">
        {/* Header */}
        <div className={`h-16 rounded bg-gradient-to-r ${
          template === "modern" ? "from-indigo-500 to-purple-600" :
          template === "minimal" ? "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" :
          "from-gray-900 to-gray-800"
        }`} />

        {/* Content */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded mt-4" />
          <div className="space-y-1">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplatesSection() {
  return (
    <section id="templates" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Beautiful Templates
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Choose from professionally designed templates that stand out
          </p>
        </FadeIn>

        {/* Templates Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <StaggerItem key={index}>
              <HoverScale scale={1.02}>
                <div className="glass-card overflow-hidden group">
                  <div className="p-4">
                    <TemplatePreview template={template.preview} />
                  </div>

                  <div className="p-6 pt-0">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {template.name}
                    </h3>

                    <p className="text-muted mb-4">{template.description}</p>

                    <Link href="/signup">
                      <Button variant="secondary" className="w-full">
                        Use Template
                      </Button>
                    </Link>
                  </div>
                </div>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
