import React from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { BASEURL, API } from "../utilities";
import styles from "../styles/Banner.module.css";

const Banner = () => {
	const router = useRouter();
	const { data: session, status } = useSession();

	const handleSignIn = async (e) => {
		e.preventDefault();
		try {
			await signIn("credentials", {
				redirect: false,
				callbackUrl: `${BASEURL}`,
				// email: "test",
				// password: "test",
			});
		} catch (err) {
			console.log(err);
			router.push(`${API}/auth/error`);
		}
	};

	const handleSignOut = async (e) => {
		try {
			e.preventDefault();
			signOut();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className={styles.layout}>
			<a onClick={() => router.push("/")}>
				<h1 className={styles.site_title}>puzzGoal</h1>
			</a>
			<nav>
				<ul>
					{status === "authenticated" && (
						<>
							<li>
								<a onClick={() => router.push("/mypuzzgoals")}>My 🥅</a>
							</li>
							<li>
								<a onClick={() => router.push("/planpuzzgoal")}>New 🧩</a>
							</li>
							<li>
								<div className={styles.avatar_frame}>
									<Image
										src={session?.user?.image}
										width={50}
										height={50}
										alt="avatar image"
									/>
									<a onClick={handleSignOut}>
										<p>Sign Out</p>
									</a>
								</div>
							</li>
						</>
					)}

					{status === "unauthenticated" && (
						<li>
							<a onClick={handleSignIn}>
								<nav>Sign In</nav>
							</a>
						</li>
					)}
				</ul>
			</nav>
		</div>
	);
};

export default Banner;
