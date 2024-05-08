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

export { resetCheat, setClicksCheat }