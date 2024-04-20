import { useState, useEffect, useRef } from 'react'
import WakeLockCircle from './WakeLockCircle'

import './BlockingScreen.css'
import './Wallet.css'
import './WakeLockCircle.css'
import endingData from './config/ending.json';

function Ending(props){
    const [endingText, setEndingText] = useState("")
    const [endingIndex, setEndingIndex] = useState(0)
    const [buttons, setButtons] = useState([])
    const [buttonColors, setButtonColors] = useState([])
    const [wakeLockShow, setWakeLockShow] = useState([false, false, false])
    const [inWaitLock, setInWakeLock] = useState(null)
    const [wakeLockStates, setWakeLockStates] = useState([false, false, false])

    const loadPart = (index) => {
        var part = endingData.ending[index]
        if (!part){
            console.log("Can't get ending at index " + index)
            return
        }
        var paragraph_text = part.text.split('\n').map((str, i) => <p key={"p-"+index+"-"+i}>{str}</p>);
        console.log(paragraph_text)
        setEndingText(paragraph_text)
        if (part.buttons){
            if (part.buttons[0] == "wake-lock"){
                setWakeLockShow([false, true, false])
                setButtons([])
                setButtonColors([])
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
        console.log("Clicked " + buttonId)
        setEndingIndex(endingIndex + 1)
        loadPart(endingIndex + 1)
    }

    const showWakeLockDiv = () => {
        for (var i = 0; i < wakeLockShow.length; i++){
            if (wakeLockShow[i]){
                return true
            }
        }
        return false
    }

    const onWakeLockFinished = (index) => {
        const newWakeLockStates = wakeLockStates.map((state, i) => {
            if (i == index){
                return true;
            }
            return state;
        })
        setWakeLockStates(newWakeLockStates);
        setWakeLockShow([true, true, true]);
    }

    useEffect(() => {
        loadPart(endingIndex)
    }, [])

    useEffect(() => {
        if (inWaitLock == null){
            return
        }
        else if (inWaitLock){
            setEndingText(<p>Good!</p>)
            document.getElementById("ending-text").className = "ending-text fade-out"
        }
        else{
            setEndingText(<p>{endingData.default_text}</p>)
            document.getElementById("ending-text").className = "ending-text"
        }
    }, [inWaitLock])
    
    return (
    <div className="blocking-screen">
        <div className="blocking-div ending-div">
            <div className='inner-border'>
                <div className="ending-text" id="ending-text">
                    {endingText}
                </div>
                {
                    showWakeLockDiv() ? <div id="wake-lock-div">
                        {wakeLockShow[0] ? <WakeLockCircle id={0} setInWakeLock={setInWakeLock} finished={wakeLockStates[0]} onFinished={() => {onWakeLockFinished(0)}}/> : null}
                        {wakeLockShow[1] ? <WakeLockCircle id={1} setInWakeLock={setInWakeLock} finished={wakeLockStates[1]} onFinished={() => {onWakeLockFinished(1)}}/> : null}
                        {wakeLockShow[2] ? <WakeLockCircle id={2} setInWakeLock={setInWakeLock} finished={wakeLockStates[2]} onFinished={() => {onWakeLockFinished(2)}}/> : null}
                    </div> : null
                }
                
                <div className="ending-buttons">
                    {
                        buttons.map((buttonText, index) => {
                            var buttonClass = "button ending-button " + buttonColors[index]
                            var buttonId = "button-" + endingIndex + "-" + index
                            return <button className={buttonClass} id={buttonId} key={buttonId} onClick={() => {onEndingButtonClicked(buttonId)}}>{buttonText}</button>
                        })
                    }
                </div>
            </div>
        </div>
    </div>)
}

export default Ending