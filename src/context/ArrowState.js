import React, { useState } from "react";
import context from "./context";

const ArrowState = (props) => {
  const [arrows, setArrows] = useState([]);

  return (
    <context.Provider value={{ arrows, setArrows }}>
      {props.children}
    </context.Provider>
  );
};

export default ArrowState;
