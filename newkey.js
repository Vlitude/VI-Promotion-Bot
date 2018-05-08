const crypto = require("crypto");

crypto.randomBytes(256, (err, buf) => {
	if (err)
		throw err;

	console.log("New key: " + buf.toString("hex"));
});
