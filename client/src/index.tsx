import React from "react";
import ReactDOM from "react-dom";
import { Button } from "antd";
// import "./global.css";

const App: React.FC = () => {
  return <Button>HELLO</Button>;
};

ReactDOM.render(<App />, document.getElementById("app"));
