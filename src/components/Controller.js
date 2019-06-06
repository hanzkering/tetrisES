import $ from 'jquery'

import ImgLeft from '../assets/left.png'
import ImgRight from '../assets/right.png'
import ImgDown from '../assets/down.png'
import ImgChanger from '../assets/changer.png'
import ImgStart from '../assets/start.png'
import ImgPause from '../assets/pause.png'
import ImgReload from '../assets/reload.png'
import ImgBottom from '../assets/bottom.png'

export default class Controller {

  constructor() {
    this._render()
    this._initEvent()
  }

  _render() {
    let template = `
    <div id="controller-left" class="controller controller-left"></div>
    <div id="controller-right" class="controller controller-right"></div>
    <div id="controller-down" class="controller controller-down"></div>
    <div id="controller-changer" class="controller controller-changer"></div>
    <div id="controller-control" class="controller controller-control"></div>
    <div id="controller-reload" class="controller controller-reload"></div>
    <div id="controller-bottom" class="controller controller-bottom"></div>
    `
    $('#app').append(template)

    // 设置内部图片，模块化管理
    let imgLeft = new Image()
    imgLeft.src = ImgLeft
    $('#controller-left').append(imgLeft)

    let imgRight = new Image()
    imgRight.src = ImgRight
    $('#controller-right').append(imgRight)

    let imgDown = new Image()
    imgDown.src = ImgDown
    $('#controller-down').append(imgDown)

    let imgChanger = new Image()
    imgChanger.src = ImgChanger
    $('#controller-changer').append(imgChanger)

    let imgStart = new Image()
    imgStart.src = ImgStart
    imgStart.id = 'start-image'
    $('#controller-control').append(imgStart)
    
    let imgPause = new Image()
    imgPause.src = ImgPause
    imgPause.id = 'pause-image'
    $('#controller-control').append(imgPause)
    $('#pause-image').hide()
    $('#start-image').show()

    let imgReload = new Image()
    imgReload.src = ImgReload
    $('#controller-reload').append(imgReload)

    let imgBottom = new Image()
    imgBottom.src = ImgBottom
    $('#controller-bottom').append(imgBottom)

  }

  _initEvent() {

  }
}