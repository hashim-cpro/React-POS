/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        phantom: ["Phantom Sans", "sans-serif"], // Adding Phantom Sans as a custom font
        poppins: ["Poppins", "sans-serif"], // Adding Poppins as a custom font
      },
      colors: {
        customdarker: "#121217",
        customdark: "#17171d",
        customdarkless: "#252429",
        customblack: "#1f2d3d",
        customsteel: "#273444",
        customslate: "#3c4858",
        custommuted: "#8492a6",
        customsmoke: "#e0e6ed",
        customsnow: "#f9fafc",
        customwhite: "#ffffff",
        customred: "#ec3750",
        customorange: "#ff8c37",
        customyellow: "#f1c40f",
        customgreen: "#33d6a6",
        customcyan: "#5bc0de",
        customblue: "#338eda",
        custompurple: "#a633d6",
        customprimary: "#ec3750",
        customsecondary: "#8492a6",
        customaccent: "#5bc0de",
        customtwitter: "#1da1f2",
        customfacebook: "#3b5998",
        custominstagram: "#e1306c",
      },
    },
  },
  plugins: [],
};
