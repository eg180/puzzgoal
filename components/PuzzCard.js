import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import "chart.js/auto";
import { Pie, Line } from "react-chartjs-2";
import dayjs from "dayjs";
import { Trash2, XCircle } from "react-feather";
import { UpdateProjectsContext } from "../contexts";
import { API } from "../utilities";
import styles from "../styles/PuzzCard.module.css";

const PuzzCard = (props) => {
	const { puzzle } = props;
	const [showInHours, setShowInHours] = useState(false);
	const defaultValues = {
		puzzle_name: puzzle.puzzle_name,
		pieces: puzzle.pieces,
		goal_date: puzzle.goal_date,
		completed_count: "",
	};
	const [draftFormValues, setDraftFormValues] = useState(defaultValues);
	const [formValues, setFormValues] = useState({});
	const { data: session, status } = useSession();
	const updateProjects = useContext(UpdateProjectsContext);
	const piecesToGo = (
		parseInt(puzzle.pieces) - parseInt(puzzle.completed_count)
	).toString();
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

	const handleTotalCompleted = async (e) => {
		e.preventDefault();
		try {
			const cumulativeCompleted = (
				parseInt(puzzle.completed_count) +
				parseInt(draftFormValues.completed_count)
			).toString();

			if (
				draftFormValues.completed_count !== "" &&
				parseInt(cumulativeCompleted) < puzzle.pieces
			) {
				setFormValues({
					...draftFormValues,
					completed_count: cumulativeCompleted,
				});
				updateProject(cumulativeCompleted);
			} else if (draftFormValues.completed_count !== "") {
				setFormValues({
					...draftFormValues,
					completed_count: puzzle.pieces,
				});
				updateProject(puzzle.pieces);
			}
		} catch (error) {}
	};

	const updateProject = async (cumulativeCompleted) => {
		try {
			const res = await fetch(`${API}/projects`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...draftFormValues,
					completed_count: cumulativeCompleted,
					project_id: puzzle.id,
				}),
			});

			// receive updated array of projects after the deletion
			const data = await res.json();
			updateProjects(data);
			toast(`Nice progress, ${session?.user?.username}!`, {
				position: toast.POSITION.BOTTOM_CENTER,
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
			setDraftFormValues(defaultValues);
		} catch (error) {
			console.log(error);
		}
	};

	const data = {
		labels: ["Pieces Left", "Completed"],
		datasets: [
			{
				data: [piecesToGo, puzzle.completed_count],
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
		const daysLeft = date2.diff(date1, "day", true).toFixed(2);
		return daysLeft;
	}

	function hoursRemaining() {
		const date1 = dayjs(puzzle.created_at);
		const date2 = dayjs(puzzle.goal_date);
		const hoursLeft = date2.diff(date1, "hour", true).toFixed(2);
		return parseInt(hoursLeft);
	}

	function onTrackDailyGoal() {
		// should show the amount of pieces to complete each day by midnight of goal_date to meet goal.
		const date1 = dayjs(puzzle.created_at);
		const date2 = dayjs(puzzle.goal_date);
		// const daysLeft = date2.diff(date1, "day", true);
		const daysLeft = date2.diff(date1, "day", true);
		// console.log(daysLeft);

		if (daysLeft < 1) {
			return piecesToGo;
		}

		return parseInt(piecesToGo / daysLeft).toFixed(2);
	}

	const handleChange = (e) => {
		e.preventDefault();
		if (e.target.value.length < 5) {
			setDraftFormValues({
				...draftFormValues,
				[e.target.name]: e.target.value,
			});
		}
	};

	const clearForm = (e) => {
		e.preventDefault();
		setDraftFormValues(defaultValues);
	};

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
						<span className={styles.title}>
							{puzzle.puzzle_name}
							<span className={styles.sub_title}>
								{piecesToGo} pieces to go!{" "}
							</span>
						</span>

						<span
							className={styles.time_left_display}
							onClick={toggleRemainingTimeDisplay}
						>
							⏰
							{showInHours ? (
								<>
									{daysRemaining()} days left{" "}
									<span className={styles.see_format}> See Hours Left</span>
								</>
							) : (
								<>
									{hoursRemaining()} hrs. left{" "}
									<span className={styles.see_format}> See Days Left</span>
								</>
							)}
						</span>
					</div>
					<span className={styles.pie}>
						<Pie data={data} width={400} height={400} />
					</span>
				</span>
				<section className={styles.bottom}>
					<div className={styles.bottom_left}>
						<span className={styles.sub_title}>🏃🏻‍♀️ Start: </span>
						{dayjs(puzzle.created_at).format("MMMM")}{" "}
						{dayjs(puzzle.created_at).format("D")}
						<span className={styles.sub_title}>🏁 End </span>
						{dayjs(puzzle.goal_date).format("MMMM")}{" "}
						{dayjs(puzzle.goal_date).format("D")}
						<span onClick={() => calculateTimeDiff()}>
							<p>
								<span className={styles.sub_title}>🥅 Goal For Today: </span>
								<span className={styles.daily_goal}>
									{onTrackDailyGoal()} pieces
								</span>
							</p>
						</span>
					</div>
					<div className={styles.bottom_right}>
						<form onSubmit={handleTotalCompleted}>
							<input
								type="number"
								minLength="1"
								maxLength="4"
								name="completed_count"
								placeholder="I did this many"
								min="1"
								onChange={handleChange}
								value={draftFormValues.completed_count}
							/>
							<button type="submit">Submit 🧩</button>
							<button type="reset" onClick={clearForm} className={styles.clear}>
								{formValues.completed_count !== "" && <XCircle size={15} />}
							</button>
						</form>
					</div>
				</section>
			</main>
		</>
	);
};

export default PuzzCard;
