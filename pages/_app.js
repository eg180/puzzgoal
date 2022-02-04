import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { API } from "../utilities";
import { UpdateProjectsContext, ProjectsContext } from "../contexts";
import Banner from "../components/Banner";
import { ToastContainer } from "react-toastify";
import "../styles/globals.css";

import "react-toastify/dist/ReactToastify.css";

function MyApp({ session, Component, ...pageProps }) {
	const [userProjects, setUserProjects] = useState([]);
	const [locStorUserProjects, setLocStorUserProjects] = useState([]);
	const [projCount, setProjCount] = useState("");

	// after an update to projects, pass data from backend here
	const updateUserProjects = (projectsArray) => {
		setUserProjects(projectsArray);
		setProjCount(projectsArray.length);
		// save projectCount to localStorage
		localStorage.setItem("projectCount", JSON.stringify(projectsArray.length));
		localStorage.setItem("projects", JSON.stringify(projectsArray));
	};

	const fetchProjects = async () => {
		try {
			const res = await fetch(`${API}/projects`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			updateUserProjects(data);
		} catch (error) {
			console.log("Please sign in.");
		}
	};

	useEffect(() => {
		// fetch projects for inital sign in / refresh if signed in

		if (session !== undefined || session !== null) {
			fetchProjects();
			// if page reloads, see if stored proj count exists
			setProjCount(localStorage.getItem("projectCount"));
			setLocStorUserProjects(JSON.parse(localStorage.getItem("projects")));
		}
	}, []);

	const count = userProjects.length > 0 ? userProjects.length : projCount;
	const projects = userProjects.length > 0 ? userProjects : locStorUserProjects;

	return (
		<>
			<SessionProvider session={session}>
				<ProjectsContext.Provider value={projects}>
					<UpdateProjectsContext.Provider value={updateUserProjects}>
						<Banner count={count} />
						<Component {...pageProps} />
					</UpdateProjectsContext.Provider>
				</ProjectsContext.Provider>
			</SessionProvider>
			<ToastContainer />
		</>
	);
}

export default MyApp;
