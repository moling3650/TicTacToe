# Tic-Tac-Toe

### 概念定义
- 棋子（Piece）
  - PIECE_O
  - PIECE_X
- 棋格（Cell）
  - PIECE_O
  - PIECE_X
  - EMPTY
- 胜者（Winner）
  - PIECE_O
  - PIECE_X
  - DRAW
---
### 棋盘（Board）
- 属性
  - dimension：尺寸，Tic-Tac-Toe的棋盘尺寸是3
  - cells：棋盘数据，用一维数组储存
- 方法
  - constructor (dimension = 3, cells = null)：棋盘初始化
  - getDimension ()：获取棋盘尺寸
  - switchPiece (piece)：切换棋子，返回`O、X`其中之一
  - cellFor (position)：获取positon的Cell，返回`O、X、EMPTY`其中之一
  - getEmptyCells ()：获取所有空白棋格的position的数组
  - move (position, piece)：落子
  - checkWin ()：获取棋局的胜者，棋局结束返回`O、X、DRAW`其中之一，否则返回`null`
  - clone ()：返回一个克隆的棋盘
  - clear ()：清空棋盘
---
### 策略（Strategy）
- 抽象方法
  - calculatePosition (board, piece)：计算落子点
---
### 游戏（Game）
- 属性
  - board：棋盘
  - containerEl：容器元素
  - currentPiece：当前落子的棋子
  - isRunning：游戏是否运行中
- 方法
  - constructor(board, containerSelector = '.container')：游戏初始化
  - _initDom ()：初始化DOM
  - _draw ()：绘制棋盘
  - move (position): 落子，棋子自动判定
  - moveByStratepy (strategy)：根据某个策略模型落子
  - start (piece = PIECE_O)：开始游戏
  - restart (piece = PIECE_O)：重置游戏
