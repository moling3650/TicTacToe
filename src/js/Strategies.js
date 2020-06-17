class RandomStrategy {

  _randomChoose(cells) {
    return cells[Math.floor(Math.random() * cells.length)]
  }

  calculatePosition(board, piece) {
    return this._randomChoose(board.getEmptyCells())
  }

}
