"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/fade-in";
import { resumeApi } from "@/lib/api";
import { Resume } from "@/types";
import {
  ArrowLeft,
  Download,
  Sparkles,
  Palette,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const templates = [
  { id: "modern", name: "Modern", color: "from-blue-500 to-purple-600" },
  { id: "minimal", name: "Minimal", color: "from-gray-400 to-gray-600" },
  { id: "professional", name: "Professional", color: "from-slate-700 to-slate-900" },
];

function ResumePreview({ resume, template }: { resume: Resume | null; template: string }) {
  if (!resume) return null;

  const content = resume.content;

  return (
    <div className="aspect-[3/4] bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-xl">
      <div className={`h-full p-8 bg-white dark:bg-zinc-900 ${
        template === "modern" ? "font-sans" :
        template === "minimal" ? "font-serif" :
        "font-serif"
      }`}>
        {/* Header */}
        <div className={`${
          template === "modern"
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 -mx-8 -mt-8 mb-6"
            : template === "minimal"
            ? "border-b-2 border-gray-300 pb-4 mb-6"
            : "text-center border-b-2 border-black pb-4 mb-6"
        }`}>
          <h1 className={`text-3xl font-bold ${
            template === "modern" ? "" : "text-gray-900 dark:text-white"
          }`}>
            {content.personal_info.full_name || "Your Name"}
          </h1>
          <p className={`mt-2 ${
            template === "modern" ? "text-white/80" : "text-gray-600 dark:text-gray-300"
          }`}>
            {content.personal_info.email} {content.personal_info.phone && `| ${content.personal_info.phone}`}
          </p>
        </div>

        {/* Summary */}
        {content.personal_info.summary && (
          <div className="mb-6">
            <h2 className={`text-lg font-bold mb-2 ${
              template === "professional" ? "border-b border-black" : "text-primary"
            }`}>
              Professional Summary
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {content.personal_info.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {content.experience.length > 0 && (
          <div className="mb-6">
            <h2 className={`text-lg font-bold mb-3 ${
              template === "professional" ? "border-b border-black" : "text-primary"
            }`}>
              Experience
            </h2>
            <div className="space-y-4">
              {content.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-gray-900 dark:text-white">{exp.position}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {exp.start_date} - {exp.end_date || "Present"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 italic">{exp.company}</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {content.education.length > 0 && (
          <div className="mb-6">
            <h2 className={`text-lg font-bold mb-3 ${
              template === "professional" ? "border-b border-black" : "text-primary"
            }`}>
              Education
            </h2>
            <div className="space-y-3">
              {content.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-gray-900 dark:text-white">{edu.school}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{edu.end_date}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {edu.degree}{edu.field && `, ${edu.field}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {content.skills.length > 0 && (
          <div>
            <h2 className={`text-lg font-bold mb-3 ${
              template === "professional" ? "border-b border-black" : "text-primary"
            }`}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-sm ${
                    template === "modern"
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");

  const [resume, setResume] = useState<Resume | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (resumeId) {
      loadResume();
    }
  }, [resumeId]);

  const loadResume = async () => {
    try {
      const response = await resumeApi.getById(Number(resumeId));
      setResume(response.data);
      setSelectedTemplate(response.data.template || "modern");
    } catch (error) {
      toast.error("Failed to load resume");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await resumeApi.download(Number(resumeId));

      // Create blob from base64
      const byteCharacters = atob(response.data.pdf_base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = response.data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Resume downloaded successfully");
    } catch (error: any) {
      const message = error.response?.data?.detail || "Failed to download resume";
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardSidebar />

      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-foreground">{resume?.title}</h1>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/dashboard/ai?id=${resumeId}`}>
                  <Button variant="secondary">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Optimize
                  </Button>
                </Link>
                <Button
                  onClick={handleDownload}
                  isLoading={isDownloading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Template Selector */}
            <FadeIn delay={0.1}>
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Templates
                    </h3>
                    <div className="space-y-3">
                      {templates.map((template) => (
                        <motion.button
                          key={template.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`w-full p-3 rounded-xl border-2 transition-all ${
                            selectedTemplate === template.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${template.color}`} />
                            <span className="font-medium">{template.name}</span>
                            {selectedTemplate === template.id && (
                              <Check className="w-4 h-4 text-primary ml-auto" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>

            {/* Preview */}
            <FadeIn delay={0.2}>
              <div className="lg:col-span-3">
                <ResumePreview resume={resume} template={selectedTemplate} />
              </div>
            </FadeIn>
          </div>
        </div>
      </main>
    </div>
  );
}
