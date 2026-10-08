import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ParticlesProvider } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ParticlesProvider init={loadFull}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ParticlesProvider>
  </QueryClientProvider>,
);
