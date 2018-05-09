const express = require("express");
const router = express.Router();
var reqsInput = null;
var reqs;

process.env.REQUIREMENTS = "cjcool:SECRET@494072,rank1:5,rank2:10;cjcoolOther:SECRET2@3599691,role1:15";

const TOKEN = process.env.TOKEN;
const SEP = ";";
const RANK_SEP = ",";
const RANK_DETAIL_SEP = ":";
const GROUP_REGEX = /([a-zA-Z0-9_]+):([^@]+)@([0-9]+),/;

function getRequirements() {
	reqsInput = process.env.REQUIREMENTS;
	reqs = {};
	reqsInput.split(SEP).forEach((entry) => {
		var match = entry.match(GROUP_REGEX);
		var group = {};
		if (match != null) {
			group.username = match[1];
			group.password = match[2];
			group.ranks = entry.substring(match[0].length).split(RANK_SEP).map((rank) => {
				var details = rank.split(RANK_DETAIL_SEP);
				return {name: details[0], credits: parseInt(details[1], 10)};
			});
			reqs[match[3]] = group;
		}
	});
}

router.use((req, res, next) => {
	if (req.query.token === TOKEN) {
		next();
	} else {
		res.status(401).end();
	}
});

router.get("/requirements", (req, res) => {
	res.send("authenticated!");
	if (process.env.REQUIREMENTS !== reqsInput)
		getRequirements();


});

module.exports = router;
