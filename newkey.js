const crypto = require("crypto");

// Be sure to increase the count as technology improves.
crypto.randomBytes(256, (err, buf) => {
	if (err)
		throw err;

	console.log("New key: " + buf.toString("hex"));
});
