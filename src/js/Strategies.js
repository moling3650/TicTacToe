class RandomStrategy {

  _log(board, piece, position) {
    const logs = [
      'Random',
      board.display(),
      `当前落子：${board.displayFor(piece)}`,
      `选择了(${Math.floor(position / board.dimension)}, ${position % board.dimension})`
    ]
    console.log(logs.join('\n'))
  }

  _randomChoose(cells) {
    return cells[Math.floor(Math.random() * cells.length)]
  }

  calculatePosition(board, piece) {
    const position = this._randomChoose(board.getEmptyCells())
    this._log(board, piece, position)
    return position
  }

}

class MonteCarloStrategy {
  constructor(numberOfTrials = 100) {
    this.numberOfTrials = numberOfTrials
  }

  _log(board, piece, position, scoreBoard) {
    const logs = [
      'Monte Carlo',
      board.display(),
      scoreBoard.map(s => s.toString().padStart(4)).join(',').replace(new RegExp(`((?:.+?,){${board.dimension}})`, 'g'), '$1\n'),
      `当前落子：${board.displayFor(piece)}`,
      `选择了(${Math.floor(position / board.dimension)}, ${position % board.dimension})`
    ]
    console.log(logs.join('\n'))
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

    const position = this._getBestMove(scoreBoard, board)
    this._log(board, piece, position, scoreBoard)
    return position
  }
}

class MinimaxStrategy {
  constructor() {
    this.WIN_SCORES = {
      [PIECE_O]: -1,
      [PIECE_X]: 1,
      [DRAW]: 0
    }

    this.root = { children: [] }
  }

  _log(board, piece, position) {
    const logs = [
      'Minimax',
      board.display(),
      `当前落子：${board.displayFor(piece)}`,
      `选择了(${Math.floor(position / board.dimension)}, ${position % board.dimension})`
    ]
    console.log(logs.join('\n'))
  }

  _winScoreFor(winner) {
    return this.WIN_SCORES[winner]
  }

  _winFor(score) {
    return {
      [PIECE_O]: '⭕',
      [PIECE_X]: '❌',
      [DRAW]: 'DRWA'
    }[score]
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

  _getBestMove(board, piece, parent) {
    const self = {
      winner: '',
      piece: board.displayFor(piece),
      bestMove: '',
      board: board.display().split('\n'),
      children: []
    }
    parent.children.push(self)
    const winner = board.checkWin()
    if (winner !== null) {
      self.piece = ''
      self.winner = this._winFor(this._winScoreFor(winner))
      return { score: this._winScoreFor(winner), position: -1 }
    }

    const adversary = board.switchPiece(piece)
    let best = { score: this._winScoreFor(adversary), position: -1 }
    for (const position of board.getEmptyCells()) {
      board.move(position, piece)
      const { score } = this._getBestMove(board, adversary, self)
      board.clearCell(position)
      if (this._isWin(piece, score)) {
        self.winner = this._winFor(this._winScoreFor(score))
        self.bestMove = `(${Math.floor(position / board.dimension)}, ${position % board.dimension})`
        return { score, position }
      } else if (this._isBetter(piece, score, best.score)) {
        best = { score, position }
      }
    }
    self.winner = this._winFor(this._winScoreFor(best.score))
    self.bestMove = `(${Math.floor(best.position / board.dimension)}, ${best.position % board.dimension})`
    return best
  }

  calculatePosition(board, piece) {
    if (board.isEmpty()) {
      return Math.floor(board.cells.length / 2)
    }
    this.root = { children: [] }
    const { position } = this._getBestMove(board, piece, this.root)
    if (position === -1) {
      throw Error('returned illegal move position (-1)')
    }
    console.log(JSON.stringify(this.root.children[0], null, 2))
    this._log(board, piece, position)
    return position
  }
}
