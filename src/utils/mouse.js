function offsets (e) {
  e = e || window.event

  const target = e.target || e.srcElement
  const style = target.currentStyle || window.getComputedStyle(target, null)
  const borderLeftWidth = parseInt(style['borderLeftWidth'], 10)
  const borderTopWidth = parseInt(style['borderTopWidth'], 10)
  const rect = target.getBoundingClientRect()
  const offsetX = e.clientX - borderLeftWidth - rect.left
  const offsetY = e.clientY - borderTopWidth - rect.top

  return {
    x: offsetX,
    y: offsetY
  }
}
export {offsets}
