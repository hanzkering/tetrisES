import $ from 'jquery'
import env from '../env.js'

// 战场组件
export default class Ground {
  constructor() {
    // 渲染画布
    this._render()
    // 生成背景
    this._drawBG()
    // 生成格子
    this._drawBlock()
  }
  // 渲染画布
  _render() {
    let template = `
    <canvas id="ground" class="ground" width="${env.groundWidth}" height="${env.groundHeight}"></canvas>
    `
    $('div#app').append(template)
    $('#ground').css({
      top: `${env.groundTop}px`,
      left: `${env.groundLeft}px`,
    })
  }
  
  // 背景
  _drawBG() {
    let canvas = document.getElementById("ground")
    console.log(canvas.width)
    console.log(canvas.height)
    let cxt = canvas.getContext("2d"); // 作画上下文
    // 创建一个渐变工具
    // 参数：从哪里填充到哪里的意思
    let grd = cxt.createLinearGradient(1, 0, 1, env.groundHeight);
    // 设置渐变颜色
    grd.addColorStop(0, "#AFC9F5");
    grd.addColorStop(1, "#032B71");
    // 将填充风格设置为渐变
    cxt.fillStyle = grd;
    // 渐变填充矩形
    // console.log(env.groundWidth, env.groundHeight)
    // cxt.fillRect(0, 0, env.groundWidth, env.groundHeight);
    cxt.fillRect(0, 0, 414, env.groundHeight);
  }

  // 画格子
  _drawBlock() {
    let canvas = document.getElementById("ground")
    let ctx = canvas.getContext("2d");

    for (let r = 0; r < 20; ++ r) { // row 行循环
      for (let c = 0; c < 10; ++ c) { // 列 col
        // 框颜色和宽度
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        // 计算框的位置
        // 使用 X和Y表示，横轴纵轴
        let posX = c * env.blockHeight
        let posY = r * env.blockWidth
        // 无填充矩形
        ctx.strokeRect(posX, posY, env.blockWidth, env.blockHeight);
      }

    }
  }
}