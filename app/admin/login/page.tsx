"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, register, token, isReady } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) router.replace("/admin");
  }, [token, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <p className="text-muted-foreground text-sm">ກຳລັງໂຫຼດ...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password);
      }
      router.push("/admin");
    } catch {
      setError(
        mode === "login"
          ? "ເຂົ້າລະບົບບໍ່ສຳເລັດ — ກວດຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດ"
          : "ລົງທະບຽນບໍ່ສຳເລັດ — ອາດມີຊື່ນີ້ແລ້ວ"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">ແອັດມິນ</h1>
            <p className="text-sm text-muted-foreground">
              API Docker — /auth/login
            </p>
          </div>
        </div>

        <div className="flex rounded-lg bg-muted p-1 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === "login"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground"
            }`}
            onClick={() => {
              setMode("login");
              setError(null);
            }}
          >
            ເຂົ້າລະບົບ
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === "register"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground"
            }`}
            onClick={() => {
              setMode("register");
              setError(null);
            }}
          >
            ລົງທະບຽນ
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">ຊື່ຜູ້ໃຊ້</label>
            <Input
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">ລະຫັດ</label>
            <Input
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "ກຳລັງດຳເນີນການ..." : mode === "login" ? "ເຂົ້າລະບົບ" : "ສ້າງບັນຊີ"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/" className="text-primary hover:underline">
            ກັບໜ້າຮ້ານ
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
