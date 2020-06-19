const PIECE_X = 1
const PIECE_O = -1
const EMPTY = 0
const DRAW = 0

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

  displayFor(cell) {
    return {
      [EMPTY]: '⬜',
      [PIECE_X]: '❌',
      [PIECE_O]: '⭕',
    }[cell]
  }

  display() {
    return this.cells.map(c => this.displayFor(c)).join('').replace(new RegExp(`(.{${this.getDimension()}})`,'g'), '$1\n')
  }

  switchPiece(piece) {
    if (![PIECE_X, PIECE_O].includes(piece)) {
      throw TypeError('Invalid piece type')
    }
    return PIECE_X + PIECE_O - piece
  }

  getDimension() {
    return this.dimension
  }

  cellFor(position) {
    return this.cells[position]
  }

  isEmptyCell(cell) {
    return cell === EMPTY
  }

  getEmptyCells() {
    return this.cells.map((cell, idx) => this.isEmptyCell(cell) ? idx : -1).filter(idx => ~idx)
  }

  move(position, piece) {
    if (this.isEmptyCell(this.cellFor(position))) {
      this.cells[position] = piece
    }
  }

  _checkWinByAxis(start, step) {
    const piece = this.cellFor(start)
    if (this.isEmptyCell(piece)) {
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

    return this.isFull() ? DRAW : null
  }

  clone() {
    return new Board(null, this.cells)
  }

  clear() {
    this.cells = new Array(this.dimension * this.dimension).fill(EMPTY)
  }

  clearCell(position) {
    this.cells[position] = EMPTY
  }

  isEmpty() {
    return this.cells.every(cell => this.isEmptyCell(cell))
  }

  isFull() {
    return this.cells.every(cell => !this.isEmptyCell(cell))
  }
}
