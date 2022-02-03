import React from "react";
import { useRouter } from "next/router";
import styles from "../styles/Banner.module.css";

const Banner = () => {
	const router = useRouter();

	return (
		<div className={styles.layout}>
			<a onClick={() => router.push("/")}>
				<h1 className={styles.site_title}>puzzGoal</h1>
			</a>

			<a onClick={() => router.push("/mypuzzgoals")}>
				<nav>My 🧩🥅</nav>
			</a>

			<a onClick={() => router.push("/planpuzzgoal")}>
				<nav>Sign In</nav>
			</a>
		</div>
	);
};

export default Banner;
