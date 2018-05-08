const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
	res.status(503).end();
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));
