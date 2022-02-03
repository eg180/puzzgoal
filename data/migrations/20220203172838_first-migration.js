const tables = ["roles", "users", "projects", "userprojects"];

const [roles, users, projects, userprojects] = tables;

exports.up = async (knex, Promise) => {
	await knex.schema
		.createTable(roles, (roles) => {
			roles.increments("id");
			roles.string("role");
			roles.timestamp("created_at").defaultTo(knex.fn.now());
			roles.timestamp("updated_at").defaultTo(knex.fn.now());
		})
		.createTable(users, (users) => {
			users.increments("user_id");
			users.string("sub");
			users.string("username", 30).unique();
			users.string("name");
			users.string("email", 255).unique().notNullable();
			users.boolean("emailVerified").defaultTo(false);
			users.timestamp("emailVerifiedDate");
			users.string("image");
			users.string("bio", 355);
			users.string("twitter", 55);
			users.string("instagram", 55);
			users.string("password", 255);
			users
				.integer("role")
				.unsigned()
				.defaultTo(2)
				.references("id")
				.inTable("roles")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
			users.timestamp("created_at").defaultTo(knex.fn.now());
			users.timestamp("updated_at").defaultTo(knex.fn.now());
			users.timestamp("refresh_token_expires_in");
		})
		.createTable(projects, (projects) => {
			projects.increments("id");
			projects.string("puzzle_name");
			projects.string("pieces");
			projects.date("goal_date");
			projects.timestamp("created_at").defaultTo(knex.fn.now());
			projects.timestamp("updated_at").defaultTo(knex.fn.now());
		})
		.createTable(userprojects, (userprojects) => {
			userprojects.increments("id");
			userprojects
				.integer("project_id")
				.unsigned()
				.references("id")
				.inTable("projects");
		});

	await knex.raw(`
    CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$;
  `);

	for (let table of tables) {
		await knex.raw(`
      CREATE TRIGGER update_timestamp
      BEFORE UPDATE
      ON ${table}
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();
    `);
	}

	await knex.raw(`
    ALTER TABLE users
    ADD CONSTRAINT proper_email
    CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');
  `);
};

exports.down = async (knex, Promise) => {
	await knex.raw(`
    DROP FUNCTION IF EXISTS update_timestamp() CASCADE;
  `);

	for (let i = tables.length - 1; i >= 0; i--) {
		await knex.schema.dropTableIfExists(tables[i]);
	}
};
