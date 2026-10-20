import { createFileRoute } from "@tanstack/react-router";
import { PaycheckApp } from "@/components/paycheck-app";

export const Route = createFileRoute("/")({
  component: PaycheckApp,
});
