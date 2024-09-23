import { useState, useRef, useEffect } from "react";
import { formatNumber } from "./Util";
import { reportAchievementClaimed } from "../public/analytics";
import "./Achievements.css";

import Achievement from "./Achievement";
import Markdown from "react-markdown";

import spiral from "/images/spiral.png";
import bookmarkBody from "/images/bookmark-body.png";
import bookmarkRibbon from "/images/bookmark-ribbon.png";

function Achievements(props) {
	const {
		showAchievements,
		setShowAchievements,
		AchievementsObject,
		setAchievementsObject,
		toggleTooltip,
		emitEvent,
		events,
		breadCoin,
		setBreadCoin,
		totalEarned,
		setTotalEarned,
		claimButtonPressed,
		loaded,
		timers,
		setTimers,
		timersUnlocked,
		setTimersUnlocked,
		unlockEnvelope,
	} = props;

	const animating = useRef(false);
	const achievementQueue = useRef([]);
	const isAnimatingBanner = useRef(false);

	var achievements = [];
	for (var categoryName in AchievementsObject) {
		var category = AchievementsObject[categoryName];
		for (var a in category) {
			achievements.push(category[a]);
		}
	}

	const [alertAchievement, setAlertAchievement] = useState(achievements[0]);

	useEffect(() => {
		var newAchievements = { ...AchievementsObject };
		for (var i = 0; i < events.length; i++) {
			var event = events[i];
			//console.log("Listening to event ", event);
			switch (event.id) {
				case "total-conversions":
					var productivityAchievements =
						AchievementsObject["productivity"];
					// if we've reached half of 1st goal, show the bookmark for the first time.
					if (
						!productivityAchievements[0].save.revealed &&
						event.amount >= productivityAchievements[0].amount / 2
					) {
						newAchievements["productivity"][0].save.revealed = true;
						peek_in();
					}

					productivityAchievements.forEach((a, i) => {
						if (i < 3 && !a.save.achieved && a.amount != null) {
							var newAchievements = { ...AchievementsObject };
							newAchievements["productivity"][i].progress =
								event.amount;
							if (event.amount >= a.amount) {
								achieve("productivity", i, newAchievements);
							}
						}
					});

					var convertAchievement = AchievementsObject["misc"][1];
					if (event.value == convertAchievement.amount) {
						//Overload value to be the total times convert has been pressed
						achieve("misc", 1, newAchievements, false);
					} else if (event.value >= convertAchievement.amount / 2) {
						convertAchievement.save.revealed = true;
					}
					break;
				case "keys-unlocked":
					achieve("keys", 0, newAchievements);
					break;
				case "keys-converted":
					var keyAchievements = AchievementsObject["keys"].slice(1);
					keyAchievements.forEach((a, i) => {
						newAchievements["keys"][i].progress = event.amount;
						if (event.amount >= a.amount) {
							achieve("keys", i, newAchievements);
						}
					});
					break;
				case "oven-finished":
					achieve("unlocking", 0, newAchievements);
					break;
				case "bread-finished":
					achieve("unlocking", 2, newAchievements);
					break;
				case "supply-finished":
					achieve("unlocking", 1, newAchievements);
					break;
				case "bread-baked":
					var loafAchievements = AchievementsObject["loaves"];
					loafAchievements.forEach((a, i) => {
						newAchievements["loaves"][i].progress = event.amount;
						if (event.amount >= a.amount) {
							achieve("loaves", i, newAchievements);
						}
					});
					break;
				case "current-balance":
					var medalAchievements = AchievementsObject["medals"];
					if (
						!medalAchievements[0].save.revealed &&
						event.amount >= medalAchievements[0].amount / 2
					) {
						newAchievements["medals"][0].save.revealed = true;
					}
					medalAchievements.forEach((a, i) => {
						newAchievements["medals"][i].progress = event.amount;
						if (event.amount >= a.amount) {
							achieve("medals", i, newAchievements);
						}
					});
					break;
				case "daily-order-claim":
					var dailyOrderAchievements =
						AchievementsObject["daily_orders"];
					var [total, totalTimely] = event.value;
					if (total == 1) {
						newAchievements["daily_orders"][0].save.revealed = true;
					}
					dailyOrderAchievements.forEach((a, i) => {
						if (a.id != "daily_order_2" && total >= a.amount) {
							achieve("daily_orders", i, newAchievements);
						} else if (
							a.id == "daily_order_2" &&
							totalTimely >= a.amount
						) {
							achieve("daily_orders", i, newAchievements);
						}
					});
					break;
				case "breadcoin-gain":
					var spendAchievement = AchievementsObject["misc"][3];
					if (event.value >= spendAchievement.amount) {
						achieve("misc", 3, newAchievements, false);
					}
					break;
				case "mature":
					achieve("misc", 4, newAchievements, false);
					break;
				case "sell-oven":
					achieve("misc", 2, newAchievements, false);
					break;
				case "hour-timeout":
					achieve("misc", 0, newAchievements, false);
					break;
				case "productivity":
					if (event.value >= 4 && event.value <= 6) {
						achieve(
							"productivity",
							event.value - 1,
							newAchievements
						);
						claimAchievement(
							AchievementsObject["productivity"][event.value - 1]
						);
					} else if (event.value >= 7 && event.value <= 8) {
						if (
							event.amount <
							AchievementsObject["productivity"][event.value - 1]
								.amount
						) {
							AchievementsObject["productivity"][
								event.value - 1
							].progress = event.amount;
						} else {
							achieve(
								"productivity",
								event.value - 1,
								newAchievements
							);
						}
					}
					break;
				case "reveal-epilogue":
					var achievements = AchievementsObject["ending"];
					achievements.forEach((a, i) => {
						newAchievements["ending"][i].save.epilogue = false;
						newAchievements["ending"][i].save.revealed = true;
					});
					break;
			}
		}
		setAchievementsObject(newAchievements);
	}, [events]);

	const achieve = (category, index, newAchievements, revealNext = true) => {
		if (newAchievements[category][index].save.achieved) {
			return;
		}
		newAchievements[category][index].save.revealed = true;
		newAchievements[category][index].save.achieved = true;
		if (revealNext && newAchievements[category].length > index + 1) {
			newAchievements[category][index + 1].save.revealed = true;
		}
		queue_alert(newAchievements[category][index]);
	};

	const claimAchievement = (achievement) => {
		if (!achievement.save.achieved || achievement.save.claimed) {
			return;
		}
		var newAchievements = { ...AchievementsObject };
		var numAchievements = 0;
		for (var categoryName in newAchievements) {
			var category = newAchievements[categoryName];
			for (var i in category) {
				if (category[i].id == achievement.id) {
					category[i].save.claimed = true;
					//console.log("Claiming ", achievement);
				}
				numAchievements += category[i].save.claimed ? 1 : 0;
			}
		}
		setAchievementsObject(newAchievements);
		setBreadCoin(breadCoin + achievement.reward);
		setTimers(timers + achievement.timers);
		if (!timersUnlocked) {
			setTimersUnlocked(true);
		}
		emitEvent("breadcoin-gain", achievement.reward, null);
		setTotalEarned(totalEarned + achievement.reward);
		animateReward(achievement.reward, achievement.id);
		if (numAchievements == 30) {
			unlockEnvelope("ending", "reveal-epilogue");
		}
		reportAchievementClaimed(achievement, numAchievements);
	};

	const animateReward = (amount, id) => {
		var num = document.getElementById("reward-anim");
		num.innerHTML = "+" + formatNumber(amount);
		var boundingBox = document.getElementById(id).getBoundingClientRect();
		num.style.left = boundingBox.left + "px";
		num.style.top = boundingBox.top - 40 + "px";

		num.classList.remove("float-up");
		void num.offsetWidth;
		num.classList.add("float-up");
	};

	var achievementsDiv = document.getElementById("achievements");
	var achievementsContainer = document.getElementById(
		"achievements-container"
	);
	var bookmarkDiv1 = document.getElementById("bookmark-div-1");
	var bookmarkDiv2 = document.getElementById("bookmark-div-2");
	var bookmarkRibb = document.getElementById("bookmark-ribbon");
	var bookmarkBod = document.getElementById("bookmark-body");
	var achievementAlert = document.getElementById("achievement-alert");
	var dailyOrdersContainer = document.getElementById("daily-order-container");

	useEffect(() => {
		if (loaded && !AchievementsObject["productivity"][0].save.revealed) {
			document.getElementById("bookmark-div-1").style.transform =
				"translateY(20vh)";
			document.getElementById("bookmark-div-2").style.transform =
				"translateY(20vh)";
		}
	}, [loaded]);

	var peek_in = () => {
		document
			.getElementById("bookmark-div-1")
			.classList.add("peek-in-bookmark");
		document
			.getElementById("bookmark-div-2")
			.classList.add("peek-in-bookmark");
		setTimeout(() => {
			document
				.getElementById("bookmark-div-1")
				.classList.remove("peek-in-bookmark");
			document
				.getElementById("bookmark-div-2")
				.classList.remove("peek-in-bookmark");
			document.getElementById("bookmark-div-1").style.transform =
				"translateY(0vh)";
			document.getElementById("bookmark-div-2").style.transform =
				"translateY(0vh)";
		}, 500);
	};

	var animate_in = () => {
		if (animating.current || showAchievements) return;
		achievementsDiv.classList.add("bounce-in");
		bookmarkDiv1.classList.add("bounce-in-bookmark");
		bookmarkDiv2.classList.add("bounce-in-bookmark");
		animating.current = true;
		achievementsContainer.style.pointerEvents = "auto";
		bookmarkRibb.style.pointerEvents = "none";
		dailyOrdersContainer.style.zIndex = 10;
		setTimeout(() => {
			achievementsDiv.classList.remove("bounce-in");
			bookmarkDiv1.classList.remove("bounce-in-bookmark");
			bookmarkDiv2.classList.remove("bounce-in-bookmark");
			achievementsDiv.style.transform = "translateY(0px)";
			bookmarkDiv1.style.transform = "translateY(-80.8vh)";
			bookmarkDiv2.style.transform = "translateY(-80.8vh)";
			animating.current = false;
		}, 1000);
		setShowAchievements(true);
	};

	var animate_out = () => {
		if (animating.current || !showAchievements) return;
		achievementsDiv.classList.add("bounce-out");
		bookmarkDiv1.classList.add("bounce-out-bookmark");
		bookmarkDiv2.classList.add("bounce-out-bookmark");
		animating.current = true;
		setTimeout(() => {
			bookmarkDiv1.classList.remove("bounce-out-bookmark");
			bookmarkDiv2.classList.remove("bounce-out-bookmark");
			achievementsDiv.classList.remove("bounce-out");
			achievementsDiv.style.transform = "translateY(100vh)";
			bookmarkDiv1.style.transform = "translateY(0vh)";
			bookmarkDiv2.style.transform = "translateY(0vh)";
			achievementsContainer.style.pointerEvents = "none";
			bookmarkRibb.style.pointerEvents = "auto";
			animating.current = false;
			dailyOrdersContainer.style.zIndex = 20;
		}, 1000);
		setShowAchievements(false);
	};

	var jiggle_bookmark = () => {
		if (animating.current || showAchievements) return;
		bookmarkBod.classList.add("jiggle-bookmark");
		bookmarkRibb.classList.add("jiggle-bookmark");
		setTimeout(() => {
			bookmarkBod.classList.remove("jiggle-bookmark");
			bookmarkRibb.classList.remove("jiggle-bookmark");
		}, 250);
	};

	var queue_alert = async (achievement) => {
		achievementQueue.current.push(achievement);
		if (isAnimatingBanner.current) {
			return;
		}
		isAnimatingBanner.current = true;
		show_alert_async(achievementQueue.current[0]);
	};

	var show_alert_async = (achievement) => {
		setAlertAchievement(achievement);
		achievementAlert.classList.add("slide-in-out");
		jiggle_bookmark();
		setTimeout(() => {
			achievementAlert.classList.remove("slide-in-out");
			achievementQueue.current.shift();
			if (achievementQueue.current.length == 0) {
				isAnimatingBanner.current = false;
			} else {
				show_alert_async(achievementQueue.current[0]);
			}
		}, 2800);
	};

	return (
		<div id="achievements-container" onClick={() => animate_out()}>
			<span id="reward-anim">
				<b>
					<span id="reward-anim-text">100</span>
				</b>
			</span>
			<div id="achievement-alert">
				<img
					id="alert-img"
					src={window.location.origin + alertAchievement.image_path}
				/>
				<div id="alert-text">
					<div id="alert-title">
						<Markdown>__Achievement Unlocked__</Markdown>
					</div>
					<div id="alert-name">{alertAchievement.display_name}</div>
				</div>
			</div>
			<div className="bookmark-div" id="bookmark-div-1">
				<img
					id="bookmark-body"
					className="bookmark-img"
					src={bookmarkBody}
				/>
			</div>
			<div className="bookmark-div" id="bookmark-div-2">
				<img
					id="bookmark-ribbon"
					className="bookmark-img"
					src={bookmarkRibbon}
					onClick={() => animate_in()}
					onMouseEnter={() => jiggle_bookmark()}
				/>
			</div>
			<div id="achievements">
				<div id="spirals">
					{Array.from(Array(15), (e, i) => {
						return <img src={spiral} key={i} className="spiral" />;
					})}
				</div>
				<div id="achievement-grid">
					{achievements.map((a, i) => {
						return (
							<Achievement
								key={"achievement-" + i}
								achievement={a}
								toggleTooltip={toggleTooltip}
								claimAchievement={claimAchievement}
								claimButtonPressed={claimButtonPressed}
								emitEvent={emitEvent}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Achievements;
