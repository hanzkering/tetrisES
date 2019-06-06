import $ from 'jquery'

export default class Priview {

  constructor() {
    this._render()
  }

  _render() {
    let template = `
    <div id="preview" class="preview"></div>
    `
    $('#app').append(template)
  }
}