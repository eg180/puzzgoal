import Banner from "../components/Banner";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Banner />
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
