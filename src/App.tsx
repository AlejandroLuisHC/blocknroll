import { BrowserRouter as Router } from "react-router-dom";
import { MainLayout } from "./layouts";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;
