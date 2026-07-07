import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Landing } from "@/components/atlas/Landing";
import { Workspace } from "@/components/atlas/Workspace";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [entered, setEntered] = useState(false);
  return entered ? <Workspace /> : <Landing onEnter={() => setEntered(true)} />;
}
