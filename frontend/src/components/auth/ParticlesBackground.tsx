import { useMemo } from "react";
import Particles from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";

export function ParticlesBackground() {
  const options = useMemo<ISourceOptions>(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      background: { color: { value: "transparent" } },
      particles: {
        number: {
          value: 60,
          density: { enable: true, width: 1200, height: 800 },
        },
        color: { value: ["#c4b5fd", "#ddd6fe", "#e9d5ff", "#f3e8ff", "#fae8ff"] },
        links: {
          enable: true,
          color: "#ddd6fe",
          distance: 150,
          opacity: 0.35,
          width: 1.2,
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: "none",
          outModes: { default: "out" },
          random: true,
        },
        opacity: { value: { min: 0.3, max: 0.6 } },
        size: { value: { min: 1.5, max: 3.5 } },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
          resize: { enable: true },
        },
        modes: {
          grab: { distance: 160, links: { opacity: 0.5 } },
        },
      },
    }),
    [],
  );

  return (
    <Particles
      id="auth-particles"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      options={options}
    />
  );
}
