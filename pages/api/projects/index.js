import { getSession } from "next-auth/react";
const Projects = require("./projects-model");

export default async function handler(req, res) {
	const session = await getSession({ req });
	const user_id = session?.user?.user_id;

	switch (req.method) {
		case "GET":
			try {
				if (user_id !== undefined) {
					const userProjects = await Projects.getUserProjects(user_id);
					return res.status(201).json(userProjects);
				} else {
					return res.status(401).json("Unauthorized");
				}
			} catch (error) {
				res.status(401).json("Please Try Again Later");
			}

			break;

		case "POST":
			try {
				const reqbod = req.body;
				const userProjects = await Projects.addProject(reqbod);
				return res.status(201).json(userProjects);
			} catch (error) {
				console.log(error);
			}

		case "PUT":
			try {
				const reqb = req.body;

				const reqbod = { ...reqb, user_id: user_id };

				const userProjects = await Projects.updateProject(reqbod);
				return res.status(201).json(userProjects);
			} catch (error) {
				console.log(error);
			}

		case "DELETE":
			try {
				const reqbod = req.body;
				const userProjects = await Projects.deleteProject(reqbod.project_id);
				return res.status(201).json(userProjects);
			} catch (error) {
				res.status(401).json("An error occured.");
			}
			break;
	}
}
