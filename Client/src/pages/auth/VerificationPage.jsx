import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../containers/common/ShowToast";

const VerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]); // Initial state with 6 empty strings

	const { _id } = useParams();

	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	const digit_code = code.join("");

	const [message, setMessage] = useState("");

	console.log("message", message);

	const handleChange = (index, value) => {
		// Validate input to allow only numeric characters
		if (/^\d*$/.test(value)) {
			const updatedCode = [...code];
			updatedCode[index] = value;

			// Get the next input element
			const nextInput = document.getElementById(`input-${index + 1}`);
			// Get the confirm button element
			const confirmButton = document.getElementById("confirmButton");

			if (nextInput) {
				// If the current input is not the last one and it has a value, move the focus to the next input
				nextInput.focus();
			} else if (confirmButton && value !== "") {
				// If the current input is the last one and it has a value, move the focus to the Confirm button
				confirmButton.focus();
			}

			setCode(updatedCode);
		}
	};

	const handleClickVerify = async () => {
		setLoading(true);

		try {
			const response = await fetch(
				`http://localhost:8080/api/user/verify_email/${_id}/${digit_code}`,
				{
					method: "GET",
				},
			);
			console.log("resposne", response);
			const result = await response.json();
			if (response.ok) {
				if (
					result.message === "Email verified successfully.You can login now."
				) {
					navigate("/login");
				} else {
					setMessage(result.message);
					console.log(result.message);
				}
			} else {
				console.log("error", result.message);
				setMessage(result.message);
			}
		} catch (error) {
			setLoading(false);
			console.error("error", error.message);
			setMessage("An error occurred. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className='email-verify-container'>
				<div className='email-verify'>
					<h4>One final step! We need to verify your email</h4>

					<div className='sub-email-verify'>
						<p>Please enter the 6-digit code sent to your email</p>
						<div className='verification-inputs'>
							{code.map((digit, index) => (
								<input
									id={`input-${index}`}
									className='email-verify-input'
									key={index}
									type='text'
									maxLength='1'
									value={digit}
									onChange={(e) => handleChange(index, e.target.value)}
								/>
							))}
						</div>
					</div>

					{message ? <div className='verify-error-message'>{message}</div> : ""}
					{/* <div >
					</div> */}

					<div className='verify-button'>
						<button
							id='confirmButton'
							type='button'
							onClick={handleClickVerify}
						>
							{loading ? `verification in progress...` : `Confirm`}
						</button>
					</div>

					<span>Can't find it? Please check your spam folder.</span>
				</div>
			</div>
		</>
	);
};

export default VerificationPage;
