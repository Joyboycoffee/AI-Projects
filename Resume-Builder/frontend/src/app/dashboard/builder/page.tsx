"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/fade-in";
import { resumeApi } from "@/lib/api";
import { ResumeContent } from "@/types";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const emptyContent: ResumeContent = {
  personal_info: {
    full_name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="mb-4">
      <CardHeader
        className="flex flex-row items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-lg">{title}</CardTitle>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted" />
        )}
      </CardHeader>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent>{children}</CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");

  const [content, setContent] = useState<ResumeContent>(emptyContent);
  const [title, setTitle] = useState("My Resume");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (resumeId) {
      loadResume();
    }
  }, [resumeId]);

  const loadResume = async () => {
    try {
      setIsLoading(true);
      const response = await resumeApi.getById(Number(resumeId));
      setContent(response.data.content);
      setTitle(response.data.title);
    } catch (error) {
      toast.error("Failed to load resume");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (resumeId) {
        await resumeApi.update(Number(resumeId), { title, content });
      } else {
        await resumeApi.create({ title, content, template: "modern" });
      }
      toast.success("Resume saved successfully");
    } catch (error) {
      toast.error("Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  };

  const addEducation = () => {
    setContent({
      ...content,
      education: [
        ...content.education,
        { school: "", degree: "", field: "", start_date: "", end_date: "", description: "" },
      ],
    });
  };

  const addExperience = () => {
    setContent({
      ...content,
      experience: [
        ...content.experience,
        { company: "", position: "", start_date: "", end_date: "", description: "", achievements: [] },
      ],
    });
  };

  const addSkill = () => {
    setContent({
      ...content,
      skills: [...content.skills, { name: "", level: "Intermediate" }],
    });
  };

  const removeItem = (section: keyof ResumeContent, index: number) => {
    const newSection = [...(content[section] as any[])];
    newSection.splice(index, 1);
    setContent({ ...content, [section]: newSection });
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
        <div className="max-w-4xl mx-auto">
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
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold border-0 bg-transparent focus:ring-0 px-0"
                />
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/dashboard/preview?id=${resumeId}`}>
                  <Button variant="secondary">Preview</Button>
                </Link>
                <Button onClick={handleSave} isLoading={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* Personal Info */}
          <CollapsibleSection title="Personal Information" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={content.personal_info.full_name}
                onChange={(e) =>
                  setContent({
                    ...content,
                    personal_info: { ...content.personal_info, full_name: e.target.value },
                  })
                }
              />
              <Input
                label="Email"
                type="email"
                value={content.personal_info.email}
                onChange={(e) =>
                  setContent({
                    ...content,
                    personal_info: { ...content.personal_info, email: e.target.value },
                  })
                }
              />
              <Input
                label="Phone"
                value={content.personal_info.phone}
                onChange={(e) =>
                  setContent({
                    ...content,
                    personal_info: { ...content.personal_info, phone: e.target.value },
                  })
                }
              />
              <Input
                label="LinkedIn"
                value={content.personal_info.linkedin}
                onChange={(e) =>
                  setContent({
                    ...content,
                    personal_info: { ...content.personal_info, linkedin: e.target.value },
                  })
                }
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Professional Summary"
                  rows={4}
                  value={content.personal_info.summary}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      personal_info: { ...content.personal_info, summary: e.target.value },
                    })
                  }
                  placeholder="Write a brief summary of your professional background..."
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Experience */}
          <CollapsibleSection title="Experience">
            <div className="space-y-4">
              {content.experience.map((exp, index) => (
                <div key={index} className="p-4 border border-border rounded-xl relative">
                  <button
                    onClick={() => removeItem("experience", index)}
                    className="absolute top-2 right-2 p-2 text-muted hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...content.experience];
                        newExp[index].company = e.target.value;
                        setContent({ ...content, experience: newExp });
                      }}
                    />
                    <Input
                      label="Position"
                      value={exp.position}
                      onChange={(e) => {
                        const newExp = [...content.experience];
                        newExp[index].position = e.target.value;
                        setContent({ ...content, experience: newExp });
                      }}
                    />
                    <Input
                      label="Start Date"
                      placeholder="Jan 2020"
                      value={exp.start_date}
                      onChange={(e) => {
                        const newExp = [...content.experience];
                        newExp[index].start_date = e.target.value;
                        setContent({ ...content, experience: newExp });
                      }}
                    />
                    <Input
                      label="End Date"
                      placeholder="Present"
                      value={exp.end_date}
                      onChange={(e) => {
                        const newExp = [...content.experience];
                        newExp[index].end_date = e.target.value;
                        setContent({ ...content, experience: newExp });
                      }}
                    />
                    <div className="md:col-span-2">
                      <Textarea
                        label="Description"
                        rows={3}
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...content.experience];
                          newExp[index].description = e.target.value;
                          setContent({ ...content, experience: newExp });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="secondary" onClick={addExperience}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
          </CollapsibleSection>

          {/* Education */}
          <CollapsibleSection title="Education">
            <div className="space-y-4">
              {content.education.map((edu, index) => (
                <div key={index} className="p-4 border border-border rounded-xl relative">
                  <button
                    onClick={() => removeItem("education", index)}
                    className="absolute top-2 right-2 p-2 text-muted hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="School"
                      value={edu.school}
                      onChange={(e) => {
                        const newEdu = [...content.education];
                        newEdu[index].school = e.target.value;
                        setContent({ ...content, education: newEdu });
                      }}
                    />
                    <Input
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...content.education];
                        newEdu[index].degree = e.target.value;
                        setContent({ ...content, education: newEdu });
                      }}
                    />
                    <Input
                      label="Field of Study"
                      value={edu.field}
                      onChange={(e) => {
                        const newEdu = [...content.education];
                        newEdu[index].field = e.target.value;
                        setContent({ ...content, education: newEdu });
                      }}
                    />
                    <Input
                      label="Graduation Year"
                      value={edu.end_date}
                      onChange={(e) => {
                        const newEdu = [...content.education];
                        newEdu[index].end_date = e.target.value;
                        setContent({ ...content, education: newEdu });
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button variant="secondary" onClick={addEducation}>
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
          </CollapsibleSection>

          {/* Skills */}
          <CollapsibleSection title="Skills">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {content.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg"
                  >
                    <Input
                      value={skill.name}
                      onChange={(e) => {
                        const newSkills = [...content.skills];
                        newSkills[index].name = e.target.value;
                        setContent({ ...content, skills: newSkills });
                      }}
                      className="w-32 border-0 bg-transparent p-0 text-sm"
                    />
                    <button
                      onClick={() => removeItem("skills", index)}
                      className="text-muted hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="secondary" onClick={addSkill}>
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </CollapsibleSection>
        </div>
      </main>
    </div>
  );
}
