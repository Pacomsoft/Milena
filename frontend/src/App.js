// src/App.jsx
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import CaballeroPage from "./pages/CaballeroPage";
import Menu from "./components/Menu";
import RegisterPage from "./pages/RegisterPage";
import UnknownPage from "./pages/UnknownPage";
import Loading from "./pages/Loading";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CrearCaballero from "./pages/CrearCaballero";
import ImageSelectorForm from "./components/CrearCaballero/ImageSelectorForm"


function App() {
  
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
            path="/CrearCaballero"
            element={
              <PrivateRoute>
                <ImageSelectorForm />
              </PrivateRoute>
            }
          />
          
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

  if(!user){
    return <Navigate to="/" replace />;
  }
  if (caballero === null) return <ImageSelectorForm />;

  return children 
}

export default App;
