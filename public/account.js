import bison from '@jeffriggle/bison/dist/esm/index';

function saveData(player){
    //console.log("Saving: ", JSON.stringify(player));
    //var binary = bison.encode(player);
    //console.log("binary", binary)
    localStorage.setItem("bread_data", JSON.stringify(player));
}

function loadData(){
    var saveData = localStorage.getItem("bread_data");
    if (saveData != null){
        try{
            console.log("Loaded Save Data: ");
            console.log(JSON.parse(saveData))
            return JSON.parse(saveData)
           //var player = bison.decode(saveData);
        }
        catch (e) {
            console.error(e)
        }
    }
}

export { saveData, loadData }