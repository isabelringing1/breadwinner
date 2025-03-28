import { useState, useRef, useEffect } from "react";
import { formatNumber } from "./Util";

import * as Parser from "./EnvelopeParser";

import envelope_open from "/images/envelope_open.png";
import envelope_closed from "/images/envelope_closed.png";
import letter_logo from "/images/letter-logo.png";
import crossed_line from "/images/crossed_line.png";

import "./Envelope.css";

function Envelope(props) {
	const {
		unlocks,
		setUnlocks,
		showEnvelope,
		setShowEnvelope,
		emitEvent,
		emitEvents,
		timersUnlocked,
		setTimersUnlocked,
		setTimers,
		timers,
		breadObject,
		events,
		totalClicks,
		totalKeys,
		AchievementsObject,
		storyState,
		setStoryState,
		reportEnvelopeAnswer,
		reportEnvelopeCompleted,
		debugEnvelope,
		setDebugEnvelope,
		datingScore,
		setDatingScore,
	} = props;
	const animating = useRef(false);
	const animatingTimer = useRef(false);
	const jiggleInterval = useRef(null);
	const unlockDict = useRef({});

	const [currentEntry, setCurrentEntry] = useState(null);
	const [cards, setCards] = useState([]);
	const [cardIndex, setCardIndex] = useState(0);

	const [datingCards, setDatingCards] = useState(null);
	const [datingMode, setDatingMode] = useState(false);
	const [datingIndex, setDatingIndex] = useState(0);

	useEffect(() => {
		checkForNextEnvelope();
	}, [unlocks, currentEntry]);

	const checkForNextEnvelope = () => {
		if (unlocks == null || currentEntry != null) {
			return;
		}
		for (var i in unlocks) {
			var entry = unlocks[i];
			unlockDict.current[entry.category] = entry;
		}
		for (var i in unlocks) {
			var entry = unlocks[i];
			if (entry.finish_time) {
				continue;
			}
			if (!hasPrerequisites(entry)) {
				continue;
			}
			var parsedEntry = Parser.parse(
				entry.category,
				onButtonClick,
				onDatingButtonClick,
				replace_tokens,
				datingScore
			);
			if (parsedEntry.cards != null && parsedEntry.cards.length) {
				setCards(parsedEntry.cards);
			} else {
				setCards([]);
			}
			setDatingCards(parsedEntry.datingCards); // may be null
			setCurrentEntry(entry);
			peek_in_envelope();
			break;
		}
	};

	useEffect(() => {
		if (debugEnvelope != null) {
			var parsedEntry = Parser.parse(
				debugEnvelope,
				onButtonClick,
				onDatingButtonClick,
				replace_tokens,
				datingScore
			);
			if (parsedEntry.cards != null && parsedEntry.cards.length) {
				setCards(parsedEntry.cards);
			} else {
				setCards([]);
			}

			setDatingCards(parsedEntry.datingCards);
			setCurrentEntry({
				category: debugEnvelope,
				event: null,
				finish_time: false,
				debug: true,
			});
			peek_in_envelope();
		}
	}, [debugEnvelope]);

	const hasPrerequisites = (envelope) => {
		if (envelope.category == null) {
			return false;
		}
		var prereqs = Parser.getPrerequisites(envelope.category);
		if (!prereqs) {
			return true;
		}
		for (var i = 0; i < prereqs.length; i++) {
			var cat = prereqs[i];
			if (
				unlockDict.current[cat] == null ||
				!unlockDict.current[cat].finish_time
			) {
				return false;
			}
		}
		return true;
	};

	const peek_in_envelope = () => {
		if (animating.current || showEnvelope) return;
		document
			.getElementById("small-envelope")
			.classList.add("peek-in-small");
		setTimeout(() => {
			document
				.getElementById("small-envelope")
				.classList.remove("peek-in-small");
			document.getElementById("small-envelope").style.bottom = "-3vh";
			document
				.getElementById("small-envelope-bg-image")
				.classList.add("envelope-hint");
			jiggle_envelope();
		}, 400);
		jiggleInterval.current = setInterval(() => {
			jiggle_envelope();
		}, 2000);
	};

	const jiggle_envelope = () => {
		if (animating.current || showEnvelope) return;
		document
			.getElementById("small-envelope")
			.classList.add("jiggle-envelope");
		setTimeout(() => {
			document
				.getElementById("small-envelope")
				.classList.remove("jiggle-envelope");
		}, 250);
	};

	const animate_open = () => {
		if (animating.current || showEnvelope) return;

		emitEvent("open-envelope");
		setCardIndex(0);
		setDatingIndex(0);
		jiggleInterval.current = null;

		animating.current = true;
		document
			.getElementById("small-envelope")
			.classList.add("peek-out-small");
		setTimeout(() => {
			document.getElementById("small-envelope").style.bottom = "-15vh";
			console.log(document.getElementById("small-envelope").classList);
			document
				.getElementById("small-envelope-bg-image")
				.classList.remove("envelope-hint");
			document
				.getElementById("small-envelope")
				.classList.remove("peek-out-small");
			document
				.getElementById("big-envelope")
				.classList.add("bounce-in-big");
			setTimeout(() => {
				document
					.getElementById("big-envelope")
					.classList.remove("bounce-in-big");
				document.getElementById("big-envelope").style.transform =
					"translateY(0)";
				animating.current = false;
				document.getElementById(
					"envelope-container"
				).style.pointerEvents = "auto";
				setShowEnvelope(true);
				if (!cards.length && datingCards != null) {
					startDating(true);
				}
			}, 750);
		}, 250);
	};

	const on_click = (e) => {
		if (animating.current || !showEnvelope) return;
		if (!datingMode) {
			var card = document.getElementById("envelope-card-" + cardIndex);
			if (
				card.querySelectorAll(".fake-button").length &&
				e.target.classList.contains("fake-button")
			) {
				return;
			} else if (
				card.querySelectorAll(".env-buttons-text-container").length &&
				!card.querySelectorAll(".fake-button").length &&
				!e.target.classList.contains("env-button")
			) {
				return;
			}

			setCardIndex(cardIndex + 1);
			if (cardIndex + 1 < cards.length) {
				animate_next_card(card);
			} else if (datingCards != null) {
				startDating();
			} else {
				animate_close();
			}
		} else {
			// DATING!!!
			var nextCard = document.getElementById(
				"dating-card-" + (datingIndex + 1)
			);
			var prevCard = document.getElementById(
				"dating-card-" + datingIndex
			);
			var cursor = document.getElementById(
				"dating-cursor-" + (datingIndex + 1)
			);
			if (
				prevCard != null &&
				prevCard.querySelectorAll(".dating-buttons-container").length &&
				!e.target.classList.contains("dating-button")
			) {
				return;
			}
			setDatingIndex(datingIndex + 1);
			if (datingIndex + 1 < datingCards.length) {
				animate_next_dating_card(prevCard, nextCard, cursor);
			} else {
				setDatingMode(false);
				animate_close();
			}
		}
	};

	const startDating = (overrideWait = false) => {
		setDatingMode(true);
		document.querySelectorAll(".envelope-card").forEach((card) => {
			card.style.opacity = 0;
			card.style.zIndex = -1;
			card.style.pointerEvents = "none";
		});
		document
			.querySelectorAll(".dating-buttons-container")
			.forEach((container) => {
				container.style.pointerEvents = "all";
			});
		animate_next_dating_card(
			null,
			document.getElementById("dating-card-0"),
			document.getElementById("dating-cursor-0"),
			overrideWait
		);
	};

	const onButtonClick = (buttonId) => {
		reportEnvelopeAnswer(buttonId);
	};

	const onDatingButtonClick = (
		id,
		buttonId,
		choiceId,
		choice,
		points,
		maxPoints
	) => {
		// have to reroute info to events otherwise no states would have updated values
		emitEvent("dating-button-choice", [
			choiceId,
			choice,
			id,
			points,
			maxPoints,
		]);
	};

	const createChoiceCards = (choiceId, choice, id) => {
		var index = 0;
		var card = null;
		for (; index < datingCards.length; index++) {
			if (datingCards[index].choiceId == choiceId) {
				card = datingCards[index];
				break;
			}
		}

		var newCards = Parser.getChoiceCards(card, choice, id, datingScore);
		if (newCards.length > 0) {
			var newDatingCards = [
				...datingCards.slice(0, index + 1),
				...newCards,
				...datingCards.slice(index + 1),
			];
			setDatingCards(newDatingCards);
		}
	};

	const replace_tokens = (text) => {
		if (text.includes("[LOAVES]")) {
			var formatted = formatNumber(getBreadTotal());
			text = text.replace("[LOAVES]", formatted);
		}
		if (text.includes("[CLICKS]")) {
			var formatted = formatNumber(totalClicks);
			text = text.replace("[CLICKS]", formatted);
		}
		if (text.includes("[KEYS]")) {
			var formatted = formatNumber(totalKeys);
			text = text.replace("[KEYS]", formatted);
		}
		if (text.includes("[ACHIEVEMENTS]")) {
			text = text.replace("[ACHIEVEMENTS]", getUnclaimedAchievements());
		}
		return text;
	};

	const getBreadTotal = () => {
		var total = 0;
		for (var bread in breadObject) {
			total += breadObject[bread].save.purchase_count;
		}
		return total;
	};

	const getUnclaimedAchievements = () => {
		var total = 0;
		for (var categoryName in AchievementsObject) {
			var category = AchievementsObject[categoryName];
			for (var a in category) {
				if (!category[a].save.claimed && !category[a].save.epilogue) {
					total += 1;
				}
			}
		}
		return total;
	};

	useEffect(() => {
		var card = document.getElementById("envelope-card-" + cardIndex);
		if (card != null && card.querySelector(".confetti-card")) {
			confetti({
				particleCount: 150,
				spread: 340,
				startVelocity: 28,
				origin: {
					x: 0.5,
					y: 0.4,
				},
				ticks: 100,
			});
		}
	}, [cardIndex]);

	useEffect(() => {
		var card = document.getElementById("dating-card-" + datingIndex);
		if (card != null && card.querySelector(".confetti-card")) {
			confetti({
				particleCount: 150,
				spread: 340,
				startVelocity: 28,
				origin: {
					x: 0.5,
					y: 0.4,
				},
				ticks: 100,
			});
		}
	}, [datingIndex]);

	const animate_next_card = async (currentCard) => {
		if (animating.current || !showEnvelope) return;
		animating.current = true;
		currentCard.classList.add("flip-out");
		setTimeout(() => {
			currentCard.style.zIndex = 1;
		}, 250);
		setTimeout(() => {
			currentCard.classList.remove("flip-out");
			if (!animatingTimer.current) {
				animating.current = false;
			}
		}, 500);

		var nextCard = document.getElementById(
			"envelope-card-" + (cardIndex + 1)
		);

		if (nextCard != null) {
			check_for_card_fx(nextCard);
			if (nextCard.querySelector(".envelope-timer-div")) {
				var firstTime = false;
				if (!timersUnlocked) {
					setTimersUnlocked(true);
					firstTime = true;
				}
				animating.current = true;
				animatingTimer.current = true;
				await animate_timer(firstTime);
				setTimers(timers + 1);
				animating.current = false;
				animatingTimer.current = false;
			}
		}
	};

	const check_for_card_fx = (card) => {
		if (card.querySelector(".achievements-in")) {
			emitEvent("animate-achievements-in");
		} else if (card.querySelector(".achievements-out")) {
			emitEvent("animate-achievements-out");
		} else if (card.querySelector(".achievements-scramble")) {
			emitEvent("animate-achievements-scramble");
		} else if (card.querySelector(".glitch-1")) {
			emitEvent("animate-glitch", null, 1);
		} else if (card.querySelector(".glitch-2")) {
			emitEvent("animate-glitch", null, 2);
		} else if (card.querySelector(".glitch-3")) {
			emitEvent("animate-glitch", null, 3);
		} else if (card.querySelector(".stop-glitch")) {
			emitEvent("stop-glitch");
		}
	};

	const animate_timer = async (first_time = false) => {
		while (document.getElementById("timer-icon") == null) {
			await new Promise((resolve) => setTimeout(resolve, 10));
		}
		if (first_time) {
			document.getElementById("timer-icon").style.display = "none";
			document.getElementById("timer-icon-copy").style.display = "none";
		}

		var timer_div =
			document.getElementsByClassName("envelope-timer-div")[0];
		var timer = document.getElementById("envelope-timer");

		await new Promise(function (resolve) {
			setTimeout(function () {
				timer_div.classList.add("timer-move");
				timer.classList.add("timer-spin");
				resolve();
			}, 500);
		});

		await new Promise(function (resolve) {
			setTimeout(function () {
				timer_div.classList.remove("timer-move");
				timer.classList.remove("timer-spin");
				timer.style.display = "none";
				document.getElementById("timer-icon").style.display = "";
				document
					.getElementById("timer-icon")
					.classList.add("wallet-timer-move");
				resolve();
			}, 600);
		});

		await new Promise(function (resolve) {
			setTimeout(function () {
				document
					.getElementById("timer-icon")
					.classList.remove("wallet-timer-move");
				var newUnlocks = [...unlocks];
				newUnlocks = try_finish_envelope(newUnlocks, false);
				setUnlocks(newUnlocks);
				resolve();
				if (first_time) {
					document.getElementById("timer-icon-copy").style.display =
						"";
				}
			}, 250);
		});
	};

	const try_finish_envelope = (newUnlocks, emitCurrentEvent = true) => {
		if (currentEntry.debug) {
			setDebugEnvelope(null);
			return newUnlocks;
		}
		for (var i in newUnlocks) {
			var entry = newUnlocks[i];
			if (entry.category == currentEntry.category) {
				if (entry.finish_time) {
					// Already finished
					return newUnlocks;
				} else {
					entry.finish_time = Date.now();
					break;
				}
			}
		}
		reportEnvelopeCompleted(currentEntry.category);
		var eventsToEmit = [];
		if (currentEntry.event != null && emitCurrentEvent) {
			eventsToEmit.push({
				id: currentEntry.event,
			});
		}
		var state = getState(entry.category);
		if (state > storyState) {
			setStoryState(state);
			eventsToEmit.push({
				id: "story-state-changed",
				value: state,
			});
		}
		if (eventsToEmit.length) {
			emitEvents(eventsToEmit);
		}

		return newUnlocks;
	};

	const getState = (id) => {
		if (id == "brioche2") {
			return 1; //reveal
		}
		if (id == "banana") {
			return 2; //first endng
		}
		if (id == "orders_14") {
			return 3; // dating sim
		}
		if (id == "ending") {
			return 4; // second ending
		}
		return 0;
	};

	useEffect(() => {
		for (var i = 0; i < events.length; i++) {
			var event = events[i];
			switch (event.id) {
				case "skip-envelope":
					animate_close();
					break;
				case "dating-button-choice":
					if (event.value[3] != -1) {
						setDatingScore([
							datingScore[0] + event.value[3], //points
							datingScore[1] + event.value[4], //max points
						]);
					}
					createChoiceCards(
						event.value[0], //choiceId
						event.value[1], //choice
						event.value[2] //id
					);
					break;
			}
		}
	}, [events]);

	const animate_close = () => {
		if (animating.current || !showEnvelope) return;
		animating.current = true;
		document.getElementById("big-envelope").classList.add("bounce-out-big");

		if (currentEntry.event != null) {
			emitEvent(currentEntry.event);
		}
		var newUnlocks = [...unlocks];
		newUnlocks = try_finish_envelope(newUnlocks);
		setUnlocks(newUnlocks);
		setTimeout(() => {
			document
				.getElementById("big-envelope")
				.classList.remove("bounce-out-big");
			document.getElementById("big-envelope").style.transform =
				"translateY(100vh)";
			document.getElementById("envelope-container").style.pointerEvents =
				"none";
			animating.current = false;
			setShowEnvelope(false);
			setCurrentEntry(null);
		}, 750);
	};

	const animate_next_dating_card = async (
		prevCard,
		currentCard,
		cursor,
		overrideWait
	) => {
		if (!overrideWait && (animating.current || !showEnvelope)) return;
		if (prevCard != null) {
			prevCard.style.opacity = 0;
			prevCard.style.display = "none";
			prevCard.style.zIndex = -1;
		}
		currentCard.style.opacity = 1;
		currentCard.style.pointerEvents = "auto";
		if (cursor != null) {
			cursor.style.opacity = 0;
			setTimeout(() => {
				cursor.style.opacity = 1;
			}, 500);
		}
		if (currentCard.classList.contains("shake")) {
			currentCard.classList.remove("shake");
			void currentCard.offsetWidth;
			currentCard.classList.add("shake");
		}
	};

	return (
		<div id="envelope-container" onClick={(e) => on_click(e)}>
			<div
				id="small-envelope"
				src={envelope_closed}
				onClick={() => animate_open()}
				onMouseEnter={() => jiggle_envelope()}
			>
				<img id="small-envelope-bg-image" src={envelope_closed} />
			</div>

			<div id="big-envelope">
				<div className="envelope-logo-div">
					Dough & Co{" "}
					<img className="envelope-logo" src={letter_logo} />
					{storyState > 0 ? (
						<img className="crossed-line" src={crossed_line} />
					) : null}
				</div>
				<img className="big-envelope-bg-image" src={envelope_open} />
				{cards.map((body, i) => {
					var dropValue = 0.45 / cards.length;
					return (
						<div
							className="envelope-card"
							key={"envelope-card-" + i}
							id={"envelope-card-" + i}
							style={{
								zIndex: cards.length - i + 40,
								filter:
									"drop-shadow(0px 5px 6px rgba(0, 0, 0, " +
									dropValue +
									"))",
							}}
						>
							<div className="envelope-inner-border">{body}</div>
						</div>
					);
				})}
				{datingCards
					? datingCards.map((cardData, i) => {
							var cardClass = "dating-card";
							var innerBorderClass = "dating-inner-border";
							if (cardData.buttons) {
								cardClass += " dating-card-buttons";
								innerBorderClass += " env-inner-border";
							}
							if (cardData.shake) {
								cardClass += " shake";
							}
							return (
								<div
									className={cardClass}
									key={"dating-card-" + i}
									id={"dating-card-" + i}
									style={{
										zIndex: datingCards.length - i + 40,
									}}
								>
									{cardData.title ? (
										<div className="title-card">
											{cardData.title
												.charAt(0)
												.toUpperCase() +
												cardData.title
													.slice(1)
													.toLowerCase()}
										</div>
									) : null}
									<div className={innerBorderClass}>
										{cardData.body}
									</div>
									{cardData.buttons ? null : (
										<div
											className="dating-cursor"
											id={"dating-cursor-" + i}
										></div>
									)}
								</div>
							);
					  })
					: null}
			</div>
		</div>
	);
}

export default Envelope;
