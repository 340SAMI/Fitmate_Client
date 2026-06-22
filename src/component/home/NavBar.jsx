"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Avatar,
  Button,
  Dropdown,
  Label,
  Drawer,
  Separator,
} from "@heroui/react";

// Replace with your real auth hook (e.g. useAuth from context/AuthProvider)
// Shape assumed: { user: { name, email, image, role } | null, logOut: () => Promise<void> }
import useAuth from "@/hooks/useAuth";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "All classes", href: "/classes" },
  { label: "Community forum", href: "/forum" },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, logOut } = useAuth();

  const dashboardPath =
    user?.role === "admin"
      ? "/dashboard/admin/overview"
      : user?.role === "trainer"
      ? "/dashboard/trainer/overview"
      : "/dashboard/user/overview";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#16181C]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8B5CF6]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16181C" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6.5 6.5 17.5 17.5M4 9l3-3M17 20l3-3M2 11l2-2M20 13l2-2M9 4 6 7M15 17l3 3" />
            </svg>
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            FEET<span className="text-[#8B5CF6]">MATE</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return ( 
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-5 text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#8B5CF6]" />}
              </Link>
            );
          })}
          {user && (
            <Link
              href={dashboardPath}
              className={`relative py-5 text-sm font-medium transition-colors ${
                pathname.startsWith("/dashboard") ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Dashboard
              {pathname.startsWith("/dashboard") && <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#8B5CF6]" />}
            </Link>
          )}
        </nav>

        {/* Desktop auth area */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <Dropdown placement="bottom end">
              <Dropdown.Trigger className="rounded-full">
                <Avatar size="sm" className="cursor-pointer ring-2 ring-[#8B5CF6]/40 transition hover:ring-[#8B5CF6]">
                  {user.image && <Avatar.Image src={user.image} alt={user.name} />}
                  <Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
                </Avatar>
              </Dropdown.Trigger>
              <Dropdown.Popover>
                <Dropdown.Menu>
                  <Dropdown.Section>
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-foreground-secondary">{user.email}</p>
                    </div>
                  </Dropdown.Section>
                  <Separator />
                  <Dropdown.Item id="dashboard" textValue="Dashboard" href={dashboardPath}>
                    <Label>Dashboard</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="logout" textValue="Log out" variant="danger" onAction={logOut}>
                    <Label>Log out</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <>
              <Button
                className="rounded-full bg-[#8B5CF6] px-5 font-semibold text-white hover:bg-[#7C3AED]"
                onPress={() => (window.location.href = "/authenticate/signin")}
              >
                Login
              </Button>
              <Button
                className="rounded-full bg-[#8B5CF6] px-5 font-semibold text-white hover:bg-[#7C3AED]"
                onPress={() => (window.location.href = "/authenticate/signup")}
              >
                Register
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu (Drawer) */}
        <div className="sm:hidden">
          <Drawer>
            <Button variant="ghost" isIconOnly aria-label="Open menu" className="text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </Button>
            <Drawer.Backdrop>
              <Drawer.Content placement="left">
                <Drawer.Dialog className="w-72 bg-[#16181C]">
                  <Drawer.CloseTrigger className="text-white" />
                  <Drawer.Header>
                    <Drawer.Heading className="text-white">
                      IRON<span className="text-[#8B5CF6]">PULSE</span>
                    </Drawer.Heading>
                  </Drawer.Header>
                  <Drawer.Body className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                      <Button
                        key={link.href}
                        slot="close"
                        variant="ghost"
                        className={`justify-start text-base font-medium ${
                          pathname === link.href ? "text-[#8B5CF6]" : "text-white/80"
                        }`}
                        onPress={() => (window.location.href = link.href)}
                      >
                        {link.label}
                      </Button>
                    ))}
                    {user && (
                      <Button
                        slot="close"
                        variant="ghost"
                        className={`justify-start text-base font-medium ${
                          pathname.startsWith("/dashboard") ? "text-[#8B5CF6]" : "text-white/80"
                        }`}
                        onPress={() => (window.location.href = dashboardPath)}
                      >
                        Dashboard
                      </Button>
                    )}

                    <Separator className="my-3" />

                    {user ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar size="sm">
                            {user.image && <Avatar.Image src={user.image} alt={user.name} />}
                            <Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-white/50">{user.email}</p>
                          </div>
                        </div>
                        <Button slot="close" size="sm" variant="soft" color="danger" onPress={logOut}>
                          Log out
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          slot="close"
                          className="w-full rounded-full bg-[#8B5CF6] font-semibold text-white"
                          onPress={() => (window.location.href = "/authenticate/signin")}
                        >
                          Login
                        </Button>
                        <Button
                          slot="close"
                          className="w-full rounded-full bg-white/5 font-semibold text-white"
                          onPress={() => (window.location.href = "/authenticate/signup")}
                        >
                          Register
                        </Button>
                      </>
                    )}
                  </Drawer.Body>
                </Drawer.Dialog>
              </Drawer.Content>
            </Drawer.Backdrop>
          </Drawer>
        </div>
      </div>
    </header>
  );
}