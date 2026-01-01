// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./chart";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { AuthProvider } from "./context/AuthContext";
import theme from "./theme/theme";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 🔥 CORESPUNZĂTOR DOCUMENTAȚIEI CHAKRA */}
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />

    <ChakraProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
