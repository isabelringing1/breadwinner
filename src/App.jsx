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
import { formatNumber, formatPercent } from "./Util";

import Debug from "./Debug";
import Tooltip from "./Tooltip";
import CardList from "./CardList";
import Wallet from "./Wallet";
import Oven from "./Oven";
import BCSymbol from "./BCSymbol";
import BlockingScreen from "./BlockingScreen";
import FloatingText from "./FloatingText";
import SpeechBubble from "./SpeechBubble";
import Achievements from "./Achievements";

import tile from "/images/tile.png";
import shadow from "/images/shadow.png";

import "./App.css";

import breadJson from "./config/bread.json";
import suppliesJson from "./config/supplies.json";
import messagesJson from "./config/messages.json";
import achievementsJson from "./config/achievements.json";

function App() {
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
  const [tooltipPos, setTooltipPos] = useState([0, 0]);
  const [showTooltipClaimButton, setShowTooltipClaimButton] = useState(true);
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
  const [showInfo, setShowInfo] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [AchievementsObject, setAchievementsObject] =
    useState(achievementsJson);
  const [events, setEvents] = useState([]);
  const isMobile = window.innerWidth <= 768;

  const convertForSave = () => {
    var player = {
      multiplier: multiplier ?? 1.0,
      bread_coin: breadCoin ?? 0,
      supplies_object: SupplyObject,
      bread_object: BreadObject,
      achievements_object: AchievementsObject,
      oven_queue: OvenQueue,
      total_spent: totalSpent,
      total_earned: totalEarned,
      total_clicks: totalClicks,
      key_unlocked: keyUnlocked,
    };
    return player;
  };

  const reset = () => {
    lockKeys();
    localStorage.clear();
    location.reload();
  };

  const isSupplyPurchased = (id) => {
    return SupplyObject[id].purchased;
  };

  const shouldShowBread = (id) => {
    var bread = BreadObject[id];
    if (totalEarned == 0 || bread == null) {
      return false;
    }

    if (id == "white") {
      return true;
    }
    if (!bread.unlocked && BreadObject[bread.previous].purchase_count > 0) {
      bread.unlocked = true;
    }
    return bread.unlocked;
  };

  const isBreadDisabled = (id) => {
    return BreadObject[id].cost > breadCoin;
  };

  const shouldShowSupply = (id) => {
    if (totalSpent == 0) {
      return false;
    }

    var supply = SupplyObject[id];
    if (id == "mixing_bowl") {
      return !isSupplyPurchased(id);
    } else if (supply.oven_increase) {
      if (!supply.unlocked && breadCoin >= supply.cost * 0.5) {
        supply.unlocked = true;
      }
    } else if (!supply.unlocked && isSupplyPurchased(supply.previous)) {
      supply.unlocked = true;
    }

    return supply.unlocked && !isSupplyPurchased(id);
  };

  const isSupplyDisabled = (id) => {
    return SupplyObject[id].cost > breadCoin;
  };

  const TryBuyBread = (id, mousePos) => {
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
    } else if (!bread || bread.cost > breadCoin) {
      return false;
    }
    var now = Date.now();
    var loaf = {
      id: id,
      purchase_count: bread.purchase_count,
      display_name: bread.display_name,
      starting_color: bread.starting_color ?? "#FFE7B7",
      ending_color: bread.ending_color ?? "#BB7F0A",
      start_time: now,
      end_time: now + bread.bake_time * 1000,
      sell_value: Math.floor(bread.cost * bread.markup),
    };
    var newOvenQueue = [
      ...OvenQueue.slice(0, nextOpen),
      loaf,
      ...OvenQueue.slice(nextOpen + 1),
    ];
    setOvenQueue(newOvenQueue);

    var newBread = { ...BreadObject };
    newBread[id].purchase_count++;
    spendBreadCoin(bread.cost);
    setTotalSpent(totalSpent + bread.cost);
    newBread[id].cost = Math.floor(newBread[id].cost * bread.increase_rate);
    setBreadObject(newBread);
    updateBreadTooltip(newBread[id]);
    if (id == "banana" && newBread[id].purchase_count == 1){
      emitEvent("bread-finished", null, null);
    }
  };

  const TryBuySupply = (id, mousePos) => {
    var supply = SupplyObject[id];
    if (!supply || supply.cost > breadCoin) {
      return false;
    }

    spendBreadCoin(supply.cost);
    setTotalSpent(totalSpent + supply.cost);
    var newSupply = { ...SupplyObject };
    newSupply[id].purchased = true;
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
      if (supply.id == "oven_slot_12"){
        emitEvent("oven-finished", null, null);
      }
      
      var allUnpurchased = newSupply.every(item => {
        return !item.purchased
      })
      if (allUnpurchased.length == 0){
        emitEvent("supply-finished", null, null);
      }
    }
  };

  const convertClicksToBreadCoin = () => {
    var earnedCoin = Math.round(clicks * multiplier);
    broadcastBc(breadCoin + earnedCoin);
    setBreadCoin(breadCoin + earnedCoin);
    setTotalEarned(totalClicks + earnedCoin);
    animateGainOrLoss(earnedCoin);
    setTotalClicks(totalClicks + clicks);
    emitEvent("total-conversions", null, totalClicks + clicks);
    spendClicks(clicks);
    setSpeechBubble("CLICK");
  };

  const spendBreadCoin = (amount) => {
    broadcastBc(breadCoin - amount);
    setBreadCoin(breadCoin - amount);
    animateGainOrLoss(-amount);
  };

  const convertKeysToMultiplier = () => {
    setMultiplier(multiplier + keys * 0.0001);
    spendKeys(keys);
    setTotalKeys(totalKeys + keys);
    emitEvent("keys-converted", null, totalKeys + keys);
  };

  const toggleTooltip = (show, item = null, mousePos = [0, 0]) => {
    if (item != null) {
      setTooltipText(item.desc);
      setTooltipTextAfter("");
    }
    setTooltipPos(mousePos);
    setShowTooltip(show);
  };

  const toggleBreadTooltip = (show, item = null, mousePos = [0, 0]) => {
    if (item != null) {
      updateBreadTooltip(item);
    }
    setTooltipPos(mousePos);
    setShowTooltip(show);
  };

  const updateBreadTooltip = (item) => {
    var sell_price = Math.floor(item.cost * item.markup);
    var times = item.purchase_count == 1 ? " time." : " times.";
    var text =
      item.desc +
      "\nSells for " +
      formatPercent(item.markup) +
      " of the original price (";
    var textAfter =
      formatNumber(sell_price) +
      ").\nYou've baked this " +
      item.purchase_count +
      times;
    setTooltipText(text);
    setTooltipTextAfter(textAfter);
  };

  const toggleLoafTooltip = (
    show,
    item = null,
    mousePos = [0, 0],
    percent_done = -1
  ) => {
    if (item != null) {
      updateLoafTooltip(item, percent_done);
    }
    setTooltipPos(mousePos);
    setShowTooltip(show);
  };

  const updateLoafTooltip = (item, percent_done) => {
    var progress_text = Math.floor(percent_done * 100) + "% done";
    if (percent_done >= 1) {
      progress_text = "Ready!";
    }

    var text = item.display_name + " - " + progress_text + "\nSells for  ";
    var textAfter = formatNumber(item.sell_value);
    setTooltipText(text);
    setTooltipTextAfter(textAfter);
  };

  const toggleConvertClicksTooltip = (show, mousePos = [0, 0]) => {
    if (show) {
      var text = "Convert for +";
      var textAfter = Math.round(clicks * multiplier);
      setTooltipText(text);
      setTooltipTextAfter(textAfter);
    }
    setTooltipPos(mousePos);
    setShowTooltip(show);
  };

  const toggleConvertKeysTooltip = (show, mousePos = [0, 0]) => {
    if (show) {
      var text =
        "Increase your multiplier by tiny amount with every key. Convert for +" +
        keys * 0.0001 +
        ".";
      setTooltipText(text);
      setTooltipTextAfter("");
    }
    setTooltipPos(mousePos);
    setShowTooltip(show);
  };

  const toggleAchievementsTooltip = (
    show,
    mousePos = [0, 0],
    achievement = null
  ) => {
    if (show) {
      var text = "???";
      var after = "";
      if (achievement.claimed) {
        var text = "**" + achievement.display_name + "**\n" + achievement.desc;
      } else if (achievement.achieved) {
        var text =
          "**" +
          achievement.display_name +
          "**\n" +
          achievement.desc +
          "\nReward: ";
        after = achievement.reward + "\nClick to claim!";
      } else if (achievement.revealed) {
        var text =
          "**" +
          achievement.display_name +
          "**\n" +
          achievement.desc +
          "\nReward: ";
        after = formatNumber(achievement.reward);
        if (achievement.progress != null) {
          after +=
            "\nProgress: " +
            formatNumber(achievement.progress) +
            "/" +
            formatNumber(achievement.amount);
        }
      }

      setTooltipText(text);
      setTooltipTextAfter(after);
    }
    setTooltipPos(mousePos);
    setShowTooltip(show);
  };

  const sellLoaf = (index) => {
    if (index < OvenQueue.length) {
      var loaf = OvenQueue[index];
      if (loaf.end_time < Date.now()) {
        setOvenQueue([
          ...OvenQueue.slice(0, index),
          null,
          ...OvenQueue.slice(index + 1),
        ]);
        broadcastBc(breadCoin + loaf.sell_value);
        setBreadCoin(breadCoin + loaf.sell_value);
        animateGainOrLoss(loaf.sell_value);
        setShowTooltip(false);
        setSpeechBubble("SELL");
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
    var message =
      messagesJson[category][
      Math.floor(Math.random() * messagesJson[category].length)
      ];
    setSpeechBubbleText(message);
    setSpeechBubbleDuration(time == -1 ? 2000 : time);
    setSpeechBubbleCount(speechBubbleCount + 1);
  };

  const getBreadTotal = () => {
    var total = 0;
    for (var bread in BreadObject) {
      total += BreadObject[bread].purchase_count;
    }
    return total;
  };

  const emitEvent = (id, value = null, amount = null) => {
    var newEvents = events.slice(0);
    var newEvent = { id: id, value: value, amount: amount };
    newEvents.push(newEvent);
    setEvents(newEvents);
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
        setSupplyObject(playerData.supplies_object);
      }
      if (playerData.bread_object) {
        setBreadObject(playerData.bread_object);
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
        setAchievementsObject(playerData.achievements_object);
      }
      setVisited(true);
    }

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
    if (extensionDetected && visited) {
      setSpeechBubble("RETURN");
    }
  }, [extensionDetected]);

  return (
    <div id="content">
      <Debug resetProgress={reset} setBreadCoin={setBreadCoin} />
      <Tooltip
        show={showTooltip}
        text={tooltipText}
        textAfter={tooltipTextAfter}
        mousePos={tooltipPos}
      />
      <Achievements
        showAchievements={showAchievements}
        setShowAchievements={setShowAchievements}
        AchievementsObject={AchievementsObject}
        setAchievementsObject={setAchievementsObject}
        toggleTooltip={toggleAchievementsTooltip}
        events={events}
        breadCoin={breadCoin}
        setBreadCoin={setBreadCoin}
        setTotalEarned={setTotalEarned}
      />
      <FloatingText
        text={floatingText}
        setText={setFloatingText}
        mousePos={floatingTextPos}
      />

      {!extensionDetected || isMobile || showInfo ? (
        <BlockingScreen
          visited={visited}
          isMobile={isMobile}
          delay={1000}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
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
        />
        <SpeechBubble
          text={speechBubbleText}
          setText={setSpeechBubbleText}
          duration={speechBubbleDuration}
          show={true}
          count={speechBubbleCount}
        />
        <div id="version">
          bread winner v1.0.0b{" "}
          <span
            id="info"
            onClick={() => {
              setShowInfo(true);
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
