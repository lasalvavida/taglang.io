function createCallback (context, width, height, options, state) {
  return function () {
    drawLoading(context, width, height, options, state)
  }
}

function drawLoading (context, width, height, options, state) {
  if (state === undefined) {
    state = {
      running: true
    }
  }
  if (options === undefined) {
    options = {}
  }
  if (options.angle === undefined) {
    options.angle = 0
  }

  if (!state.running) {
    return
  }
  if (options.imageData) {
    context.putImageData(options.imageData, 0, 0)
  }
  context.rect(0, 0, width, height)
  if (options.fillStyle) {
    context.fillStyle = options.fillStyle
  } else {
    if (options.imageData) {
      context.fillStyle = 'rgba(0, 0, 0, 0.5)'
    } else {
      context.fillStyle = '#444444'
    }
  }
  context.fill()
  if (options.lineWidth) {
    context.lineWidth = options.lineWidth
  } else {
    context.lineWidth = 10
  }
  if (options.strokeStyle) {
    context.strokeStyle = options.strokeStyle
  } else {
    context.strokeStyle = '#FFFFFF'
  }
  context.beginPath()
  context.arc(Math.floor(width / 2.0),
    Math.floor(height / 2.0),
    Math.min(width / 5.0, height / 5.0),
    options.angle,
    options.angle + Math.PI / 3.0)
  context.stroke()
  options.angle += Math.PI / 16.0
  if (options.angle > 2 * Math.PI) {
    options.angle -= 2 * Math.PI
  }
  if (state.running) {
    window.requestAnimationFrame(createCallback(context, width, height, options, state))
  }
  return state
}

export default drawLoading
