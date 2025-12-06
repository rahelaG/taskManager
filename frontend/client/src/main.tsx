// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { AuthProvider } from "./context/AuthContext";
import theme from "./theme/theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      {/* Necesită tema pentru dark-mode persistent */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
