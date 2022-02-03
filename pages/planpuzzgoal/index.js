import React, { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import useFormError from "../../hooks/useFormError";
import styles from "./PlanPuzzGoal.module.css";

const PlanPuzzGoal = () => {
	const router = useRouter();
	const todaysDate = new Date().toISOString().split("T")[0];
	const [formValues, setFormValues] = useState({
		puzzle_name: "",
		pieces: "25",
		goal_date: todaysDate,
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

	const handleSubmit = (e) => {
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
		toast("🦄 Now get your puzzle on! 🧩", {
			position: toast.POSITION.TOP_RIGHT,
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
		router.push("/mypuzzgoals");
		// console.log(formValues);
	};

	return (
		<div className={styles.layout}>
			<section className={styles.form_container}>
				<h1>My Puzzle Planizzle</h1>

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

export default PlanPuzzGoal;
