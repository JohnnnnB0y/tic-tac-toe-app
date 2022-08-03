import React, { useState } from 'react';
import styles from './style.scss';
import { judgeWinner } from './utils';
// 初始棋盘数据
const initChessData = Array.from(new Array(9), (el, index) => ({ id: index, player: 0 }));
/**
 * status：preparing ｜ going ｜ over
 * winner：获胜者 0 代表没有玩家赢得比赛 1代表player1赢 2代表player2赢
 * currentPlayer：处于当前轮次的玩家 0 代表游戏未开始 1 代表player1的轮次 2 代表player2的轮次
 */
const initGameInfo = { status: 'preparing', winner: 0, currentPlayer: 0 };
// 默认提示信息
const initNoticeInfo = { visible: false, message: '' };
// 不同状态的提示信息
const statusInfo = { 'preparing': '开始游戏', 'going': '游戏进行中', 'over': '重新开始' };


const TicTacToeGame = () => {
  const [second, setSecond] = useState(5);
  const [timer, setTimer] = useState(null);
  const [chessData, setChessData] = useState(initChessData);
  const [gameInfo, setGameInfo] = useState(initGameInfo);
  const [noticeInfo, setNoticeInfo] = useState(initNoticeInfo);
  // 开启倒计时
  const cutDown = () => {
    setSecond(5);
    timer && clearInterval(timer);
    const newTimer = setInterval(() => {
      setSecond(second => second - 1);
    }, 1000);
    setTimer(newTimer);
  }
  // 关闭倒计时
  const closeTimer = () => {
    timer && clearInterval(timer);
    timer && setTimer(null);
  }
  // 倒计时为0 关闭或重启倒计时
  if (second === 0) {
    if (gameInfo.status === 'going' && !timer) {
      const curr = gameInfo.currentPlayer === 1 ? 2 : 1;
      setGameInfo({ ...gameInfo, currentPlayer: curr });
      cutDown();
    } else {
      closeTimer();
    }
  }

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
    // 更新棋盘信息
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
      cutDown();
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
      closeTimer();
    }
  }
  // 点击开始/重新开始
  const onStartClick = () => {
    const { status } = gameInfo;
    if (status === 'preparing' || status === 'over') {
      setGameInfo({ ...initGameInfo, status: 'going', currentPlayer: 1 });
      setChessData(initChessData);
      handleNotice();
      cutDown();
    }
  }
  // 重置游戏
  const resetGame = () => {
    setGameInfo(initGameInfo);
    setChessData(initChessData);
    setNoticeInfo(initNoticeInfo)
    closeTimer();
  }
  // 关闭提示
  const handleNotice = () => {
    setNoticeInfo({ visible: false, message: '' });
  }
  return (
    <section className='game_section'>
      <div className='timer'>
        {
          gameInfo.status === 'going' && (
            <div className='timer_msg'>
              <span className='label'>倒计时：</span><span className='second'>{second}</span>
            </div>
          )
        }
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
      {
        gameInfo.status !== 'preparing' && (
          <div className='reset_btn' onClick={resetGame}>重置</div>
        )
      }
    </section>
  )
}

export default TicTacToeGame;