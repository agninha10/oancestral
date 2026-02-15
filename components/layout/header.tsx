import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserNav } from "@/components/layout/user-nav";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
    { href: "/", label: "Início" },
    { href: "/receitas", label: "Receitas" },
    { href: "/cursos", label: "Cursos" },
    { href: "/blog", label: "Blog" },
    { href: "/sobre", label: "Sobre" },
];

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="font-serif text-2xl font-bold text-primary">
                        O Ancestral
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="transition-colors hover:text-primary text-foreground/80"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    <ThemeToggle />
                    <UserNav />
                </div>

                {/* Mobile Menu */}
                <div className="flex md:hidden items-center space-x-2">
                    <ThemeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            {/* Mobile Menu Header */}
                            <div className="mb-8">
                                <Link href="/" className="inline-block">
                                    <span className="font-serif text-2xl font-bold text-primary">
                                        O Ancestral
                                    </span>
                                </Link>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex flex-col space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* User Navigation */}
                            <div className="mt-8 border-t border-border pt-6">
                                <UserNav />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
