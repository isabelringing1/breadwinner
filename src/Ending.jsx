import { useState, useEffect, useRef } from 'react'
import WaitCircle from './WaitCircle'

import './BlockingScreen.css'
import './Wallet.css'
import './WaitCircle.css'
import endingData from './config/ending.json';

function Ending(props){
    const { breadTotal, endingState, setEndingState, waitCircleStates, setWaitCircleStates } = props
    const [endingText, setEndingText] = useState("")
    const [endingIndex, setEndingIndex] = useState(0)
    const [buttons, setButtons] = useState([])
    const [buttonColors, setButtonColors] = useState([])
    const [waitCircleShow, setWaitCircleShow] = useState([false, false, false])
    const [wakeLockError, setWakeLockError] = useState(null)

    const inWait = useRef(null)
   

    const loadPart = (index) => {
        var part = endingData.ending[index]
        if (!part){
            console.log("Can't get ending at index " + index)
            return
        }
        if (part.replace){
            if (part.replace == "TOTAL"){
                part.text = part.text.replace("TOTAL", breadTotal)
            }
        }
        var paragraph_text = part.text.split('\n').map((str, i) => <p key={"p-"+index+"-"+i}>{str}</p>);
        setEndingText(paragraph_text)
        if (part.buttons){
            if (part.buttons[0] == "wait-circle"){
                setEndingState("WAIT")
            }
            else{
                setButtons(part.buttons)
                setButtonColors(part.buttonColors)
            } 
        }
        else{
            setButtons(["Next"])
            setButtonColors(["green"])
        }
    }

    const onEndingButtonClicked = (buttonId) => {
        setEndingIndex(endingIndex + 1)
        loadPart(endingIndex + 1)
    }

    const onDeclineButtonClicked = () => {
        setEndingState("NOT_READY");
    }

    const showWaitCircleDiv = () => {
        for (var i = 0; i < waitCircleShow.length; i++){
            if (waitCircleShow[i]){
                return true
            }
        }
        return false
    }

    const onWaitCircleFinished = (index) => {
        var finished = true;
        const newWaitCircleStates = waitCircleStates.map((state, i) => {
            if (i == index){
                return true;
            }
            if (!state){
                finished = false;
            }
            return state;
        });
        setWaitCircleStates(newWaitCircleStates);
        setWaitCircleShow([true, true, true]);
        
        console.log(newWaitCircleStates)
        if (finished){
            setEndingState("FINISHED")
        }
    }

    useEffect(() => {
        if (endingState == "READY"){
            loadPart(endingIndex)
        }
        else if (endingState == "WAIT"){ // set up wait circles
            setEndingText(<p>{endingData.default_text}</p>)
            if (!waitCircleStates[1]){
                setWaitCircleShow([false, true, false])
            }
            else{
                setWaitCircleShow([true, true, true])
            }
            setButtons([])
            setButtonColors([])
            for (var i = 0; i < waitCircleStates.length; i++){
                if (waitCircleStates[i]){
                    document.getElementById("column-" + (i + 1)).className = "column transparent"
                }
            }
        }
        else if (endingState == "FINISHED"){
            console.log("ending state is finished")
        }
        
    }, [endingState])

    return (
    <div className="blocking-screen">
        <div className="blocking-div ending-div">
            <div className='inner-border'>
                <div className="ending-text" id="ending-text">
                    {endingText}
                </div>
                {
                    showWaitCircleDiv() ? <div id="wait-div">
                        {waitCircleShow[0] ? <WaitCircle id={0} inWait={inWait} setWakeLockError={setWakeLockError} finished={waitCircleStates[0]} onFinished={() => {onWaitCircleFinished(0)}} setEndingText={setEndingText} defaultText={endingData.default_text}/> : null}
                        {waitCircleShow[1] ? <WaitCircle id={1} inWait={inWait} setWakeLockError={setWakeLockError} finished={waitCircleStates[1]} onFinished={() => {onWaitCircleFinished(1)}} setEndingText={setEndingText} defaultText={endingData.default_text}/> : null}
                        {waitCircleShow[2] ? <WaitCircle id={2} inWait={inWait} setWakeLockError={setWakeLockError} finished={waitCircleStates[2]} onFinished={() => {onWaitCircleFinished(2)}} setEndingText={setEndingText} defaultText={endingData.default_text}/> : null}
                    </div> : null
                }
                
                <div className="ending-buttons">
                    {
                        buttons.map((buttonText, index) => {
                            var buttonClass = "button ending-button " + buttonColors[index]
                            var buttonId = "button-" + endingIndex + "-" + index
                            return <button className={buttonClass} id={buttonId} key={buttonId} onClick={() => {
                                if (buttonColors[index] == "red"){
                                    onDeclineButtonClicked()
                                }
                                else{
                                    onEndingButtonClicked(buttonId)
                                }
                            }}>{buttonText}</button>
                        })
                    }
                </div>
                { wakeLockError ? <div id="wake-lock-error">{wakeLockError}</div> : null}
            </div>
        </div>
    </div>)
}

export default Ending