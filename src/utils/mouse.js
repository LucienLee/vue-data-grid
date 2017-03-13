/* Mouse position calc */

// normalize pageX and pageY in mouse event
function normPagePosInEvent (e) {
  e = e || window.event

  if (e.pageX === undefined) {
    e.pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
    e.pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
  }

  return e
}

export { normPagePosInEvent }
