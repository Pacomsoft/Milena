import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import NavLogin from "../components/NavLogin";
import NavStats from "../components/NavStats";
import Loading from "../pages/Loading";

function Navbar() {
  const { user, caballero } = useContext(AuthContext);

  // Estado 2: si hay caballero, mostrar stats
  if (caballero !== null && caballero !== undefined) {
    return <NavStats caballero={caballero} />;
  }

  // Estado 3: no hay caballero
  if (user === null) {
    return <NavLogin />;
  }

  // Estado 4: usuario con sesión pero sin caballero
  return null;
}

export default Navbar;
