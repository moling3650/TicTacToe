class RandomStrategy {

  _randomChoose(cells) {
    return cells[Math.floor(Math.random() * cells.length)]
  }

  calculatePosition(board, piece) {
    return this._randomChoose(board.getEmptyCells())
  }

}

class MonteCarloStrategy {
  constructor(numberOfTrials = 100) {
    this.numberOfTrials = numberOfTrials
  }

  _randomChoose(cells) {
    return cells[Math.floor(Math.random() * cells.length)]
  }

  _trial (board, piece) {
    let winner = null
    while (winner === null) {
      const emptyCells = board.getEmptyCells()
      const position = this._randomChoose(emptyCells)
      board.move(position, piece)
      winner = board.checkWin()
      piece = board.switchPiece(piece)
    }
  }

  _updateScores(scores, board) {
    const winner = board.checkWin()
    if (winner === DRAW) {
      return
    }

    board.cells.forEach((cell, pos) => {
      if (cell !== EMPTY) {
        scores[pos] += (cell === winner) ? 1 : -1
      }
    })
  }

  _getBestMove(scores, board) {
    const emptyCells = board.getEmptyCells()
    if (!emptyCells.length) {
      throw Error('there is no possible next move')
    }

    const maxScore = Math.max(...emptyCells.map(pos => scores[pos]))
    const maxScoreCells = emptyCells.filter(pos => scores[pos] === maxScore)
    return this._randomChoose(maxScoreCells)
  }

  calculatePosition(board, piece) {
    const scoreBoard = new Array(board.cells.length).fill(0)

    for (let index = 0; index < this.numberOfTrials; index++) {
      const trialBoard = board.clone()
      this._trial(trialBoard, piece)
      this._updateScores(scoreBoard, trialBoard)
    }

    return this._getBestMove(scoreBoard, board)
  }
}
