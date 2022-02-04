import { getSession } from "next-auth/react";
const Projects = require("./projects-model");

export default async function handler(req, res) {
	const reqbod = req.body;
	const session = await getSession({ req });
	const user_id = session?.user?.user_id;

	switch (req.method) {
		case "GET":
			try {
				if (user_id !== undefined) {
					const userProjects = await Projects.getUserProjects(user_id);
					return res.status(201).json(userProjects);
				}
			} catch (error) {
				res.status(401).json("Please Try Again Later");
			}

			break;

		case "POST":
			try {
				const userProjects = await Projects.addProject(reqbod);
				return res.status(201).json(userProjects);
			} catch (error) {
				console.log(error);
			}

		case "DELETE":
			try {
				const userProjects = await Projects.deleteProject(reqbod.project_id);
				return res.status(201).json(userProjects);
			} catch (error) {
				res.status(401).json("An error occured.");
			}
			break;
	}
}
