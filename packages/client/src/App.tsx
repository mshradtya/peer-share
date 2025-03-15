import "./App.css";
import Routes from "./router";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes />
    </ThemeProvider>
  );
}

export default App;
