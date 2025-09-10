import React, {useContext} from "react";
import logo from '../assets/images/logo-ssrpg.png';
import { AuthContext } from "../context/AuthContext";
import { useNavigate} from "react-router-dom";
import { notify } from "../components/Notification";


    

  

function Menu(){
    const { user, loginUser, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
      logoutUser();
      notify("info", "Te esperamos de vuelta Caballero, ¡Hasta pronto!");
      navigate("/");
    }
	if (!user) {
    // si no hay usuario logueado, no renderiza nada
    	return null;
  	}
	return (
		
			<div className="horizontal-menu">
				<nav className="navbar top-navbar">
					<div className="container">
						<div className="navbar-content">
							<a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-gold text-decoration-none" style={{width: '20%'}}>
								<img src={logo} alt="Logo" style={{maxWidth: '50%'}}/>
							</a>
							<ul className="navbar-nav">	
								
								<li className="nav-item dropdown">
									<a className="barra-status ">Explorando:</a> <a className="barra-status value" id="timerest" name="timerest">10</a>
								</li>						
								
								<li className="nav-item dropdown nav-messages">
									<a className="nav-link dropdown-toggle" href="#" id="messageDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"    className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
									</a>
									<div className="dropdown-menu" aria-labelledby="messageDropdown">
										<div className="dropdown-header d-flex align-items-center justify-content-between">
											<p className="mb-0 font-weight-medium">9 New Messages</p>
											<a href="" className="text-muted">Clear all</a>
										</div>
										<div className="dropdown-body">
											<a href="" className="dropdown-item">
												<div className="figure">
													<img src="https://via.placeholder.com/30x30" alt="userr" />
												</div>
												<div className="content">
													<div className="d-flex justify-content-between align-items-center">
														<p>Leonardo Payne</p>
														<p className="sub-text text-muted">2 min ago</p>
													</div>	
													<p className="sub-text text-muted">Project status</p>
												</div>
											</a>
											<a href="" className="dropdown-item">
												<div className="figure">
													<img src="https://via.placeholder.com/30x30" alt="userr" />
												</div>
												<div className="content">
													<div className="d-flex justify-content-between align-items-center">
														<p>Carl Henson</p>
														<p className="sub-text text-muted">30 min ago</p>
													</div>	
													<p className="sub-text text-muted">Client meeting</p>
												</div>
											</a>
											<a href="" className="dropdown-item">
												<div className="figure">
													<img src="https://via.placeholder.com/30x30" alt="userr" />
												</div>
												<div className="content">
													<div className="d-flex justify-content-between align-items-center">
														<p>Jensen Combs</p>												
														<p className="sub-text text-muted">1 hrs ago</p>
													</div>	
													<p className="sub-text text-muted">Project updates</p>
												</div>
											</a>
											<a href="" className="dropdown-item">
												<div className="figure">
													<img src="https://via.placeholder.com/30x30" alt="userr" />
												</div>
												<div className="content">
													<div className="d-flex justify-content-between align-items-center">
														<p>Amiah Burton</p>
														<p className="sub-text text-muted">2 hrs ago</p>
													</div>
													<p className="sub-text text-muted">Project deadline</p>
												</div>
											</a>
											<a href="" className="dropdown-item">
												<div className="figure">
													<img src="https://via.placeholder.com/30x30" alt="userr" />
												</div>
												<div className="content">
													<div className="d-flex justify-content-between align-items-center">
														<p>Yaretzi Mayo</p>
														<p className="sub-text text-muted">5 hr ago</p>
													</div>
													<p className="sub-text text-muted">New record</p>
												</div>
											</a>
										</div>
										<div className="dropdown-footer d-flex align-items-center justify-content-center">
											<a href="">View all</a>
										</div>
									</div>
								</li>
								<li className="nav-item dropdown nav-notifications">
									<a className="nav-link dropdown-toggle" href="#" id="notificationDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"    className="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
										<div className="indicator">
											<div className="circle"></div>
										</div>
									</a>
									<div className="dropdown-menu" aria-labelledby="notificationDropdown">
										<div className="dropdown-header d-flex align-items-center justify-content-between">
											<p className="mb-0 font-weight-medium">6 New Notifications</p>
											<a href="" className="text-muted">Clear all</a>
										</div>
										<div className="dropdown-body">
											<a href="" className="dropdown-item">
												<div className="icon">
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"    className="feather feather-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
												</div>
												<div className="content">
													<p>New customer registered</p>
													<p className="sub-text text-muted">2 sec ago</p>
												</div>
											</a>
											<a href="" className="dropdown-item">
												<div className="icon">
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"    className="feather feather-gift"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
												</div>
												<div className="content">
													<p>New Order Recieved</p>
													<p className="sub-text text-muted">30 min ago</p>
												</div>
											</a>
											<a href="" className="dropdown-item">
												<div className="icon">
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"    className="feather feather-alert-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
												</div>
												<div className="content">
													<p>Server Limit Reached!</p>
													<p className="sub-text text-muted">1 hrs ago</p>
												</div>
											</a>
											<a href="" className="dropdown-item">
												<div className="icon">
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"    className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
												</div>
												<div className="content">
													<p>Apps are ready for update</p>
													<p className="sub-text text-muted">5 hrs ago</p>
												</div>
											</a>
											<a href="" className="dropdown-item">
												<div className="icon">
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"    className="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
												</div>
												<div className="content">
													<p>Download completed</p>
													<p className="sub-text text-muted">6 hrs ago</p>
												</div>
											</a>
										</div>
										<div className="dropdown-footer d-flex align-items-center justify-content-center">
											<a href="">View all</a>
										</div>
									</div>
								</li>
								<li className="nav-item dropdown nav-profile">
								<a
									className="nav-link dropdown-toggle"
									href="#"
									id="profileDropdown"
									role="button"
									data-bs-toggle="dropdown" // Bootstrap 5 usa data-bs-toggle
									aria-expanded="false"
								>
									<img src="images/avatars/admin.png" alt="profile" />
								</a>
								<ul className="dropdown-menu" aria-labelledby="profileDropdown">
									<li>
									<div className="dropdown-header d-flex flex-column align-items-center">
										<div className="figure mb-3">
										<img src="images/avatars/admin.png" alt="" />
										</div>
										<div className="info text-center">
										<p className="name font-weight-bold mb-0">Angel_Fenix</p>
										</div>
									</div>
									</li>
									<li>
									<ul className="profile-nav p-0 pt-3">
										<li className="nav-item">
										<a href="pages/general/profile.html" className="nav-link">
											{/* ...icon... */}
											<span>Cuenta</span>
										</a>
										</li>
										<li className="nav-item">
										<a className="nav-link"  onClick={handleLogout}>
											{/* ...icon... */}
											<span>Cerrar Sesión</span>
										</a>
										</li>
									</ul>
									</li>
								</ul>
								</li>
							</ul>
							<button
								className="navbar-toggler navbar-toggler-right align-self-center"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#bottomNavbar"
								aria-controls="bottomNavbar"
								aria-expanded="false"
								aria-label="Toggle navigation"								
								>
								<span className="navbar-toggler-icon"></span>
							</button>
						</div>
					</div>
				</nav>
				<nav id="bottomNavbar" className="bottom-navbar collapse">
					<div className="container">
						<ul className="nav page-navigation" style={{paddingBottom: "5px", paddingTop: "5px"}}>
							<li className="nav-item">
								<a href="/Caballero" className="btn btn-menu">CABALLERO</a>
							</li>						
							<li className="nav-item">
								<a href="/Inventario" className="btn btn-menu">INVENTARIO</a>
							</li>
							<li className="nav-item">
								<a href="/Armadura" className="btn btn-menu">ARMADURA</a>
							</li>
							<li className="nav-item">
								<a href="/Enemigo" className="btn btn-menu">ENEMIGO</a>
							</li>
							<li className="nav-item">
								<a href="/Coliseo" className="btn btn-menu">COLISEO</a>
							</li>
							<li className="nav-item">
								<a href="/Explorar" className="btn btn-menu">EXPLORAR</a>
							</li>
							<li className="nav-item">
								<a href="/Viajar" className="btn btn-menu">VIAJAR</a>
							</li>
							<li className="nav-item">
								<a href="/Cosmo" className="btn btn-menu">COSMO</a>
							</li>
							<li className="nav-item">
								<a href="/Misiones" className="btn btn-menu">MISIONES</a>
							</li>
							<li className="nav-item">
								<a href="/Entrenar" className="btn btn-menu">ENTRENAR</a>
							</li>
						</ul>
					</div>
				</nav>
			</div>

			
			
	);

}

export default Menu;