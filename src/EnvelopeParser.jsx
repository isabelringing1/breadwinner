import envelopeData from "./config/envelopes.json";
import endingData from "./config/ending.json";
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

function parse(id, onButtonClick, replaceTokens, setDating) {
	var data = envelopeData[id] ?? endingData[id];
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
			} else if (el[0] == "/") {
				{
					cards.push(
						<div className="envelope-card-body">
							{parseButtons(el, id, onButtonClick, cardNo)}
						</div>
					);
				}
			} else {
				var text = replaceTokens(el);
				cards.push(
					<div className="envelope-card-body">
						<div className="env-line">
							<Markdown>{el}</Markdown>
						</div>
					</div>
				);
			}
		}
		cardNo++;
	});
	setDating(null);
	if (data.dating) {
		var datingCardNo = 0;
		var datingCards = [];
		data.dating.forEach((el) => {
			if (el.constructor === Array) {
				var title = null;
				var buttons = false;
				var card = (
					<div className="dating-card-body">
						{el.map((text, i) => {
							if (text[0] == "[") {
								title = parseDatingTitle(text);
								return parseSpecialDating(text, id);
							} else if (text[0] == "/") {
								buttons = true;
								return parseButtons(
									text,
									id,
									onButtonClick,
									datingCardNo,
									true
								);
							}
							return (
								<div
									key={"dating-env-line-" + id + "-" + i}
									className="env-line"
								>
									<Markdown>{text}</Markdown>
								</div>
							);
						})}
					</div>
				);
				var data = {
					body: card,
					title: title,
				};
				datingCards.push(data);
			} else {
				var card;
				var title;

				if (el[0] == "[") {
					title = parseDatingTitle(el);
					card = (
						<div className="dating-card-body">
							{parseSpecialDating(el, id)}
						</div>
					);
				} else if (el[0] == "/") {
					buttons = true;
					card = (
						<div className="dating-card-body">
							{parseButtons(el, id, onButtonClick, cardNo, true)}
						</div>
					);
				} else {
					card = (
						<div className="dating-card-body">
							<div
								key={"dating-env-line-" + id}
								className="env-line"
							>
								<Markdown>{el}</Markdown>
							</div>
						</div>
					);
				}
				var data = {
					body: card,
					title: title,
					buttons: buttons,
				};
				datingCards.push(data);
			}
			datingCardNo++;
		});

		setDating(datingCards);
	}
	return cards;
}

function parseSpecial(special, id) {
	var keyword = special.split("[").pop().split("]")[0];
	var content = special.split("]")[1];
	if (keyword == "SIGNATURE") {
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
	} else if (keyword == "SIGNATURE2") {
		return (
			<div
				className="env-signature-container"
				key={"env-signature-container-" + id}
			>
				<div className="env-line-signature">Your friend,</div>
				<div className="env-line-signature">Dough</div>
			</div>
		);
	} else if (keyword == "TIMER1") {
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
	} else if (keyword == "TIMER2") {
		return (
			<div className="env-line" key={"env-timer-" + id}>
				Thank you for your feedback! Here’s a small token for your
				troubles:
				<span className="envelope-timer-div">
					<img src={timer_img} id="envelope-timer" />
				</span>
			</div>
		);
	} else if (keyword == "TIMER3") {
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
	} else if (keyword == "CONFETTI") {
		return (
			<div
				className="env-line-centered confetti-card"
				key={"env-confetti-line-" + id}
			>
				{content}
			</div>
		);
	} else if (keyword == "HTML") {
		return (
			<div
				className="env-line"
				dangerouslySetInnerHTML={{ __html: content }}
				key={"env-line-html-" + content}
			></div>
		);
	} else if (keyword == "HTML-NUM") {
		return (
			<div
				className="env-line-centered"
				dangerouslySetInnerHTML={{ __html: content }}
				key={"env-line-num-" + id}
			></div>
		);
	} else if (keyword == "HTML-CONFETTI") {
		return (
			<div
				className="env-line-centered confetti-card"
				dangerouslySetInnerHTML={{ __html: content }}
				key={"env-line-num-" + id}
			></div>
		);
	}
	return <div></div>;
}

function parseDatingTitle(text) {
	return text.split("[").pop().split("]")[0];
}

function parseSpecialDating(special, id) {
	var keyword = special.split("[").pop().split("]")[0];
	var content = special.split("]")[1];
	if (keyword == "DOUGH") {
		return (
			<div
				key={"dating-env-line-" + id}
				className="env-line dating-dough"
			>
				{content}
			</div>
		);
	}
}

function parseButtons(text, id, onButtonClick, cardNo, dating = false) {
	var buttons = text.split("/");
	var containerClass = "env-buttons-container";
	var buttonClass = "button env-button";
	if (text.includes("[")) {
		containerClass = "env-buttons-text-container";
	}
	if (dating) {
		containerClass = "dating-buttons-container";
		buttonClass = "button dating-button dating-button-";
	}

	var buttonCt = 0;
	return (
		<div className={containerClass} key={containerClass + "-" + id}>
			{buttons.map((button, i) => {
				if (button == "") {
					return null;
				} else if (button[0] == "[") {
					return (
						<span
							key={"env-button-text-" + id + "-" + i}
							className={"env-buttons-text"}
						>
							{button.slice(1, -1)}
						</span>
					);
				}
				buttonCt++;
				return (
					<button
						className={buttonClass + buttonCt}
						key={"env-button-" + id + "-" + buttonCt}
						onClick={() => {
							onButtonClick(id + "-" + cardNo + "-" + buttonCt);
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
