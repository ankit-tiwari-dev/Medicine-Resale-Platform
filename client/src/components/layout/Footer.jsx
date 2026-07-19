import { Link } from "react-router-dom";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Browse", path: "/browse" },
        { name: "About", path: "/#about" },
    ];

    const legalLinks = [
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
    ];

    return (
        <footer className="border-t border-border/40 bg-muted/20">
            <div className="max-w-7xl mx-auto px-6 py-14 lg:py-16">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-5 space-y-4">
                        <Link to="/" className="inline-block text-lg font-black tracking-tighter text-foreground uppercase">
                            MedAImart
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            Secure marketplace for buying and selling verified medicines.
                        </p>
                    </div>

                    <div className="lg:col-span-3 space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                            Navigate
                        </p>
                        <nav className="flex flex-col gap-3">
                            {navLinks.map((link) => (
                                link.path.startsWith("/#") ? (
                                    <a
                                        key={link.name}
                                        href={link.path}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}
                        </nav>
                    </div>

                    <div className="lg:col-span-4 space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                            Legal
                        </p>
                        <nav className="flex flex-col gap-3">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/40">
                    <p className="text-[10px] font-bold text-muted-foreground/40 tracking-widest uppercase text-center sm:text-left">
                        &copy; {currentYear} MedAImart. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
