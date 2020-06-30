const PIECE_X = 1
const PIECE_O = -1
const EMPTY = 0
const DRAW = 0

class Board {
  constructor(dimension = 3, cells = null, winDimension) {
    if (cells && Array.isArray(cells)) {
      this.cells = cells.flat()
      this.dimension = Math.sqrt(this.cells.length)
    } else {
      this.dimension = dimension
      this.clear()
    }
    this.winDimension = winDimension || this.dimension
    this.checkWinRegExp = new RegExp(`(${this.displayFor(PIECE_X)}|${this.displayFor(PIECE_O)})(?:\\1){${this.winDimension - 1}}`)
  }

  displayFor(cell) {
    return {
      [EMPTY]: '⬜',
      [PIECE_X]: '❌',
      [PIECE_O]: '⭕',
    }[cell]
  }

  winnerFor(display) {
    return {
      '❌': PIECE_X,
      '⭕': PIECE_O
    }[display]
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

  _getAxisList() {
    const axisList = []
    for (let start = 0; start < this.cells.length; start += this.dimension) {
      const axis = []
      for (let offset = 0; offset < this.dimension; offset++) {
        axis.push(start + offset)
      }
      axisList.push(axis.map(pos => this.displayFor(this.cellFor(pos))).join(''))
    }

    for (let start = 0; start < this.dimension; start++) {
      const axis = []
      for (let offset = 0; offset < this.cells.length; offset += this.dimension) {
        axis.push(start + offset)
      }
      axisList.push(axis.map(pos => this.displayFor(this.cellFor(pos))).join(''))
    }

    {
      let start = this.winDimension - 1
      while (start / this.dimension < this.dimension - this.winDimension + 1) {
        const axis = [this.cellFor(start)]
        let offset = 0
        do {
          offset += this.dimension - 1
          axis.push(start + offset)
        } while ((start + offset * 2) < this.cells.length && (start + offset) % this.dimension)
        axisList.push(axis.map(pos => this.displayFor(this.cellFor(pos))).join(''))
        start += start < this.dimension - 1 ? 1 : this.dimension
      }
    }

    {
      let start = this.dimension - this.winDimension
      while (start / this.dimension <= (this.dimension - this.winDimension)) {
        const axis = [this.cellFor(start)]
        let offset = 0
        do {
          offset += this.dimension + 1
          axis.push(start + offset)
        } while ((start + offset + this.dimension) / this.dimension < this.dimension && (start + offset + 1) % this.dimension)
        axisList.push(axis.map(pos => this.displayFor(this.cellFor(pos))).join(''))
        start += start % this.dimension ? -1 : this.dimension
      }
    }
    return axisList
  }

  _checkWinByAxis(axis) {
    const match = this.checkWinRegExp.exec(axis)
    return match && this.winnerFor(match[1])
  }

  checkWin() {
    for (const axis of this._getAxisList()) {
      const winner = this._checkWinByAxis(axis)
      if (winner !== null) {
        return winner
      }
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
