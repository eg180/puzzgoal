import { SessionProvider } from "next-auth/react";
import Banner from "../components/Banner";
import { ToastContainer } from "react-toastify";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ session, Component, ...pageProps }) {
	return (
		<>
			<SessionProvider session={session}>
				<Banner />
				<Component {...pageProps} />
			</SessionProvider>
			<ToastContainer />
		</>
	);
}

export default MyApp;
