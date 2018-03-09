var choo = require('choo')
var html = require('choo/html')
var css = require('sheetify')
var map = require('./map.component.js')()

var app = choo()

css('tachyons')
css('./style.css')

var invisible = css`:host { opacity: 0; }`
var mapContainer = css`position: relative; max-width: 900px; min-height: 100vh;`

app.route('*', function (state, emit) {
  return html`
    <body class="sans-serif">
      ${navbar(state, emit)}
      <main class="flex w-100 items-center justify-center">
        <div class=" flex w-100  items-center justify-center">
          <div 
            class="flex justify-center items-center w-100 ${mapContainer}">
            <div class="spinner"><div></div><div></div><div></div><div></div></div>
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

function navbar (state, emit) {
  return html`
    <nav class="z-3 flex justify-between items-center h3 ph1">
      <div class="fw8 pv2 flex-auto">
        ${html`<span class="ma2">J'aime NDG</span>`}
      </div>

      <div class="pa3 items-center justify-center">
        ${searchbar(state, emit)}
      </div>

      <div class="flex flex-auto justify-end items-center">
        
      </div>
    </nav>`
}

function searchbar (state, emit) {
  return html`
    <input 
      type="text" 
      class="pa2 mh2 dn" 
      style="max-width: 450px;" 
      placeholder="Search for a service, a place, an organization..." />`
}
