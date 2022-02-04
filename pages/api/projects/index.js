const Projects = require("./projects-model");

export default async function handler(req, res) {
	const reqbod = req.body;

	switch (req.method) {
		case "GET":
			res.status(405).end();

			break;

		case "POST":
			await Projects.addProject(reqbod);
			return res.status(201).json({ success: "ok" });

		case "DELETE":
			res.status(405).end();
			break;
	}
}
