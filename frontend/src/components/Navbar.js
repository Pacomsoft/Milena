// src/components/Navbar.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import NavLogin from "../components/NavLogin"
import NavStats from "../components/NavStats"

function Navbar() {
  const { user, caballero } = useContext(AuthContext);
  if(caballero!==null)
  {
    return <NavStats/>;

  }
  else
  {
    if(user===null)
    {
      return <NavLogin/>;   
    }
    else{
      return null;
    }
  }
}

export default Navbar;
