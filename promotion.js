const express = require("express");
const router = express.Router();
var reqsInput = null;
var reqs;

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
	if (process.env.TOKEN == null)
		console.warn("A token was not set! The request will be authorized.");
	if (req.query.token === process.env.TOKEN) {
		next();
	} else {
		res.status(401).end();
	}
});

router.get("/requirements", (req, res) => {
	if (process.env.REQUIREMENTS !== reqsInput)
		getRequirements();

	if (typeof req.query.group === "string" && reqs[req.query.group] != null) {
		res.json(reqs[req.query.group].ranks);
	} else {
		res.status(404).end();
	}
});

module.exports = router;
