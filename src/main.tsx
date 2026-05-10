import "modern-normalize";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Імпортую класи
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./components/App/App";

// Створюю QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Обгортаю App у QueryClientProvider та передаю client */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
