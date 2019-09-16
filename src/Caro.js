import React from 'react';
import './Caro.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReplyAll } from '@fortawesome/free-solid-svg-icons'

const width = 20;
const height = 20;
const nSquareToWin = 5;

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick = {()=>this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Row extends React.Component {
  render() {
    let row = this.props.row.map((square, colIdx) => {
      return (
        <Square value = {square} onClick = {() => this.props.onClick(this.props.rowIdx, colIdx)}/>
      )
    })
    return (
      <div className = "board-row">
        {row}
      </div>
    )
  }
}

class Board extends React.Component {
  render() {
    let board;
    board = this.props.squares.map((row, rowIdx) => {
      return (
        <Row rowIdx = {rowIdx} row = {row} onClick = {this.props.onClick}/>
      )
    })
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Caro extends React.Component {
  constructor(props) {
    super(props);
    let tmpArr = Array(height);
    for (let i = 0; i < height; i++) {
      tmpArr[i] = Array(width).fill(null);
    }
    this.state = {
      history: [{
        squares: tmpArr,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }
    squares[i][j] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  replay(){
   let tmpArr = Array(height);
    for (let i = 0; i < height; i++) {
      tmpArr[i] = Array(width).fill(null);
    }    
    const squares = tmpArr;
    this.setState({
      history: ([{
        squares: squares
      }]),
      stepNumber: 0,
      xIsNext: true,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div class = "content">
        <div className = "game">
          <div className = "game-board">
            <div className = "title">Game Caro VN</div>
            <div className = "status">{status}
            <button className = "replay" onClick = {() => this.replay()}>
              <FontAwesomeIcon icon = {faReplyAll}/> Chơi lại
            </button>
            </div>
            <Board
              squares = {current.squares}
              onClick = {(i, j) => this.handleClick(i, j)}
            />
          </div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  let win;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (!squares[i][j]) continue;
      if (j <= width - nSquareToWin) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i][j + k] !== squares[i][j + k + 1]) {
            win = false
          }
        }
        if (win){
          if(j > 0 && j < width - nSquareToWin){
            let check1 = false;
            let check2 = false;
            for(let k1 = 0; k1 < j; k1++){
              if(squares[i][k1] && squares[i][k1] !== squares[i][j]) check1 = true;
            }
            for(let k2 = j + nSquareToWin; k2 < width ;k2++){
              if(squares[i][k2] && squares[i][k2] !== squares[i][j]) check2 = true;
            }
            if(!check1 || !check2) return squares[i][j];
          }          
          else{
            return squares[i][j];
          }
        }
      }

      if (i <= height - nSquareToWin) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i + k][j] !== squares[i + k + 1][j]) {
            win = false
          }
        }
        if (win){ 
          if(i > 0 && i < height-nSquareToWin){
            let check1 = false;
            let check2 = false;
            for(let k1 = 0; k1 < i; k1++){
              if(squares[k1][j] && squares[k1][j] !== squares[i][j])check1 = true;
            }
            for(let k2 = i + nSquareToWin; k2 < height; k2++){
              if(squares[k2][j] && squares[k2][j] !== squares[i][j])check2 = true;
            }
            if(!check1 || !check2)return squares[i][j];
          }
          else{
            return squares[i][j];
          }
        }
      }

      if (j <= width - nSquareToWin && i <= height - nSquareToWin) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i + k][j + k] !== squares[i + k + 1][j + k + 1]) {
            win = false
          }
        }
        if (win)
        {
          if(i > 0 && j > 0 && i < height - nSquareToWin && j < width - nSquareToWin){
            let check1 = false;
            let check2 = false;
            for(let ki = i - 1, kj = j - 1; ki >= 0 && kj >= 0; ki--, kj--){
              if(squares[ki][kj] && squares[ki][kj] !== squares[i][j]) check1 = true;
            }
            for(let ki = i + nSquareToWin, kj = j + nSquareToWin; ki < height && kj < width; ki++, kj++)
            {
              if(squares[ki][kj] && squares[ki][kj] !== squares[i][j]) check2 = true;
            }
            if(!check1 || !check2)return squares[i][j];
          }
          else{
            return squares[i][j];
          }
        }
      }
      
      if (i <= height - nSquareToWin && j >= nSquareToWin - 1) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i + k][j - k] !== squares[i + k + 1][j - k - 1]) {
            win = false
          }
        }
        if (win){
          if(i > 0 && j < width - 1 && i < height - nSquareToWin && j >= nSquareToWin){
            let check1 = false;
            let check2 = false;
            for(let ki = i - 1, kj = j + 1; ki >= 0 && kj < width; ki--, kj++){
              if(squares[ki][kj] && squares[ki][kj]!== squares[i][j]) check1 = true;
            }
            for(let ki = i + nSquareToWin, kj = j - nSquareToWin; ki < height && kj >= 0; ki++, kj--){
              if(squares[ki][kj] && squares[ki][kj]!== squares[i][j]) check2 = true;
            }
            if(!check1 || !check2)return squares[i][j];
          }
          else{
            return squares[i][j];
          }
        }
      }
    }
  }
  return null;
}

export default Caro;