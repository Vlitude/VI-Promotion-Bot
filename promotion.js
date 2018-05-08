const express = require("express");
const router = express.Router();

process.env.REQUIREMENTS = "cjcool:SECRET@494072,rank1:5,rank2:10;cjcoolOther:SECRET2@3599691,role1:15";

const TOKEN = process.env.TOKEN;

router.use((req, res, next) => {
	if (req.query.token === TOKEN) {
		next();
	} else {
		res.status(401).end();
	}
});

router.get("/requirements", (req, res) => {
	res.send("authenticated!");
});

module.exports = router;
