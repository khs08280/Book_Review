import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          light: "#f3f3f3",
          lighter: "#fafafa",
          lightest: "#ffffff",
        },
        dark: {
          dark: "#333333",
          darker: "#1a1a1a",
          darkest: "#0a0a0a",
        },
      },
    },
  },
  plugins: [],
  mode: "jit",
};
export default config;
