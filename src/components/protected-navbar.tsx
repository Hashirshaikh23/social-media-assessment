"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logoutService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProtectedNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await logoutService();
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/feed" className="font-semibold">
          Social Media App
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" className="font-normal">
            <Link href="/feed">Feed</Link>
          </Button>
          <Button asChild variant="ghost" className="font-normal">
            <Link href="/bookmarks">Bookmarks</Link>
          </Button>
          <Button asChild variant="ghost" className="font-normal">
            <Link href="/profile">Profile</Link>
          </Button>
          <Button
            variant="ghost"
            className="font-normal cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
