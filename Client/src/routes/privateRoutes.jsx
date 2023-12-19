import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const PrivateRoutes = ({ children }) => {
	const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("user"));
	const navigate = useNavigate();

	useEffect(() => {
		if (getTokenFromLocalStorage?.token === undefined) {
			// Navigate to the login page
			navigate("/login", { replace: true });

			// Delay showing the toast message
			setTimeout(() => {
				toast.error("Please you must login first.", {
					autoClose: 3000, // Adjust the duration as needed
				});
			}, 100); // Adjust the delay as needed
		}
	}, [getTokenFromLocalStorage, navigate]);

	return getTokenFromLocalStorage?.token !== undefined ? children : null;
};
