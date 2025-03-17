import "./App.css";
import Routes from "./router";
import { ThemeProvider } from "./components/theme-provider";
import { WebRTCProvider } from "./context/WebRTCProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <WebRTCProvider>
        <Routes />
      </WebRTCProvider>
    </ThemeProvider>
  );
}

export default App;
