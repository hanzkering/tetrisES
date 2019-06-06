import $ from 'jquery'

export default class Scoreboard {

  constructor() {
    this._render()
  }

  _render() {
    let template = `
    <div id="scoreboard" class="scoreboard">
      <div id="score" class="score">0</div>
    </div>
    `
    $('#app').append(template)
  }
}