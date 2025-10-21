// src/App.jsx
import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Logout from "./pages/Logout";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import CaballeroPage from "./pages/CaballeroPage";
import EntrenarPage from "./pages/EntrenarPage"
import Menu from "./components/Menu";
import RegisterPage from "./pages/RegisterPage";
import UnknownPage from "./pages/UnknownPage";
import Loading from "./pages/Loading";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CrearCaballero from "./pages/CrearCaballero";
import ImageSelectorForm from "./components/CrearCaballero/ImageSelectorForm"
import BackendDownPage from "./pages/BackendDown";
import Batallas from "./components/Batalla/Batalla";
import Batalla from "./components/Batalla/Batalla";
import BatallaPublic from "./pages/Batalla";
import RequireQuery from "./components/RequireQuery";
import Coliseo from "./pages/Coliseo";
import { API_URL } from "./config";

function App() {

  const [backendOnline, setBackendOnline] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/server/ping`)
      .then((res) => {
        if (res.ok) {
          setBackendOnline(true);
        } else {
          setBackendOnline(false);
        }
      })
      .catch(() => setBackendOnline(false));
  }, []);

  if (!backendOnline) {
    return <BackendDownPage></BackendDownPage>
  }
  
  return (
    <AuthProvider>
      <Router>
        <InnerApp />
      </Router>
    </AuthProvider>
  );
}

// Componente interno para usar context y controlar loading
function InnerApp() {
  const { user, loading } = useContext(AuthContext);
  const {caballero} = useContext(AuthContext);
  const location = useLocation();

    // rutas que no deben tener layout (wrapper)
  const STANDALONE_PATHS = ["/Batalla"];
  const isStandalone = STANDALONE_PATHS.includes(location.pathname);

  // 🔓 Rama STANDALONE: NO layout, NO login requerido, NO bloqueo por `loading`
  if (isStandalone) {
    return (
      <>
        <ToastContainer />
        <Routes>
          <Route
            path="/Batalla"
            element={
              <RequireQuery name="id" redirectTo="/?error=missing_id">
                <BatallaPublic />
              </RequireQuery>
            }
          />
          {/* (opcional) fallback si llegan a otra ruta en este modo */}
          <Route path="*" element={<UnknownPage />} />
        </Routes>
      </>
    );
  }

  // Mientras validamos usuario, mostramos loader (evita cualquier render de rutas públicas)
  if (loading) return(<Loading />);

  return (
    
    <div className="page-wrapper">

      {/* Mostrar Menu y Navbar solo si hay usuario */}
      {user && <Menu />}
      <ToastContainer />
      <div className="page-content">
        <Navbar />
        <Routes>
          {/* "/" = Login si no está logueado */}
          <Route path="/" element={<LoginRoute />} />
          {/* "/Registrar" solo si NO está logueado */}
          <Route path="/Registrar" element={<RegisterRoute />} />
          {/* "/Caballero" protegido */}
          <Route
            path="/Caballero"
            element={
              <PrivateRoute>
                <CaballeroPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/Entrenar"
            element={
              <PrivateRoute>
                <EntrenarPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/CrearCaballero"
            element={
              <PrivateRoute>
                <ImageSelectorForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/Batallas"
            element={
              <PrivateRoute>
                <Batallas />
              </PrivateRoute>
            }
          />
          <Route path="/Coliseo" element={<PrivateRoute> <Coliseo /> </PrivateRoute>} />
          <Route path="/logout" element={<PrivateRoute> <Logout /> </PrivateRoute>} />

          
          {/* Ruta catch-all para páginas no definidas */}
          <Route path="*" element={<UnknownPage />} />

        </Routes>
      </div>
      <Footer />
    </div>
  );
}

// Rutas públicas
function LoginRoute() {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/Caballero" replace /> : <Hero />;
}

function RegisterRoute() {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/Caballero" replace /> : <RegisterPage />;
}

// Rutas privadas
function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  const { caballero } = useContext(AuthContext);

  if (!user) return <Navigate to="/" replace />;
  if (caballero === undefined) return <Loading />; // todavía cargando
  //if (caballero === null) return <ImageSelectorForm />;
  if(caballero === null){
     if (window.location.pathname !== "/logout") {
      return <ImageSelectorForm />;
    }
  }
  return children;
}
export { App, InnerApp };


