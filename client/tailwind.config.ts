import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      minWidth: {
        main_box: "40rem",
      },
      colors: {
        light: {
          light: "#f3f3f3",
          lighter: "#fafafa",
          lightest: "#ffffff",
        },
        dark: {
          dark: "#333333",
          darker: "#1E1E20",
          darkest: "#0a0a0a",
        },
      },
      width: {
        modal_width: "72rem",
      },
    },
  },
  plugins: [],
  mode: "jit",
};
export default config;
