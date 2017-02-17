function getOffset (el) {
  el = el.getBoundingClientRect()
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}

export default getOffset
