import { useState, useEffect, useRef } from "react";
import { saveData, loadData } from "../public/account";
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
import DailyOrder from "./DailyOrder";
import Envelope from "./Envelope";

import tile from "/images/tile.png";
import shadow from "/images/shadow.png";

import "./App.css";

import breadJson from "./config/bread.json";
import suppliesJson from "./config/supplies.json";
import messagesJson from "./config/messages.json";
import achievementsJson from "./config/achievements.json";

function App() {
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
	const [tooltipText, setTooltipText] = useState("");
	const [tooltipTextAfter, setTooltipTextAfter] = useState("");
	const [tooltipTextAfterAfter, setTooltipTextAfterAfter] = useState("");
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
	const [showBlocking, setShowBlocking] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const [infoScreenTitle, setInfoScreenTitle] = useState("");
	const [infoScreenBody, setInfoScreenBody] = useState("");
	const [breadBaked, setBreadBaked] = useState(0);
	const [showAchievements, setShowAchievements] = useState(false);
	const [AchievementsObject, setAchievementsObject] =
		useState(achievementsJson);
	const [showDailyOrder, setShowDailyOrder] = useState(false);
	const [events, setEvents] = useState([]);
	const [dailyOrderNextRefreshTime, setDailyOrderNextRefreshTime] =
		useState(null);
	const [dailyOrderArray, setDailyOrderArray] = useState([]);
	const [dailyOrderEvent, setDailyOrderEvent] = useState(null);
	const [totalDailyOrders, setTotalDailyOrders] = useState(0);
	const [totalTimelyDailyOrders, setTotalTimelyDailyOrders] = useState(0);
	const [convertPresses, setConvertPresses] = useState(0);
	const [allLoavesDone, setAllLoavesDone] = useState(false);
	const [inSellAllSequence, setInSellAllSequence] = useState(false);
	const [showEnvelope, setShowEnvelope] = useState(false);
	const [envelopeCategory, setEnvelopeCategory] = useState(null);
	const [timers, setTimers] = useState(0);
	const [timersUnlocked, setTimersUnlocked] = useState(false);
	const [showTimer, setShowTimer] = useState(false);

	const hourTimeout = useRef(null);
	const onInfoScreenButtonPressed = useRef(null);
	const onAchievementClaimButtonPressed = useRef(null);

	const isMobile = window.innerWidth <= 768;

	const convertForSave = () => {
		var player = {
			multiplier: multiplier ?? 1.0,
			bread_coin: breadCoin ?? 0,
			supplies_object: getSave(SupplyObject),
			bread_object: getSave(BreadObject),
			achievements_object: getSaveAchievements(AchievementsObject),
			oven_queue: OvenQueue,
			total_spent: totalSpent,
			total_earned: totalEarned,
			total_clicks: totalClicks,
			key_unlocked: keyUnlocked,
			bread_baked: breadBaked,
			daily_order_next_refresh_time: dailyOrderNextRefreshTime,
			daily_order: dailyOrderArray,
			total_daily_orders: totalDailyOrders,
			total_timely_daily_orders: totalTimelyDailyOrders,
			convert_presses: convertPresses,
			timers: timers,
			timersUnlocked: timersUnlocked,
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
		} else if (supply.oven_increase) {
			var index = parseInt(supply.id.slice(-1));
			if (
				index > 1 &&
				!SupplyObject["oven_slot_" + (index - 1)].save.purchased
			) {
				return false;
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
		var now = Date.now();
		var loaf = {
			id: id,
			purchase_count: bread.save.purchase_count,
			display_name: bread.display_name,
			starting_color: bread.starting_color ?? "#FFE7B7",
			ending_color: bread.ending_color ?? "#BB7F0A",
			start_time: now,
			end_time: now + bread.bake_time * 1000,
			sell_value: Math.floor(bread.save.cost * bread.markup),
		};
		var newOvenQueue = [
			...OvenQueue.slice(0, nextOpen),
			loaf,
			...OvenQueue.slice(nextOpen + 1),
		];
		setOvenQueue(newOvenQueue);

		var newBread = { ...BreadObject };
		newBread[id].save.purchase_count++;
		spendBreadCoin(bread.save.cost);
		setTotalSpent(totalSpent + bread.save.cost);
		newBread[id].save.cost = Math.floor(
			newBread[id].save.cost * bread.increase_rate
		);
		setBreadObject(newBread);
		updateBreadTooltip(newBread[id]);
		setBreadBaked(breadBaked + 1);
		emitEvent("bread-baked", null, breadBaked + 1);
		tryUnlockDailyOrder(loaf.id, newBread);
		if (id == "banana" && newBread[id].save.purchase_count == 1) {
			emitEvent("bread-finished", null, null);
		}
		if (breadBaked == 0) {
			//1st loaf of bread
			peekInEnvelope("intro");
		}
	};

	const TryBuySupply = (id, mousePos) => {
		setInSellAllSequence(false);
		var supply = SupplyObject[id];
		if (!supply || supply.cost > breadCoin) {
			return false;
		}

		spendBreadCoin(supply.cost);
		setTotalSpent(totalSpent + supply.cost);
		var newSupply = { ...SupplyObject };
		newSupply[id].save.purchased = true;
		setSupplyObject(newSupply);
		if (supply.keys) {
			setKeyUnlocked(true);
			emitEvent("keys-unlocked", null, null);
			unlockKeys();
		} else if (supply.multiplier) {
			setMultiplier(multiplier * supply.multiplier);
			setSpeechBubble("MULTIPLIER");
		} else if (supply.oven_increase) {
			var newOvenQueue = [...OvenQueue, null];
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
				emitEvent("oven-finished", null, null);
			}
		}
		var allPurchased = Object.entries(newSupply).every((item) => {
			return item[1].save.purchased;
		});
		if (allPurchased) {
			emitEvent("supply-finished", null, null);
		}
	};

	const convertClicksToBreadCoin = () => {
		setInSellAllSequence(false);
		var earnedCoin = Math.round(clicks * multiplier);
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
		spendClicks(clicks);
		setSpeechBubble("CLICK");
	};

	const spendBreadCoin = (amount) => {
		broadcastBc(breadCoin - amount);
		setBreadCoin(breadCoin - amount);
		animateGainOrLoss(-amount);
	};

	const convertKeysToMultiplier = () => {
		setInSellAllSequence(false);
		setMultiplier(multiplier + keys * 0.0001);
		spendKeys(keys);
		setTotalKeys(totalKeys + keys);
		emitEvent("keys-converted", null, totalKeys + keys);
	};

	// Does stuff to set the default tooltip
	const setupTooltip = (show, mousePos = [0, 0]) => {
		setTooltipTextAfter("");
		setTooltipTextAfterAfter("");
		setTooltipPos(mousePos);
		setShowTooltip(show);
		setShowTimer(false);
	};

	const toggleTooltip = (show, item = null, mousePos = [0, 0]) => {
		setupTooltip(show, mousePos);
		if (item != null) {
			setTooltipText(item.desc);
		}
	};

	const toggleBreadTooltip = (show, item = null, mousePos = [0, 0]) => {
		setupTooltip(show, mousePos);
		if (item != null) {
			updateBreadTooltip(item);
		}
	};

	const updateBreadTooltip = (item) => {
		var sell_price = Math.floor(item.save.cost * item.markup);
		var times = item.save.purchase_count == 1 ? " time." : " times.";
		var text =
			item.desc +
			"\nSells for " +
			formatPercent(item.markup) +
			" of the original price (";
		var textAfter =
			formatNumber(sell_price) +
			").\nYou've baked this " +
			item.save.purchase_count +
			times;
		setTooltipText(text);
		setTooltipTextAfter(textAfter);
		setTooltipTextAfterAfter("");
	};

	const toggleLoafTooltip = (
		show,
		item = null,
		mousePos = [0, 0],
		percent_done = -1
	) => {
		setupTooltip(show, mousePos);
		if (item != null) {
			updateLoafTooltip(item, percent_done);
		}
	};

	const updateLoafTooltip = (item, percent_done) => {
		var progress_text = Math.floor(percent_done * 100) + "% done";
		if (percent_done >= 1) {
			progress_text = "Ready!";
		}

		var text = item.display_name + " - " + progress_text + "\nSells for  ";
		var textAfter = formatNumber(item.sell_value);

		if (percent_done < 1 && timers > 0) {
			textAfter += "\nClick to use ";
			setShowTimer(true);
		}
		setTooltipText(text);
		setTooltipTextAfter(textAfter);
	};

	const toggleConvertClicksTooltip = (show, mousePos = [0, 0]) => {
		setupTooltip(show, mousePos);
		if (show) {
			var text = "Convert for +";
			var textAfter = Math.round(clicks * multiplier);
			setTooltipText(text);
			setTooltipTextAfter(textAfter);
		}
	};

	const toggleConvertKeysTooltip = (show, mousePos = [0, 0]) => {
		setupTooltip(show, mousePos);
		if (show) {
			var text =
				"Increase your multiplier by tiny amount with every key. Convert for +" +
				keys * 0.0001 +
				".";
			setTooltipText(text);
		}
	};

	const toggleAchievementsTooltip = (
		show,
		mousePos = [0, 0],
		achievement = null
	) => {
		setupTooltip(show, mousePos);
		if (show) {
			var text = "???";
			var inbetweenAfter = "";
			var after = "";
			if (achievement.save.claimed) {
				text =
					"**" + achievement.display_name + "**\n" + achievement.desc;
				if (achievement.desc_after) {
					inbetweenAfter = achievement.desc_after;
				}
				if (achievement.quip) {
					text += "\n_" + achievement.quip + "_";
				}
			} else if (true) {
				//achievement.save.revealed
				if (achievement.desc_after) {
					text =
						"**" +
						achievement.display_name +
						"**\n" +
						achievement.desc;
					inbetweenAfter = achievement.desc_after + "\nReward: ";
					after += "\n";
				} else {
					text =
						"**" +
						achievement.display_name +
						"**\n" +
						achievement.desc +
						"\nReward: ";
				}
				after = formatNumber(achievement.reward);
				if (achievement.save.achieved) {
					after += "\nClick to claim!";
				} else if (achievement.save.revealed) {
					if (achievement.progress != null) {
						if (achievement.timer) {
							if (achievement.progress > 0) {
								after +=
									"\nTime Remaining: " +
									msToTime(
										(achievement.timer -
											achievement.progress) *
											1000,
										true
									);
							}
						} else {
							after +=
								"\nProgress: " +
								formatNumber(achievement.progress) +
								"/" +
								formatNumber(achievement.amount);
						}
					}
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
				after += "\nClick to complete now!";
			}
			setTooltipText(text);
			setTooltipTextAfter(inbetweenAfter);
			setTooltipTextAfterAfter(after);
		}
	};

	const toggleTimerInfoTooltip = (show, mousePos = [0, 0]) => {
		setupTooltip(show, mousePos);
		if (show) {
			var text = "Use a timer to finish a baking loaf instantly!";
			setTooltipText(text);
		}
	};

	const showAchievementInfoDialog = (a) => {
		setShowInfo(true);
		setInfoScreenTitle("Are you sure?");
		setInfoScreenBody(
			"We're going off the honor system for this one. Are you sure you want to mark this as done?"
		);
		onInfoScreenButtonPressed.current = () => {
			emitEvent(a.category, Number(a.id.slice(-1)));
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
				updateDailyOrder(loaf.id);
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

	const getBreadTotal = () => {
		var total = 0;
		for (var bread in BreadObject) {
			total += BreadObject[bread].save.purchase_count;
		}
		return total;
	};

	const emitEvent = (id, value = null, amount = null) => {
		var newEvents = events.slice(0); //copies
		var newEvent = { id: id, value: value, amount: amount };
		newEvents.push(newEvent);
		setEvents(newEvents);
	};

	const emitEvents = (events) => {
		var newEvents = events.slice(0); //copies
		newEvents.push.apply(newEvents, events);
		setEvents(newEvents);
	};

	const updateDailyOrder = (id) => {
		var newDailyOrderArray = [...dailyOrderArray];
		var changed = false;
		newDailyOrderArray.forEach((entry) => {
			if (entry[0] == id) {
				entry[2]++;
				changed = true;
			}
		});
		if (changed) {
			setDailyOrderArray(newDailyOrderArray);
		}
	};

	const tryUnlockDailyOrder = (id, breadObject) => {
		if (
			id == "cinnamon_raisin" &&
			breadObject[id].save.purchase_count == 1
		) {
			setDailyOrderEvent(true);
			return;
		}
	};

	const onLoafClicked = (index) => {
		if (index >= OvenQueue.length) {
			console.log("Error: Invalid loaf index " + index);
			return;
		}
		var loaf = OvenQueue[index];
		if (loaf.end_time >= Date.now() && timers > 0) {
			// Spend timer
			loaf.end_time = Date.now() - 1;
			setTimers(timers - 1);
			setShowTimer(false);
			updateLoafTooltip(loaf, 100);
			saveData(convertForSave());
		}
	};

	useEffect(() => {
		if ((keys == 420 && clicks == 69) || (keys == 69 && clicks == 420)) {
			emitEvent("mature");
		}
	}, [keys, clicks]);

	const peekInEnvelope = (category) => {
		setEnvelopeCategory(category);
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
		if (playerData) {
			setMultiplier(playerData.multiplier);
			if (playerData.supplies_object) {
				var newSupply = { ...SupplyObject };
				for (const [key, value] of Object.entries(
					playerData.supplies_object
				)) {
					newSupply[key].save = value;
				}
				setSupplyObject(newSupply);
			}
			if (playerData.bread_object) {
				var newBread = { ...BreadObject };
				for (const [key, value] of Object.entries(
					playerData.bread_object
				)) {
					newBread[key].save = value;
				}
				setBreadObject(newBread);
			}
			if (playerData.bread_coin) {
				broadcastBc(playerData.bread_coin);
				setBreadCoin(playerData.bread_coin);
			}
			if (playerData.oven_queue) {
				setOvenQueue(playerData.oven_queue);
			}
			if (playerData.total_spent) {
				setTotalSpent(playerData.total_spent);
			}
			if (playerData.total_earned) {
				setTotalEarned(playerData.total_earned);
			}
			if (playerData.total_clicks) {
				setTotalClicks(playerData.total_clicks);
			}
			if (playerData.key_unlocked) {
				setKeyUnlocked(playerData.key_unlocked);
			}
			if (playerData.achievements_object) {
				console.log(playerData.achievements_object);
				var newAchievements = { ...AchievementsObject };
				for (const [categoryName, array] of Object.entries(
					playerData.achievements_object
				)) {
					for (var i = 0; i < array.length; i++) {
						newAchievements[categoryName][i].save =
							playerData.achievements_object[categoryName][i];
					}
				}
				setAchievementsObject(newAchievements);
			}
			if (playerData.bread_baked) {
				setBreadBaked(playerData.bread_baked);
			}
			if (playerData.daily_order_next_refresh_time) {
				setDailyOrderNextRefreshTime(
					playerData.daily_order_next_refresh_time
				);
			}
			if (playerData.daily_order) {
				setDailyOrderArray(playerData.daily_order);
			}
			if (playerData.total_daily_orders) {
				setTotalTimelyDailyOrders(playerData.total_daily_orders);
			}
			if (playerData.total_timely_daily_orders) {
				setTotalTimelyDailyOrders(playerData.total_timely_daily_orders);
			}
			if (playerData.convert_presses) {
				setConvertPresses(playerData.convert_presses);
			}
			if (playerData.timers) {
				setTimers(playerData.timers);
			}
			if (playerData.timersUnlocked) {
				setTimersUnlocked(playerData.timersUnlocked);
			}
			setVisited(true);
		}
		setLoaded(true);

		hourTimeout.current = setTimeout(() => {
			emitEvent("hour-timeout");
		}, 3600000);

		window.onblur = function (e) {
			console.log("onblur");
			clearTimeout(hourTimeout.current);
			hourTimeout.current = setTimeout(() => {
				emitEvent("hour-timeout");
			}, 3600000);
		};

		return () => {
			document.removeEventListener("visibilitychange", (event) => {
				if (document.visibilityState == "visible") {
					requestClickCount();
					requestKeyCount();
				}
			});
		};
	}, []);

	useEffect(() => {
		saveData(convertForSave());
	}, [breadCoin, AchievementsObject]);

	useEffect(() => {
		emitEvent("current-balance", null, breadCoin);
	}, [breadCoin]);

	useEffect(() => {
		if (extensionDetected && visited) {
			setSpeechBubble("RETURN");
		}
	}, [extensionDetected]);

	return (
		<div id="content">
			<Debug
				resetProgress={reset}
				setBreadCoin={setBreadCoin}
				ovenQueue={OvenQueue}
				setOvenQueue={setOvenQueue}
				achievements={AchievementsObject}
				setAchievements={setAchievementsObject}
				setTimers={setTimers}
			/>
			<Tooltip
				show={showTooltip}
				text={tooltipText}
				textAfter={tooltipTextAfter}
				textAfterAfter={tooltipTextAfterAfter}
				mousePos={tooltipPos}
				showTimer={showTimer}
			/>
			<Envelope
				cat={envelopeCategory}
				setCat={setEnvelopeCategory}
				showEnvelope={showEnvelope}
				setShowEnvelope={setShowEnvelope}
				emitEvent={emitEvent}
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
				peekInEnvelope={peekInEnvelope}
				timers={timers}
				setTimers={setTimers}
				timersUnlocked={timersUnlocked}
				setTimersUnlocked={setTimersUnlocked}
			/>
			<DailyOrder
				showDailyOrder={showDailyOrder}
				setShowDailyOrder={setShowDailyOrder}
				dailyOrderNextRefreshTime={dailyOrderNextRefreshTime}
				setDailyOrderNextRefreshTime={setDailyOrderNextRefreshTime}
				dailyOrderArray={dailyOrderArray}
				setDailyOrderArray={setDailyOrderArray}
				loaded={loaded}
				breadCoin={breadCoin}
				setBreadCoin={setBreadCoin}
				totalEarned={totalEarned}
				setTotalEarned={setTotalEarned}
				BreadObject={BreadObject}
				unlockEvent={dailyOrderEvent}
				emitEvent={emitEvent}
				totalDailyOrders={totalDailyOrders}
				setTotalDailyOrders={setTotalDailyOrders}
				totalTimelyDailyOrders={totalTimelyDailyOrders}
				setTotalTimelyDailyOrders={setTotalTimelyDailyOrders}
				timers={timers}
				setTimers={setTimers}
			/>
			<FloatingText
				text={floatingText}
				setText={setFloatingText}
				mousePos={floatingTextPos}
			/>

			{!extensionDetected || isMobile || showBlocking ? (
				<BlockingScreen
					visited={visited}
					isMobile={isMobile}
					delay={1000}
					showBlocking={showBlocking}
					setShowBlocking={setShowBlocking}
				/>
			) : null}
			{showInfo ? (
				<InfoScreen
					setShowInfo={setShowInfo}
					title={infoScreenTitle}
					body={infoScreenBody}
					onConfirmButtonClicked={onInfoScreenButtonPressed.current}
				/>
			) : null}

			<div id="column-1" className="column">
				<Wallet
					clicks={clicks}
					keys={keys}
					multiplier={multiplier}
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
				<div id="bc-container">
					<div id="bread-coin">
						<BCSymbol color="black" />
						<span id="bc-num">
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
				/>
				<SpeechBubble
					text={speechBubbleText}
					setText={setSpeechBubbleText}
					duration={speechBubbleDuration}
					show={true}
					count={speechBubbleCount}
				/>
				<div id="version">
					bread winner{" "}
					<span
						id="info"
						onClick={() => {
							setShowBlocking(true);
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
	);
}

export default App;
