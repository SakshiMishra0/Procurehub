import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css"; // Tailwind/global CSS
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./context/AuthContext.jsx"; // ✅ Add this line

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
