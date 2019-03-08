import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";

const App: React.FC = () => {
  return <div>HI!</div>;
};

ReactDOM.render(<App />, document.getElementById("app"));
