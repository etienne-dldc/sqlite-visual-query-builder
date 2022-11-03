import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Root } from "./components/Root";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Missing root element");
}

const root = createRoot(rootEl);

root.render(<Root />);
