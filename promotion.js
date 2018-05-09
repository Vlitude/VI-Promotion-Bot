const express = require("express");
const roblox = require("noblox");
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
				return {rank: details[0], credits: parseInt(details[1], 10)};
			});
			group.ranks.sort((a, b) => {
				return a.credits > b.credits ? -1 : 1;
			});
			reqs[match[3]] = group;
		}
	});
	console.log(reqs);
}

function obfuscate(match) {
	return "#".repeat(match.length);
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

/** Returns rank requirements for the group. */
router.get("/requirements", (req, res) => {
	if (process.env.REQUIREMENTS !== reqsInput)
		getRequirements();

	if (typeof req.query.group === "string" && reqs[req.query.group] != null) {
		res.json(reqs[req.query.group].ranks);
	} else {
		res.status(404).end();
	}
});

/** Sets the users rank to the rank that they have enough credits for, if not their current rank. */
router.post("/promote", (req, res) => {
	var details, oldRank, newRank;
	var group = req.params.group;
	var user = req.params.user;
	var newCredits = req.params.credits;

	if (process.env.REQUIREMENTS !== reqsInput)
		getRequirements();

	details = reqs[group];
	try {
		roblox.login(details.username, reqs[group].password);
		newCredits = parseInt(newCredits);
		for (var [rank, credits] of reqs[group].ranks) {
			if (newCredits >= credits) {
				newRank = rank;
			} else {
				break;
			}
		}
		oldRank = roblox.getRankInGroup(group, user);
		if (oldRank !== newRank)
			console.log("promoted to " + newRank); // roblox.setRank(group, user, newRank); // Disabled while testing.
		res.send("true");
	} catch (exc) {
		console.warn("Unable to promote user: " + exc.stack);
		res.send("false," + exc.message
			.replace(details.username, obfuscate).replace(details.password, obfuscate));
	}
});

module.exports = router;
