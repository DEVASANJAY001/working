import React from "react";
import "aws-amplify/auth/enable-oauth-listener";
import ReactDOM from "react-dom/client";
import "./config/aws-config";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);