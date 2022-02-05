import React, { useContext } from "react";
import PuzzCard from "../../components/PuzzCard";
import { ProjectsContext } from "../../contexts";
import styles from "./MyPuzzGoals.module.css";

const MyPuzzGoals = (props) => {
	const projects = useContext(ProjectsContext);
	return (
		<div className={styles.layout}>
			<section className={styles.cards_container}>
				{projects?.length > 0 ? (
					projects.map((proj) => {
						return (
							<ul key={proj.id}>
								<li className={styles.card}>
									<PuzzCard puzzle={proj} />
								</li>
							</ul>
						);
					})
				) : (
					<div className={styles.no_projects_container}>
						<p>Plan your first project. 👆🏼</p>
					</div>
				)}
			</section>
		</div>
	);
};

export default MyPuzzGoals;
