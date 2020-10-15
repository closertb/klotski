/**
 * Title:
 * @author Mr Denzel
 * @create Date 2018-02-05 21:35
 * @version 1.0
 * Description:
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Block from '../components/Block';
import { arrayGenerate } from '../utils/util';

function Status(props) {
  const str = `${props.value}x${props.value}`;
  return (
    <div className="nav-bar">
      <span className="show-status">{str}</span>
      <Link to="/"><span className="go-back" /></Link>
    </div>
  );
}
const translateKey = (str) => {
  const arr = str.substr(1).split('&'); const res = {};
  arr.forEach((t) => {
    const couple = t.split('=');
    res[couple[0]] = couple[1];
  });
  return res;
};

export default class Simple extends React.Component {
  constructor(props) {
    super(props);
    this.level = +translateKey(this.props.location.search).level;
    this.length = this.level * this.level;
    this.state = {
      level: this.level,
      squares: arrayGenerate(this.length),
    };
    this.handleClick = this.handleClick.bind(this);
    const size = Math.min(window.innerWidth - 20, window.innerHeight);
    this.blockSize = Math.floor(size / 60) * 60;
  }

  handleClick() {
  }

  render() {
    const link = `/game?level=${this.level}`;
    return (
      <div className="game-box">
        <Status value={this.state.level} />
        <Block
          handle={this.handleClick}
          level={this.state.level}
          squares={this.state.squares}
          size={this.blockSize}
          simple
        />
        <Link to={link}>
          {' '}
          <div className="start-button be-center" />
        </Link>
      </div>
    );
  }
}
