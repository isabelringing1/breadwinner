import { useState, useRef, useEffect, useCallback } from "react";
import OrderCard from "./OrderCard";
import OrderContainer from "./OrderContainer";
import BCSymbol from "./BCSymbol";
import { shuffleArray, useInterval, msToTime, formatNumber } from "./Util";

import "./OrderBoard.css";

import doBookmark from "/images/do_bookmark.png";
import spiral from "/images/spiral.png";
import blue_tab from "/images/blue_tab.svg";
import purple_tab from "/images/purple_tab.svg";

import card1 from "/images/postit1.png";
import card2 from "/images/postit2.png";
import card3 from "/images/postit3.png";
import timer from "/images/timer.png";

var cards = [card1, card2, card3, card3]; //TODO: Make 4th post it

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

const normalBreadBounds = {
	white: [10, 25],
	whole_wheat: [7, 15],
	sourdough: [5, 10],
	challah: [5, 10],
	cinnamon_raisin: [5, 10],
	pumpernickel: [3, 8],
	potato: [2, 7],
	brioche: [1, 3],
};

const easyBreadBounds = {
	white: [5, 10],
	whole_wheat: [3, 8],
	sourdough: [2, 5],
	challah: [2, 5],
	cinnamon_raisin: [2, 5],
	pumpernickel: [2, 5],
	potato: [2, 5],
	brioche: [2, 5],
};

const ORDER_BOARD_REFRESH = 21600000;

function OrderBoard(props) {
	const {
		showDailyOrder,
		setShowDailyOrder,
		dailyOrderNextRefreshTime,
		setDailyOrderNextRefreshTime,
		orderBoardLastRefreshTime,
		setOrderBoardLastRefreshTime,
		dailyOrderObject,
		setDailyOrderObject,
		loaded,
		breadCoin,
		setBreadCoin,
		totalEarned,
		setTotalEarned,
		BreadObject,
		unlockEvent,
		emitEvent,
		emitEvents,
		totalDailyOrders,
		setTotalDailyOrders,
		timers,
		setTimers,
		timerUnit,
		orderBoardOrders,
		setOrderBoardOrders,
		reportDailyOrderFulfilled,
		reportOrderBoardOrderFulfilled,
		totalOrderBoardOrders,
		setTotalOrderBoardOrders,
	} = props;

	const animating = useRef(false);
	const refreshTimeout = useRef(null);
	const orderBoardOrdersRef = useRef(null);
	const orderBoardLastRefreshTimeRef = useRef(null);

	const [timeLeft, setTimeLeft] = useState(0);
	const [mode, setMode] = useState("daily-order");
	const [numNotifs, setNumNotifs] = useState(0);

	// [Min, Max)
	const getRandomInt = (min, max) => {
		const minCeiled = Math.ceil(min);
		const maxFloored = Math.floor(max);
		return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
	};

	useEffect(() => {
		orderBoardOrdersRef.current = orderBoardOrders;
	}, [orderBoardOrders]);

	useEffect(() => {
		orderBoardLastRefreshTimeRef.current = orderBoardLastRefreshTime;
	}, [orderBoardLastRefreshTime]);

	useEffect(() => {
		if (loaded) {
			updateDailyOrder();
			updateOrderBoardOrders();
			if (!dailyOrderUnlocked()) {
				document.getElementById("do-bookmark-div").style.transform =
					"translateY(20vh)";
			}
		}
	}, [loaded]);

	useEffect(() => {
		calculateNotifs(orderBoardOrders, dailyOrderObject);
	}, [dailyOrderObject, orderBoardOrders]);

	const calculateNotifs = (orderBoard, dailyOrders) => {
		console.log("Calculating notifs");
		if (orderBoard == null) {
			return;
		}
		var count = orderBoard.filter(function (order) {
			return canClaim(order) || !order.started;
		}).length;
		if (canClaim(dailyOrders)) {
			count++;
		}
		setNumNotifs(count);
	};

	useEffect(() => {
		// hack; if notif is changing and daily order screen isn't showing, we know an order has been filled
		if (!showDailyOrder) {
			jiggle_bookmark();
		}
	}, [numNotifs]);

	useEffect(() => {
		if (unlockEvent == "daily-order") {
			peek_in();
			updateDailyOrder(true);
		} else if (unlockEvent == "order-board") {
			initializeOrderBoard();
		}
	}, [unlockEvent]);

	useInterval(() => {
		var t = dailyOrderNextRefreshTime - Date.now();
		setTimeLeft(t);
	}, 1000);

	const dailyOrderUnlocked = () => {
		return BreadObject["challah"].save.purchase_count > 0;
	};

	const orderBoardUnlocked = () => {
		return BreadObject["pumpernickel"].save.purchase_count > 0;
	};

	/* Daily orders refresh at 9 a.m. */
	const updateDailyOrder = (easy_order = false) => {
		if (!dailyOrderUnlocked()) {
			return;
		}
		var now = new Date();
		var refreshTimeToday = new Date().setHours(9, 0, 0, 0);
		var nextRefreshTime = dailyOrderNextRefreshTime;
		console.log(
			"updating daily order: next refresh time is " + nextRefreshTime
		);
		if (
			dailyOrderNextRefreshTime == null ||
			dailyOrderNextRefreshTime == 0
		) {
			console.log("Creating new daily order");
			setDailyOrderObject(createNewDailyOrder(easy_order));
			nextRefreshTime =
				new Date(refreshTimeToday) >= now
					? refreshTimeToday
					: refreshTimeToday + 86400000; //+24 hours
			setDailyOrderNextRefreshTime(nextRefreshTime);
			console.log("setting next refresh time to " + nextRefreshTime);
		} else if (now >= new Date(dailyOrderNextRefreshTime)) {
			setDailyOrderObject(createNewDailyOrder());
			do {
				nextRefreshTime += 86400000;
			} while (now >= new Date(nextRefreshTime));

			setDailyOrderNextRefreshTime(nextRefreshTime);
		}
		var timeTilRefresh = nextRefreshTime - now.getTime();
		console.log("time until refresh: " + timeTilRefresh);
		if (timeTilRefresh >= 1) {
			setTimeout(() => {
				updateDailyOrder();
				emitEvent("daily-order-update", null, null);
			}, timeTilRefresh);
		}
	};

	const updateOrderBoardOrders = () => {
		if (!orderBoardUnlocked()) {
			return;
		}
		if (
			orderBoardLastRefreshTimeRef.current == 0 ||
			orderBoardLastRefreshTimeRef.current == null
		) {
			initializeOrderBoard();
			return;
		}

		var nextRefreshTimestamp =
			orderBoardLastRefreshTimeRef.current + ORDER_BOARD_REFRESH;
		var now = Date.now();
		var newOrderBoardOrders = orderBoardOrdersRef.current;
		if (now >= nextRefreshTimestamp) {
			while (
				now >= nextRefreshTimestamp &&
				newOrderBoardOrders.length < 3
			) {
				nextRefreshTimestamp += ORDER_BOARD_REFRESH;
				newOrderBoardOrders.push(createNewOrderBoardOrder());
			}
			setOrderBoardOrders(newOrderBoardOrders);
			setOrderBoardLastRefreshTime(Date.now());
			calculateNotifs(newOrderBoardOrders, dailyOrderObject);
			nextRefreshTimestamp = Date.now() + ORDER_BOARD_REFRESH;
		}

		var timeTilRefresh = nextRefreshTimestamp - now;
		console.log("new time til refresh: ", timeTilRefresh);
		if (newOrderBoardOrders.length < 3 && timeTilRefresh >= 1) {
			console.log("Setting timeout");
			refreshTimeout.current = setTimeout(() => {
				updateOrderBoardOrders();
			}, timeTilRefresh);
		} else if (
			newOrderBoardOrders.length == 3 &&
			refreshTimeout.current != null
		) {
			console.log("clearing timeout");
			clearTimeout(refreshTimeout.current);
			refreshTimeout.current = null;
		}
	};

	const prepBreadWeights = () => {
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
		return [lowerWeights, higherWeights];
	};

	/* Daily Order Generation - 2 suborders
        1st bool determines whether or not reward has been claimed
        50% Chance to get Lower Bread suborder (lower tier loaf, higher count)
        50% Chance to get Higher bread suborder (higher tier loaf, lower count)
    */
	const createNewDailyOrder = (easy_order) => {
		var order = {
			suborders: [],
		};
		shuffleArray(cards);
		var totalBcReward = 0;
		var totalTimerReward = 0;
		var bounds =
			easy_order || getRandomInt(0, 100) > 90
				? easyBreadBounds
				: normalBreadBounds;

		var [lowerWeights, higherWeights] = prepBreadWeights();
		for (var i = 0; i < 2; i++) {
			var suborder =
				getRandomInt(0, 2) == 0
					? createSuborder(lowerWeights, bounds)
					: createSuborder(higherWeights, bounds);
			if (i > 0 && suborder.id == order.suborders[0].id) {
				//same bread type
				i--;
				continue;
			}
			suborder.card = cards[i];
			totalBcReward += suborder.bc_reward;
			totalTimerReward += suborder.timer_reward;
			order.suborders.push(suborder);
		}
		totalTimerReward *= 3;
		totalBcReward *= 3;
		order.bc_reward = totalBcReward;
		order.timer_reward = totalTimerReward;
		order.started = true;
		console.log("Daily Order: ", order);
		return order;
	};

	const initializeOrderBoard = () => {
		var orders = [];
		for (var i = 0; i < 3; i++) {
			orders.push(createNewOrderBoardOrder());
		}
		setOrderBoardOrders(orders);
		setOrderBoardLastRefreshTime(Date.now());
	};

	const createNewOrderBoardOrder = () => {
		var order = {
			suborders: [],
		};
		shuffleArray(cards);
		var totalBcReward = 0;
		var totalTimerReward = 0;
		var [lowerWeights, higherWeights] = prepBreadWeights();
		var numSuborders = getRandomInt(2, 5);
		var bounds =
			getRandomInt(0, 100) > 90 ? easyBreadBounds : normalBreadBounds;
		for (var i = 0; i < numSuborders; i++) {
			var suborder =
				getRandomInt(0, 2) == 0
					? createSuborder(lowerWeights, bounds)
					: createSuborder(higherWeights, bounds);
			lowerWeights[suborder.id] = 0;
			higherWeights[suborder.id] = 0;
			suborder.card = cards[i];
			totalBcReward += suborder.bc_reward;
			totalTimerReward += suborder.timer_reward;
			order.suborders.push(suborder);
		}
		totalBcReward /= 2;
		order.bc_reward = Math.floor(totalBcReward);
		order.timer_reward = totalTimerReward;
		order.uiud = crypto.randomUUID();
		console.log("Order board: ", order);
		return order;
	};

	const createSuborder = (weights, boundsDict) => {
		var total_weight = 0;
		for (const [_, weight] of Object.entries(weights)) {
			total_weight += weight;
		}

		var roll = Math.random() * total_weight;
		var sum = 0;
		for (const [id, weight] of Object.entries(weights)) {
			sum += weight;
			if (sum >= roll) {
				var bc_reward = Math.floor(
					BreadObject[id].save.cost * BreadObject[id].markup
				);
				var timer_reward = Math.ceil(
					(1000 * BreadObject[id].bake_time) / timerUnit
				);
				var amount = getRandomInt(boundsDict[id][0], boundsDict[id][1]);
				return {
					id: id,
					amount: amount,
					bc_reward: bc_reward,
					timer_reward: timer_reward,
					counter: 0,
				};
			}
		}
		return null;
	};

	const canClaim = (order) => {
		if (!loaded || order.bc_reward == -1) {
			return false; // Has been claimed
		}
		for (var i = 0; i < order.suborders.length; i++) {
			if (order.suborders[i].counter < order.suborders[i].amount) {
				return false;
			}
		}
		return true;
	};

	const tryClaimDailyOrderReward = (e) => {
		var newDailyOrderObject = { ...dailyOrderObject };
		setBreadCoin(breadCoin + newDailyOrderObject.bc_reward);
		setTimers(timers + newDailyOrderObject.timer_reward);
		var breadcoinGainEvent = {
			id: "breadcoin-gain",
			amount: newDailyOrderObject.bc_reward,
		};
		var dailyOrderClaimEvent = {
			id: "daily-order-claim",
			value: totalDailyOrders,
		};
		emitEvents([breadcoinGainEvent, dailyOrderClaimEvent]);

		setTotalEarned(totalEarned + newDailyOrderObject.bc_reward);
		animateReward(newDailyOrderObject.bc_reward);
		newDailyOrderObject.bc_reward = -1;
		setDailyOrderObject(newDailyOrderObject);
		var timeSinceGeneration =
			Date.now() - (dailyOrderNextRefreshTime - 86400000);
		var newTotalDailyOrders = [];
		if (totalDailyOrders != null && totalDailyOrders != 0) {
			newTotalDailyOrders = [...totalDailyOrders];
		}
		newTotalDailyOrders.push([new Date(), timeSinceGeneration]);
		setTotalDailyOrders(newTotalDailyOrders);
		reportDailyOrderFulfilled(
			newTotalDailyOrders.length,
			timeSinceGeneration
		);

		// subtract the amount of bread from any other active orders that have this type
		var breadDict = {};
		newDailyOrderObject.suborders.forEach((suborder) => {
			breadDict[suborder.id] = suborder.amount;
		});

		var newOrderBoardOrders = [...orderBoardOrders];
		newOrderBoardOrders.forEach((o) => {
			if (o.started) {
				o.suborders.forEach((suborder) => {
					if (breadDict[suborder.id] > 0) {
						suborder.counter = Math.max(
							0,
							suborder.counter - breadDict[suborder.id]
						);
					}
				});
			}
		});
		setOrderBoardOrders(newOrderBoardOrders);

		confetti({
			particleCount: 150,
			spread: 340,
			startVelocity: 28,
			origin: {
				x: 0.5,
				y: 0.65,
			},
			ticks: 100,
		});
		e.stopPropagation();
	};

	const tryClaimOrderBoardReward = (e, order, i) => {
		setBreadCoin(breadCoin + order.bc_reward);
		setTimers(timers + order.timer_reward);
		var breadcoinGainEvent = {
			id: "breadcoin-gain",
			amount: order.bc_reward,
		};
		var orderBoardOrderClaimEvent = {
			id: "order-board-claim",
			value: totalOrderBoardOrders + 1,
		};
		emitEvents([breadcoinGainEvent, orderBoardOrderClaimEvent]);
		setTotalOrderBoardOrders(totalOrderBoardOrders + 1);
		reportOrderBoardOrderFulfilled(totalOrderBoardOrders + 1);
		setTotalEarned(totalEarned + order.bc_reward);
		animateReward(order.bc_reward, "order-board-button-" + i);
		if (orderBoardOrders.length == 3) {
			// need to kickstart timer
			setOrderBoardLastRefreshTime(Date.now());
		}
		const newOrderBoardOrders = orderBoardOrders.filter(
			(o) => o.uiud !== order.uiud
		);

		// subtract the amount of bread from any other active orders that have this type
		var breadDict = {};
		order.suborders.forEach((suborder) => {
			breadDict[suborder.id] = suborder.amount;
		});

		newOrderBoardOrders.forEach((o) => {
			if (o.started) {
				o.suborders.forEach((suborder) => {
					if (breadDict[suborder.id] > 0) {
						suborder.counter = Math.max(
							0,
							suborder.counter - breadDict[suborder.id]
						);
					}
				});
			}
		});
		var newDailyOrderObject = { ...dailyOrderObject };
		if (newDailyOrderObject.bc_reward != -1) {
			newDailyOrderObject.suborders.forEach((suborder) => {
				if (breadDict[suborder.id] > 0) {
					suborder.counter = Math.max(
						0,
						suborder.counter - breadDict[suborder.id]
					);
				}
			});
		}

		setOrderBoardOrders(newOrderBoardOrders);
		setDailyOrderObject(newDailyOrderObject);
		if (refreshTimeout.current == null) {
			refreshTimeout.current = setTimeout(() => {
				console.log("updating order board orders");
				updateOrderBoardOrders();
				emitEvent("order-board-update", null, null);
			}, ORDER_BOARD_REFRESH);
		}

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
		e.stopPropagation();
	};

	const tryStartOrderBoardOrder = (e, order) => {
		var newOrderBoardOrders = [...orderBoardOrders];
		for (var i = 0; i < newOrderBoardOrders.length; i++) {
			if (newOrderBoardOrders[i].uiud == order.uiud) {
				newOrderBoardOrders[i].started = true;
			}
		}
		setOrderBoardOrders(newOrderBoardOrders);
		e.stopPropagation();
	};

	const toggleMode = (e, newMode) => {
		if (mode != newMode) {
			setMode(newMode);
		}
		e.stopPropagation();
	};

	var orderContainerDiv = document.getElementById("order-container");
	var dailyOrderContainer = document.getElementById("daily-order-container");
	var bookmarkDiv = document.getElementById("do-bookmark-div");
	var bookmarkBody = document.getElementById("do-bookmark-body");
	var version = document.getElementById("version");
	var achievementsContainer = document.getElementById(
		"achievements-container"
	);

	var animate_in = () => {
		if (animating.current || showDailyOrder) return;
		orderContainerDiv.classList.add("do-bounce-in");
		bookmarkDiv.classList.add("do-bounce-in-bookmark");
		animating.current = true;
		dailyOrderContainer.style.pointerEvents = "auto";
		bookmarkBody.style.pointerEvents = "none";
		achievementsContainer.style.zIndex = 10;
		version.style.zIndex = 10;
		setTimeout(() => {
			orderContainerDiv.classList.remove("do-bounce-in");
			bookmarkDiv.classList.remove("do-bounce-in-bookmark");
			orderContainerDiv.style.transform = "translateY(0px)";
			bookmarkDiv.style.transform = "translateY(-82.8vh)";
			animating.current = false;
		}, 1000);
		setShowDailyOrder(true);
	};

	var animate_out = () => {
		if (animating.current || !showDailyOrder) return;
		orderContainerDiv.classList.add("do-bounce-out");
		bookmarkDiv.classList.add("do-bounce-out-bookmark");
		animating.current = true;
		setTimeout(() => {
			bookmarkDiv.classList.remove("do-bounce-out-bookmark");
			orderContainerDiv.classList.remove("do-bounce-out");
			orderContainerDiv.style.transform = "translateY(100vh)";
			bookmarkDiv.style.transform = "translateY(0vh)";
			dailyOrderContainer.style.pointerEvents = "none";
			bookmarkBody.style.pointerEvents = "auto";
			animating.current = false;
			achievementsContainer.style.zIndex = 20;
			version.style.zIndex = 22;
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

	const animateReward = (amount, buttonId = "daily-order-claim-button") => {
		var num = document.getElementById("do-reward-anim");
		num.innerHTML = "+" + formatNumber(amount);
		var boundingBox = document
			.getElementById(buttonId)
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

	var bgColor = mode == "daily-order" ? "#94E5FF" : "#DEA2FF";
	return (
		<div id="daily-order-container" onClick={() => animate_out()}>
			<span id="do-reward-anim">100</span>

			<div id="do-bookmark-div">
				<div
					id="do-bookmark-body"
					className="bookmark-img"
					onClick={() => animate_in()}
					onMouseEnter={() => jiggle_bookmark()}
				>
					{numNotifs > 0 ? (
						<div id="orders-notif" className="bookmark-notif">
							{numNotifs}
						</div>
					) : null}
					<img className="bookmark-body-img" src={doBookmark} />
				</div>
			</div>

			<div id="order-container" style={{ backgroundColor: bgColor }}>
				{orderBoardUnlocked() ? (
					<div id="order-tabs">
						<img
							src={blue_tab}
							id="daily-order-tab"
							className="tab"
							onClick={(e) => {
								toggleMode(e, "daily-order");
							}}
						/>
						<img
							src={purple_tab}
							id="order-board-tab"
							className="tab"
							onClick={(e) => {
								toggleMode(e, "order-board");
							}}
						/>
					</div>
				) : null}

				<div id="do-spirals">
					{Array.from(Array(15), (e, i) => {
						return (
							<img src={spiral} key={i} className="do-spiral" />
						);
					})}
				</div>
				{mode == "daily-order" ? (
					<div id="daily-order">
						<div id="daily-order-content">
							<div id="daily-order-title">Daily Order</div>
							<div id="daily-order-cards">
								{dailyOrderObject.suborders.map((order, i) => {
									return (
										<OrderCard
											order={order}
											i={i}
											key={i}
											mode="daily-order"
										/>
									);
								})}
							</div>

							{dailyOrderObject.bc_reward == -1 ? (
								<div id="daily-order-reward-info">
									Reward: Claimed!
								</div>
							) : (
								<div id="daily-order-reward-info">
									Reward:{" "}
									<BCSymbol color="black" height={"3vh"} />
									{formatNumber(
										dailyOrderObject.bc_reward
									)} + {dailyOrderObject.timer_reward}{" "}
									<img src={timer} id="daily-order-timer" />
								</div>
							)}
							<div id="daily-order-claim-button">
								<button
									className="do-button"
									disabled={!canClaim(dailyOrderObject)}
									onClick={(e) => tryClaimDailyOrderReward(e)}
								>
									CLAIM
								</button>
							</div>
							<div id="daily-order-time-info">
								Refreshes in {msToTime(timeLeft, true, true)}
							</div>
						</div>
					</div>
				) : (
					<div id="order-board">
						<div id="order-board-header">
							<div id="order-board-title">Order Board</div>
							{orderBoardOrders.length < 3 ? (
								<div id="order-board-subtitle">
									New Order in{" "}
									{msToTime(
										orderBoardLastRefreshTime +
											ORDER_BOARD_REFRESH -
											Date.now(),
										true,
										true
									)}
								</div>
							) : null}
						</div>

						<div id="order-board-orders">
							{orderBoardOrders.map((order, i) => {
								return (
									<OrderContainer
										key={i}
										order={order}
										canClaim={canClaim}
										tryClaimReward={
											tryClaimOrderBoardReward
										}
										tryStartOrder={tryStartOrderBoardOrder}
									/>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default OrderBoard;
