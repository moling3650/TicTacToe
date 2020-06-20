class Game {
  constructor(board, containerSelector = '.container', opts) {
    this.board = board
    this.containerEl = document.querySelector(containerSelector)
    this.currentPiece = PIECE_O
    this.isRunning = false
    this._initDom(opts)
  }

  _initDom(opts) {
    const { cellSize = 100, cellBorderWidth = 1 } = opts || {}
    const fragment = document.createDocumentFragment()
    const dim = this.board.getDimension()
    for (let pos = 0; pos < this.board.cells.length; pos++) {
      const el = document.createElement('DIV')
      el.style.width = `${cellSize}px`
      el.style.height = `${cellSize}px`
      el.style.fontSize = `${cellSize * 0.6}px`
      el.style.lineHeight = `${cellSize}px`
      el.style.border = `${cellBorderWidth}px solid #fff`
      el.classList.add('cell')
      el.addEventListener('click', () => this.move(pos))
      fragment.appendChild(el)
    }
    this.containerEl.style.width = `${(cellSize + cellBorderWidth * 2) * dim}px`
    this.containerEl.appendChild(fragment)
  }

  _draw() {
    const range = new Range()
    range.selectNodeContents(this.containerEl)
    const fragment = range.extractContents()
    Array.from(fragment.childNodes).forEach((el, pos) => {
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
