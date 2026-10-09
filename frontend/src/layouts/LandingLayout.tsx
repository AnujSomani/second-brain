import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export function LandingLayout() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
  }, []);

  return (
    <div className="min-h-screen bg-page text-ink relative selection:bg-purple-300 selection:text-purple-950 overflow-x-clip transition-colors duration-300">
      {/* Seamless rich purplish atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[750px] bg-gradient-to-b from-purple-300/50 via-purple-200/35 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[25%] -right-20 w-[700px] h-[700px] bg-purple-300/35 rounded-full blur-3xl" />
        <div className="absolute top-[55%] -left-20 w-[700px] h-[700px] bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-purple-200/45 rounded-full blur-3xl" />
      </div>
      <Outlet />
    </div>
  );
}