import React, { useState } from "react";
import styles from "./planpuzzle.module.css";

const PlanPuzzle = () => {
	const todaysDate = new Date().toISOString().split("T")[0];
	const [formValues, setFormValues] = useState({
		puzzle_name: "",
		pieces: "25",
		goal_date: todaysDate,
	});
	const [formSubmitted, setFormSubmitted] = useState(false);
	const puzzNameErrorStyle =
		formValues.puzzle_name === "" &&
		formSubmitted === true &&
		styles.puzzle_name_error;

	const piecesErrorStyle =
		formValues.pieces === "" && formSubmitted === true && styles.pieces_error;

	const goalDateErrorStyle =
		formValues.goal_date === "" &&
		formSubmitted === true &&
		styles.goal_date_error;

	const handleChange = (e) => {
		setFormValues({
			...formValues,
			[e.target.name]: e.target.value,
		});
	};

	const highlightMissingFields = () => {};

	const handleSubmit = (e) => {
		e.preventDefault();
		setFormSubmitted(true);
		console.log(formValues);
		highlightMissingFields();
		// check for missing values
	};

	return (
		<div className={styles.layout}>
			<section className={styles.form_container}>
				<h1>My Puzzle Plan</h1>

				<form onSubmit={handleSubmit}>
					<fieldset>
						<input
							className={puzzNameErrorStyle}
							name="puzzle_name"
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
							min={todaysDate}
						></input>
						<button type="submit">Set My PuzzGoal</button>
					</fieldset>
				</form>
			</section>
		</div>
	);
};

export default PlanPuzzle;
