import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Game from './Game';
import Simple from './Simple';
import Home from './Home';
import Demo from './Css';
import { Icons } from '../components/Icon';


export default class Root extends React.PureComponent {
  render() {
    return (
      <Router>
        <div className="full-height">
          <Icons />
          <Route exact path="/" component={Home} />
          <Route path="/game" component={Game} />
          <Route path="/simple" component={Simple} />
          <Route path="/demo" component={Demo} />
        </div>
      </Router>
    );
  }
}
