import React, { useState, useContext } from "react";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
import { UpdateProjectsContext } from "../../contexts";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { API } from "../../utilities";
import { useSession } from "next-auth/react";
import useFormError from "../../hooks/useFormError";
import styles from "./PlanPuzzGoal.module.css";

const PlanPuzzGoal = () => {
	const updateProjects = useContext(UpdateProjectsContext);
	const router = useRouter();
	const { data: session } = useSession();

	const todaysDate = new Date().toISOString().split("T")[0];

	function tomorrowsDate() {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tomorrow.toISOString().split("T")[0];
	}

	const [formValues, setFormValues] = useState({
		puzzle_name: "",
		pieces: "",
		goal_date: tomorrowsDate(),
	});
	const [formSubmitted, setFormSubmitted] = useState(false);
	const { puzzNameErrorStyle, piecesErrorStyle, goalDateErrorStyle } =
		useFormError(formValues, formSubmitted);

	const handleChange = (e) => {
		setFormValues({
			...formValues,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			setFormSubmitted(true);
			if (
				formValues.puzzle_name === "" ||
				formValues.pieces === "" ||
				formValues.goal_date === ""
			) {
				return;
			}
			setFormSubmitted(true);
			// save to db and create toast once that's settled

			const res = await fetch(`${API}/projects`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ formValues, user_id: session.user.user_id }),
			});
			const data = await res.json();
			// reset form errors etc.
			setFormSubmitted(false);
			// clear form.
			setFormValues({
				puzzle_name: "",
				pieces: "",
				goal_date: tomorrowsDate(),
			});
			// set projects in _app using context
			updateProjects(data);
			toast("🦄 Your puzzgoal was added 🧩", {
				position: toast.POSITION.BOTTOM_CENTER,
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
			// console.log(formValues);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={styles.layout}>
			<section className={styles.form_container}>
				{JSON.stringify(todaysDate)}
				{JSON.stringify(tomorrowsDate())}
				<h1>My Puzzle Planizzle</h1>

				<form onSubmit={handleSubmit}>
					<fieldset>
						<input
							className={puzzNameErrorStyle}
							name="puzzle_name"
							value={formValues.puzzle_name}
							minLength={1}
							placeholder="Puzzle Name"
							maxLength={30}
							onChange={handleChange}
							autoComplete="off"
						/>
						<input
							className={piecesErrorStyle}
							name="pieces"
							placeholder="How many pieces?"
							type="number"
							min="2"
							value={formValues.pieces}
							autoComplete="off"
							onChange={handleChange}
						/>
						<input
							className={goalDateErrorStyle}
							type="date"
							id="start"
							name="goal_date"
							value={formValues.goal_date}
							onChange={handleChange}
							min={tomorrowsDate()}
						></input>
						<button type="submit">Set My PuzzGoal</button>
					</fieldset>
				</form>
			</section>
		</div>
	);
};

export default PlanPuzzGoal;
