/**
 * Title:
 * @author Mr Denzel
 * @create Date 2018-02-03 21:20
 * @version 1.0
 * Description:
 */
import React from 'react';
import Block from '../components/Block';
import ShadowBox from '../components/Shadow';
import { evenInverseNumber } from '../utils/util';

function Status(props) {
  const formatter = (t) => {
    const res = t > 9 ? t : `0${t}`;
    return res;
  };
  if (props.isSuccess) {
    return (<div className="show-status success-status">
      {' '}
成功了
      {' '}
            </div>
    );
  }
  return (<div className="show-status">
    {' '}
    {
      props.value
    }
    {' '}
    <span className="total-step">
      {' '}
      {
        formatter(props.step)
      }
      {' '}

    </span>
          </div>
  );
}

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.level = this.props.location.search.split('=')[1];
    this.length = this.level * this.level;
    const squares = evenInverseNumber(this.level);
    this.state = {
      success: false,
      level: this.level,
      time: '00:00:00',
      timePass: 0,
      step: 0,
      update: false,
      // will change
      squares,
      showShadow: false
    };
    this.pauseClick = this.pauseClick.bind(this);
    this.startClick = this.startClick.bind(this);
    this.resetClick = this.resetClick.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    const size = Math.min(window.innerWidth - 20, window.innerHeight);
    this.blockSize = Math.floor(size / 60) * 60;
  }

  componentDidMount() {
    this.timer(0);
    document.querySelector('.game-box').addEventListener('touchmove', (e) => {
      e.preventDefault();
    });
  }

  timer(offsetTime) {
    const formatter = (t) => {
      const res = t > 9 ? t : `0${t}`;
      return res;
    };
    const startTime = new Date().getTime();
    let tPass = 0;
    const tOffset = offsetTime || 0;
    this.interId = setInterval(() => {
      const tNew = new Date().getTime();
      let ms; let sec; let min; let
        timeStr;
      tPass = tOffset + tNew - startTime;
      ms = Math.floor(tPass / 10 % 100);
      sec = Math.floor((tPass / 1000) % 60);
      min = Math.floor((tPass / 1000 / 60) % 60);
      timeStr = `${formatter(min)}:${formatter(sec)}:${formatter(ms)}`;
      this.tick(timeStr, tPass);
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interId);
    document.querySelector('.game-box').removeEventListener('touchmove', (e) => {
      e.preventDefault();
    });
  }

  tick(timeStr, tPass) {
    this.setState({
      timePass: tPass,
      time: timeStr,
      update: false,
    });
  }

  handleSuccess(nextSquares) {
    const isSuccess = nextSquares.every((t => t.value === (t.index + 1) % this.length));
    const step = this.state.step + 1;
    if (isSuccess) {
      clearInterval(this.interId);
      this.setState({
        success: true,
        step,
      });
    } else {
      this.setState({
        step
      });
    }
  }

  pauseClick() {
    clearInterval(this.interId);
    this.setState({
      showShadow: true
    });
  }

  startClick() {
    this.setState({
      showShadow: false
    });
    this.timer(this.state.timePass);
  }

  resetClick() {
    this.setState({
      showShadow: false,
      time: '00:00:00',
      timePass: 0,
      step: 0,
      level: this.level,
      update: true,
      squares: evenInverseNumber(this.level),
    });
    this.timer(0);
  }

  render() {
    return (
      <div className="game-box">
        <Status
          value={this.state.time}
          isSuccess={this.state.success}
          step={this.state.step}
        />
        <Block
          handle={this.handleSuccess}
          level={this.state.level}
          squares={this.state.squares}
          size={this.blockSize}
          simple={false}
          update={this.state.update}
        />
        <ShadowBox
          isShow={this.state.showShadow}
          isSuccess={this.state.success}
          level={this.state.level}
          time={this.state.time}
          timePass={this.state.timePass}
          step={this.state.step}
          pauseHandle={this.pauseClick}
          startHandle={this.startClick}
          resetHandle={this.resetClick}
        />
      </div>
    );
  }
}
