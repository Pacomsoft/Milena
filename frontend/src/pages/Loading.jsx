import React from "react";

function Loading() {
  return (
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5 background-mobile container-base">
          <div className="col-lg-12" style={{ alignSelf: "flex-start" }}>
            <div className="spinner-border" role="status">
              
            </div>
          </div>
        </div>
  );
}

export default Loading;
