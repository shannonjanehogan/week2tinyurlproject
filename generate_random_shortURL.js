function generateRandomShortURL(length) {
  var results = " "
  var possibilities = "abcdefghijklmnopqrstuvwxyz0123456789"

  for (var i = 0; i <= 5; i++) {
    results += possibilities.charAt(Math.floor(Math.random() *  possibilities.length));
  }
  return results;
}

module.exports = generateRandomShortURL




// ///this is part of the set-up in the app, but has not been//
// ///used in the final version. should I just delete this?//


// const http = require("http");
// const PORT = 8080;

// // a function which handles requests and sends response
// function requestHandler(request, response) {
//   if (request.url == "/") {
//     response.end("Welcome!");
//   } else if (request.url == "/urls") {
//     response.end("www.lighthouselabs.ca\nwww.google.com");
//   } else {
//     response.statusCode = 404;
//     response.end("Unknown Path");
//   }
// }