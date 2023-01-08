import React from "react";

function Spinner({ message }) {
  return (
    <div className="text-center">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>{message}</p>
    </div>
  );
}

export default Spinner;
