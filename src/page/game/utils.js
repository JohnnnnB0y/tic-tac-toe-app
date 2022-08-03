// 所有获胜的组合
const winArr = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];
// 处理校验逻辑
export const judgeWinner = (chessData, currentPlayer) => {
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
    const all = [...playData.get(1), ...playData.get(2)].length;
    if (all === 9 && winner === 0) {
      winner = -1;
    }
  }
  return { winner };
}