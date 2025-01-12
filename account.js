function saveData(player){
    var saveString = JSON.stringify(player)
    localStorage.setItem("bread_data", window.btoa(saveString));
}

function loadData(){
    var saveData = localStorage.getItem("bread_data");
    if (saveData != null){
        try {
            saveData = JSON.parse(window.atob(saveData));
        } catch (e) {
            console.log("Detected old save method")
            saveData = JSON.parse(saveData)
        }
        return saveData
    }
}

export { saveData, loadData }