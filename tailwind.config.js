/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAFA",
        card: "#FFFFFF",
        hairline: "#EBEBEB",
        "hairline-subtle": "#DCDCDC",
        "text-primary": "#171717",
        "text-body": "#4D4D4D",
        "text-secondary": "#666666",
        "text-muted": "#8F8F8F",
        "text-disabled": "#C9C9C9",
        safe: {
          DEFAULT: "#16A34A",
          text: "#166534",
          bg: "#F0FDF4",
          border: "#BBF7D0",
        },
        warning: {
          DEFAULT: "#D97706",
          text: "#92400E",
          bg: "#FFFBEB",
          border: "#FDE68A",
        },
        danger: {
          DEFAULT: "#DC2626",
          text: "#991B1B",
          bg: "#FEF2F2",
          border: "#FECACA",
        },
        logic: {
          DEFAULT: "#2563EB",
          text: "#1E40AF",
          bg: "#EFF6FF",
          border: "#BFDBFE",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
      },
    },
  },
  plugins: [],
};
