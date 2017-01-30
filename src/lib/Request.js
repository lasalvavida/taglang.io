import Promise from 'bluebird'

function send (type, url, parameters) {
  return new Promise(function (resolve, reject) {
    if (parameters !== undefined) {
      url += '?'
      var first = true
      for (var parameterId in parameters) {
        if (parameters.hasOwnProperty(parameterId)) {
          if (!first) {
            url += '&'
          }
          url += parameterId + '=' + parameters[parameterId]
          first = false
        }
      }
    }
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          resolve(this.responseText)
        } else {
          reject(this)
        }
      }
    }
    xhttp.open(type, url, true)
    xhttp.send()
  })
}

export default {
  get: function (url, parameters) {
    return send('GET', url, parameters)
  }
}
