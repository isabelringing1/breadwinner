import { useState } from "react";
import "./BlockingScreen.css";

function InfoScreen(props) {
	const {
		title,
		body,
		setShowInfo,
		onConfirmButtonClicked,
		confirmOverrideText,
	} = props;

	const onCancel = () => {
		setShowInfo(false);
	};

	return (
		<div className="blocking-screen" onClick={onCancel}>
			<div className="blocking-div">
				<div className="inner-border">
					<div className="blocking-screen-title">{title}</div>
					<div className="blocking-screen-text">{body}</div>
					<div className="info-button-div">
						<div className="red button" onClick={onCancel}>
							Never Mind
						</div>
						<div
							className="green button"
							onClick={onConfirmButtonClicked}
						>
							{confirmOverrideText
								? confirmOverrideText
								: "Confirm"}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default InfoScreen;
