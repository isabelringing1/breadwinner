import { useState, useEffect, useRef } from 'react'
import { saveData, loadData } from '../public/account';
import { requestClickCount, registerForMessages, spendClicks, broadcastBc, requestKeyCount, spendKeys, unlockKeys } from '../public/extension';
import { formatNumber, formatPercent } from './Util'

import Debug from './Debug'
import Tooltip from './Tooltip';
import CardList from './CardList'
import Wallet from './Wallet'
import Oven from './Oven'
import BCSymbol from './BCSymbol'
import BlockingScreen from './BlockingScreen';
import FloatingText from './FloatingText';
import SpeechBubble from './SpeechBubble'

import tile from '/src/images/tile.png'
import shadow from '/src/images/shadow.png'

import './App.css'

import breadJson from './config/bread.json';
import suppliesJson from './config/supplies.json';
import messagesJson from './config/messages.json';

function App() {
  const [clicks, setClicks] = useState(null);
  const [keys, setKeys] = useState(null);
  const [keyUnlocked, setKeyUnlocked] = useState(false);
  const [multiplier, setMultiplier] = useState(null);
  const [breadCoin, setBreadCoin] = useState(0);
  const [SupplyObject, setSupplyObject] = useState(suppliesJson);
  const [BreadObject, setBreadObject] = useState(breadJson);
  const [OvenQueue, setOvenQueue] = useState([null, null, null, null]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipTextAfter, setTooltipTextAfter] = useState("");
  const [tooltipPos, setTooltipPos] = useState("");
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [floatingText, setFloatingText] = useState("");
  const [floatingTextPos, setFloatingTextPos] = useState("")
  const [speechBubbleText, setSpeechBubbleText] = useState("")
  const [speechBubbleDuration, setSpeechBubbleDuration] = useState(2000)
  
  const convertForSave = () => {
    var player = {
      multiplier: multiplier ?? 1.0,
      bread_coin: breadCoin ?? 0,
      supplies_object: SupplyObject,
      bread_object: BreadObject,
      oven_queue: OvenQueue,
      total_spent: totalSpent,
      total_earned: totalEarned,
      total_clicks: totalClicks,
      key_unlocked: keyUnlocked
    }
    return player;
  }

  const reset = () => {
    setSupplyObject(suppliesJson);
    setBreadObject(breadJson);
    setOvenQueue([null, null, null, null]);
    setMultiplier(1);
    setBreadCoin(0);
    broadcastBc(0);
    setTotalSpent(0);
    setTotalEarned(0);
    setTotalClicks(0);
    setKeyUnlocked(false);
  }

  const isSupplyPurchased = (id) => {
    return SupplyObject[id].purchased;
  }

  const shouldShowBread = (id) => {
    var bread = BreadObject[id];
    if (totalEarned == 0 || bread == null){
      return false;
    }

    if (id == "white"){
      return true;
    }
    if (!bread.unlocked && BreadObject[bread.previous].purchase_count > 0){
      console.log("Unlocking " + id)
      bread.unlocked = true;
    }
    return bread.unlocked;
  }

  const isBreadDisabled = (id) => {
    return BreadObject[id].cost > breadCoin;
  }

  const shouldShowSupply = (id) => {
    if (totalSpent == 0){
      return false;
    }

    var supply = SupplyObject[id];
    if (id == "mixing_bowl"){
      return !isSupplyPurchased(id);
    }
    else if (supply.keys){
      return !isSupplyPurchased(id);
    }
    else if (supply.oven_increase){
      if (!supply.unlocked && breadCoin >= supply.cost * 0.5){
        supply.unlocked = true;
      }
    }
    else if (!supply.unlocked && isSupplyPurchased(supply.previous)){
      supply.unlocked = true;
    }
    
    return supply.unlocked && !isSupplyPurchased(id);
  }

  const isSupplyDisabled = (id) => {
    return SupplyObject[id].cost > breadCoin;
  }

  const TryBuyBread = (id, mousePos) => {
    console.log("Trying to buy bread " + id);
    var bread = BreadObject[id];
    var nextOpen = -1;
    for (var i = 0; i < OvenQueue.length; i++){
      if (OvenQueue[i] == null){
        nextOpen = i;
        break;
      }
    }
    if (nextOpen == -1){
      console.log("Oven is full");
      setFloatingText("Oven full!")
      setFloatingTextPos(mousePos)
      return false;
    }
    else if (!bread || bread.cost > breadCoin){
      console.log("Couldn't buy " + id);
      return false;
    }
    console.log("Success buying " + id);

    var now = Date.now()
    var loaf = {
      id: id,
      purchase_count: bread.purchase_count,
      display_name: bread.display_name,
      starting_color: bread.starting_color ?? "#FFE7B7",
      ending_color: bread.ending_color ?? "#BB7F0A",
      start_time: now,
      end_time: now + (bread.bake_time * 1000),
      sell_value: Math.floor(bread.cost * bread.markup)
    }
    var newOvenQueue = [
      ...OvenQueue.slice(0, nextOpen),
      loaf,
      ...OvenQueue.slice(nextOpen + 1)
    ];
    setOvenQueue(newOvenQueue);

    var newBread = { ...BreadObject }
    newBread[id].purchase_count++;
    spendBreadCoin(bread.cost)
    setTotalSpent(totalSpent + bread.cost)
    newBread[id].cost = Math.floor(newBread[id].cost * bread.increase_rate)
    setBreadObject(newBread);
    updateBreadTooltip(newBread[id])
  }

  const TryBuySupply = (id, mousePos) => {
    console.log("Trying to buy supply " + id);
    var supply = SupplyObject[id];
    if (!supply || supply.cost > breadCoin){
      console.log("Couldn't buy " + id);
      return false;
    }

    console.log("Success buying " + id);
    spendBreadCoin(supply.cost)
    setTotalSpent(totalSpent + supply.cost)
    var newSupply = { ...SupplyObject }
    newSupply[id].purchased = true;
    setSupplyObject(newSupply);
    if (supply.keys){
      setKeyUnlocked(true);
      unlockKeys();
    }
    else if (supply.multiplier){
      setMultiplier(multiplier * supply.multiplier)
    }
    else if (supply.oven_increase){
      var newOvenQueue = [
        ...OvenQueue,
        null
      ];
      setOvenQueue(newOvenQueue);
    }
  }

  const convertClicksToBreadCoin = () => {
    var earnedCoin = Math.round(clicks * multiplier)
    broadcastBc(breadCoin + earnedCoin)
    setBreadCoin(breadCoin + earnedCoin)
    setTotalEarned(totalClicks + earnedCoin)
    animateGainOrLoss(earnedCoin)
    setTotalClicks(totalClicks + clicks)
    spendClicks(clicks);
  }

  const spendBreadCoin = (amount) => {
    broadcastBc(breadCoin - amount)
    setBreadCoin(breadCoin - amount);
    animateGainOrLoss(-amount)
  }

  const convertKeysToMultiplier = () => {
    setMultiplier(multiplier + (keys * .000001))
    spendKeys(keys)
  }

  const toggleTooltip = (show, item = null, mousePos = [0, 0]) => {
    if (item != null){
      setTooltipText(item.desc);
      setTooltipTextAfter("")
    }
    setTooltipPos(mousePos);
    setShowTooltip(show);
  }

  const toggleBreadTooltip = (show, item = null, mousePos = [0, 0]) => {
    if (item != null){
      updateBreadTooltip(item)
    }
    setTooltipPos(mousePos);
    setShowTooltip(show);
  }

  const updateBreadTooltip = (item) => {
    var sell_price = Math.floor(item.cost * item.markup)
    var times = item.purchase_count == 1 ? " time." : " times."
    var text = item.desc + "\nSell for " + formatPercent(item.markup) + " of the original price ("
    var textAfter = formatNumber(sell_price) + ").\nYou've baked this " + item.purchase_count + times
    setTooltipText(text);
    setTooltipTextAfter(textAfter)
  }

  const toggleLoafTooltip = (show, item = null, mousePos = [0, 0], percent_done = -1) => {
    if (item != null){
      updateLoafTooltip(item, percent_done);
    }
    setTooltipPos(mousePos);
    setShowTooltip(show);
  }

  const updateLoafTooltip = (item, percent_done) => {
    var progress_text = Math.floor(percent_done * 100) + "% done"
    if (percent_done >= 1){
      progress_text = "Ready!"
    }

    var text = item.display_name + " - " + progress_text + "\nSells for  "
    var textAfter = formatNumber(item.sell_value)
    setTooltipText(text);
    setTooltipTextAfter(textAfter)
  }

  const toggleConvertClicksTooltip = (show, mousePos = [0, 0]) => {
    if (show){
      var text = "Convert for +"
      var textAfter = Math.round(clicks * multiplier)
      setTooltipText(text);
      setTooltipTextAfter(textAfter);
    }
    setTooltipPos(mousePos);
    setShowTooltip(show);
  }

  const toggleConvertKeysTooltip = (show, mousePos = [0, 0]) => {
    if (show){
      var text = "Increase your multiplier by tiny amount with every key. Convert for +" + (keys * .000001) + "."
      setTooltipText(text);
      setTooltipTextAfter("")
    }
    setTooltipPos(mousePos);
    setShowTooltip(show);
  }

  const sellLoaf = (index) => {
    if (index < OvenQueue.length){
      var loaf = OvenQueue[index];
      if (loaf.end_time < Date.now()){
        setOvenQueue([
          ...OvenQueue.slice(0, index),
          null,
          ...OvenQueue.slice(index + 1)
        ]);
        broadcastBc(breadCoin + loaf.sell_value)
        setBreadCoin(breadCoin + loaf.sell_value)
        animateGainOrLoss(loaf.sell_value)
        return;
      }
    }
    console.error("Error trying to sell loaf at index " + index);
  }

  const animateGainOrLoss = (amount) => {
    var num = document.getElementById("bc-anim");
    num.style.color = amount > 0 ? "#76b812" : "red";
    num.innerHTML = (amount > 0 ? "+" : "") + formatNumber(amount);
    num.classList.remove('float');
    void num.offsetWidth;
    num.classList.add('float'); 
  }

  const setSpeechBubble = (category, time = -1) => {
    if (messagesJson[category] == null){
      console.log("Could not find a message in category " + id);
      return;
    }
    var message = messagesJson[category][Math.floor(Math.random() * messagesJson[category].length)]
    setSpeechBubbleText(message);
    setSpeechBubbleDuration(time == -1 ? 2000 : time);
  }

  useEffect(() => {
    registerForMessages(setClicks, setKeys, setKeyUnlocked);
    document.addEventListener("visibilitychange", (event) => {
      if (document.visibilityState == "visible") {
        requestClickCount();
        requestKeyCount();
      }
    });
    requestClickCount();
    requestKeyCount();

    var playerData = loadData();
    if (playerData){
      setMultiplier(playerData.multiplier);
      if (playerData.supplies_object){
        setSupplyObject(playerData.supplies_object);
      }
      if (playerData.bread_object){
        setBreadObject(playerData.bread_object);
      }
      if (playerData.bread_coin){
        broadcastBc(playerData.bread_coin)
        setBreadCoin(playerData.bread_coin)
      }
      if (playerData.oven_queue){
        setOvenQueue(playerData.oven_queue)
      }
      if (playerData.total_spent){
        setTotalSpent(playerData.total_spent)
      }
      if (playerData.total_earned){
        setTotalEarned(playerData.total_earned)
      }
      if (playerData.total_clicks){
        setTotalClicks(playerData.total_clicks)
      }
      if (playerData.key_unlocked){
        setKeyUnlocked(playerData.key_unlocked);
      }
    }

    setSpeechBubble("RETURN");

    return () => {
      document.removeEventListener("visibilitychange", (event) => {
        if (document.visibilityState == "visible") {
          requestClickCount();
          requestKeyCount();
        }
      });
    }
  }, []);

  useEffect(() => {
    saveData(convertForSave())
  }, [breadCoin])

  return (<div id="content">
    <Debug resetProgress={reset} setBreadCoin={setBreadCoin}/>
    <Tooltip show={showTooltip} text={tooltipText} textAfter={tooltipTextAfter} mousePos={tooltipPos}/>
    <FloatingText text={floatingText} setText={setFloatingText} mousePos={floatingTextPos} />

    { clicks ? null : <BlockingScreen isMobile={false}/>}
    
    <div id="column-one" className="column">
      <Wallet clicks={clicks} keys={keys} multiplier={multiplier} convertClicks={convertClicksToBreadCoin} convertKeys={convertKeysToMultiplier} toggleClicksTooltip={toggleConvertClicksTooltip} toggleKeysTooltip={toggleConvertKeysTooltip} keyUnlocked={keyUnlocked}/>
    
      { SupplyObject ? <CardList id="supply-list" title="Kitchen Supplies" items={Object.values(SupplyObject)} onCardClicked={TryBuySupply} shouldShow={shouldShowSupply} toggleTooltip={toggleTooltip} shouldDisable={isSupplyDisabled} maxItems={4}/> : null }
    </div>

    <div id="column-two" className="column">
      <div id="bc-container">
        <div id="bread-coin"><BCSymbol color="black"/><span id="bc-num"><span id="bc-anim">100</span>{formatNumber(breadCoin) ?? "?"} </span></div>
      </div>
      <Oven queue={OvenQueue} sellLoaf={sellLoaf} toggleTooltip={toggleLoafTooltip} updateTooltip={updateLoafTooltip} shouldShow={totalSpent > 0}/>
      <SpeechBubble text={speechBubbleText} setText={setSpeechBubbleText} duration={speechBubbleDuration}/>
    </div>

    <div id="column-three" className="column">
      { BreadObject ? <CardList id="bread-list" title="Recipe Book" items={Object.values(BreadObject)} onCardClicked={TryBuyBread} shouldShow={shouldShowBread} toggleTooltip={toggleBreadTooltip} shouldDisable={isBreadDisabled} maxItems={9}/> : null }
    </div>
    <div id="background">
      <img src={tile} className='tile-bg' id='tile-left'/>
      <img src={tile} className='tile-bg' id='tile-right'/>
      <img src={shadow} id='shadow'/>
    </div>
  </div>
    
  );
}

export default App
