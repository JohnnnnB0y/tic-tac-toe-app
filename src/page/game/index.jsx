import React, { useState, useEffect } from 'react';
import styles from './style.scss';
// 初始化数据
const initChessData = Array.from(new Array(9), (el, index) => ({ id: index, player: 0 }));
const initGameInfo = { status: 'preparing', winner: 0, currentPlayer: 0 };
const winArr = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];
const statusInfo = { 'preparing': '开始游戏', 'going': '游戏进行中', 'over': '重新开始' };
// 处理校验逻辑
const judgeWinner = (chessData, currentPlayer) => {
  const playData = new Map([[1, []], [2, []]]);
  chessData.forEach(el => {
    const { id, player } = el;
    if (player > 0) {
      const arr = playData.get(player);
      playData.set(player, [...arr, id]);
    }
  });
  const currPlayerData = playData.get(currentPlayer);
  const winnerInfo = { winner: 0 };
  if (currPlayerData.length >= 3) {
    // 下了三颗棋子才校验是否获胜
    winArr.forEach((item) => {
      if (currPlayerData.filter(el => item.includes(el))?.length >= 3) {
        winnerInfo.winner = currentPlayer;
        return;
      }
    });
  }
  return winnerInfo;
}


const TicTacToeGame = () => {
  const [second, setSecond] = useState(5);
  const [chessData, setChessData] = useState(initChessData);
  const [gameInfo, setGameInfo] = useState(initGameInfo);

  // 点击棋盘格
  const handleChessClick = (v) => {
    const { status, winner, currentPlayer } = gameInfo;
    if (status === 'preparing') {
      return alert('请点击开始游戏！')
    }
    if (status === 'over') {
      return alert('游戏已经结束，请开始下一把游戏！')
    }
    const { id, player } = v;
    // 当前棋盘格 已经有玩家选择了 就不能选择
    if (player > 0) return;
    // 获取新的棋盘信息
    const newChessData = chessData.map((el) => {
      return el.id === id ? {
        ...el,
        player: currentPlayer
      } : el;
    });
    setChessData(newChessData);
    verifyResult(newChessData, currentPlayer);
  }
  // 校验验游戏结果
  const verifyResult = (chessData) => {
    const { currentPlayer } = gameInfo;
    if (currentPlayer === 0) return;
    const { winner: newWinner } = judgeWinner(chessData, currentPlayer);
    if (newWinner === 0 || newWinner !== currentPlayer) {
      const curr = currentPlayer > 0 && currentPlayer === 1 ? 2 : 1;
      setGameInfo({ ...gameInfo, currentPlayer: curr });
    } else {
      setGameInfo({ ...gameInfo, status: 'over', winner: newWinner });
      alert(`恭喜 player ${newWinner}，获胜`);
    }
  }
  const onStartClick = () => {
    const { status } = gameInfo;
    if (status === 'preparing') {
      setGameInfo({ ...gameInfo, status: 'going', currentPlayer: 1 });
    }
    if (status === 'over') {
      setGameInfo({ ...initGameInfo, status: 'going', currentPlayer: 1 });
      setChessData(initChessData);
    }
  }
  return (
    <section className='game_section'>
      <div className='timer'>
        {/* <div>
          <span>倒计时：</span><span className='second'>{second}</span>
        </div> */}
      </div>
      <div className='middleContent'>
        <div className='player'>
          <div className={`player_display ${gameInfo.currentPlayer === 1 && 'active_player'}`}>
            player 1
            {
              gameInfo.winner === 1 && <span className='winnerFlag'>WINNER</span>
            }
          </div>
        </div>
        <div className='chessBoard'>
          <ul className='chessBoard_list'>
            {
              chessData.map((el) => {
                return (
                  <li className='chess_item' key={el.id} onClick={() => handleChessClick(el)}>
                    {
                      el.player === 1 && <span>X</span>
                    }
                    {
                      el.player === 2 && <span>O</span>
                    }
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className='player'>
          <div className={`player_display ${gameInfo.currentPlayer === 2 && 'active_player'}`}>
            player 2
            {
              gameInfo.winner === 2 && <span className='winnerFlag'>WINNER</span>
            }
          </div>
        </div>
      </div>
      <div className='startBox'>
        <button className='startBtn' onClick={onStartClick}>
          {
            statusInfo[gameInfo.status]
          }
        </button>
      </div>
    </section>
  )
}

export default TicTacToeGame;