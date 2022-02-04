import React, { useContext } from "react";
import PuzzCard from "../../components/PuzzCard";
import { ProjectsContext } from "../../contexts";
import styles from "./MyPuzzGoals.module.css";

const MyPuzzGoals = (props) => {
	const projects = useContext(ProjectsContext);
	return (
		<div className={styles.layout}>
			<section className={styles.cards_container}>
				{projects?.length > 0 &&
					projects.map((proj) => {
						return (
							<div className={styles.card} key={proj.id}>
								<PuzzCard puzzle={proj} />
							</div>
						);
					})}
			</section>
		</div>
	);
};

export default MyPuzzGoals;
