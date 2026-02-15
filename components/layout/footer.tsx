import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
    plataforma: [
        { href: "/receitas", label: "Receitas" },
        { href: "/cursos", label: "Cursos" },
        { href: "/blog", label: "Blog" },
        { href: "/comunidade", label: "Comunidade" },
    ],
    recursos: [
        { href: "/sobre", label: "Sobre" },
        { href: "/faq", label: "FAQ" },
        { href: "/contato", label: "Contato" },
        { href: "/afiliados", label: "Programa de Afiliados" },
    ],
    legal: [
        { href: "/privacidade", label: "Política de Privacidade" },
        { href: "/termos", label: "Termos de Uso" },
        { href: "/cookies", label: "Política de Cookies" },
    ],
};

const socialLinks = [
    { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
    { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
    { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
];

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-muted/30">
            <div className="container px-4 py-12 md:px-6 md:py-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand & Newsletter */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <span className="font-serif text-2xl font-bold text-primary">
                                O Ancestral
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                            Transforme sua saúde com sabedoria ancestral e ciência moderna.
                            Alimentação, treinos e estilo de vida para uma vida plena.
                        </p>

                        {/* Newsletter */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold">Newsletter</h3>
                            <p className="text-xs text-muted-foreground">
                                Receba dicas e conteúdos exclusivos semanalmente
                            </p>
                            <form className="flex gap-2 max-w-sm">
                                <Input
                                    type="email"
                                    placeholder="Seu e-mail"
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon">
                                    <Mail className="h-4 w-4" />
                                    <span className="sr-only">Inscrever</span>
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-semibold mb-4">Plataforma</h3>
                        <ul className="space-y-3">
                            {footerLinks.plataforma.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Recursos</h3>
                        <ul className="space-y-3">
                            {footerLinks.recursos.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} O Ancestral. Todos os direitos reservados.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center space-x-4">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="sr-only">{social.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
}
