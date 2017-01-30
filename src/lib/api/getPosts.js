import Request from '../Request'

export default function getPosts (server) {
  return Request.get('api/getPosts.php')
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
