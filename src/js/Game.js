class Game {
  constructor(board, containerSelector = '.container') {
    this.board = board
    this.containerEl = document.querySelector(containerSelector)
    this.currentPiece = PIECE_O
    this.isRunning = false
    this._initDom()
  }

  _initDom() {
    const fragment = document.createDocumentFragment()
    const dim = this.board.getDimension()
    for (let pos = 0; pos < this.board.cells.length; pos++) {
      if (pos && pos % dim === 0) {
        fragment.appendChild(document.createElement('BR'))
      }
      const el = document.createElement('DIV')
      el.classList.add('cell')
      el.addEventListener('click', () => this.move(pos))
      fragment.appendChild(el)
    }
    this.containerEl.appendChild(fragment)
  }

  _draw() {
    const range = new Range()
    range.selectNodeContents(this.containerEl)
    const fragment = range.extractContents()
    Array.from(fragment.childNodes).filter(n => n.tagName === 'DIV')
    .forEach((el, pos) => {
      const cell = this.board.cellFor(pos)
      el.innerText = (cell === EMPTY) ? '' : CELL_DISPLAY[cell]
    })

    this.containerEl.appendChild(fragment)
  }

  move(position) {
    if (this.isRunning && this.board.cellFor(position) === EMPTY) {
      this.board.move(position, this.currentPiece)
      this.currentPiece = this.board.switchPiece(this.currentPiece)
      this._draw()
      const winner = this.board.checkWin()
      if (winner !== null) {
        this.isRunning = false
        alert(`Winner is ${CELL_DISPLAY[winner]}, please restart the game.`)
      }
    }
  }

  moveByStratepy(stratepy) {
    const position = stratepy.calculatePosition(this.board, this.currentPiece)
    this.move(position)
  }

  start(piece = PIECE_O) {
    this.currentPiece = piece
    this.isRunning = true
    this.board.clear()
    this._draw()
  }

  restart(piece = PIECE_O) {
    this.start(piece)
  }
}
