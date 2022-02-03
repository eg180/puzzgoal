const BASEURL =
	process.env.NODE_ENV === "production"
		? "https://puzzgoal.herokuapp.com"
		: "http://localhost:3000";

const API =
	process.env.NODE_ENV === "production"
		? "https://puzzgoal.herokuapp.com/api"
		: "http://localhost:3000/api";

module.exports = {
	BASEURL,
	API,
};
