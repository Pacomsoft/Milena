import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { InnerApp } from "./App";
import "@testing-library/jest-dom";
import Navbar from "./components/Navbar";

// Mock de componentes
jest.mock("./components/Navbar", () => () => <div>NavbarMock</div>);
jest.mock("./components/Menu", () => () => <div>MenuMock</div>);
jest.mock("./components/Footer", () => () => <div>FooterMock</div>);
jest.mock("./components/Hero", () => () => <div>HeroMock</div>);
jest.mock("./pages/RegisterPage", () => () => <div>RegisterMock</div>);
jest.mock("./pages/CaballeroPage", () => () => <div>CaballeroMock</div>);
jest.mock("./pages/Loading", () => () => <div>LoadingMock</div>);
jest.mock("./components/CrearCaballero/ImageSelectorForm", () => () => <div>ImageSelectorFormMock</div>);
jest.mock("./pages/UnknownPage", () => () => <div>UnknownMock</div>);


describe("App.js", () => {

  function renderWithAuth(authValue, initialEntries = ["/"]) {
    return render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={initialEntries}>
          <InnerApp />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  }

  test("muestra loader mientras loading=true", () => {
    renderWithAuth({ user: null, caballero: null, loading: true });
    expect(screen.getByText("LoadingMock")).toBeInTheDocument();
  });

  test("muestra Hero si no hay usuario y loading=false", () => {
    renderWithAuth({ user: null, caballero: null, loading: false });
    expect(screen.getByText("HeroMock")).toBeInTheDocument();
  });

  test("redirige a Caballero si hay usuario y caballero definido", () => {
    renderWithAuth({ user: { id: 1 }, caballero: { nombre: "Seiya" }, loading: false });
    expect(screen.getByText("MenuMock")).toBeInTheDocument();
    expect(screen.getByText("NavbarMock")).toBeInTheDocument();
  });

  test("muestra ImageSelectorForm si usuario logueado pero caballero=null", () => {
    renderWithAuth({ user: { id: 1 }, caballero: null, loading: false });
    expect(screen.getByText("ImageSelectorFormMock")).toBeInTheDocument();
  });

  test("muestra RegisterPage si ruta /Registrar y no hay usuario", () => {
    renderWithAuth({ user: null, caballero: null, loading: false }, ["/Registrar"]);
    expect(screen.getByText("RegisterMock")).toBeInTheDocument();
  });

  test("muestra UnknownPage si ruta no definida", () => {
    renderWithAuth({ user: null, caballero: null, loading: false }, ["/ruta-inexistente"]);
    expect(screen.getByText("UnknownMock")).toBeInTheDocument();
  });

});
