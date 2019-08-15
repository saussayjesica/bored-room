import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Meeting from "./Meeting";

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/meeting" component={Meeting} />
      {/* <Route path="/report" component={Report} /> */}
    </Router>
  );
}

function Home() {
  return (
    <div>
      <Link to="/meeting">Meeting</Link>
    </div>
  );
}

export default App;
