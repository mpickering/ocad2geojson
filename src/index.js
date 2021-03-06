const readOcad = require('./ocad-reader')
const ocadToGeoJson = require('./ocad-to-geojson')
const { ocadToSvg } = require('./ocad-to-svg')
const ocadToMapboxGlStyle = require('./ocad-to-mapbox-gl-style')

module.exports = {
  readOcad,
  ocadToGeoJson,
  ocadToSvg,
  ocadToMapboxGlStyle
}
