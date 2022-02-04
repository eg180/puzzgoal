import React, { useContext } from "react";
import { UpdateProjectsContext } from "../contexts";
import { API } from "../utilities";
import styles from "../styles/PuzzCard.module.css";

const PuzzCard = (props) => {
	const { puzzle } = props;
	const updateProjects = useContext(UpdateProjectsContext);
	const deleteProject = async (project_id) => {
		try {
			const res = await fetch(`${API}/projects`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ project_id }),
			});

			// receive updated array of projects after the deletion
			const data = await res.json();
			updateProjects(data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<main className={styles.layout}>
			<ul onClick={() => deleteProject(puzzle.id)} key={puzzle.id}>
				{puzzle.puzzle_name}
			</ul>
		</main>
	);
};

export default PuzzCard;
