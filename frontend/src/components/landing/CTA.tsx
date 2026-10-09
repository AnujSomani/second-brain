import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export function CTA() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-transparent">
      <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-10 sm:p-16 text-center text-white shadow-2xl shadow-purple-600/30 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Ready to build your second brain?
          </h2>
          <p className="text-lg sm:text-xl text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who are already saving time and staying organized with Brainly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup" className="w-full sm:w-auto inline-block cursor-pointer">
              <Button variant="inverse" title="Get Started Free" fullWidth className="cursor-pointer font-bold px-8 py-3.5 hover:bg-purple-50 hover:text-purple-800 hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5" />
            </Link>
          </div>
          <p className="mt-5 text-sm text-purple-200">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </section>
  );
}