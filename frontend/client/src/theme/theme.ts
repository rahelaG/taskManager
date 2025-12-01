import { defineConfig, createSystem, defaultConfig, defaultSystem } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    body: {
      backgroundColor: "gray.50",
    },
  },

  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e3f2f9" },
          100: { value: "#c5e4f3" },
          200: { value: "#a2d4ec" },
          300: { value: "#7ac1e4" },
          400: { value: "#47a9da" },
          500: { value: "#0088cc" },
          600: { value: "#007ab8" },
          700: { value: "#006ba1" },
          800: { value: "#005885" },
          900: { value: "#003f5e" },
        },
      },
    },
  },
});

// 🔥 creăm systemul final
export const system = createSystem(defaultConfig, config);
