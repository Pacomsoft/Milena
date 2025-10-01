import React, { useContext } from "react";

function NavStats({caballero}){

          return (
        <header className="text-white">
          <div className="container">           
              <div className="flex-wrap align-items-center justify-content-between background-mobile"  style={{display:'block'}}>                    
                  <div className="row text-center">
                    <div className="col-lg-2 col-md-2 col-sm-4 mb-4 info-base">
                      <center>
                        <div className="square bg-danger border border-3 border-warning p-3">
                          <h3 className="text-gold">{caballero.nivel}</h3>
                        </div>
                      </center>
                      <div className="label-info mt-2 text-silver">Nivel</div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                      <center>
                        <div className="square bg-danger border border-3 border-warning p-3">
                          <h3 className="text-gold">-</h3>
                        </div>
                      </center>
                      <div className="label-info mt-2 text-silver">Armadura</div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                      <center>
                        <div className="square bg-danger border border-3 border-warning p-3">
                          <h3 className="text-gold">{caballero.vida_actual}</h3>
                        </div>
                      </center>
                      <div className="label-info mt-2 text-silver">Vida</div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                      <center>
                        <div className="square bg-danger border border-3 border-warning p-3">
                          <h3 className="text-gold">{caballero.cosmo}</h3>
                        </div>
                      </center>
                      <div className="label-info mt-2 text-silver">Cosmo</div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                      <center>
                        <div className="square bg-danger border border-3 border-warning p-3">
                          <h3 className="text-gold">{caballero.oro}</h3>
                        </div>
                      </center>
                      <div className="label-info mt-2 text-silver">Oro</div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                      <center>
                        <div className="square bg-danger border border-3 border-warning p-3">
                          <h3 className="text-gold">{caballero.habilidad}</h3>
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

export default NavStats;