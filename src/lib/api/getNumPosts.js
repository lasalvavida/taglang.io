import Request from '../Request'

export default function getPostById () {
  var requestString = 'api/getNumPosts.php'
  return Request.get(requestString)
    .then(function (resultString) {
      var result = JSON.parse(resultString)
      return result.numPosts
    })
}
