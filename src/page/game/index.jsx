import React, { useState } from 'react';
import styles from './style.scss';
// 初始棋盘数据
const initChessData = Array.from(new Array(9), (el, index) => ({ id: index, player: 0 }));
/**
 * status：preparing ｜ going ｜ over
 * winner：获胜者 0 代表没有玩家赢得比赛 1代表player1赢 2代表player2赢
 * currentPlayer：处于当前轮次的玩家 0 代表游戏未开始 1 代表player1的轮次 2 代表player2的轮次
 */
const initGameInfo = { status: 'preparing', winner: 0, currentPlayer: 0 };
// 所有获胜的组合
const winArr = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];
// 默认提示信息
const initNoticeInfo = { visible: false, message: '' };
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
  let winner = 0;
  if (currPlayerData.length >= 3) {
    // 下了三颗棋子才校验
    winArr.forEach((item) => {
      if (currPlayerData.filter(el => item.includes(el))?.length >= 3) {
        winner = currentPlayer;
        return;
      }
    });
    // 没有玩家获胜且落棋数量达到最大 判定平局
    if (currPlayerData.length === 5 && winner === 0) {
      winner = -1;
    }
  }
  return { winner };
}


const TicTacToeGame = () => {
  // const [second, setSecond] = useState(5);
  const [chessData, setChessData] = useState(initChessData);
  const [gameInfo, setGameInfo] = useState(initGameInfo);
  const [noticeInfo, setNoticeInfo] = useState(initNoticeInfo);

  // 点击棋盘格
  const handleChessClick = (v) => {
    const { status, currentPlayer } = gameInfo;
    if (status === 'preparing') {
      setNoticeInfo({ visible: true, message: '请点击开始游戏！' })
      return;
    }
    if (status === 'over') {
      setNoticeInfo({ visible: true, message: '游戏已经结束，请重新开始！' });
      return;
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
    const { currentPlayer, status } = gameInfo;
    if (status !== 'going' || currentPlayer === 0) return;
    const { winner: newWinner } = judgeWinner(chessData, currentPlayer);
    // 没有人获胜 切换玩家 继续游戏
    if (newWinner === 0 || newWinner !== currentPlayer) {
      const curr = currentPlayer === 1 ? 2 : 1;
      setGameInfo({ ...gameInfo, currentPlayer: curr });
    }
    // 平局
    if (newWinner === -1) {
      setNoticeInfo({ visible: true, message: '平局，请重新开始游戏！' });
      setGameInfo({ ...gameInfo, status: 'over', winner: newWinner });
    }
    // 玩家获胜
    if (newWinner === currentPlayer) {
      setNoticeInfo({ visible: true, message: `恭喜 player ${newWinner}，获胜` });
      setGameInfo({ ...gameInfo, status: 'over', winner: newWinner });
    }
  }
  // 点击开始/重新开始
  const onStartClick = () => {
    const { status } = gameInfo;
    if (status === 'preparing') {
      setGameInfo({ ...gameInfo, status: 'going', currentPlayer: 1 });
      handleNotice();
    }
    if (status === 'over') {
      setGameInfo({ ...initGameInfo, status: 'going', currentPlayer: 1 });
      setChessData(initChessData);
      handleNotice();
    }
  }
  // 关闭提示
  const handleNotice = () => {
    setNoticeInfo({ visible: false, message: '' });
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
      {
        noticeInfo.visible && (<div className='notice'>
          <span className='message'>{noticeInfo.message}</span>
        </div>)
      }
    </section>
  )
}

export default TicTacToeGame;