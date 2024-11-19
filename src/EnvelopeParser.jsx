import envelopeData from "./config/envelopes.json";
import dough_logo from "/images/dough-logo.png";
import timer_img from "/images/timer.png";
import Markdown from "react-markdown";

function getPrerequisites(id) {
	var data = envelopeData[id];
	if (!data) {
		return null;
	}
	return data.prerequisites;
}

function parse(id, onButtonClick, replaceTokens) {
	var data = envelopeData[id];
	var cards = [];
	if (!data || !data.cards) {
		return null;
	}
	var cardNo = 0;
	data.cards.forEach((el) => {
		if (el.constructor === Array) {
			// multiple cards
			var card = (
				<div className="envelope-card-body">
					{el.map((text, i) => {
						if (text[0] == "[") {
							return parseSpecial(text, id);
						} else if (text[0] == "/") {
							return parseButtons(
								text,
								id,
								onButtonClick,
								cardNo
							);
						}
						text = replaceTokens(text);
						return (
							<div
								key={"env-line-" + id + "-" + i}
								className="env-line"
							>
								<Markdown>{text}</Markdown>
							</div>
						);
					})}
				</div>
			);
			cards.push(card);
		} else {
			if (el[0] == "[") {
				cards.push(
					<div className="envelope-card-body">
						{parseSpecial(el, id)}
					</div>
				);
			} else {
				var text = replaceTokens(el);
				cards.push(
					<div className="envelope-card-body">
						<div className="env-line">
							<Markdown>{text}</Markdown>
						</div>
					</div>
				);
			}
		}
		cardNo++;
	});
	return cards;
}

function parseSpecial(special, id) {
	if (special == "[SIGNATURE]") {
		return (
			<div
				className="env-signature-container"
				key={"env-signature-container-" + id}
			>
				<div className="env-line-signature">Cheers,</div>
				<div className="env-line-signature">
					Dough & Co <img src={dough_logo} className="dough-logo" />
				</div>
			</div>
		);
	} else if (special == "[SIGNATURE2]") {
		return (
			<div
				className="env-signature-container"
				key={"env-signature-container-" + id}
			>
				<div className="env-line-signature">Your friend,</div>
				<div className="env-line-signature">Dough</div>
			</div>
		);
	} else if (special == "[TIMER1]") {
		return (
			<div key={"env-timer-" + id}>
				<div className="env-line">
					Here, take this-- you deserve it!
					<span className="envelope-timer-div">
						<img src={timer_img} id="envelope-timer" />
					</span>
				</div>
				<div className="env-line-signature">Cheers,</div>
				<div className="env-line-signature">
					Dough & Co <img src={dough_logo} className="dough-logo" />
				</div>
			</div>
		);
	} else if (special == "[TIMER2]") {
		return (
			<div className="env-line" key={"env-timer-" + id}>
				Thank you for your feedback! Here’s a small token for your
				troubles:
				<span className="envelope-timer-div">
					<img src={timer_img} id="envelope-timer" />
				</span>
			</div>
		);
	} else if (special == "[TIMER3]") {
		return (
			<div className="env-line" key={"env-timer-" + id}>
				Here’s a small token for your troubles:
				<span className="envelope-timer-div">
					<img src={timer_img} id="envelope-timer" />
				</span>
				<div className="env-line-signature">Cheers,</div>
				<div className="env-line-signature">
					Dough & Co <img src={dough_logo} className="dough-logo" />
				</div>
			</div>
		);
	} else if (special == "[SURVEY]") {
		return (
			<div
				className="env-survey env-line-centered confetti-card"
				key={"env-survey-line-" + id}
			>
				SURVEY TIME!
			</div>
		);
	} else if (special == "[CONGRATS]") {
		return (
			<div className="env-line-centered confetti-card">
				Congratulations!
			</div>
		);
	}
	return <div></div>;
}

function parseButtons(text, id, onButtonClick, cardNo) {
	var buttons = text.split("/");

	return (
		<div
			className="env-buttons-container"
			key={"env-buttons-container-" + id}
		>
			{buttons.map((button, i) => {
				if (button == "") {
					return null;
				}
				return (
					<button
						className={"button env-button env-button-" + i}
						key={"env-button-" + id + "-" + i}
						onClick={() => {
							onButtonClick(id + "-" + cardNo + "-" + i);
						}}
					>
						{button}
					</button>
				);
			})}
		</div>
	);
}

export { parse, getPrerequisites };
