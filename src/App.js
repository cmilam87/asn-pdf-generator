import React from "react";
import { Container, CssBaseline, Paper, ThemeProvider, createTheme } from "@mui/material";
import QRCodeGenerator from "./Components/QRCodeGenerator";
const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
})
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <QRCodeGenerator />
      </Paper>
    </Container>
    </ThemeProvider>
  );
}

export default App;
