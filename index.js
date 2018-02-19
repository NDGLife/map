var choo = require('choo')
var html = require('choo/html')
var css = require('sheetify')
var map = require('./map.component.js')()

var app = choo()

css('tachyons')
css('./style.css')

var spinner = css('./spinner.css')
var invisible = css`:host { opacity: 0; }`

app.route('*', function (state, emit) {
  return html`
    <body class="sans-serif ">
      <nav class="bg-dark-gray white flex justify-between items-center">
        <div class="fw8 pa2 flex-auto">
          <span class="ma2">J'aime NDG</span>
        </div>
        <div class="pa3  items-center justify-center ">
          
          <input type="text" class="pa2 mh2" style="width: 450px;" placeholder="Search for a service, a place, an organization..." />
        </div>
        <div class="flex flex-auto justify-end items-center">
          <button class="mh2 ph4 pa2">Post</button>
        </div>
      </nav>
      <main class="flex w-100 items-center justify-center">
        <div class=" flex pa2 w-100  items-center justify-center">
          <div class="flex justify-center items-center w-100" style="position: relative; border: 1px solid #333; max-width: 900px; height: 700px;">
            <div class=${spinner}><div></div><div></div><div></div><div></div></div>
            <div class="w-100 ${!state.map.loaded ? invisible : ''}">${map.render(state, emit)}</div>
          </div>
        </div>
      </main>
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
