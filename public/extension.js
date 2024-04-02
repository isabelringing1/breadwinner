function requestClickCount(){
    console.log("requesting clicks")
    window.postMessage({
      id: "getClicks"
    });
}

function spendClicks(clicks){
    window.postMessage({
      id: "spendClicks",
      amount: clicks
    });
}

function broadcastBc(bc){
  console.log("Broadcasting ", bc)
  window.postMessage({
    id: "broadcastBc",
    bc: bc
  });
}

function requestKeyCount(){
  window.postMessage({
    id: "getKeys"
  })
}

function spendKeys(keys){
  window.postMessage({
    id: "spendKeys",
    amount: keys
  });
}

function unlockKeys(){
  window.postMessage({
    id: "unlockKeys",
  });
}

function registerForMessages(setClicks, setKeys, setKeyUnlocked){
    window.addEventListener("message", (event) => {
        if (event.data.id == "updatedClicks"){
          setClicks(event.data.clicks ?? 0);
        }
        else if (event.data.id == "updatedKeys"){
          setKeys(event.data.keys ?? 0);
          setKeyUnlocked(true)
        }
    });
}

export { requestClickCount, registerForMessages, spendClicks, broadcastBc, requestKeyCount, spendKeys, unlockKeys }