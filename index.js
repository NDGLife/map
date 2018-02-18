var choo = require('choo')
var html = require('choo/html')
var css = require('sheetify')
var map = require('./map.component.js')()

var app = choo()

css('./style.css')
var spinner = css('./spinner.css')
var invisible = css`:host { opacity: 0; }`

app.route('*', function (state, emit) {
  return html`
    <body>
      <div style="position: relative; border: 1px solid #333">
        <div class=${spinner}><div></div><div></div><div></div><div></div></div>
        <div class=${!state.map.loaded ? invisible : ''}>${map.render(state, emit)}</div>
      </div>
    </body>
  `
})

app.use(function (state, emitter) {
  state.map = {
    loaded: false
  }

  emitter.on('DOMContentLoaded', function () {
    emitter.on('map:load', function () {
      setTimeout(() => {
        state.map.loaded = true
        emitter.emit('render')
      }, 500)
    })
  })
})

app.mount('body')
