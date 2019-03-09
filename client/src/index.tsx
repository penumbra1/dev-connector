import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Message } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./global.css";

const App: React.FC = () => {
  return (
    <Message>
      <Message.Header>Attention!</Message.Header>
      <p>This is the captain speaking.</p>
    </Message>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
