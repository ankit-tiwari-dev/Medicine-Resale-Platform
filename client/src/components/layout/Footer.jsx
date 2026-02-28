import { Link } from "react-router-dom";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background border-t border-border/40 py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <Link to="/" className="text-sm font-black tracking-tighter text-foreground uppercase">
                        MedAImart
                    </Link>

                    <nav className="flex gap-8">
                        <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                            Terms
                        </a>
                        <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                            Privacy
                        </a>
                    </nav>

                    <p className="text-[10px] font-bold text-muted-foreground/40 tracking-widest uppercase">
                        &copy; {currentYear} MedAImart.
                    </p>
                </div>
            </div>
        </footer>
    );
}
