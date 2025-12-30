import Navbar from "./components/layout/Navbar";
import AppRouter from "./router/AppRouter";
import { ProjectProvider } from "./context/ProjectContext";

export default function App() {
  return (
    <ProjectProvider>
      <Navbar />
      <AppRouter />
    </ProjectProvider>
  );
}
