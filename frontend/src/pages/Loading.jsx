import React from "react";

function Loading() {
  return (
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-lg-12" style={{ alignSelf: "flex-start", textAlign:"center"}}>
            <div className="spinner-border" role="status">
              
            </div>
          </div>
        </div>
  );
}

export default Loading;
