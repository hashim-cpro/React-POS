/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        phantom: ["Phantom Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-tertiary": "var(--bg-tertiary)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        "border-color": "var(--border-color)",
        "accent-primary": "var(--accent-primary)",
        "accent-secondary": "var(--accent-secondary)",
        "input-bg": "var(--input-bg)",
        "hover-bg": "var(--hover-bg)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
      },
      boxShadow: {
        DEFAULT:
          "var(--shadow-color) 0px 1px 3px 0px, var(--shadow-color) 0px 1px 2px -1px",
      },
    },
  },
  plugins: [],
};
