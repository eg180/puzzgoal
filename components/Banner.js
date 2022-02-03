import React from "react";
import { useRouter } from "next/router";
import styles from "../styles/Banner.module.css";

const Banner = () => {
	const router = useRouter();

	return (
		<div className={styles.layout}>
			<h1 className={styles.site_title}>puzzGoal</h1>

			<a onClick={() => router.push("/planpuzzle")}>
				<nav>Sign In</nav>
			</a>
		</div>
	);
};

export default Banner;
