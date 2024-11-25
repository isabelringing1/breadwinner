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
		busyStartTime,
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
	const [numNotifs, setNumNotifs] = useState(0);
	const [peekIn, setPeekIn] = useState(0);

	useEffect(() => {
		var count = achievements.filter(function (a) {
			return a.save.achieved && !a.save.claimed;
		}).length;
		setNumNotifs(count);
	}, [AchievementsObject]);

	useEffect(() => {
		var newAchievements = { ...AchievementsObject };
		for (var i = 0; i < events.length; i++) {
			var event = events[i];
			console.log("Listening to event ", event);
			switch (event.id) {
				case "total-conversions":
					var productivityAchievements =
						AchievementsObject["productivity"];
					// if we've reached third of 1st goal, show the bookmark for the first time.
					if (
						!productivityAchievements[0].save.revealed &&
						event.amount >= productivityAchievements[0].amount / 3
					) {
						newAchievements["productivity"][0].save.revealed = true;
						peek_in();
					}

					productivityAchievements.forEach((a, i) => {
						if (i < 3 && !a.save.achieved && a.amount != null) {
							newAchievements["productivity"][i].save.progress =
								event.amount;
							if (event.amount >= a.amount) {
								achieve("productivity", i, newAchievements);
							}
						}
					});

					var convertAchievement = AchievementsObject["misc"][1];
					convertAchievement.save.progress = event.value;
					if (event.value == convertAchievement.amount) {
						//Overload value to be the total times convert has been pressed
						achieve("misc", 1, newAchievements, false);
					} else if (event.value >= convertAchievement.amount / 4) {
						convertAchievement.save.revealed = true;
					}
					break;
				case "keys-unlocked":
					achieve("keys", 0, newAchievements);
					break;
				case "keys-converted":
					var keyAchievements = AchievementsObject["keys"].slice(1);
					console.log(keyAchievements);
					keyAchievements.forEach((a, i) => {
						newAchievements["keys"][i + 1].save.progress =
							event.amount;
						if (event.amount >= a.amount) {
							achieve("keys", i + 1, newAchievements);
						}
					});

					// Stretch 3
					newAchievements["stretch"][2].save.progress = event.amount;
					if (
						event.amount >= newAchievements["stretch"][2].amount &&
						!newAchievements["stretch"][2].save.epilogue
					) {
						achieve("stretch", 2, newAchievements, false);
					}
					break;
				case "oven-mid":
					newAchievements["unlocking"][0].save.revealed = true;
					break;
				case "oven-finished":
					achieve("unlocking", 0, newAchievements);
					break;
				case "bread-mid":
					newAchievements["unlocking"][2].save.revealed = true;
					break;
				case "bread-finished":
					achieve("unlocking", 2, newAchievements);
					break;
				case "supply-mid":
					newAchievements["unlocking"][1].save.revealed = true;
					break;
				case "supply-finished":
					achieve("unlocking", 1, newAchievements);
					break;
				case "bread-baked":
					var loafAchievements = AchievementsObject["loaves"];
					loafAchievements.forEach((a, i) => {
						newAchievements["loaves"][i].save.progress =
							event.amount;
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
						newAchievements["medals"][i].save.progress =
							event.amount;
						if (event.amount >= a.amount) {
							achieve("medals", i, newAchievements);
						}
					});

					// Stretch 2
					if (
						event.amount >= newAchievements["stretch"][1].amount &&
						!newAchievements["stretch"][1].save.epilogue
					) {
						achieve("stretch", 1, newAchievements, false);
					}
					break;
				case "daily-order-claim":
					var dailyOrderAchievements =
						AchievementsObject["daily_orders"];
					var [total, totalLastHour, totalLateNight] =
						parseDailyOrders(event.value);
					if (total == 1) {
						newAchievements["daily_orders"][0].save.revealed = true;
					}
					dailyOrderAchievements.forEach((a, i) => {
						if (a.id == "daily_order_1" && total >= a.amount) {
							achieve("daily_orders", i, newAchievements);
						} else if (
							a.id == "daily_order_2" &&
							totalLastHour >= a.amount
						) {
							achieve("daily_orders", i, newAchievements);
						} else if (
							a.id == "daily_order_3" &&
							totalLateNight >= a.amount
						) {
							achieve("daily_orders", i, newAchievements);
						}
					});

					// Stretch 1
					if (
						total >= newAchievements["stretch"][0].amount &&
						!newAchievements["stretch"][0].save.epilogue
					) {
						achieve("stretch", 0, newAchievements, false);
					}
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
				case "busy-reset":
					newAchievements["misc"][0].progress = "0m/60m";
					break;
				case "productivity":
					if (event.value == "stretch_4") {
						console.log(
							"achieving ",
							AchievementsObject["stretch"][3]
						);
						achieve("stretch", 3, newAchievements);
						claimAchievement(AchievementsObject["stretch"][3]);
						break;
					}
					var index = Number(event.value.slice(-1)) - 1;
					if (index >= 3 && index <= 5) {
						console.log(
							index,
							AchievementsObject["productivity"][index]
						);
						achieve("productivity", index, newAchievements);
						claimAchievement(
							AchievementsObject["productivity"][index]
						);
					} else if (index >= 6 && index <= 7) {
						if (
							event.amount <
							newAchievements["productivity"][index].amount
						) {
							newAchievements["productivity"][
								index
							].save.progress = event.amount;
						} else {
							achieve("productivity", index, newAchievements);
						}
					}
					break;
				case "reveal-epilogue":
					var achievements = AchievementsObject["stretch"];
					achievements.forEach((a, i) => {
						newAchievements["stretch"][i].save.epilogue = false;
						if (i != 5) {
							newAchievements["stretch"][i].save.revealed = true;
						}
					});
					break;
				case "stretch": //stretch 4, kickin it
					if (!newAchievements["stretch"][3].save.epilogue) {
						achieve("stretch", 3, newAchievements, false);
						claimAchievement(AchievementsObject["stretch"][3]);
					}
					break;
				case "banana-baked": //stretch 5
					if (
						event.amount >= newAchievements["stretch"][4].amount &&
						!newAchievements["stretch"][4].save.epilogue
					) {
						achieve("stretch", 4, newAchievements, false);
					}
					newAchievements["stretch"][4].save.progress = event.amount;
					break;
			}
		}
		updateBusyAchievement(newAchievements);
		setAchievementsObject(newAchievements);
	}, [events]);

	const achieve = (category, index, newAchievements, revealNext = true) => {
		console.log(newAchievements[category][index]);
		if (newAchievements[category][index].save.achieved) {
			return;
		}
		newAchievements[category][index].save.revealed = true;
		newAchievements[category][index].save.achieved = true;
		if (revealNext && newAchievements[category].length > index + 1) {
			newAchievements[category][index + 1].save.revealed = true;
		}
		queue_alert(newAchievements[category][index]);
		if (!peekIn) {
			peek_in();
		}
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
					category[i].save.claim_time = Date.now();
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
		reportAchievementClaimed(achievement, numAchievements);
	};

	const parseDailyOrders = (dailyOrders) => {
		var total = dailyOrders.length;
		var totalLastHour = 0;
		var totalLateNight = 0;
		dailyOrders.forEach((entry, i) => {
			var timeSinceGeneration = entry[1];
			console.log(
				"Time since generation for entry ",
				entry,
				" is ",
				timeSinceGeneration
			);
			// Check if generation was in the last 15 minutes of 24 hours
			if (
				timeSinceGeneration >= 85500000 &&
				timeSinceGeneration < 86400000
			) {
				totalLastHour += 1;
			} else if (
				timeSinceGeneration >= 64800000 &&
				timeSinceGeneration <= 68400000
			) {
				totalLateNight += 1;
			}
		});
		return [total, totalLastHour, totalLateNight];
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

	const updateBusyAchievement = (newAchievements) => {
		if (
			busyStartTime.current == 0 ||
			newAchievements["misc"][0].save.achieved
		) {
			return;
		}
		var duration = Date.now() - busyStartTime.current;

		if (duration >= 3600000) {
			achieve("misc", 0, newAchievements, false);
		}

		if (duration > 1200000 && !newAchievements["misc"][0].save.revealed) {
			// 20 minutes
			newAchievements["misc"][0].save.revealed = true;
		}
		var minutes = Math.floor(duration / 60000);
		if (minutes > 0) {
			newAchievements["misc"][0].progress = minutes + "m/60m";
		}
	};

	useEffect(() => {
		if (loaded && !AchievementsObject["productivity"][0].save.revealed) {
			document.getElementById("bookmark-div-1").style.transform =
				"translateY(20vh)";
			document.getElementById("bookmark-div-2").style.transform =
				"translateY(20vh)";
		}
	}, [loaded]);

	var peek_in = () => {
		if (peekIn) {
			return;
		}
		setPeekIn(true);
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
		setPeekIn(false);
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
		setPeekIn(true);
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
				<div id="bookmark-body" className="bookmark-img">
					{numNotifs > 0 ? (
						<div id="achievements-notif" className="bookmark-notif">
							{numNotifs}
						</div>
					) : null}
					<img className="bookmark-body-img" src={bookmarkBody} />
				</div>
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
