import React from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { BASEURL, API } from "../utilities";

import styles from "../styles/Banner.module.css";

const Banner = (props) => {
	const { count } = props;

	const router = useRouter();
	const { data: session, status } = useSession();

	const handleSignIn = async (e) => {
		e.preventDefault();
		try {
			await signIn("credentials", {
				redirect: false,
				callbackUrl: `${BASEURL}/mypuzzgoals`,
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
			signOut({
				callbackUrl: `${BASEURL}`,
			});

			localStorage.clear();
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
							<li id={styles.goal_container}>
								<span id={styles.count}>
									<p>{count === null ? "0" : count}</p>
								</span>
								<a onClick={() => router.push("/mypuzzgoals")}>My 🥅</a>
							</li>
							<li id={styles.new_container}>
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
