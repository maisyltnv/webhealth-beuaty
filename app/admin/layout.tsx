"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Settings,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/admin", label: "ແດັສບອດ", icon: LayoutDashboard },
  { href: "/admin/products", label: "ສິນຄ້າ", icon: Package },
  { href: "/admin/orders", label: "ຄຳສັ່ງຊື້", icon: ShoppingCart },
  { href: "/admin/currency", label: "ອັດຕາແລກປ່ຽນ", icon: DollarSign },
  { href: "/admin/settings", label: "ຕັ້ງຄ່າ", icon: Settings },
];

function AuthGateShell({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-muted/30 px-4">
      <p className="text-sm text-muted-foreground text-center">{message}</p>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { adminUser, adminToken, isReady, logoutAdmin } = useAuth();

  const isLoginRoute = pathname === "/admin/login";
  const requiresAuth = !isLoginRoute;

  useEffect(() => {
    if (!isReady || !requiresAuth) return;
    if (!adminToken) {
      router.replace("/admin/login");
    }
  }, [isReady, requiresAuth, adminToken, router]);

  const handleLogout = () => {
    logoutAdmin();
    setIsSidebarOpen(false);
    router.push("/admin/login");
  };

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (!isReady) {
    return <AuthGateShell message="ກຳລັງໂຫຼດ..." />;
  }

  if (!adminToken) {
    return (
      <AuthGateShell message="ຕ້ອງເຂົ້າລະບົບແອັດມິນກ່ອນ — ກຳລັງໄປໜ້າເຂົ້າລະບົບ..." />
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-bold">ແອັດມິນ</span>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleLogout}
            aria-label="ອອກຈາກລະບົບ"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs font-medium">ອອກ</span>
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-border z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-border">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold">ແອັດມິນ</span>
                </Link>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-border p-4 mt-auto">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  ອອກຈາກລະບົບ
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-card border-r border-border">
          <div className="flex items-center gap-2 h-16 px-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">ແອັດມິນ</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              ອອກຈາກລະບົບ
            </Button>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              ກັບຄືນໜ້າຮ້ານ
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="border-b border-border bg-card px-6 py-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              ຜູ້ໃຊ້:{" "}
              <span className="font-medium text-foreground">
                {adminUser
                  ? String(adminUser.username ?? adminUser.id ?? "—")
                  : "…"}
              </span>
              {adminUser?.role != null && (
                <span className="ml-2 text-xs">({String(adminUser.role)})</span>
              )}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              ອອກຈາກລະບົບ
            </Button>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
