const db = require("../../../data/dbConfig");

module.exports = {
	addProject,
	deleteProject,
	getUserProjects,
};

// the object fed into this should have puzzle_name, pieces, goal_date
async function addProject(obj) {
	// id should relate to the phrase_id
	try {
		const [{ id }] = await db("projects")
			.insert({
				puzzle_name: obj.formValues.puzzle_name,
				pieces: obj.formValues.pieces,
				goal_date: obj.formValues.goal_date,
			})
			.returning("id");
		let project_id = id;
		return await addUsertoProject(obj, project_id); // this is the project id
	} catch (error) {
		console.log(error);
	}
}

async function deleteProject(project_id) {
	// delete from foreign / dependent table
	try {
		const [{ user_id }] = await db("userprojects")
			.where({ project_id })
			.del()
			.returning("user_id");
		// delete from independent table

		await db("projects").where({ id: project_id }).del();
		// now return updated active goals / projects
		return await getUserProjects(user_id);
	} catch (error) {
		console.log(error);
	}
}

async function addUsertoProject(obj, project_id) {
	// obj should still contain user_id -> obj.user_id
	try {
		await db("userprojects").insert({
			project_id: project_id,
			user_id: obj.user_id,
		});
		return await getUserProjects(obj.user_id);
	} catch (error) {
		return console.log(error);
	}
}

async function getUserProjects(user_id) {
	try {
		return await db("projects")
			.select(
				"projects.id",
				"projects.puzzle_name",
				"projects.pieces",
				"projects.created_at",
				"projects.goal_date"
			)
			.join("userprojects", "userprojects.project_id", "=", "projects.id")
			.where("userprojects.user_id", user_id);
	} catch (error) {
		console.log(error);
	}
}
