import { useState, useRef, useEffect } from "react";
import DailyOrderCard from "./DailyOrderCard";
import BCSymbol from "./BCSymbol";
import { shuffleArray, useInterval, msToTime, formatNumber } from "./Util";

import "./DailyOrder.css";

import doBookmark from "/images/do_bookmark.png";
import spiral from "/images/spiral.png";
import title from "/images/daily_order_title.png";

import card1 from "/images/postit1.png";
import card2 from "/images/postit2.png";
import card3 from "/images/postit3.png";
import timer from "/images/timer.png";

var cards = [card1, card2, card3];

const lowerBreadWeights = {
	white: 0.2,
	whole_wheat: 0.4,
	sourdough: 0.4,
};

const higherBreadWeights = {
	challah: 0.25,
	cinnamon_raisin: 0.35,
	pumpernickel: 0.25,
	potato: 0.1,
	brioche: 0.05,
};

function DailyOrder(props) {
	const {
		showDailyOrder,
		setShowDailyOrder,
		dailyOrderNextRefreshTime,
		setDailyOrderNextRefreshTime,
		dailyOrderArray,
		setDailyOrderArray,
		loaded,
		breadCoin,
		setBreadCoin,
		totalEarned,
		setTotalEarned,
		BreadObject,
		unlockEvent,
		emitEvent,
		totalDailyOrders,
		setTotalDailyOrders,
		totalTimelyDailyOrders,
		setTotalTimelyDailyOrders,
		timers,
		setTimers,
		timerUnit,
	} = props;

	const animating = useRef(false);
	const [timeLeft, setTimeLeft] = useState(0);
	const [claimState, setClaimState] = useState("unclaimable");

	// [Min, Max)
	const getRandomInt = (min, max) => {
		const minCeiled = Math.ceil(min);
		const maxFloored = Math.floor(max);
		return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
	};

	useEffect(() => {
		if (loaded) {
			updateDailyOrder();
			if (dailyOrderArray[0] == -1) {
				setClaimState("claimed");
			} else if (canClaim()) {
				setClaimState("claimable");
			}

			if (!dailyOrderUnlocked()) {
				document.getElementById("do-bookmark-div").style.transform =
					"translateY(20vh)";
			}
		}
	}, [loaded]);

	useEffect(() => {
		if (canClaim() && claimState == "unclaimable") {
			jiggle_bookmark();
			setClaimState("claimable");
		}
	}, [dailyOrderArray]);

	useEffect(() => {
		if (unlockEvent) {
			peek_in();
			updateDailyOrder();
		}
	}, [unlockEvent]);

	useInterval(() => {
		var t = dailyOrderNextRefreshTime - Date.now();
		setTimeLeft(t);
	}, 1000);

	const dailyOrderUnlocked = () => {
		return BreadObject["challah"].save.purchase_count > 0;
	};

	/* Daily orders refresh at 3 p.m. est */
	const updateDailyOrder = () => {
		if (!dailyOrderUnlocked()) {
			return;
		}
		var now = new Date();
		var refreshTimeToday = new Date().setHours(15, 0, 0, 0);
		var nextRefreshTime = dailyOrderNextRefreshTime;
		if (dailyOrderNextRefreshTime == null) {
			setDailyOrderArray(createNewDailyOrder());
			nextRefreshTime =
				new Date(refreshTimeToday) >= now
					? refreshTimeToday
					: refreshTimeToday + 86400000; //+24 hours
			setDailyOrderNextRefreshTime(nextRefreshTime);
		} else if (now >= new Date(dailyOrderNextRefreshTime)) {
			setDailyOrderArray(createNewDailyOrder());
			nextRefreshTime = dailyOrderNextRefreshTime + 86400000;
			setDailyOrderNextRefreshTime(nextRefreshTime);
		}
		var timeTilRefresh = nextRefreshTime - now.getTime();
		setTimeout(() => {
			updateDailyOrder();
		}, timeTilRefresh);
	};

	/* Daily Order Generation - 2 suborders
        1st bool determines whether or not reward has been claimed
        50% Chance to get Lower Bread suborder (lower tier loaf, higher count)
        50% Chance to get Higher bread suborder (higher tier loaf, lower count)
        50% chance to get 1 timer, 50% to get 2 timers
    */
	const createNewDailyOrder = () => {
		var order = [];
		shuffleArray(cards);
		var totalBcReward = 0;
		var totalTimerReward = 0;
		var lowerWeights = { ...lowerBreadWeights };
		var higherWeights = { ...higherBreadWeights };
		for (const [id, _] of Object.entries(lowerWeights)) {
			if (BreadObject[id].save.purchase_count == 0) {
				lowerWeights[id] = 0;
			}
		}
		for (const [id, _] of Object.entries(higherWeights)) {
			if (BreadObject[id].save.purchase_count == 0) {
				higherWeights[id] = 0;
			}
		}
		for (var i = 0; i < 2; i++) {
			var suborder =
				getRandomInt(0, 2) == 0
					? createSuborder(lowerWeights, 4, 10)
					: (suborder = createSuborder(higherWeights, 1, 3));
			suborder.push(cards[i]);
			totalBcReward += suborder[3];
			totalTimerReward += suborder[4];
			order.push(suborder);
		}
		//console.log("Order: ", order);
		order.unshift(totalTimerReward);
		order.unshift(totalBcReward);
		return order;
	};

	const createSuborder = (weights, min, max) => {
		var numLoaves = getRandomInt(min, max);
		var total_weight = 0;
		for (const [_, weight] of Object.entries(weights)) {
			total_weight += weight;
		}

		var roll = Math.random() * total_weight;
		var sum = 0;
		for (const [id, weight] of Object.entries(weights)) {
			sum += weight;
			if (sum >= roll) {
				weights[id] = 0;
				var bc_reward = Math.floor(
					BreadObject[id].save.cost * BreadObject[id].markup
				);
				var timer_reward = Math.ceil(
					(1000 * BreadObject[id].bake_time) / timerUnit / 2
				);
				return [id, numLoaves, 0, bc_reward, timer_reward];
			}
		}
		return null;
	};

	const canClaim = () => {
		if (!loaded || dailyOrderArray[0] == -1) {
			return false; // Has been claimed
		}
		for (var i = 2; i < dailyOrderArray.length; i++) {
			if (dailyOrderArray[i][2] < dailyOrderArray[i][1]) {
				return false;
			}
		}
		return true;
	};

	const tryClaimReward = (e) => {
		var newDailyOrderArray = [...dailyOrderArray];
		setBreadCoin(breadCoin + newDailyOrderArray[0]);
		setTimers(timers + newDailyOrderArray[1]);
		emitEvent("breadcoin-gain", newDailyOrderArray[0], null);
		setTotalEarned(totalEarned + newDailyOrderArray[0]);
		animateReward(newDailyOrderArray[0]);
		newDailyOrderArray[0] = -1;
		setDailyOrderArray(newDailyOrderArray);
		setClaimState("claimed");
		var timeSinceGeneration =
			Date.now() - (dailyOrderNextRefreshTime - 86400000);
		setTotalDailyOrders(totalDailyOrders + 1);
		var totalTimely = totalTimelyDailyOrders;
		console.log(timeSinceGeneration);
		if (timeSinceGeneration <= 3600000) {
			totalTimely += 1;
			setTotalTimelyDailyOrders(totalTimely);
		}
		emitEvent(
			"daily-order-claim",
			[totalDailyOrders + 1, totalTimely],
			null
		);
		e.stopPropagation();
	};

	var dailyOrderDiv = document.getElementById("daily-order");
	var dailyOrderContainer = document.getElementById("daily-order-container");
	var bookmarkDiv = document.getElementById("do-bookmark-div");
	var bookmarkBody = document.getElementById("do-bookmark-body");
	var achievementsContainer = document.getElementById(
		"achievements-container"
	);

	var animate_in = () => {
		if (animating.current || showDailyOrder) return;
		dailyOrderDiv.classList.add("do-bounce-in");
		bookmarkDiv.classList.add("do-bounce-in-bookmark");
		animating.current = true;
		dailyOrderContainer.style.pointerEvents = "auto";
		bookmarkBody.style.pointerEvents = "none";
		achievementsContainer.style.zIndex = 10;
		setTimeout(() => {
			dailyOrderDiv.classList.remove("do-bounce-in");
			bookmarkDiv.classList.remove("do-bounce-in-bookmark");
			dailyOrderDiv.style.transform = "translateY(0px)";
			bookmarkDiv.style.transform = "translateY(-82.8vh)";
			animating.current = false;
		}, 1000);
		setShowDailyOrder(true);
	};

	var animate_out = () => {
		if (animating.current || !showDailyOrder) return;
		dailyOrderDiv.classList.add("do-bounce-out");
		bookmarkDiv.classList.add("do-bounce-out-bookmark");
		animating.current = true;
		setTimeout(() => {
			bookmarkDiv.classList.remove("do-bounce-out-bookmark");
			dailyOrderDiv.classList.remove("do-bounce-out");
			dailyOrderDiv.style.transform = "translateY(100vh)";
			bookmarkDiv.style.transform = "translateY(0vh)";
			dailyOrderContainer.style.pointerEvents = "none";
			bookmarkBody.style.pointerEvents = "auto";
			animating.current = false;
			achievementsContainer.style.zIndex = 20;
		}, 1000);
		setShowDailyOrder(false);
	};

	var jiggle_bookmark = () => {
		if (animating.current || showDailyOrder) return;
		document
			.getElementById("do-bookmark-body")
			.classList.add("jiggle-bookmark");
		setTimeout(() => {
			document
				.getElementById("do-bookmark-body")
				.classList.remove("jiggle-bookmark");
		}, 250);
	};

	const animateReward = (amount) => {
		var num = document.getElementById("do-reward-anim");
		num.innerHTML = "+" + formatNumber(amount);
		var boundingBox = document
			.getElementById("daily-order-claim-button")
			.getBoundingClientRect();
		num.style.top = boundingBox.top - 40 + "px";
		num.classList.remove("float-up");
		void num.offsetWidth;
		num.classList.add("float-up");
	};

	var peek_in = () => {
		document
			.getElementById("do-bookmark-div")
			.classList.add("peek-in-bookmark");
		setTimeout(() => {
			document
				.getElementById("do-bookmark-div")
				.classList.remove("peek-in-bookmark");
			document.getElementById("do-bookmark-div").style.transform =
				"translateY(0vh)";
		}, 500);
	};
	return (
		<div id="daily-order-container" onClick={() => animate_out()}>
			<span id="do-reward-anim">100</span>

			<div id="do-bookmark-div">
				<img
					id="do-bookmark-body"
					className="bookmark-img"
					src={doBookmark}
					onClick={() => animate_in()}
					onMouseEnter={() => jiggle_bookmark()}
				/>
			</div>
			<div id="daily-order">
				<div id="do-spirals">
					{Array.from(Array(15), (e, i) => {
						return (
							<img src={spiral} key={i} className="do-spiral" />
						);
					})}
				</div>

				<div id="daily-order-content">
					<div id="daily-order-title">
						<img id="daily-order-title-img" src={title} />
					</div>
					<div id="daily-order-cards">
						{dailyOrderArray.map((order, i) => {
							if (i == 0 || i == 1) return null;
							return (
								<DailyOrderCard order={order} i={i} key={i} />
							);
						})}
					</div>

					{dailyOrderArray[0] == -1 ? (
						<div id="daily-order-reward-info">Reward: Claimed!</div>
					) : (
						<div id="daily-order-reward-info">
							Reward: <BCSymbol color="black" height={"3vh"} />
							{formatNumber(dailyOrderArray[0])} +{" "}
							{dailyOrderArray[1]}{" "}
							<img src={timer} id="daily-order-timer" />
						</div>
					)}
					<div id="daily-order-claim-button">
						<button
							className="do-button"
							disabled={!canClaim()}
							onClick={(e) => tryClaimReward(e)}
						>
							CLAIM
						</button>
					</div>
					<div id="daily-order-time-info">
						Refreshes in {msToTime(timeLeft, true, true)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default DailyOrder;
