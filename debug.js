function resetCheat(){
    window.postMessage({
      id: "resetClicks"
    });
  }
  
function setClicksCheat(amount){
    window.postMessage({
        id: "setClicks",
        amount: amount
    });
}

function setKeysCheat(amount) {
    window.postMessage({
        id: "setKeys",
        amount: amount
    });
}

export { resetCheat, setClicksCheat, setKeysCheat }