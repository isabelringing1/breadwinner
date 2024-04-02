
function BlockingScreen(props){
    const { isMobile } = props
    return (<div id="blocking-screen">
        <div id="blocking-div">
            { isMobile ? 
            "Sorry, but Bread Game does not work on mobile!\nPlease visit on Desktop to play." :
            "No extension detected!"}

        </div>
    </div>)
}

export default BlockingScreen;