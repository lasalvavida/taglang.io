import Request from '../Request'

export default function getPostById (id) {
  var requestString = 'api/getPostById.php?id=' + id
  return Request.get(requestString)
    .then(function (resultString) {
      var result = JSON.parse(resultString)
      result.date = new Date(result.date)
      return result
    })
}
