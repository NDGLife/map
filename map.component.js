var html = require('choo/html')
var mapboxgl = require('mapbox-gl')
var sheetify = require('sheetify')
var Nanocomponent = require('nanocomponent')
var turf = require('turf')

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

  if (!this.el) this.el = html`<div style="border: 1px solid #ccc; height: 500px;"></div>`

  return this.el
}

MapComponent.prototype.load = function (el) {
  setTimeout(() => {
    var boundaries = require('./ndg.json')
    var bounds = [ -73.78770599365234, 45.31688783495922, -73.4670280456543, 45.619609390726846 ]
    var mask = turf.polygon(boundaries.features[0].geometry.coordinates[0])
    var map = new mapboxgl.Map({
      container: el,
      center: [-73.62528441043861, 45.467405167566994],
      zoom: 13,
      bearing: -57,
      pitch: 15,
      maxBounds: [ -73.68770599365234, 45.43688783495922, -73.5670280456543, 45.499609390726846 ],
      style: 'mapbox://styles/kareniel/cjdtaqmpk43oj2rp740hr4dmr'
    })

    map.dragRotate.disable()
    map.touchZoomRotate.disableRotation()
    map.addControl(new mapboxgl.NavigationControl())
    map.on('load', () => {
      map.addSource('boundaries', {
        type: 'geojson',
        data: polyMask(mask, bounds)
      })

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
