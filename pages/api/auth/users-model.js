const db = require("../../../data/dbConfig");

module.exports = {
	getAll,
	getOne,
	insert,
	findByEmail,
	findBySub,
	updateBio,
	updateUsername,
};

async function updateBio(text, user_id) {
	await db("users").where({ user_id }).update({ bio: text });
}

async function updateUsername(username, user_id) {
	try {
		// If successful, we want to only return the amount of rows affected.
		return await db("users").where({ user_id }).update({ username: username });
	} catch (error) {
		return 0;
	}
}

function findByEmail(email) {
	return db("users")
		.select(
			"users.sub",
			"users.user_id",
			"users.username",
			"users.email",
			"users.bio",
			"users.role"
		)
		.where({ email });
}

function findBySub(sub) {
	return db("users")
		.select(
			"users.sub",
			"users.user_id",
			"users.username",
			"users.email",
			"users.bio",
			"users.role"
		)
		.where({ sub })
		.first();
}

function getAll() {
	return db("users");
}

function getOne(user_id) {
	// finds by user_id
	return db("users").where("users.user_id", user_id);
}

async function insert(user) {
	try {
		const [{ user_id }] = await db("users")
			.insert(user)
			.onConflict("email")
			.ignore()
			.returning("user_id");

		if (user_id !== undefined) {
			// meaning success of above line of code

			return db("users")
				.select("users.sub", "users.user_id", "users.email", "users.image")
				.where({ user_id })
				.first();
		}
	} catch (err) {
		console.log(err);
	}

	// only reached if id === undefined / is a duplicate / email/account already exists in the database.
}
