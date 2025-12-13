import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App";

import { BrowserRouter } from "react-router-dom";

function baseAfterFourthSlash() {
  const parts = window.location.pathname.split("/");
  console.log(parts);

  if (parts.length <= 4) return "";

  return "/api/hassio_ingress/" + parts[3] + "/";
}

function Main() {
  const basename = baseAfterFourthSlash();

  return (
    <BrowserRouter basename={basename}>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(<Main />);
