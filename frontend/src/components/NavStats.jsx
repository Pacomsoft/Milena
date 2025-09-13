import React from "react";

function NavStats(){
          return (
        <header className="text-white">
          <div className="container">           
                // Si está logueado → mostrar stats
              <div className="flex-wrap align-items-center justify-content-between background-mobile"  style={{display:'block'}}>                    
                  <div className="row text-center">
                    <div className="col-lg-2 col-md-2 col-sm-4 mb-4 info-base">
                      <center>
                        <div className="square bg-danger border border-3 border-warning p-3">
                          <h3 className="text-gold">1</h3>
                        </div>
                      </center>
                      <div className="label-info mt-2 text-silver">Nivel</div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                      <center>
                        <div className="square bg-danger border border-3 border-warning p-3">
                          <h3 className="text-gold">100</h3>
                        </div>
                      </center>
                      <div className="label-info mt-2 text-silver">Armadura</div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                      <center>
                        <div className="square bg-danger border border-3 border-warning p-3">
                          <h3 className="text-gold">250</h3>
                        </div>
                      </center>
                      <div className="label-info mt-2 text-silver">Vida</div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                      <center>
                        <div className="square bg-danger border border-3 border-warning p-3">
                          <h3 className="text-gold">100</h3>
                        </div>
                      </center>
                      <div className="label-info mt-2 text-silver">Cosmo</div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                      <center>
                        <div className="square bg-danger border border-3 border-warning p-3">
                          <h3 className="text-gold">25</h3>
                        </div>
                      </center>
                      <div className="label-info mt-2 text-silver">Oro</div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                      <center>
                        <div className="square bg-danger border border-3 border-warning p-3">
                          <h3 className="text-gold">500</h3>
                        </div>
                      </center>
                      <div className="label-info mt-2 text-silver">Habilidad</div>
                    </div>
                  </div>              
              </div>                
          </div>
        </header>
      );
}

export default NavStats();