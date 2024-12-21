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

function parse(
	id,
	onButtonClick,
	onDatingButtonClick,
	replaceTokens,
	setDating
) {
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
							<Markdown>{text}</Markdown>
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
			if (el.constructor === Object) {
				// Choice
				var choiceCards = parseDatingButtons(
					el,
					id,
					onDatingButtonClick,
					datingCardNo
				);
				for (var j = 0; j < choiceCards.length; j++) {
					datingCardNo++;
					datingCards.push(choiceCards[j]);
				}
			} else {
				// Otherwise it's a thought or a dialogue card
				var data = parseDatingCard(el, id);
				datingCards.push(data);
				datingCardNo++;
			}
		});
		setDating(datingCards);
	}
	return cards;
}

function parseDatingCard(el, id) {
	var card = null;
	var title = null;
	var shake = false;
	if (el.constructor === Array) {
		card = (
			<div className="dating-card-body">
				{el.map((text, i) => {
					shake = shake || text.indexOf("SHAKE") != -1;
					title = parseDatingTitle(text);
					if (text[0] == "[") {
						return parseSpecialDating(text, id, i);
					}
					var c = "env-line";
					if (text[0] == "_") {
						c += " dating-thought";
					}
					return (
						<div
							key={"dating-env-line-" + id + "-" + i}
							className={c}
						>
							<Markdown>{text}</Markdown>
						</div>
					);
				})}
			</div>
		);
	} else {
		if (el[0] == "[") {
			title = parseDatingTitle(el);
			shake = el.indexOf("SHAKE") != -1;
			card = (
				<div className="dating-card-body">
					{parseSpecialDating(el, id)}
				</div>
			);
		} else {
			var c = "env-line";
			if (el[0] == "_") {
				c += " dating-thought";
			}
			card = (
				<div className="dating-card-body">
					<div key={"dating-env-line-" + id + "-0"} className={c}>
						<Markdown>{el}</Markdown>
					</div>
				</div>
			);
		}
	}

	var data = {
		body: card,
		title: title,
		shake: shake,
	};
	return data;
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
	if (text.indexOf("[") == -1) {
		return null;
	}
	var title = text.split("[").pop().split("]")[0];
	if (title == "DOUGH-SHAKE") {
		return "DOUGH";
	}
	return text.split("[").pop().split("]")[0];
}

function parseSpecialDating(special, id, i = 0) {
	var keyword = special.split("[").pop().split("]")[0];
	var content = special.split("]")[1];
	var c = "env-line dating-dough";
	if (content[0] == "_") {
		c += " dating-thought";
	}
	if (keyword == "DOUGH" || keyword == "DOUGH-SHAKE") {
		return (
			<div key={"dating-env-line-" + id + "-" + i} className={c}>
				<Markdown>{content}</Markdown>
			</div>
		);
	}
}

function parseButtons(text, id, onButtonClick, cardNo) {
	var buttons = text.split("/");
	var containerClass = "env-buttons-container";
	var buttonClass = "button env-button env-button-";
	if (text.includes("[")) {
		containerClass = "env-buttons-text-container";
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

function parseDatingButtons(object, id, onDatingButtonClick, cardNo) {
	var containerClass = "dating-buttons-container";
	var buttonClass = "button dating-button dating-button-";
	var buttonObjs = object.buttons;

	var buttonCt = 0;
	var datingCards = [];
	var card = (
		<div className={containerClass} key={containerClass + "-" + id}>
			{buttonObjs.map((buttonObj, i) => {
				buttonCt++;
				return (
					<button
						className={buttonClass + buttonCt}
						key={"dating-button-" + id + "-" + buttonCt}
						onClick={() => {
							onDatingButtonClick(
								id,
								id + "-" + cardNo + "-" + i,
								object.choice_id,
								i,
								buttonObj[1], //score
								object.outcomes[i]
							);
						}}
					>
						{buttonObj[0]}
					</button>
				);
			})}
		</div>
	);

	datingCards.push({
		body: card,
		choiceId: object.choice_id,
		outcomes: object.outcomes,
		buttons: true,
		title: null,
	});
	return datingCards;
}

function getChoiceCards(card, choice, id) {
	var choiceTextArray = card.outcomes[choice];
	var choiceCards = [];
	for (var i = 0; i < choiceTextArray.length; i++) {
		var data = parseDatingCard(choiceTextArray[i], id + "-choice-");
		choiceCards.push(data);
	}
	return choiceCards;
}

export { parse, getPrerequisites, getChoiceCards };
