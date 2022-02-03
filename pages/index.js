import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";

export default function Home() {
	return (
		<div className={styles.layout}>
			<Head>
				<title>Welcome to PuzzGoal!</title>
				<meta name="PuzzGoal" content="Set goals for completing your puzzles" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<section className={styles.hero}>
				<p>Finally Finish That Damn Puzzle.</p>
				<p>Set the puzzle count</p>
				<p>Pick a date</p>
				<p>Update progress</p>
				<p>Share it with us!</p>
			</section>
		</div>
	);
}
