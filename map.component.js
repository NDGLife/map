var html = require('choo/html')
var mapboxgl = require('mapbox-gl')
var sheetify = require('sheetify')
var Nanocomponent = require('nanocomponent')
var turf = require('turf')
var boundaries = require('./ndg.json')
var scale = require('@turf/transform-scale')

sheetify('mapbox-gl/dist/mapbox-gl.css')

mapboxgl.accessToken = process.env.MAPBOX_TOKEN

module.exports = MapComponent

function MapComponent () {
  if (!(this instanceof MapComponent)) return new MapComponent()

  Nanocomponent.call(this)
}

MapComponent.prototype = Object.create(Nanocomponent.prototype)

MapComponent.prototype.createElement = function (state, emit) {
  this.state = state
  this.emit = emit

  if (!this.el) this.el = html`<div style="height: 100vh"></div>`

  return this.el
}

MapComponent.prototype.load = function (el) {
  setTimeout(() => {
    var bounds = [ -73.78770599365234, 45.31688783495922, -73.4670280456543, 45.619609390726846 ]
    var mask = scale(turf.polygon(boundaries.features[0].geometry.coordinates[0]), 1.05)
    var map = new mapboxgl.Map({
      container: el,
      center: [-73.61677473906548, 45.476881924798676],
      zoom: 17.89941016617437,
      bearing: -17.799999999999955,
      pitch: 60,
      maxBounds: [ -73.68770599365234, 45.43688783495922, -73.5670280456543, 45.499609390726846 ],
      style: 'mapbox://styles/kareniel/cjejbdj4n1kpc2sqoz4r02vb4'
    })

    // disable interactivity
    map.dragRotate.disable()
    map.touchZoomRotate.disableRotation()

    map.on('load', () => {
      map.addSource('boundaries', {
        type: 'geojson',
        data: polyMask(mask, bounds)
      })

      global.map = map

      map.addLayer({
        'id': 'ndg',
        'type': 'fill',
        'source': 'boundaries',
        'layout': {},
        'paint': {
          'fill-color': '#eee',
          'fill-opacity': 0.999
        }
      })

      this.emit('map:load')
    })
  }, 0)
}

MapComponent.prototype.update = function (state, emit) {
  this.state = state

  return false
}

function polyMask (mask, bounds) {
  var bboxPoly = turf.bboxPolygon(bounds)
  return turf.difference(bboxPoly, mask)
}
