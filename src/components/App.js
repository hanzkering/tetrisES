import $ from 'jquery'
import env from '../env.js'

import '../assets/reset.css'
import '../assets/app.css'


export default class App {
  constructor() {
  }

  run() {
    console.log('App Run')

    // 初始化环境信息
    this._initEnv()
    // 渲染 app DOM
    this._render()
  }

  _initEnv() {
    env.screenWidth = $(window).width()
    env.screenHeight = $(window).height()
  }

  // 渲染 app DOM
  _render() {
    let template = `
    <div id="app" style="width: ${env.screenWidth}px;height: ${env.screenHeight}px"></div>
    `
    $('body').prepend(template)
  }
}
// 后边不应该具有任何代码