const Symbol = require('./symbol')

module.exports = class LineSymbol extends Symbol {
  constructor (buffer, offset) {
    super(buffer, offset, 2)

    // TODO: why?
    this.offset += 64

    this.lineColor = this.readSmallInt()
    this.lineWidth = this.readSmallInt()
    this.lineStyle = this.readSmallInt()
    this.distFromStart = this.readSmallInt()
    this.distToEnd = this.readSmallInt()
    this.mainLength = this.readSmallInt()
    this.endLength = this.readSmallInt()
    this.mainGap = this.readSmallInt()
    this.secGap = this.readSmallInt()
    this.endGap = this.readSmallInt()
    this.minSym = this.readSmallInt()
    this.nPrimSym = this.readSmallInt()
    this.primSymDist = this.readSmallInt()
    this.dblMode = this.readWord()
    this.dblFlags = this.readWord()
    this.dblFillColor = this.readSmallInt()
    this.dblLeftColor = this.readSmallInt()
    this.dblRightColor = this.readSmallInt()
    this.dblWidth = this.readSmallInt()
    this.dblLeftWidth = this.readSmallInt()
    this.dblRightWidth = this.readSmallInt()
    this.dblLength = this.readSmallInt()
    this.dblGap = this.readSmallInt()
    this.dblBackgroundColor = this.readSmallInt()
    this.dblRes = new Array(2)
    for (let i = 0; i < this.dblRes.length; i++) {
      this.dblRes[i] = this.readSmallInt()
    }
    this.decMode = this.readWord()
    this.decSymbolSize = this.readSmallInt()
    this.decSymbolDistance = !!this.readByte()
    this.decSymbolWidth = !!this.readByte()
    this.frColor = this.readSmallInt()
    this.frWidth = this.readSmallInt()
    this.frStyle = this.readSmallInt()
    this.primDSize = this.readWord()
    this.secDSize = this.readWord()
    this.cornerDSize = this.readWord()
    this.startDSize = this.readWord()
    this.endDSize = this.readWord()
    this.useSymbolFlags = this.readByte()
    this.reserved = this.readByte()
  }
}
