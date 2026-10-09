import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import brain from "../../assets/brain.jpg";

export function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-line transition-colors duration-300 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-purple-300">
              <img
                src={brain}
                alt="Brainly Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-ink tracking-tight">Brainly</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <button
              onClick={() => scrollToSection('demo')}
              className="text-muted hover:text-purple-600 transition-colors text-sm font-semibold cursor-pointer"
            >
              See in action
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-muted hover:text-purple-600 transition-colors text-sm font-semibold cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-muted hover:text-purple-600 transition-colors text-sm font-semibold cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-muted hover:text-purple-600 transition-colors text-sm font-semibold cursor-pointer"
            >
              Pricing
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/signin">
              <Button variant="secondary" title="Sign in" />
            </Link>
            <Link to="/signup">
              <Button variant="primary" title="Get Started" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}