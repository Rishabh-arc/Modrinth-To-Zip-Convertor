import HomePage from "./pages/HomePage";
import { Toaster } from "sonner";

function App() {
  return (
    <div>
      <HomePage />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
