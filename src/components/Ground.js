import $ from 'jquery'
import env from '../env.js'

import Shape from './Shape.js'
import ShapeL from './ShapeL.js'
import ShapeT from './ShapeT.js'
import ShapeJ from './ShapeJ.js'
import ShapeO from './ShapeO.js'
import ShapeI from './ShapeI.js'
import ShapeZ from './ShapeZ.js'
import ShapeS from './ShapeS.js'

// 战场组件
export default class Ground {
  constructor() {
    // 信息
    this._init()
    // 初始化格子数据
    this._initStore()

    // 渲染画布
    this._render()

    // 生成战场
    this._reDraw()

    // 初始化操作事件
    this._initEvent()
  }

  _init() {
    // 行数，列数
    this._cols = 10
    this._rows = 20

    // 尺寸
    this._height = env.groundHeight
    this._width = this._height / 2

    // 战场位置
    this._posTop = 0
    this._posLeft = (env.screenWidth - this._width) / 2 

    // 格子尺寸
    this._blockWidth = this._width / 10
    this._blockHeight = this._height / 20

    // 等级 映射 速度
    this._levelSpeed = new Map([
      [1, 500], 
      [2, 450], 
      [3, 400], 
      [4, 350], 
      [5, 300], 
      [6, 250], 
      [7, 200], 
      [8, 150], 
      [9, 100], 
      [10, 50],
      ])

    // 全部形状类
    this._shapes = [
      ShapeL, ShapeT, ShapeI, ShapeJ, ShapeO, ShapeS, ShapeZ,
    ]
  }
  // 格子数据
  _initStore() {
    this._store = new Array(this._rows)
    for (let i = 0 ; i<this._rows ; ++i) {
      this._store[i] = (new Array(this._cols)).fill(null, 0)
    }
  }

  setLevel(level) {
    this._level = level
    this._speed = this._levelSpeed.get(this._level)
  }
  getLevel() {
    return this._level
  }

   // 重绘
   _reDraw() {
    // 清除
    this._clear()
    // 生成格子
    this._drawBlock()
  }

  // 渲染画布
  _render() {
    let template = `
    <canvas id="ground" class="ground"></canvas>
    `
    $('#app').append(template)
    $('#ground').attr('width', this._width)
    $('#ground').attr('height', this._height)

    $('#ground').css({
      top: `${this._posTop}px`,
      left: `${this._posLeft}px`,
    })

    // 画布对象，上下文对象
    this.canvas = document.getElementById("ground")
    this.ctx = this.canvas.getContext("2d"); // 作画上下文
  }

  _clear() {
    this.ctx.clearRect(0, 0, this._width, this._height);
  }

  // 画格子
  _drawBlock() {
    for (let r = 0; r < this._rows; ++ r) { // row 行循环
      for (let c = 0; c < this._cols; ++ c) { // 列 col
        // 框颜色和宽度
        this.ctx.strokeStyle = "rgba(255,255,255,0.4)";
        this.ctx.lineWidth = 1;
        // 计算框的位置
        // 使用 X和Y表示，横轴纵轴
        let posX = c * this._blockHeight
        let posY = r * this._blockWidth
        // 无填充矩形
        this.ctx.strokeRect(posX, posY, this._blockWidth, this._blockHeight);

        // 判断当前的格子是否需要填充形状的颜色
        let color = this._store[r][c]
        if (color) {
          this.ctx.fillStyle = color
          this.ctx.fillRect(posX+1, posY+1, this._blockWidth-2, this._blockHeight-2);
        }

        // 判断当前活动形状
        if (this._activeShape) {
          let blockPos = this._activeShape.calBlockPos()
          let posArr = blockPos.map(ele=>ele[0]+'-'+ele[1])
          if (posArr.includes(r + '-' + c)) {
            this.ctx.fillStyle = this._activeShape.color
            this.ctx.fillRect(posX+1, posY+1, this._blockWidth-2, this._blockHeight-2);
          }
        }
  
      }
    }
  }

  // 绑定事件
  _initEvent() {
    // 键盘事件
    $(document).keydown(event => {
      console.log(event.keyCode)
      // this // App 对象
      // 键盘 <-
      if (37 == event.keyCode) {
        this.moveLeft()
        event.preventDefault()
      }
      // 键盘->
      else if (39 == event.keyCode) {
        this.moveRight()
        event.preventDefault()
      }
      // 键盘空格
      else if (32 == event.keyCode) {
        this.change()
        event.preventDefault()
      }
      // 键盘下
      else if (40 == event.keyCode) {
        this.moveDown()
        event.preventDefault()
      }
      // 键盘Enter
      else if (13 == event.keyCode) {
        this.moveToBottom()
        event.preventDefault()
      }
      // 键盘Shift
      else if (16 == event.keyCode) {
        this.start()
        event.preventDefault()
      }
      // 键盘esc
      else if (27 == event.keyCode) {
        this.pause()
        event.preventDefault()
      }
      // 键盘r
      else if (82 == event.keyCode) {
        this.reload()
        event.preventDefault()
      }
    })

    $('#controller-start').click(event=>{
        this.start()
        event.preventDefault()
    })
    $('#controller-pause').click(event=>{
        this.pause()
        event.preventDefault()
    })
    $('#controller-left').click(event=>{
        this.moveLeft()
        event.preventDefault()
    })
    $('#controller-right').click(event=>{
        this.moveRight()
        event.preventDefault()
    })
    $('#controller-changer').click(event=>{
        this.change()
        event.preventDefault()
    })
    $('#controller-reload').click(event=>{
        this.reload()
        event.preventDefault()
    })
    $('#controller-down').click(event=>{
        this.moveDown()
        event.preventDefault()
    })
    $('#controller-bottom').click(event=>{
        this.moveToBottom()
        event.preventDefault()
    })
    $('#controller-control').click(event=>{
      let control = $('#controller-control')
      if ('pause' == control.data('status') || ! control.data('status')) {
        this.start()
        control.data('status', 'start')
      }
      else if ('start' == control.data('status')) {
        this.pause()
        control.data('status', 'pause')
      }
      event.preventDefault()  
    })
  }

  // 判断是否越界
  _isOverBoundary() {
    // 获取当前形状的四个块的位置
    let blockPos = this._activeShape.calBlockPos()
    for (let i = 0; i < blockPos.length; ++i) {
      // 得到4个方块的新坐标
      let x = blockPos[i][0]
      let y = blockPos[i][1]

      // 未出现的块不用判断
      if (x < 0) {
        continue
      }

      // 墙的判断
      if (y < 0 || y >= this._cols || x >= this._rows) {
        return true
      } 
      
      // 已有块判断
      if (this._store[x][y]) {
        return true
      }
    }

    return false
  }

  // 更新store
  _updateStore() {
    // 遍历全部的形状的块
    let blockPos = this._activeShape.calBlockPos()
    for (let i = 0; i<blockPos.length; ++i) {
      let r = blockPos[i][0], c = blockPos[i][1]
      if (r>=0 && c >=0 ) {
        this._store[r][c] = this._activeShape.color 
      }
    }
  }
  // 消除方块
  _erasureBlock() {
    // 遍历全部的块
    for (let r = 19; r>=0 ; --r) {
      // 从底行开始处理
      let isFull = true
      for (let c = 0; c<this._cols; ++c) {
        isFull = isFull && this._store[r][c]
        // isFull  &&= this._store[r][c]
      }
      // 某行满了
      if (isFull) {
        // 消除，就是一个移动的操作，将上面的行向下移动
        this._moveRest(r)
        ++ r // 重新检测改行，改行是上面 的移动下来的
      }
    }
  }
  // 移动上面剩余的块
  _moveRest(row) {
    for (let r = row-1; r >=0 ; --r) {
      // r 需要移动的行的索引号
      // r+1 移动目标的索引号
      this._store[r+1] = this._store[r]
    }
    // 将第一行，索引为0的设置为初始化状态
    this._store[0] = (new Array(this._cols)).fill(null, 0)
  }

    // 新形状
  _newShape() {
    let randomIndex = Math.floor(Math.random()*7) // 0 - 6
    this._activeShape = new this._shapes[randomIndex]() // 随机策略  
    this._activeShape.pos = [-2, 4]    
  }
   
  start() {

    if (!this.getLevel()) {
      // 设置初始速度
      this.setLevel(1)
    }    

    // 在定时器不存在时，设置定时器
    if (! this._timer) {
      this._timer = setInterval(()=>{
        // 活动形状需要初始化
        if (!this._activeShape) {
          this._newShape()
        }
        // 向下移动块  
        this.moveDown()
      }, this._speed)
    }
    $('#start-image').hide()
    $('#pause-image').show()
  }

  reload() {
    this._activeShape = null
    this._initStore()
    this.setLevel(1)

    this.pause()
    this.start()
  }

  _isOver() {
    for (let c = 0; c<this._cols; ++c) {
      if (this._store[0][c]) {
        return true
      }
    }
    return false
  }
  pause() {
    if( this._timer) {
      clearInterval(this._timer)
      this._timer = null
    }
    $('#pause-image').hide()
    $('#start-image').show()
  }
  over() {
    this.pause()
    console.log('游戏结束')
  }

  _shapeFixed() {
    // 更新累积数据
    this._updateStore() // store的更新

    // 消除方块
    this._erasureBlock()

    // 处理游戏结束
    if (this._isOver()) {
      this.over()
      return this
    }

    // 取消活动块
    this._activeShape = null
  }
  moveDown() {
    if (! this._timer || ! this._activeShape) {
      return this
    }

    // 开始向下移动
    this._activeShape.moveDown()

    // 判断是否越界，若越界，将形状定在原来的位置上
    if (this._isOverBoundary()) {
      this._activeShape.rollback()

      // 固定形状
      this._shapeFixed()

      return this
    }

    // 重绘
    this._reDraw()

    return this
  }

  moveToBottom() {
    if (! this._timer || ! this._activeShape) {
      return this
    }

    for (let r = this._rows-1; r>=0; --r) {
      this._activeShape.moveToRow(r)
       // 判断是否越界
      if (this._isOverBoundary()) {
        this._activeShape.rollback()
        continue
      }
      break
    }

    // 固定形状
    this._shapeFixed()            
    // 重绘
    this._reDraw()    
  }
  moveLeft() {
    if (! this._timer || ! this._activeShape) {
      return this
    }

    // 移动
    this._activeShape.moveLeft()

    // 判断是否越界
    if (this._isOverBoundary()) {
      this._activeShape.rollback()
      return;
    }
    // 重绘
    this._reDraw()
  }
  moveRight() {
    if (! this._timer || ! this._activeShape) {
      return
    }

    // 移动
    this._activeShape.moveRight()
    // 判断是否越界
    if (this._isOverBoundary()) {
      this._activeShape.rollback()
      return;
    }
    // 重绘
    this._reDraw()
  }
  change() {
    if (! this._timer || ! this._activeShape) {
      return
    }

    // 移动
    this._activeShape.change()

    // 判断是否越界
    if (this._isOverBoundary()) {
      // 回滚转换
      this._activeShape.changeRollback()
      return;
    }
    this._reDraw()
  }

}