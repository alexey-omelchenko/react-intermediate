import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import 'index.scss';
import Homepage from 'components/homepage/homepage';
import About from 'components/about/about';
import Nav from 'components/nav/nav';

const App = () => (
  <Router>
    <div className="container-fluid">
      <Nav />
      <Route exact path="/" component={Homepage} />
      <Route path="/about" component={About} />
    </div>
  </Router>
);

export default App;
