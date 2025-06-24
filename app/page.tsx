"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./components/home";

export default function Main() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}
