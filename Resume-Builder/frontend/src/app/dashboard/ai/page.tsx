"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { aiApi } from "@/lib/api";
import { GradientText } from "@/components/animations/gradient-text";
import {
  Sparkles,
  Zap,
  Wand2,
  Target,
  CheckCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const features = [
  {
    icon: Wand2,
    title: "Content Enhancement",
    description: "Transform basic descriptions into compelling achievements with AI-powered language.",
  },
  {
    icon: Target,
    title: "ATS Optimization",
    description: "Get tailored keyword suggestions to help your resume pass through applicant tracking systems.",
  },
  {
    icon: Zap,
    title: "Grammar & Style",
    description: "Fix grammar issues and improve writing style with professional language suggestions.",
  },
];

export default function AIPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState("summary");

  const handleOptimize = async () => {
    if (!input.trim()) {
      toast.error("Please enter some content to optimize");
      return;
    }

    setIsLoading(true);
    try {
      const response = await aiApi.optimize(selectedSection, input);
      setOutput(response.data.optimized);
      toast.success("Content optimized!");
    } catch (error: any) {
      const message = error.response?.data?.detail || "Failed to optimize content";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <DashboardSidebar />

      <main className="ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Tools</span>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Enhance Your Resume with{" "}
                <GradientText>AI</GradientText>
              </h1>
              <p className="text-xl text-muted max-w-2xl mx-auto">
                Let our advanced AI transform your resume content into compelling,
                professional achievements.
              </p>
            </div>
          </FadeIn>

          {/* Features */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="glass-card p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted text-sm">{feature.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Optimization Tool */}
          <FadeIn delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-primary" />
                  Content Optimizer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Section
                    </label>
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-card border border-border mb-4"
                    >
                      <option value="summary">Professional Summary</option>
                      <option value="experience">Work Experience</option>
                      <option value="skills">Skills</option>
                      <option value="education">Education</option>
                    </select>

                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Content
                    </label>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Paste your resume content here..."
                      rows={10}
                      className="mb-4"
                    />

                    <Button
                      onClick={handleOptimize}
                      isLoading={isLoading}
                      className="w-full"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Optimize with AI
                    </Button>
                  </div>

                  {/* Output */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Optimized Result
                    </label>
                    <div className="relative">
                      <Textarea
                        value={output}
                        readOnly
                        placeholder="AI-optimized content will appear here..."
                        rows={10}
                        className="bg-primary/5 border-primary/20"
                      />
                      {output && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(output);
                            toast.success("Copied to clipboard");
                          }}
                          className="absolute bottom-2 right-2"
                        >
                          Copy
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
