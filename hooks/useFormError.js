import React from "react";
import styles from "../pages/planpuzzgoal/PlanPuzzGoal.module.css";

const useFormError = (formValues, formSubmitted) => {
	const puzzNameErrorStyle =
		formValues.puzzle_name === "" && formSubmitted === true
			? styles.puzzle_name_error
			: undefined;

	const piecesErrorStyle =
		formValues.pieces === "" && formSubmitted === true
			? styles.pieces_error
			: undefined;

	const goalDateErrorStyle =
		formValues.goal_date === "" && formSubmitted === true
			? styles.goal_date_error
			: undefined;

	return { puzzNameErrorStyle, piecesErrorStyle, goalDateErrorStyle };
};

export default useFormError;
