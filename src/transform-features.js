const { PointSymbolType, LineSymbolType } = require('./ocad-reader/symbol-types')

const defaultOptions = {
  assignIds: true,
  applyCrs: true,
  generateSymbolElements: true,
  exportHidden: false,
  coordinatePrecision: 6
}

module.exports = function (ocadFile, createObject, createElement, options) {
  options = { ...defaultOptions, ...options, colors: ocadFile.colors, idCount: ocadFile.objects.length }

  const symbols = ocadFile.symbols.reduce((ss, s) => {
    ss[s.symNum] = s
    return ss
  }, {})

  let features = ocadFile.objects
    .map(createObject.bind(null, options, symbols))
    .filter(f => f)

  if (options.generateSymbolElements) {
    const elementFeatures = ocadFile.objects
      .map(generateSymbolElements.bind(null, createElement, options, symbols))

    features = features.concat(Array.prototype.concat.apply([], elementFeatures))
      .filter(f => f)
  }

  return features
}

const generateSymbolElements = (createElement, options, symbols, object, objectIndex) => {
  const symbol = symbols[object.sym]
  let elements = []

  if (!options.exportHidden && (!symbol || symbol.isHidden())) return elements

  switch (symbol.type) {
    case PointSymbolType:
      const angle = object.ang ? object.ang / 10 / 180 * Math.PI : 0
      elements = symbol.elements
        .map((e, i) => createElement(symbol, 'element', i, e, object.coordinates[0], angle, options, object, objectIndex))
      break
    case LineSymbolType:
      if (symbol.primSymElements.length > 0) {
        const coords = object.coordinates
        const endLength = symbol.endLength
        const mainLength = symbol.mainLength
        const spotDist = symbol.primSymDist

        let d = endLength

        for (let i = 1; i < coords.length; i++) {
          const c0 = coords[i - 1]
          const c1 = coords[i]
          const v = c1.sub(c0)
          const angle = Math.atan2(v[1], v[0])
          const u = v.unit()
          const segmentLength = v.vLength()

          let c = c0.add(u.mul(d))
          let j = 0
          while (d < segmentLength) {
            elements = elements.concat(symbol.primSymElements
              .map((e, i) => createElement(symbol, 'prim', i, e, c, angle, options, object, objectIndex)))

            j++
            const step = (spotDist && j % symbol.nPrimSym) ? spotDist : mainLength

            c = c.add(u.mul(step))
            d += step
          }

          d -= segmentLength
        }
      }

      if (symbol.cornerSymElements.length > 0) {
        const coords = object.coordinates
        for (let i = 1; i < coords.length - 1; i++) {
          const c0 = coords[i - 1]
          const c1 = coords[i]
          const v = c1.sub(c0)
          const angle = Math.atan2(v[1], v[0])
          elements = elements.concat(symbol.cornerSymElements
            .map((e, i) => createElement(symbol, 'corner', i, e, c1, angle, options, object, objectIndex)))
        }
      }
  }

  return elements
}
