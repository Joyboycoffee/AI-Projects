"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/fade-in";
import { useAuth } from "@/contexts/auth-context";
import {
  User,
  Mail,
  Shield,
  Bell,
  Save,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Profile updated successfully");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
      <DashboardSidebar />

      <main className="ml-64 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
              <p className="text-muted">Manage your account settings and preferences</p>
            </div>
          </FadeIn>

          <div className="space-y-6">
            {/* Profile Info */}
            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <Button variant="secondary" size="sm">
                          Change Avatar
                        </Button>
                      </div>
                    </div>

                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />

                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      disabled
                      helperText="Email cannot be changed"
                    />

                    <div className="flex justify-end">
                      <Button type="submit" isLoading={isLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Current Plan */}
            <FadeIn delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl">
                    <div>
                      <p className="font-semibold text-foreground capitalize">
                        {user?.plan} Plan
                      </p>
                      <p className="text-sm text-muted">
                        {user?.plan === "free"
                          ? "1 resume download per month"
                          : "Unlimited downloads & AI features"}
                      </p>
                    </div>
                    {user?.plan === "free" ? (
                      <Button variant="secondary">Upgrade</Button>
                    ) : (
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="w-5 h-5" />
                        <span>Active</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </main>
    </div>
  );
}
