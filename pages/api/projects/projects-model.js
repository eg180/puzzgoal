const db = require("../../../data/dbConfig");

module.exports = {
	addProject,
};

// the object fed into this should have puzzle_name, pieces, goal_date
async function addProject(obj) {
	// id should relate to the phrase_id
	try {
		const [{ id }] = await db("projects")
			.insert({
				puzzle_name: obj.formValues.puzzle_name,
				pieces: obj.formValues.puzzle_name,
				goal_date: obj.formValues.goal_date,
			})
			.returning("id");
		let project_id = id;
		await addUsertoProject(obj, project_id); // this is the project id
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
	} catch (error) {
		return console.log(error);
	}
}
