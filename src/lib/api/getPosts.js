import Request from '../Request'

export default function getPosts (options) {
  var requestString = 'api/getPosts.php'
  var parameterStrings = []
  for (var optionName in options) {
    if (options.hasOwnProperty(optionName)) {
      parameterStrings.push(optionName + '=' + options[optionName])
    }
  }
  if (parameterStrings.length > 0) {
    requestString += '?' + parameterStrings.join('&')
  }
  return Request.get(requestString)
    .then(function (resultString) {
      var result = JSON.parse(resultString)
      var resultLength = result.length
      for (var i = 0; i < resultLength; i++) {
        var post = result[i]
        post.date = new Date(post.date)
      }
      return result
    })
}
