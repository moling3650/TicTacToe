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
        el.innerText = this.board.isEmptyCell(cell) ? '' : this.board.displayFor(cell)
      })

    this.containerEl.appendChild(fragment)
  }

  move(position) {
    if (this.isRunning && this.board.isEmptyCell(this.board.cellFor(position))) {
      this.board.move(position, this.currentPiece)
      this.currentPiece = this.board.switchPiece(this.currentPiece)
      this._draw()
      const winner = this.board.checkWin()
      if (winner !== null) {
        this.isRunning = false
        const winMsg = winner === DRAW ? 'Draw' : `Winner is ${this.board.displayFor(winner)}`
        alert(`${winMsg}, please restart the game.`)
      }
    }
  }

  moveByStratepy(stratepy) {
    if (this.board.isFull()) {
      throw Error('there is no possible next move')
    }
    const position = stratepy.calculatePosition(this.board, this.currentPiece)
    this.move(position)
  }

  start() {
    this.isRunning = true
    this.board.clear()
    this._draw()
  }

  restart() {
    this.start()
  }
}
