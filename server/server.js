const http = require("node:http");
http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];

    request
      .on("error", (err) => {
        console.error(err);
      })
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        // BEGINNING OF NEW STUFF
        response.on("error", (err) => {
          console.error(err);
        });
        response.statusCode = 200;
        response.setHeader("Content-Type", "multipart/form-data");
        const responseBody = { headers, method, url, body };

        console.log({ responseBody });

        response.write(JSON.stringify(responseBody));
        response.end();
      });
  })
  .listen(3000);
