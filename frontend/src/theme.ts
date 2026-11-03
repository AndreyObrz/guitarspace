import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f0f10",
      paper: "#1a1a1c",
    },
    primary: {
      main: "#1abeff",
    },
    text: {
      primary: "#ffffff",
      secondary: "#9aa0a6",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
});