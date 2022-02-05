import React, { useState, useContext } from "react";
import "chart.js/auto";
import { Pie, Line } from "react-chartjs-2";
import dayjs from "dayjs";
import { Trash2 } from "react-feather";
import { UpdateProjectsContext } from "../contexts";
import { API } from "../utilities";
import styles from "../styles/PuzzCard.module.css";

const PuzzCard = (props) => {
	const { puzzle } = props;
	const [showInHours, setShowInHours] = useState(false);
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

	const data = {
		labels: ["Pieces Left", "Completed"],
		datasets: [
			{
				data: [puzzle.pieces, puzzle.completed_count],
				backgroundColor: ["#FF6384", "#c2eabd"],
				hoverBackgroundColor: ["#FF6384", "#36A2EB"],
			},
		],
	};

	const toggleRemainingTimeDisplay = () => {
		setShowInHours(!showInHours);
	};

	const calculateTimeDiff = () => {
		console.table(puzzle.created_at, puzzle.goal_date);
		const date1 = dayjs(puzzle.created_at);
		const date2 = dayjs(puzzle.goal_date);
		// const daysLeft = date2.diff(date1, "day", true);
		const hoursLeft = date2.diff(date1, "hour", true);
		// console.log(daysLeft);
		console.log(hoursLeft);
		console.log(puzzle.pieces / hoursLeft);
	};

	function daysRemaining() {
		const date1 = dayjs(puzzle.created_at);
		const date2 = dayjs(puzzle.goal_date);
		const daysLeft = date2.diff(date1, "day", false);
		return daysLeft;
	}

	function hoursRemaining() {
		const date1 = dayjs(puzzle.created_at);
		const date2 = dayjs(puzzle.goal_date);
		const hoursLeft = date2.diff(date1, "hour", false);
		return parseInt(hoursLeft).toFixed(2);
	}

	function onTrackDailyGoal() {
		// should show the amount of pieces to complete each day by midnight of goal_date to meet goal.
		const date1 = dayjs(puzzle.created_at);
		const date2 = dayjs(puzzle.goal_date);
		// const daysLeft = date2.diff(date1, "day", true);
		const hoursLeft = date2.diff(date1, "day", false);
		// console.log(daysLeft);
		return parseInt(puzzle.pieces / hoursLeft).toFixed(2);
	}

	return (
		<>
			<main className={styles.layout}>
				<span
					onClick={() => deleteProject(puzzle.id)}
					className={styles.delete_container}
				>
					<Trash2 />
				</span>
				<span className={styles.title_container}>
					<div>
						<span className={styles.title}>{puzzle.puzzle_name}</span>
						<span
							className={styles.time_left_display}
							onClick={toggleRemainingTimeDisplay}
						>
							⏰
							{showInHours
								? `${daysRemaining()} days left`
								: `${hoursRemaining()} hours left`}
						</span>
					</div>
					<span className={styles.pie}>
						<Pie data={data} width={400} height={400} />
					</span>
				</span>
				<span className={styles.sub_title}>🏃🏻‍♀️ Start: </span>
				{dayjs(puzzle.created_at).format("MMMM")}{" "}
				{dayjs(puzzle.created_at).format("D")}
				<span className={styles.sub_title}>🏁 End </span>
				{dayjs(puzzle.goal_date).format("MMMM")}{" "}
				{dayjs(puzzle.goal_date).format("D")}
				<span className={styles.sub_title}>{puzzle.pieces} pieces to go </span>
				<span onClick={() => calculateTimeDiff()}>
					<p>
						<span className={styles.sub_title}>🥅 Goal For Today: </span>
						<span className={styles.daily_goal}>
							{onTrackDailyGoal()} pieces
						</span>
					</p>
				</span>
			</main>
		</>
	);
};

export default PuzzCard;
