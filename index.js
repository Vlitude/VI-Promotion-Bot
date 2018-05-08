const http = require("http2");

const HTTP_OPTIONS = {
	allowHTTP1: true
};

const server = http.createSecureServer(HTTP_OPTIONS);

server.on("request", (request, response) => {
	response.statusCode = 503;
	response.end();
});

server.listen(process.env.PORT || 8080);
