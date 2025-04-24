import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Budget from "@/pages/budget";
import Settings from "@/pages/settings";
import { DateProvider } from "./contexts/DateContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/budget" component={Budget} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DateProvider>
        <Router />
        <Toaster />
      </DateProvider>
    </QueryClientProvider>
  );
}

export default App;
