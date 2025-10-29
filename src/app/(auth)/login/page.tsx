"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loginService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    const res = await loginService({ username, password });

    if (!res.success) {
      toast.error(res.message);
    }

    toast.success("Login successful");
    router.push("/feed");
  };

  return (
    <div className="min-h-[calc(100dvh-0px)] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
                required
                minLength={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                required
                minLength={3}
              />
            </div>
            <div className="grid gap-2">
              <Link href="/register" className="text-sm text-muted-foreground">
                Don't have an account? Register
              </Link>
            </div>
            <Button type="submit" className="w-full cursor-pointer">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
