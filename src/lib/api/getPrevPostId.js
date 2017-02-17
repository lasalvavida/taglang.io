import Request from '../Request'

export default function getPostById (id) {
  var requestString = 'api/getPrevPostId.php?id=' + id
  return Request.get(requestString)
    .then(function (resultString) {
      var result = JSON.parse(resultString)
      return result.id
    })
}
