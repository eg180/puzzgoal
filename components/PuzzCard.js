import React from "react";
import styles from "../styles/PuzzCard.module.css";

const PuzzCard = (props) => {
	const { puzzle } = props;
	return (
		<main className={styles.layout}>
			<ul key={puzzle.id}>{puzzle.puzzle_name}</ul>
		</main>
	);
};

export default PuzzCard;
