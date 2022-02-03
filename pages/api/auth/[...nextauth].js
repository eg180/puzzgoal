import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import Users from "./users-model";

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function getUserName(sesh) {
	let un = sesh.user.email.split("@")[0];
	let randNum = getRandomInt(1000).toString();
	return `${un}${randNum}`;
}

export default NextAuth({
	// https://next-auth.js.org/configuration/providers
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
			// https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
			scope: "read:user",
		}),
	],
	secret: process.env.JWT_SECRET,

	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},

	// JSON Web tokens are only used for sessions if the `jwt: true` session
	// option is set - or by default if no database is specified.
	// https://next-auth.js.org/configuration/options#jwt
	jwt: {
		// You can define your own encode/decode functions for signing and encryption
		// to to override the default behaviour ->.
		// encode: async ({ secret, token, maxAge }) => {},
		// decode: async ({ secret, token, maxAge }) => {},
	},

	pages: {
		// signIn: "/auth/signin", // Displays signin buttons
		// signOut: '/auth/signout', // Displays form with sign out button
		error: "/auth/error", // Error code passed in query string as ?error=
		// verifyRequest: '/auth/verify-request', // Used for check email page
		// newUser: null // If set, new users will be directed here on first sign in
	},

	callbacks: {
		// async signIn({ user, account, profile, email, credentials }) {
		// 	return true;
		// },
		// async redirect({ url, baseUrl }) {
		// 	return baseUrl;
		// },
		async session({ session, token, user }) {
			let existingUser = await Users.findByEmail(session.user.email);

			if (existingUser.length === 0) {
				// means this user not yet in db. add the user to db then
				let un = getUserName(session);

				const user = {
					sub: token.sub,
					name: token.name,
					email: session.user.email,
					username: un,
					image: session.user.image,
					refresh_token_expires_in: session.user.expires,
				};

				const newUser = await Users.insert(user);
				// now try again
				existingUser = await Users.findByEmail(newUser.email);
				session.user.username = existingUser[0].username;
				session.user.user_id = existingUser[0].user_id;
				session.user.bio = existingUser[0].bio;
				return session;
			} else if (existingUser.length === 1) {
				// console.log("existing user found", existingUser);
				// if this is a returning user / already in db
				session.user.username = existingUser[0].username;
				session.user.user_id = existingUser[0].user_id;
				session.user.bio = existingUser[0].bio;
				// console.log(existingUser);
				// console.log("session", session);

				return session;
			}
			// console.log("session", session);
		},
		async jwt({ token, user, account, profile, isNewUser }) {
			const isSignIn = user ? true : false;
			// Add auth_time to token on signin in
			if (isSignIn) {
				token.auth_time = Math.floor(Date.now() / 1000);
			}
			user && (token.user = user);

			// return Promise.resolve(token);
			return token;
		},
	},

	// Events are useful for logging
	// https://next-auth.js.org/configuration/events
	events: {},

	// You can set the theme to 'light', 'dark' or use 'auto' to default to the
	// whatever prefers-color-scheme is set to in the browser. Default is 'auto'
	theme: {
		colorScheme: "light",
	},

	// Enable debug messages in the console if you are having problems
	debug: false,
});
