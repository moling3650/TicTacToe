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
    let winner = board.checkWin()
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
      if (!board.isEmptyCell(cell)) {
        scores[pos] += (cell === winner) ? 1 : -1
      }
    })
  }

  _getBestMove(scores, board) {
    const emptyCells = board.getEmptyCells()
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

class MinimaxStrategy {
  constructor() {
    this.WIN_SCORES = {
      [PIECE_O]: -1,
      [PIECE_X]: 1,
      [DRAW]: 0
    }
  }

  _winScoreFor(winner) {
    return this.WIN_SCORES[winner]
  }

  _isWin(piece, score) {
    return this._winScoreFor(piece) === score
  }

  _isBetter(piece, score, bestScore) {
    if (piece === PIECE_O) {
      return score <= bestScore
    } else if (piece === PIECE_X) {
      return score >= bestScore
    } else {
      throw TypeError('Invalid piece type')
    }
  }

  _getBestMove(board, piece) {
    const winner = board.checkWin()
    if (winner !== null) {
      return { score: this._winScoreFor(winner), position: -1 }
    }

    const otherPiece = board.switchPiece(piece)
    let best = { score: this._winScoreFor(otherPiece), position: -1 }
    for (const position of board.getEmptyCells()) {
      const child = board.clone()
      child.move(position, piece)
      const { score } = this._getBestMove(child, otherPiece)
      if (this._isWin(piece, score)) {
        return { score, position }
      } else if (this._isBetter(piece, score, best.score)) {
        best = { score, position }
      }
    }
    return best
  }

  calculatePosition(board, piece) {
    if (board.isEmpty()) {
      return Math.floor(board.cells.length / 2)
    }
    const { position } = this._getBestMove(board, piece)
    if (position === -1) {
      throw Error('returned illegal move position (-1)')
    }
    return position
  }
}
