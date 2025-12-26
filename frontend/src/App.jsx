import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./router";
import { ConfirmProvider } from "./components/ui/ConfirmDialog";

function App() {
  return (
    <ConfirmProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </ConfirmProvider>
  );
}

export default App;
