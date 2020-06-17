const PIECE_X = 1
const PIECE_O = -1
const EMPTY = 0
const DRAW = 0
const CELL_DISPLAY = {
  [EMPTY]: '□',
  [PIECE_X]: 'X',
  [PIECE_O]: 'O',
}

class Board {
  constructor(dimension = 3, cells = null) {
    if (cells && Array.isArray(cells)) {
      this.cells = cells.flat()
      this.dimension = Math.sqrt(this.cells.length)
    } else {
      this.dimension = dimension
      this.clear()
    }
  }

  switchPiece(piece) {
    if (piece === PIECE_X) {
      return PIECE_O
    } else if (piece === PIECE_O) {
      return PIECE_X
    } else {
      throw TypeError('Invalid piece type')
    }
  }

  getDimension() {
    return this.dimension
  }

  cellFor(position) {
    return this.cells[position]
  }

  getEmptyCells() {
    return this.cells.map((cell, idx) => cell === EMPTY ? -1 : idx).filter(idx => ~idx)
  }

  move(position, piece) {
    if (this.cellFor(position) === EMPTY) {
      this.cells[position] = piece
    }
  }

  _checkWinByAxis(start, step) {
    const piece = this.cellFor(start)
    if (piece === EMPTY) {
      return null
    }
    let pos = start + step * (this.dimension - 1)
    while (start < pos && this.cellFor(pos) === piece) {
      pos -= step
    }
    return (start === pos) ? piece : null
  }

  checkWin() {
    let winner = null
    // 横轴
    for (let pos = 0; pos < this.cells.length; pos += this.dimension) {
      winner = this._checkWinByAxis(pos, 1)
      if (winner) {
        return winner
      }
    }
    // 纵轴
    for (let pos = 0; pos < this.dimension; pos++) {
      winner = this._checkWinByAxis(pos, this.dimension)
      if (winner) {
        return winner
      }
    }
    // 左斜轴
    winner = this._checkWinByAxis(0, this.dimension + 1)
    if (winner) {
      return winner
    }
    // 右斜轴
    winner = this._checkWinByAxis(this.dimension - 1, this.dimension - 1)
    if (winner) {
      return winner
    }

    return this.getEmptyCells().length ? null : DRAW
  }

  clone() {
    return new Board(null, this.board)
  }

  clear() {
    this.cells = new Array(this.dimension * this.dimension)
    this.cells.fill(EMPTY)
  }
}
