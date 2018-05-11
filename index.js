const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

app.use((req, res) => {
	res.status(404).end();
});

app.use("/promotion", require("./promotion"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));
