"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { resumeApi } from "@/lib/api";
import { Resume } from "@/types";
import {
  Plus,
  FileText,
  Download,
  Sparkles,
  ChevronRight,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await resumeApi.getAll();
      setResumes(response.data);
    } catch (error) {
      toast.error("Failed to load resumes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      await resumeApi.delete(id);
      setResumes(resumes.filter((r) => r.id !== id));
      toast.success("Resume deleted");
    } catch (error) {
      toast.error("Failed to delete resume");
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      const response = await resumeApi.duplicate(id);
      setResumes([response.data, ...resumes]);
      toast.success("Resume duplicated");
    } catch (error) {
      toast.error("Failed to duplicate resume");
    }
  };

  return (
    <div className="min-h-screen">
      <DashboardSidebar />

      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted">Manage your resumes and track progress</p>
              </div>
              <Link href="/dashboard/builder">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Resume
                </Button>
              </Link>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Total Resumes", value: resumes.length, icon: FileText },
                { label: "Downloads", value: "12", icon: Download },
                { label: "AI Optimizations", value: "5", icon: Sparkles },
                { label: "Active Plan", value: "Free", icon: FileText },
              ].map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeIn>

          {/* Resumes Grid */}
          <FadeIn delay={0.2}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Resumes</CardTitle>
                <Link href="/dashboard/builder">
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12">Loading...</div>
                ) : resumes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No resumes yet
                    </h3>
                    <p className="text-muted mb-4">Create your first resume to get started</p>
                    <Link href="/dashboard/builder">
                      <Button>Create Resume</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resumes.map((resume) => (
                      <motion.div
                        key={resume.id}
                        whileHover={{ y: -4 }}
                        className="glass-card p-4 group cursor-pointer"
                      >
                        <Link href={`/dashboard/preview?id=${resume.id}`}>
                          <div className="aspect-[3/4] bg-white dark:bg-zinc-900 rounded-lg mb-4 overflow-hidden">
                            <div className="h-full p-4 space-y-2">
                              <div className="h-8 bg-gradient-to-r from-primary to-secondary rounded" />
                              <div className="space-y-1">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                              </div>
                              <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded mt-2" />
                            </div>
                          </div>
                        </Link>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-foreground truncate">
                              {resume.title}
                            </h4>
                            <p className="text-xs text-muted">
                              {new Date(resume.created_at).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/dashboard/builder?id=${resume.id}`}>
                              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                <Edit className="w-4 h-4 text-muted" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDuplicate(resume.id)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4 text-muted" />
                            </button>
                            <button
                              onClick={() => handleDelete(resume.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
