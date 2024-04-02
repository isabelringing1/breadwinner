function resetCheat(){
    console.log("reset")
    window.postMessage({
      id: "resetClicks"
    });
  }
  
function setClicksCheat(amount){
    console.log(amount)
    window.postMessage({
        id: "setClicks",
        amount: amount
    });
}

export { resetCheat, setClicksCheat }