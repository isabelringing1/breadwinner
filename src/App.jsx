import { useState, useEffect, useRef } from "react";
import { saveData, loadData } from "../public/account";
import { setClicksCheat, setKeysCheat } from "../public/debug";
import { ErrorBoundary } from "react-error-boundary";
import {
	reportLoafBought,
	reportSupplyBought,
	reportLoafSold,
	reportTimerUsed,
	reportEnvelopeAnswer,
	reportTrialMode,
	reportExtensionAcquired,
	reportDailyOrderFulfilled,
	reportOrderBoardOrderFulfilled,
	reportEnvelopeCompleted,
	reportFAQOpened,
} from "../public/analytics";
import {
	requestClickCount,
	registerForMessages,
	spendClicks,
	broadcastBc,
	requestKeyCount,
	spendKeys,
	unlockKeys,
	lockKeys,
} from "../public/extension";
import { formatNumber, formatPercent, msToTime } from "./Util";

import Debug from "./Debug";
import Tooltip from "./Tooltip";
import CardList from "./CardList";
import Wallet from "./Wallet";
import Oven from "./Oven";
import BCSymbol from "./BCSymbol";
import BlockingScreen from "./BlockingScreen";
import InfoScreen from "./InfoScreen";
import FloatingText from "./FloatingText";
import SpeechBubble from "./SpeechBubble";
import Achievements from "./Achievements";
import OrderBoard from "./OrderBoard";
import Envelope from "./Envelope";
import ErrorScreen from "./ErrorScreen";

import tile from "/images/tile.png";
import shadow from "/images/shadow.png";
import dough_logo from "/images/dough-logo.png";
import dough_logo_2 from "/images/dough-logo-2.png";
import heart_logo from "/images/heart-logo.png";

import "./App.css";

import breadJson from "./config/bread.json";
import suppliesJson from "./config/supplies.json";
import messagesJson from "./config/messages.json";
import achievementsJson from "./config/achievements.json";
import clickAchievementsJson from "./config/click_achievements.json";
import EndGameController from "./EndGameController";

const timer_unit = 60000;

function App() {
	const [playerId, setPlayerId] = useState(null);
	const [playerStartTime, setPlayerStartTime] = useState(null);
	const [loaded, setLoaded] = useState(false);
	const [clicks, setClicks] = useState(null);
	const [keys, setKeys] = useState(null);
	const [keyUnlocked, setKeyUnlocked] = useState(false);
	const [multiplier, setMultiplier] = useState(1);
	const [breadCoin, setBreadCoin] = useState(0);
	const [SupplyObject, setSupplyObject] = useState(suppliesJson);
	const [BreadObject, setBreadObject] = useState(breadJson);
	const [OvenQueue, setOvenQueue] = useState([null, null, null, null]);
	const [showTooltip, setShowTooltip] = useState(false);
	const [tooltipPos, setTooltipPos] = useState([0, 0]);
	const [totalSpent, setTotalSpent] = useState(0);
	const [totalEarned, setTotalEarned] = useState(0);
	const [totalClicks, setTotalClicks] = useState(0);
	const [totalKeys, setTotalKeys] = useState(0);
	const [floatingText, setFloatingText] = useState("");
	const [floatingTextPos, setFloatingTextPos] = useState("");
	const [speechBubbleText, setSpeechBubbleText] = useState("");
	const [speechBubbleDuration, setSpeechBubbleDuration] = useState(1200);
	const [speechBubbleCount, setSpeechBubbleCount] = useState(0);
	const [extensionDetected, setExtensionDetected] = useState(false);
	const [visited, setVisited] = useState(false);
	const [blockingCategory, setBlockingCategory] = useState(null);
	const [showInfo, setShowInfo] = useState(false);
	const [infoScreenTitle, setInfoScreenTitle] = useState("");
	const [infoScreenBody, setInfoScreenBody] = useState("");
	const [infoScreenConfirmOverrideText, setInfoScreenConfirmOverrideText] =
		useState(null);
	const [breadBaked, setBreadBaked] = useState(0);
	const [showAchievements, setShowAchievements] = useState(false);
	const [AchievementsObject, setAchievementsObject] =
		useState(achievementsJson);
	const [showDailyOrder, setShowDailyOrder] = useState(false);
	const [events, setEvents] = useState([]);
	const [dailyOrderNextRefreshTime, setDailyOrderNextRefreshTime] =
		useState(null);
	const [dailyOrderObject, setDailyOrderObject] = useState({ suborders: [] });
	const [dailyOrderEvent, setDailyOrderEvent] = useState(null);
	const [totalDailyOrders, setTotalDailyOrders] = useState([]);
	const [totalTimelyDailyOrders, setTotalTimelyDailyOrders] = useState(0);
	const [convertPresses, setConvertPresses] = useState(0);
	const [allLoavesDone, setAllLoavesDone] = useState(false);
	const [inSellAllSequence, setInSellAllSequence] = useState(false);
	const [showEnvelope, setShowEnvelope] = useState(false);
	const [timers, setTimers] = useState(0);
	const [timersUnlocked, setTimersUnlocked] = useState(false);
	const [tooltipContentArray, setTooltipContentArray] = useState([]);
	const [envelopeUnlocks, setEnvelopeUnlocks] = useState([]);
	const [useTimerMode, setUseTimerMode] = useState(false);
	const [timerButtonHovered, setTimerButtonHovered] = useState(false);
	const [storyState, setStoryState] = useState(0); //start
	const [inTrialMode, setInTrialMode] = useState(false);
	const [orderBoardOrders, setOrderBoardOrders] = useState([]);
	const [orderBoardLastRefreshTime, setOrderBoardLastRefreshTime] =
		useState(null);
	const [isMobile, setIsMobile] = useState(false);
	const [totalOrderBoardOrders, setTotalOrderBoardOrders] = useState(0);
	const [debugEnvelope, setDebugEnvelope] = useState(null);
	const [datingScore, setDatingScore] = useState([0, 0]); //curr points, total points
	const [endingEnvelopeOrder, setEndingEnvelopeOrder] = useState(null);
	const [spedUpLoafClicks, setSpedUpLoafClicks] = useState(0);

	const onInfoScreenButtonPressed = useRef(null);
	const onAchievementClaimButtonPressed = useRef(null);
	const trialModeJiggleInterval = useRef(null);
	const idleTimeout = useRef(null);
	const busyStartTime = useRef(0);
	const glitchStop = useRef(null);
	const clickMessages = useRef(null);

	const convertForSave = () => {
		var player = {
			playerId: playerId,
			clicks: clicks, // only used in trial mode
			keys: keys, // only used in trial mode
			multiplier: multiplier ?? 1.0,
			bread_coin: breadCoin ?? 0,
			supplies_object: getSave(SupplyObject),
			bread_object: getSave(BreadObject),
			achievements_object: getSaveAchievements(AchievementsObject),
			oven_queue: OvenQueue,
			total_spent: totalSpent,
			total_earned: totalEarned,
			total_clicks: totalClicks,
			total_keys: totalKeys,
			key_unlocked: keyUnlocked,
			bread_baked: breadBaked,
			daily_order_next_refresh_time: dailyOrderNextRefreshTime,
			order_board_last_refresh_time: orderBoardLastRefreshTime,
			daily_order: dailyOrderObject,
			total_daily_orders: totalDailyOrders,
			total_timely_daily_orders: totalTimelyDailyOrders,
			convert_presses: convertPresses,
			timers: timers,
			timers_unlocked: timersUnlocked,
			envelope_unlocks: envelopeUnlocks,
			story_state: storyState,
			start_time: playerStartTime,
			in_trial_mode: inTrialMode,
			order_board: orderBoardOrders,
			total_order_board_orders: totalOrderBoardOrders,
			dating_score: datingScore,
			ending_envelope_order: endingEnvelopeOrder,
			sped_up_loaf_clicks: spedUpLoafClicks,
		};
		return player;
	};

	const getSave = (obj) => {
		var saveObj = {};
		for (const [key, value] of Object.entries(obj)) {
			saveObj[key] = value.save;
		}
		return saveObj;
	};

	const getSaveAchievements = (obj) => {
		var saveObj = {};
		for (const [categoryName, array] of Object.entries(obj)) {
			var achievements = [];
			for (var i in array) {
				achievements.push(array[i].save);
			}
			saveObj[categoryName] = achievements;
		}
		return saveObj;
	};

	const reset = () => {
		lockKeys();
		localStorage.clear();
		location.reload();
	};

	const isSupplyPurchased = (id) => {
		return SupplyObject[id].save.purchased;
	};

	const shouldShowBread = (id) => {
		var bread = BreadObject[id];
		if (totalEarned == 0 || bread == null) {
			return false;
		}

		if (id == "white") {
			return true;
		}
		if (
			!bread.save.unlocked &&
			BreadObject[bread.previous].save.purchase_count > 0
		) {
			bread.save.unlocked = true;
		}
		return bread.save.unlocked;
	};

	const isBreadDisabled = (id) => {
		return BreadObject[id].save.cost > breadCoin;
	};

	const shouldShowSupply = (id) => {
		if (totalSpent == 0) {
			return false;
		}

		var supply = SupplyObject[id];
		if (id == "mixing_bowl") {
			return !isSupplyPurchased(id);
		} else if (id == "secret_spread") {
			return (
				BreadObject["sourdough"].save.purchase_count > 0 &&
				!isSupplyPurchased(id)
			);
		} else if (supply.oven_increase) {
			var index = parseInt(supply.id.split("_").at(-1));
			if (index > 1) {
				if (!SupplyObject["oven_slot_" + (index - 1)].save.purchased) {
					return false;
				} else {
					supply.save.unlocked = true;
				}
			}
			if (!supply.save.unlocked && breadCoin >= supply.cost * 0.5) {
				supply.save.unlocked = true;
			}
		} else if (
			!supply.save.unlocked &&
			isSupplyPurchased(supply.previous)
		) {
			supply.save.unlocked = true;
		}

		return supply.save.unlocked && !isSupplyPurchased(id);
	};

	const isSupplyDisabled = (id) => {
		return SupplyObject[id].cost > breadCoin;
	};

	const TryBuyBread = (id, mousePos) => {
		setInSellAllSequence(false);
		var bread = BreadObject[id];
		var nextOpen = -1;
		for (var i = 0; i < OvenQueue.length; i++) {
			if (OvenQueue[i] == null) {
				nextOpen = i;
				break;
			}
		}
		if (nextOpen == -1) {
			setFloatingText("Oven full!");
			setFloatingTextPos(mousePos);
			return false;
		} else if (!bread || bread.save.cost > breadCoin) {
			return false;
		}
		var eventsToEmit = [];
		var now = Date.now();
		var markup = getMarkup(bread);
		var loaf = {
			id: id,
			purchase_count: bread.save.purchase_count,
			display_name: bread.display_name,
			starting_color: bread.starting_color ?? "#FFE7B7",
			ending_color: bread.ending_color ?? "#BB7F0A",
			start_time: now,
			end_time: now + bread.bake_time * 1000,
			sell_value: Math.floor(bread.save.cost * markup),
			index: nextOpen,
		};
		var newOvenQueue = [
			...OvenQueue.slice(0, nextOpen),
			loaf,
			...OvenQueue.slice(nextOpen + 1),
		];
		setOvenQueue(newOvenQueue);

		var newBread = { ...BreadObject };
		newBread[id].save.purchase_count++;
		newBread[id].save.markup = getMarkup(newBread[id]);
		spendBreadCoin(bread.save.cost);
		setTotalSpent(totalSpent + bread.save.cost);
		newBread[id].save.cost = Math.floor(
			newBread[id].save.cost * bread.increase_rate
		);
		setBreadObject(newBread);
		updateBreadTooltip(newBread[id]);
		setBreadBaked(breadBaked + 1);
		eventsToEmit.push({
			id: "bread-baked",
			amount: breadBaked + 1,
		});
		if (id == "banana") {
			if (newBread[id].save.purchase_count == 1) {
				eventsToEmit.push({
					id: "bread-finished",
				});
			}
		}
		if (breadBaked == 5) {
			//6th loaf of bread
			unlockEnvelope("timer");
		}
		eventsToEmit = checkForPercentNextLoaf(newBread, eventsToEmit);
		if (newBread[id].save.purchase_count == 1) {
			var event = null;
			if (id == "challah") {
				event = "unlock-daily-order";
			} else if (id == "cinnamon_raisin") {
				eventsToEmit.push({
					id: "bread-mid",
				});
				event = "unlock-order-board";
			} else if (id == "banana") {
				event = "reveal-epilogue";
			}
			eventsToEmit.push({
				id: "first-baked",
				value: id,
			});
			unlockEnvelope(id, event);
		}
		if (eventsToEmit.length > 0) {
			emitEvents(eventsToEmit);
		}
		reportLoafBought(loaf, breadBaked + 1, newOvenQueue.length, playerId);
	};

	const getMarkup = (bread) => {
		if (bread.save.cost < bread.starting_cost * 100) {
			return bread.starting_markup;
		}
		var breadCutoff = Math.log(100) / Math.log(bread.increase_rate);
		console.log("calculated bread cutoff as ", breadCutoff);
		return Math.max(
			bread.minimum_markup,
			bread.starting_markup -
				(bread.save.purchase_count - breadCutoff) * 0.0005
		);
	};

	const TryBuySupply = (id, mousePos) => {
		setInSellAllSequence(false);
		var eventsToEmit = [];
		var supply = SupplyObject[id];
		if (!supply || supply.cost > breadCoin) {
			return false;
		}

		var ovenSize = OvenQueue.length;
		spendBreadCoin(supply.cost);
		setTotalSpent(totalSpent + supply.cost);
		var newSupply = { ...SupplyObject };
		newSupply[id].save.purchased = true;
		setSupplyObject(newSupply);
		if (supply.keys) {
			setKeyUnlocked(true);
			eventsToEmit.push({
				id: "keys-unlocked",
			});
			unlockKeys();
			if (inTrialMode) {
				setKeys(0);
			}
		} else if (supply.multiplier) {
			setMultiplier(multiplier * supply.multiplier);
			setSpeechBubble("MULTIPLIER");
		} else if (supply.oven_increase) {
			var newOvenQueue = [...OvenQueue, null];
			ovenSize++;
			setOvenQueue(newOvenQueue);
			if (newOvenQueue.length % 4 == 1) {
				setSpeechBubble("OVEN-ROW");
			}
			var allOvenSlotsPurchased = Object.entries(newSupply).every(
				(item) => {
					return (
						item[1].oven_increase == null || item[1].save.purchased
					);
				}
			);
			if (allOvenSlotsPurchased) {
				eventsToEmit.push({
					id: "oven-finished",
				});
			}
			if (ovenSize >= 5) {
				eventsToEmit.push({
					id: "oven-mid",
				});
			}
		}
		var allPurchased = Object.entries(newSupply).filter((item) => {
			return item[1].save.purchased;
		});
		if (allPurchased.length == Object.entries(newSupply).length) {
			eventsToEmit.push({
				id: "supply-finished",
			});
		} else if (allPurchased.length >= 2) {
			eventsToEmit.push({
				id: "supply-mid",
			});
		}
		if (id == "secret_spread") {
			unlockEnvelope("secret_spread");
		}
		if (eventsToEmit.length > 0) {
			emitEvents(eventsToEmit);
		}
		reportSupplyBought(supply, breadBaked + 1, ovenSize, playerId);
	};

	const convertClicksToBreadCoin = () => {
		setInSellAllSequence(false);
		var earnedCoin = Math.round(clicks * getTotalMultiplier());
		broadcastBc(breadCoin + earnedCoin);
		setBreadCoin(breadCoin + earnedCoin);
		setTotalEarned(totalEarned + earnedCoin);
		animateGainOrLoss(earnedCoin);
		setTotalClicks(totalClicks + clicks);
		setConvertPresses(convertPresses + 1);
		var conversionEvent = {
			id: "total-conversions",
			amount: totalClicks + clicks,
			value: convertPresses + 1,
		};
		var breadCoinEvent = {
			id: "breadcoin-gain",
			value: earnedCoin,
		};
		emitEvents([conversionEvent, breadCoinEvent]);

		if (inTrialMode) {
			setClicks(0);
		} else {
			spendClicks(clicks);
		}
		setSpeechBubble("CLICK");
	};

	const spendBreadCoin = (amount) => {
		broadcastBc(breadCoin - amount);
		setBreadCoin(breadCoin - amount);
		animateGainOrLoss(-amount);
	};

	const convertKeysToMultiplier = () => {
		setInSellAllSequence(false);
		//setMultiplier(multiplier + keys * 0.0001);
		if (inTrialMode) {
			setKeys(0);
		} else {
			spendKeys(keys);
		}
		setTotalKeys(totalKeys + keys);
		emitEvent("keys-converted", null, totalKeys + keys);
	};

	const getTotalMultiplier = () => {
		return multiplier + totalKeys * 0.0001;
	};

	// Does stuff to set the default tooltip
	const setupTooltip = (show, mousePos = [0, 0]) => {
		setTooltipContentArray([]);
		setShowTooltip(show);
		setTooltipPos(show ? mousePos : [0, 0]);
	};

	const toggleTooltip = (show, item = null, mousePos = [0, 0]) => {
		setupTooltip(show, mousePos);
		if (item != null) {
			setTooltipContentArray([item.desc]);
		}
	};

	const toggleBreadTooltip = (show, item = null, mousePos = [0, 0]) => {
		setupTooltip(show, mousePos);
		if (item != null) {
			updateBreadTooltip(item);
		}
	};

	const updateBreadTooltip = (item) => {
		var sell_price = Math.floor(item.save.cost * item.save.markup);
		var times = item.save.purchase_count == 1 ? " time." : " times.";
		var text1 =
			item.desc +
			"\nSells for " +
			formatPercent(item.save.markup, 0) +
			" of the original price (";
		var text2 =
			formatNumber(sell_price) +
			").\nYou've baked this " +
			formatNumber(item.save.purchase_count) +
			times;
		setTooltipContentArray([text1, "[BC]", text2]);
	};

	const toggleLoafTooltip = (
		show,
		item = null,
		mousePos = [0, 0],
		percent_done = -1,
		timerCost = 0
	) => {
		setupTooltip(show, mousePos);
		if (item != null) {
			updateLoafTooltip(item, percent_done, timerCost);
		}
	};

	const updateLoafTooltip = (item, percent_done, timerCost) => {
		var progress_text = Math.floor(percent_done * 100) + "% done";
		if (percent_done >= 1) {
			progress_text = "Ready!";
		}

		var tooltipArray = [];
		var text1 = item.display_name + " - " + progress_text + "\nSells for  ";
		tooltipArray.push(text1);
		tooltipArray.push("[BC]");
		var text2 = formatNumber(item.sell_value);
		tooltipArray.push(text2);

		if (percent_done < 1 && timersUnlocked) {
			tooltipArray.push("\n");
			if (timers < timerCost) {
				tooltipArray.push("[gray]Speed up for " + timerCost);
				tooltipArray.push("[bw timer]");
			} else {
				tooltipArray.push("Speed up for " + timerCost);
				tooltipArray.push("[timer]");
			}
		}

		setTooltipContentArray(tooltipArray);
	};

	const toggleConvertClicksTooltip = (show, mousePos = [0, 0]) => {
		setupTooltip(show, mousePos);
		if (show) {
			var text1 = "Convert for +";
			var text2 = formatNumber(Math.round(clicks * getTotalMultiplier()));
			setTooltipContentArray([text1, "[BC]", text2]);
		}
	};

	const toggleConvertKeysTooltip = (show, mousePos = [0, 0]) => {
		setupTooltip(show, mousePos);
		if (show) {
			var text =
				"Increase your multiplier by tiny amount with every key. Convert for +" +
				keys * 0.0001 +
				".";
			setTooltipContentArray([text]);
		}
	};

	const toggleAchievementsTooltip = (
		show,
		mousePos = [0, 0],
		achievement = null
	) => {
		setupTooltip(show, mousePos);
		if (show) {
			if (!achievement.save.revealed) {
				setTooltipContentArray(["???"]);
				return;
			}

			if (achievement.save.claimed) {
				var tooltipArray = [];
				var text1 =
					"**" + achievement.display_name + "**\n" + achievement.desc;
				if (achievement.quip) {
					text1 += "\n_" + achievement.quip + "_";
				}
				tooltipArray.push(text1);

				if (achievement.desc_after) {
					text2 = achievement.desc_after;
					tooltipArray.push(" ");
					tooltipArray.push("[BC]");
					tooltipArray.push(text2);
				}
				setTooltipContentArray(tooltipArray);
				return;
			}

			var tooltipArray = [];
			var text1 =
				"**" + achievement.display_name + "**\n" + achievement.desc;
			tooltipArray.push(text1);

			if (achievement.desc_after) {
				var text2 = achievement.desc_after + "\nReward: ";
				tooltipArray.push(" ");
				tooltipArray.push("[BC]");
				tooltipArray.push(text2);
			} else {
				tooltipArray.push("\nReward: ");
			}
			tooltipArray.push("[BC]");
			tooltipArray.push(formatNumber(achievement.reward));

			if (achievement.timers) {
				tooltipArray.push(" + " + formatNumber(achievement.timers));
				tooltipArray.push("[timer]");
			}

			if (achievement.save.achieved) {
				tooltipArray.push("\nClick to claim!");
			} else if (achievement.save.revealed) {
				if (achievement.save.progress != null) {
					if (achievement.timer) {
						if (achievement.save.progress > 0) {
							tooltipArray.push(
								"\nTime Remaining: " +
									msToTime(
										(achievement.timer -
											achievement.save.progress) *
											1000,
										true
									)
							);
						}
					} else if (typeof achievement.save.progress === "number") {
						tooltipArray.push(
							"\nProgress: " +
								formatNumber(achievement.save.progress) +
								"/" +
								formatNumber(achievement.amount)
						);
					}
				}
			}

			// Add click achievement flavor text, if exists
			if (!achievement.save.achieved && achievement.click) {
				var messages = clickMessages.current[achievement.id];
				if (
					achievement.save.progress != null &&
					!isNaN(achievement.save.progress) &&
					messages[achievement.save.progress]
				) {
					tooltipArray.push("\n");
					tooltipArray.push(
						"*" + messages[achievement.save.progress] + "*"
					);
				}
			}

			if (
				achievement.manual &&
				!achievement.save.claimed &&
				achievement.save.revealed
			) {
				onAchievementClaimButtonPressed.current = () => {
					showAchievementInfoDialog(achievement);
				};
				tooltipArray.push("\nClick to complete now!");
			}
			setTooltipContentArray(tooltipArray);
		}
	};

	const toggleTimerInfoTooltip = (
		show,
		mousePos = [0, 0],
		canUseTimers = false
	) => {
		setupTooltip(show, mousePos);
		if (show) {
			var text = "Spend timers to finish a baking loaf instantly!\n";
			if (canUseTimers) {
				text += "Click to use.";
			}
			setTooltipContentArray([text]);
		}
	};

	const toggleBCTooltip = (show, mousePos = [0, 0]) => {
		show = show && breadCoin > 1000000000;
		setupTooltip(show, mousePos);
		var formatted = formatNumber(breadCoin, false, false);
		setTooltipContentArray(["[BC]", formatted]);
	};

	const showAchievementInfoDialog = (a) => {
		setShowInfo(true);
		setInfoScreenTitle("Are you sure?");
		if (a.id == "stretch_6") {
			setInfoScreenBody("");
		} else {
			setInfoScreenBody(
				"We're going off the honor system for this one. Do you really want to mark this as done?"
			);
		}

		if (a.id == "productivity_6") {
			setInfoScreenConfirmOverrideText("Yes, Stop Guilt Tripping Me");
		} else {
			setInfoScreenConfirmOverrideText(null);
		}
		onInfoScreenButtonPressed.current = () => {
			emitEvent(a.category, a.id);
		};
	};

	const sellLoaf = (index) => {
		if (index < OvenQueue.length) {
			var loaf = OvenQueue[index];
			if (loaf.end_time < Date.now()) {
				var newOvenQueue = [
					...OvenQueue.slice(0, index),
					null,
					...OvenQueue.slice(index + 1),
				];
				setOvenQueue(newOvenQueue);
				broadcastBc(breadCoin + loaf.sell_value);
				setBreadCoin(breadCoin + loaf.sell_value);
				emitEvent("breadcoin-gain", loaf.sell_value, null);
				setTotalEarned(totalEarned + loaf.sell_value);
				animateGainOrLoss(loaf.sell_value);
				setShowTooltip(false);
				updateOrderBoard(loaf.id);
				setSpeechBubble("SELL");
				if (
					allLoavesDone &&
					OvenQueue.length == 16 &&
					!inSellAllSequence
				) {
					setInSellAllSequence(true);
				}
				setAllLoavesDone(false);
				if (
					inSellAllSequence &&
					newOvenQueue.every((e) => e === null)
				) {
					//Check if oven is empty now
					emitEvent("sell-oven");
				}

				reportLoafSold(
					loaf,
					breadBaked,
					OvenQueue.length,
					Date.now() - loaf.end_time,
					playerId
				);
				return;
			}
		}
		console.error("Error trying to sell loaf at index " + index);
	};

	const animateGainOrLoss = (amount) => {
		var num = document.getElementById("bc-anim");
		num.style.color = amount > 0 ? "#76b812" : "red";
		num.innerHTML = (amount > 0 ? "+" : "") + formatNumber(amount);
		num.classList.remove("float");
		void num.offsetWidth;
		num.classList.add("float");
	};

	const setSpeechBubble = (category, time = -1) => {
		if (messagesJson[category] == null) {
			return;
		}
		var totalWeight = 0;
		for (const [key, value] of Object.entries(messagesJson[category])) {
			totalWeight += value;
		}
		var roll = Math.random() * totalWeight;
		var sum = 0;
		var message = "";
		for (const [key, value] of Object.entries(messagesJson[category])) {
			sum += value;
			if (sum >= roll) {
				message = key;
				break;
			}
		}
		setSpeechBubbleText(message);
		setSpeechBubbleDuration(time == -1 ? 2000 : time);
		setSpeechBubbleCount(speechBubbleCount + 1);
	};

	const emitEvent = (id, value = null, amount = null) => {
		var newEvent = { id: id, value: value, amount: amount };
		setEvents([newEvent]);
	};

	const emitEvents = (e) => {
		setEvents(e);
	};

	const updateOrderBoard = (id) => {
		var newDailyOrderObject = { ...dailyOrderObject };
		var newOrderBoardObject = [...orderBoardOrders];
		var changed = false;
		if (dailyOrderObject.bc_reward != -1) {
			newDailyOrderObject.suborders.forEach((order) => {
				if (order.id == id) {
					order.counter++;
					changed = true;
				}
			});
		}
		newOrderBoardObject.forEach((order) => {
			if (order.started) {
				order.suborders.forEach((suborder) => {
					if (suborder.id == id) {
						suborder.counter++;
						changed = true;
					}
				});
			}
		});
		if (changed) {
			setDailyOrderObject(newDailyOrderObject);
			setOrderBoardOrders(newOrderBoardObject);
		}
	};

	const onLoafClicked = (index) => {
		if (index >= OvenQueue.length) {
			console.log("Error: Invalid loaf index " + index);
			return;
		}
		var loaf = OvenQueue[index];
		var cost = getTimerCost(loaf);
		if (useTimerMode && loaf.end_time >= Date.now() && timers >= cost) {
			// Spend timer
			var percentFinished =
				(1 -
					(loaf.end_time - Date.now()) /
						(loaf.end_time - loaf.start_time)) *
				100;
			loaf.end_time = Date.now() - 1;
			setTimers(timers - cost);
			updateLoafTooltip(loaf, 100);
			saveData(convertForSave());
			setUseTimerMode(false);
			reportTimerUsed(
				loaf,
				cost,
				percentFinished,
				breadBaked,
				OvenQueue.length,
				playerId
			);
		}

		// spend one click to knock off a second
		if (!useTimerMode && loaf.end_time >= Date.now()) {
			if (clicks == 0) {
				if (inTrialMode) {
					setClicks(0);
				} else {
					spendClicks(1);
				}
				return;
			}
			if (inTrialMode) {
				setClicks(clicks - 1);
			} else {
				spendClicks(2);
			}

			loaf.end_time -= 1000;
			saveData(convertForSave());
			setSpedUpLoafClicks(spedUpLoafClicks + 1);
			emitEvent("loaf-sped-up", 0, spedUpLoafClicks + 1);

			document
				.getElementById(loaf.id + "-div-" + index)
				.classList.add("pulse");
			setTimeout(() => {
				if (
					document.getElementById(loaf.id + "-div-" + index) != null
				) {
					document
						.getElementById(loaf.id + "-div-" + index)
						.classList.remove("pulse");
				}
			}, 300);

			var textAnim = document.getElementById(
				loaf.index + "-loaf-text-anim"
			);
			textAnim.classList.remove("float-short");
			void textAnim.offsetWidth;
			textAnim.classList.add("float-short");
			setTimeout(() => {
				textAnim.classList.remove("float-short");
			}, 600);
		}
	};

	const getTimerCost = (loaf) => {
		var time_left = loaf.end_time - Date.now();
		return Math.ceil(time_left / timer_unit);
	};

	const canUseTimers = () => {
		if (timers == 0) {
			return false;
		}
		for (var i = 0; i < OvenQueue.length; i++) {
			if (OvenQueue[i] != null) {
				var loaf = OvenQueue[i];
				var timerCost = getTimerCost(loaf);
				if (timerCost <= timers && loaf.end_time > Date.now()) {
					return true;
				}
			}
		}
		return false;
	};

	const generateClickMessages = () => {
		var messageDict = {};
		for (var messageGroupId in clickAchievementsJson) {
			var messageGroup = clickAchievementsJson[messageGroupId];
			messageDict[messageGroupId] = {};
			for (var id in messageGroup) {
				var bounds = id.split("-");
				var start = Number(bounds[0]);
				var end = Number(bounds[1]);
				for (var i = start; i < end; i++) {
					messageDict[messageGroupId][i] = messageGroup[id];
				}
			}
		}
		return messageDict;
	};

	useEffect(() => {
		if ((keys == 420 && clicks == 69) || (keys == 69 && clicks == 420)) {
			emitEvent("mature");
		}
	}, [keys, clicks]);

	useEffect(() => {
		for (var i = 0; i < events.length; i++) {
			var event = events[i];
			switch (event.id) {
				case "unlock-daily-order":
					setDailyOrderEvent("daily-order");
					break;
				case "unlock-order-board":
					setDailyOrderEvent("order-board");
					break;
				case "daily-order-update":
					saveData(convertForSave());
					break;
				case "order-board-update":
					saveData(convertForSave());
					setOrderBoardOrders(orderBoardOrders);
					break;
				case "animate-glitch":
					animate_glitch(event.amount);
					break;
				case "animate-achievements-out":
					stop_glitch();
					break;
			}
		}
	}, [events]);

	const unlockEnvelope = (category, eventName) => {
		for (var i in envelopeUnlocks) {
			if (envelopeUnlocks[i].category == category) {
				//already unlocked
				return;
			}
		}
		var newEnvelopeUnlocks = [
			{
				category: category,
				event: eventName,
				finish_time: false,
			},
			...envelopeUnlocks,
		];
		setEnvelopeUnlocks(newEnvelopeUnlocks);
	};

	const unlockEnvelopes = (categories) => {
		var newUnlocks = [];
		for (var i in categories) {
			newUnlocks.push({
				category: categories[i],
				event: null,
				finish_time: false,
			});
		}
		setEnvelopeUnlocks([...newUnlocks, ...envelopeUnlocks]);
	};

	const jiggleCrown = () => {
		document.getElementById("ending-logo").classList.add("jiggle-crown");
		setTimeout(() => {
			document
				.getElementById("ending-logo")
				.classList.remove("jiggle-crown");
		}, 250);
	};

	const jiggleTrialMode = () => {
		document
			.getElementById("trial-mode-marker")
			.classList.add("jiggle-lite");
		setTimeout(() => {
			document
				.getElementById("trial-mode-marker")
				.classList.remove("jiggle-lite");
		}, 250);
	};

	const startTrialMode = () => {
		if (extensionDetected) {
			console.log(
				"Error: Cannot start trial mode because extension is detected."
			);
			return;
		}

		//console.log("Starting trial mode");
		setInTrialMode(true);
		reportTrialMode();
		trialModeJiggleInterval.current = setInterval(() => {
			jiggleTrialMode();
		}, 8000);
	};

	const onContentClick = (e) => {
		updateBusy();
		if (!inTrialMode) {
			return;
		}
		if (e.target.id == "convert-clicks") {
			//pressing convert button
			setClicks(1);
			return;
		} else if (e.target.id == "set-clicks-button") {
			return;
		} else if (e.target.closest(".loaf-div")) {
			return;
		}
		setClicks(clicks + 1);
	};

	const onKeyDown = (e) => {
		updateBusy();
		if (!inTrialMode || e.repeat) {
			return;
		}
		setKeys(keys + 1);
	};

	const updateBusy = () => {
		if (busyStartTime.current == 0) {
			busyStartTime.current = Date.now();
		}

		if (idleTimeout.current != null) {
			clearTimeout(idleTimeout.current);
		}
		idleTimeout.current = setTimeout(() => {
			//console.log("inactive for a full minute");
			busyStartTime.current = 0;
			emitEvent("busy-reset", null);
		}, 60000);
	};

	const calculatePercentToNextLoaf = (breadObj) => {
		var nextBreadCost = null;
		for (const [id, data] of Object.entries(breadObj)) {
			if (data.save.purchase_count == 0) {
				nextBreadCost = data.save.cost;
				break;
			}
		}

		if (nextBreadCost == null) {
			return 100;
		}

		var netWorth = breadCoin;
		for (var i = 0; i < OvenQueue.length; i++) {
			if (OvenQueue[i] != null) {
				netWorth += OvenQueue[i].sell_value;
			}
		}
		return netWorth / nextBreadCost;
	};

	const checkForPercentNextLoaf = (breadObj, eventsToEmit) => {
		var percentToNextLoaf = calculatePercentToNextLoaf(breadObj);
		if (breadObj["whole_wheat"].save.purchase_count > 0) {
			if (percentToNextLoaf >= 0.5) {
				unlockEnvelope("whole_wheat2");
			}
		}
		if (breadObj["potato"].save.purchase_count > 0) {
			if (percentToNextLoaf >= 0.33) {
				unlockEnvelope("potato2");
			}
		}
		if (breadObj["brioche"].save.purchase_count > 0) {
			if (percentToNextLoaf >= 0.25) {
				unlockEnvelope("brioche2");
			}
			if (percentToNextLoaf >= 0.5) {
				unlockEnvelope("brioche3");
			}
			if (percentToNextLoaf >= 0.75) {
				unlockEnvelope("brioche4");
			}
		}
		return eventsToEmit;
	};

	const animate_glitch = (level) => {
		var config = {
			timing: {
				duration: 4000,
			},
			glitchTimeSpan: {
				start: 0.2,
				end: 0.7,
			},
			shake: {
				amplitudeX: 0,
				amplitudeY: 0,
			},
			slice: {
				count: 1,
				velocity: 1,
				maxHeight: 0.02,
			},
		};
		if (level == 2) {
			config.timing.duration = 3000;
			config.glitchTimeSpan.end = 0.9;
			config.shake.amplitudeX = 0.01;
			config.shake.amplitudeY = 0.01;
			config.slice.velocity = 3;
			config.slice.count = 3;
			config.slice.maxHeight = 0.04;
		} else if (level == 3) {
			config.timing.duration = 2000;
			config.glitchTimeSpan.start = 0.0;
			config.glitchTimeSpan.end = 1.0;
			config.shake.amplitudeX = 0.03;
			config.shake.amplitudeY = 0.03;
			config.slice.velocity = 15;
			config.shake.count = 7;
			config.shake.maxHeight = 7;
		}

		const { _, stopGlitch } = PowerGlitch.glitch(".glitchable", config);
		glitchStop.current = stopGlitch;
	};

	const stop_glitch = () => {
		if (glitchStop.current != null) {
			glitchStop.current();
		}
		setSupplyObject(SupplyObject); // force rerender
	};

	useEffect(() => {
		var eventsToEmit = [];
		eventsToEmit = checkForPercentNextLoaf(BreadObject, eventsToEmit);
		if (eventsToEmit.length > 0) {
			emitEvents(eventsToEmit);
		}
	}, [breadCoin]);

	const convertArrayToSuborder = (arr) => {
		return {
			id: arr[0],
			amount: arr[1],
			counter: arr[2],
			bc_reward: arr[3],
			timer_reward: arr[4],
			card: arr[5],
		};
	};
	useEffect(() => {
		registerForMessages(
			setClicks,
			setKeys,
			setKeyUnlocked,
			extensionDetected,
			setExtensionDetected
		);
		document.addEventListener("visibilitychange", (event) => {
			if (document.visibilityState == "visible") {
				requestClickCount();
				requestKeyCount();
			}
		});
		requestClickCount();
		requestKeyCount();

		var playerData = loadData();
		if (playerData != null) {
			setPlayerId(playerData.playerId);
			setMultiplier(
				Number.isNaN(playerData.multiplier) ? 1 : playerData.multiplier
			);
			setBreadCoin(
				Number.isNaN(playerData.bread_coin) ? 0 : playerData.bread_coin
			);
			broadcastBc(
				Number.isNaN(playerData.bread_coin) ? 0 : playerData.bread_coin
			);
			setOvenQueue(playerData.oven_queue);
			setTotalSpent(playerData.total_spent);
			setTotalEarned(playerData.total_earned);
			setTotalClicks(playerData.total_clicks);
			setTotalKeys(playerData.total_keys);
			setKeyUnlocked(playerData.key_unlocked);
			setBreadBaked(playerData.bread_baked);
			setDailyOrderNextRefreshTime(
				playerData.daily_order_next_refresh_time
			);
			setOrderBoardLastRefreshTime(
				playerData.order_board_last_refresh_time
			);
			if (Array.isArray(playerData.daily_order)) {
				if (playerData.daily_order.length == 0) {
					setDailyOrderObject({ suborders: [] });
				} else {
					setDailyOrderObject({
						bc_reward: playerData.daily_order[0],
						timer_reward: playerData.daily_order[1],
						suborders: [
							convertArrayToSuborder(playerData.daily_order[2]),
							convertArrayToSuborder(playerData.daily_order[3]),
						],
					});
				}
			} else {
				setDailyOrderObject(playerData.daily_order);
			}

			setTotalDailyOrders(playerData.total_daily_orders);
			setTotalTimelyDailyOrders(playerData.total_daily_orders);
			setConvertPresses(playerData.convert_presses);
			setTimers(playerData.timers);
			setTimersUnlocked(playerData.timers_unlocked);
			if (playerData.envelope_unlocks != null) {
				if (Array.isArray(playerData.envelope_unlocks[0])) {
					var unlocks = [];
					playerData.envelope_unlocks.forEach((arr) => {
						unlocks.push({
							category: arr[0],
							event: arr[1],
							finish_time: arr[2],
						});
					});
					setEnvelopeUnlocks(unlocks);
				} else {
					setEnvelopeUnlocks(playerData.envelope_unlocks);
				}
			}
			setStoryState(playerData.story_state);
			setPlayerStartTime(playerData.start_time);
			setOrderBoardOrders(playerData.order_board);
			setTotalOrderBoardOrders(playerData.total_order_board_orders);
			if (playerData.dating_score) {
				setDatingScore(playerData.dating_score);
			}
			if (playerData.ending_envelope_order) {
				setEndingEnvelopeOrder(playerData.ending_envelope_order);
			}
			if (playerData.sped_up_loaf_clicks > 0) {
				setSpedUpLoafClicks(playerData.sped_up_loaf_clicks);
			}
			setVisited(true);

			var newSupply = { ...SupplyObject };
			for (const [key, value] of Object.entries(
				playerData.supplies_object
			)) {
				newSupply[key].save = value;
			}
			setSupplyObject(newSupply);

			var newBread = { ...BreadObject };
			for (const [key, value] of Object.entries(
				playerData.bread_object
			)) {
				newBread[key].save = value;
			}
			setBreadObject(newBread);

			var newAchievements = { ...AchievementsObject };
			for (const [categoryName, array] of Object.entries(
				playerData.achievements_object
			)) {
				for (var i = 0; i < array.length; i++) {
					if (
						newAchievements[categoryName] == null ||
						(categoryName == "daily_orders" && i == 2)
					) {
						continue;
					}
					newAchievements[categoryName][i].save =
						playerData.achievements_object[categoryName][i];
				}
			}
			console.log(newAchievements["stretch"]);
			if (
				playerData.story_state >= 2 &&
				!newAchievements["stretch"][5].save.revealed
			) {
				newAchievements["stretch"][5].save.revealed = true;
			}
			setAchievementsObject(newAchievements);
		} else {
			setPlayerId(self.crypto.randomUUID());
			setPlayerStartTime(Date.now());
		}
		setLoaded(true);

		document.addEventListener("click", (e) => {
			if (e.target.id != "timer-icon" && e.target.id != "timers-wallet") {
				setUseTimerMode(false);
			}
		});

		window.addEventListener("resize", () => {
			setIsMobile(window.innerHeight / window.innerWidth > 1);
		});
		setIsMobile(window.innerHeight / window.innerWidth > 1);
		clickMessages.current = generateClickMessages();

		return () => {
			document.removeEventListener("click", (e) => {
				if (
					e.target.id != "timer-icon" &&
					e.target.id != "timers-wallet"
				) {
					setUseTimerMode(false);
				}
			});
			document.removeEventListener("visibilitychange", (event) => {
				if (document.visibilityState == "visible") {
					requestClickCount();
					requestKeyCount();
				}
			});
			window.removeEventListener("resize", () => {
				setIsMobile(window.innerHeight / window.innerWidth > 1);
			});
		};
	}, []);

	useEffect(() => {
		if (playerId != null) {
			saveData(convertForSave());
		}
	}, [
		breadCoin,
		AchievementsObject,
		envelopeUnlocks,
		timers,
		OvenQueue,
		inTrialMode,
		orderBoardOrders,
	]);

	useEffect(() => {
		emitEvent("current-balance", null, breadCoin);
	}, [breadCoin]);

	useEffect(() => {
		if (inTrialMode && clicks != null) {
			saveData(convertForSave());
		}
		var clicks_button = document.getElementById("convert-clicks");
		var keys_button = document.getElementById("convert-keys");
		if (clicks_button) {
			clicks_button.disabled = !clicks || clicks == 0;
		}
		if (keys_button) {
			keys_button.disabled = !keys || keys == 0;
		}
	}, [clicks, keys]);

	useEffect(() => {
		if (!inTrialMode) {
			return;
		}
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [keys, inTrialMode]);

	useEffect(() => {
		document.getElementById("column-1").style.opacity = isMobile
			? "0"
			: "1";
		document.getElementById("column-2").style.opacity = isMobile
			? "0"
			: "1";
		document.getElementById("column-3").style.opacity = isMobile
			? "0"
			: "1";
		document.getElementById("envelope-container").style.opacity = isMobile
			? "0"
			: "1";
		document.getElementById("achievements-container").style.opacity =
			isMobile ? "0" : "1";
	}, [isMobile]);

	useEffect(() => {
		var playerData = loadData();
		if (extensionDetected && playerData != null) {
			setSpeechBubble("RETURN");
			if (playerData.in_trial_mode) {
				console.log("just acquired extension");
				//In the case where the player has just acquired the extension
				if (playerData.keys != null) {
					setKeysCheat(playerData.keys);
				}
				setClicksCheat(playerData.clicks);
				setInTrialMode(false);
				reportExtensionAcquired();
			}

			if (playerData.keys != null) {
				unlockKeys();
			}
			return;
		}

		// In the case where the player is continuing from trial mode
		if (!extensionDetected && playerData != null) {
			setClicks(playerData.clicks);
			setKeys(playerData.keys);
			setVisited(true);
		}
	}, [extensionDetected]);

	return (
		<ErrorBoundary
			fallbackRender={ErrorScreen}
			onReset={() => {
				window.location.reload();
			}}
		>
			<div
				id="content"
				onClick={(e) => {
					onContentClick(e);
				}}
			>
				<Debug
					resetProgress={reset}
					setBreadCoin={setBreadCoin}
					ovenQueue={OvenQueue}
					setOvenQueue={setOvenQueue}
					achievements={AchievementsObject}
					setAchievements={setAchievementsObject}
					setTimers={setTimers}
					emitEvent={emitEvent}
					inTrialMode={inTrialMode}
					setClicks={setClicks}
					setDebugEnvelope={setDebugEnvelope}
				/>
				<EndGameController
					events={events}
					storyState={storyState}
					totalDailyOrders={totalDailyOrders}
					endingEnvelopeOrder={endingEnvelopeOrder}
					setEndingEnvelopeOrder={setEndingEnvelopeOrder}
					unlockEnvelope={unlockEnvelope}
					unlockEnvelopes={unlockEnvelopes}
					loaded={loaded}
				/>
				<Tooltip
					show={showTooltip}
					mousePos={tooltipPos}
					contentArray={tooltipContentArray}
				/>
				<Envelope
					unlocks={envelopeUnlocks}
					setUnlocks={setEnvelopeUnlocks}
					showEnvelope={showEnvelope}
					setShowEnvelope={setShowEnvelope}
					emitEvent={emitEvent}
					emitEvents={emitEvents}
					timersUnlocked={timersUnlocked}
					setTimersUnlocked={setTimersUnlocked}
					setTimers={setTimers}
					timers={timers}
					breadObject={BreadObject}
					events={events}
					totalClicks={totalClicks}
					totalKeys={totalKeys}
					AchievementsObject={AchievementsObject}
					storyState={storyState}
					setStoryState={setStoryState}
					reportEnvelopeAnswer={reportEnvelopeAnswer}
					reportEnvelopeCompleted={reportEnvelopeCompleted}
					debugEnvelope={debugEnvelope}
					setDebugEnvelope={setDebugEnvelope}
					datingScore={datingScore}
					setDatingScore={setDatingScore}
				/>
				<Achievements
					showAchievements={showAchievements}
					setShowAchievements={setShowAchievements}
					AchievementsObject={AchievementsObject}
					setAchievementsObject={setAchievementsObject}
					toggleTooltip={toggleAchievementsTooltip}
					emitEvent={emitEvent}
					events={events}
					breadCoin={breadCoin}
					setBreadCoin={setBreadCoin}
					totalEarned={totalEarned}
					setTotalEarned={setTotalEarned}
					loaded={loaded}
					claimButtonPressed={onAchievementClaimButtonPressed.current}
					timers={timers}
					setTimers={setTimers}
					timersUnlocked={timersUnlocked}
					setTimersUnlocked={setTimersUnlocked}
					busyStartTime={busyStartTime}
					storyState={storyState}
					setStoryState={setStoryState}
				/>
				<OrderBoard
					showDailyOrder={showDailyOrder}
					setShowDailyOrder={setShowDailyOrder}
					dailyOrderNextRefreshTime={dailyOrderNextRefreshTime}
					setDailyOrderNextRefreshTime={setDailyOrderNextRefreshTime}
					orderBoardLastRefreshTime={orderBoardLastRefreshTime}
					setOrderBoardLastRefreshTime={setOrderBoardLastRefreshTime}
					dailyOrderObject={dailyOrderObject}
					setDailyOrderObject={setDailyOrderObject}
					loaded={loaded}
					breadCoin={breadCoin}
					setBreadCoin={setBreadCoin}
					totalEarned={totalEarned}
					setTotalEarned={setTotalEarned}
					BreadObject={BreadObject}
					unlockEvent={dailyOrderEvent}
					emitEvent={emitEvent}
					emitEvents={emitEvents}
					events={events}
					totalDailyOrders={totalDailyOrders}
					setTotalDailyOrders={setTotalDailyOrders}
					totalTimelyDailyOrders={totalTimelyDailyOrders}
					setTotalTimelyDailyOrders={setTotalTimelyDailyOrders}
					timers={timers}
					setTimers={setTimers}
					timerUnit={timer_unit}
					orderBoardOrders={orderBoardOrders}
					setOrderBoardOrders={setOrderBoardOrders}
					reportDailyOrderFulfilled={reportDailyOrderFulfilled}
					reportOrderBoardOrderFulfilled={
						reportOrderBoardOrderFulfilled
					}
					totalOrderBoardOrders={totalOrderBoardOrders}
					setTotalOrderBoardOrders={setTotalOrderBoardOrders}
					envelopeUnlocks={envelopeUnlocks}
				/>
				<FloatingText
					text={floatingText}
					setText={setFloatingText}
					mousePos={floatingTextPos}
				/>

				<BlockingScreen
					extensionDetected={extensionDetected}
					visited={visited}
					isMobile={isMobile}
					delay={1000}
					blockingCategory={blockingCategory}
					setBlockingCategory={setBlockingCategory}
					resetProgress={reset}
					startTime={playerStartTime}
					inTrialMode={inTrialMode}
					startTrialMode={startTrialMode}
					envelopeUnlocks={envelopeUnlocks}
					endingEnvelopeOrder={endingEnvelopeOrder}
					totalClicks={totalClicks}
					totalKeys={totalKeys}
					breadBaked={breadBaked}
					AchievementsObject={AchievementsObject}
					reportFAQOpened={reportFAQOpened}
				/>

				{showInfo ? (
					<InfoScreen
						setShowInfo={setShowInfo}
						title={infoScreenTitle}
						body={infoScreenBody}
						confirmOverrideText={infoScreenConfirmOverrideText}
						onConfirmButtonClicked={
							onInfoScreenButtonPressed.current
						}
					/>
				) : null}

				<div id="column-1" className="column">
					<Wallet
						clicks={clicks}
						keys={keys}
						totalKeys={totalKeys}
						multiplier={multiplier}
						getTotalMultiplier={getTotalMultiplier}
						convertClicks={convertClicksToBreadCoin}
						convertKeys={convertKeysToMultiplier}
						toggleClicksTooltip={toggleConvertClicksTooltip}
						toggleKeysTooltip={toggleConvertKeysTooltip}
						keyUnlocked={keyUnlocked}
						convertPresses={convertPresses}
						setConvertPresses={setConvertPresses}
						emitEvent={emitEvent}
						timers={timers}
						timersUnlocked={timersUnlocked}
						toggleTimerInfoTooltip={toggleTimerInfoTooltip}
						useTimerMode={useTimerMode}
						setUseTimerMode={setUseTimerMode}
						canUseTimers={canUseTimers}
						timerButtonHovered={timerButtonHovered}
						setTimerButtonHovered={setTimerButtonHovered}
					/>

					{SupplyObject ? (
						<CardList
							id="supply-list"
							title="Kitchen Supplies"
							items={Object.values(SupplyObject)}
							onCardClicked={TryBuySupply}
							shouldShow={shouldShowSupply}
							toggleTooltip={toggleTooltip}
							shouldDisable={isSupplyDisabled}
							maxItems={4}
						/>
					) : null}
				</div>

				<div id="column-2" className="column">
					{inTrialMode ? (
						<div
							id="trial-mode-marker"
							onClick={() => {
								setBlockingCategory("trial-mode");
							}}
							onMouseOver={() => {
								jiggleTrialMode();
							}}
						>
							trial mode
						</div>
					) : null}

					<div id="bc-container">
						<div id="bread-coin">
							<BCSymbol color="black" />
							<span
								id="bc-num"
								onMouseMove={(e) => {
									var x =
										e.clientX < window.innerWidth - 300
											? e.clientX + 30
											: e.clientX - 240;
									toggleBCTooltip(true, [x, e.clientY + 30]);
								}}
								onMouseLeave={() => {
									toggleBCTooltip(false);
								}}
							>
								<span id="bc-anim">100</span>
								{formatNumber(breadCoin) ?? "?"}{" "}
							</span>
						</div>
					</div>
					<Oven
						queue={OvenQueue}
						sellLoaf={sellLoaf}
						toggleTooltip={toggleLoafTooltip}
						updateTooltip={updateLoafTooltip}
						shouldShow={totalSpent > 0}
						setAllDone={setAllLoavesDone}
						onLoafClicked={onLoafClicked}
						timers={timers}
						getTimerCost={getTimerCost}
						useTimerMode={useTimerMode}
						setUseTimerMode={setUseTimerMode}
						timerButtonHovered={timerButtonHovered}
					/>
					<SpeechBubble
						text={speechBubbleText}
						setText={setSpeechBubbleText}
						duration={speechBubbleDuration}
						show={true}
						count={speechBubbleCount}
					/>
					<div id="version">
						{storyState > 1 ? (
							<img
								src={
									storyState == 5 ? dough_logo_2 : dough_logo
								}
								id="ending-logo"
								onClick={() => {
									setBlockingCategory("ending-crown");
								}}
								onMouseEnter={() => jiggleCrown()}
							/>
						) : null}
						{inTrialMode ? (
							<div
								id="trial-mode-marker"
								onClick={() => {
									setBlockingCategory("trial-mode");
								}}
								onMouseOver={() => {
									jiggleTrialMode();
								}}
							>
								lite!
							</div>
						) : null}
						{storyState >= 3 &&
						datingScore[0] / datingScore[1] > 0.66 ? (
							<img src={heart_logo} id="ending-logo-heart" />
						) : null}
						bread winner{" "}
						<span
							id="info"
							onClick={() => {
								setBlockingCategory("question-mark");
							}}
						>
							?
						</span>
					</div>
				</div>

				<div id="column-3" className="column">
					{BreadObject ? (
						<CardList
							id="bread-list"
							title="Recipe Book"
							items={Object.values(BreadObject)}
							onCardClicked={TryBuyBread}
							shouldShow={shouldShowBread}
							toggleTooltip={toggleBreadTooltip}
							shouldDisable={isBreadDisabled}
							maxItems={9}
						/>
					) : null}
				</div>
				<div id="background">
					<img src={tile} className="tile-bg" id="tile-1" />
					<img src={tile} className="tile-bg" id="tile-3" />
					<img src={shadow} id="shadow" />
				</div>
			</div>
		</ErrorBoundary>
	);
}

export default App;
