import { useState, useEffect, useRef } from 'react'

import "./WaitCircle.css"
import hand1 from '/images/hand1.svg'
import hand2 from '/images/hand2.svg'

function WaitCircle(props) {
    const { id, inWait, setWakeLockError, finished, onFinished, setEndingText, defaultText } = props
    const [hand, setHand] = useState(null)

    const wakeLock = useRef(null)

    useEffect(() => {
        document.addEventListener("visibilitychange", async () => {
            breakWait();
        });
    }, []);

    const trySetWait = async () => {
        if (finished){
            return;
        }
        try {
            var wl = await navigator.wakeLock.request("screen");
            wakeLock.current = wl;
            inWait.current = true;
            setEndingText(<p>Good.</p>)
            setTimeout(() => {
                if (!inWait.current){
                    return
                }
                setEndingText(<p>Now go!</p>)
                document.getElementById("ending-text").className = "ending-text fade-out"
            }, 2000)

            document.getElementById("fill-left-" + id).className = "fill";
            document.getElementById("fill-right-" + id).className = "fill";
            document.getElementById("wait-container-" + id).className = "wait-container wait-transition"
            document.getElementById("column-" + (id + 1)).className = "column slow-fade"
            if (id == 0 || id == 2){
                document.getElementById("tile-" + (id + 1)).className = "tile-bg slow-fade"
            }
            setHand(hand1)
            setTimeout(() => {
                document.getElementById("wait-container-" + id).className = "wait-container wait-activated"
                setHand(hand2)
            }, 400);

            setTimeout(() => {
                if (!inWait.current){
                    return
                }
                onFinished();
                breakWait();
                document.getElementById("column-" + (id+ 1)).className = "column transparent"
                if (id == 0 || id == 2){
                    document.getElementById("tile-" + (id + 1)).className = "tile-bg transparent"
                }
            }, 1800000);

        } catch (err) {
            // The Wake Lock request has failed - usually system related, such as battery.
            console.log(`${err.name}, ${err.message}`)
            setWakeLockError("We aren't able to keep the screen awake for you. Please make sure low battery mode is off or change your settings manually to keep the screen awake.")
        }
    }

    const breakWait = () => {
        if (wakeLock.current == null || finished){
            inWait.current = false;
            setEndingText(<p>{defaultText}</p>)
            document.getElementById("ending-text").className = "ending-text"
            document.getElementById("column-" + (id+ 1)).className = "column"
            if (id == 0 || id == 2){
                document.getElementById("tile-" + (id + 1)).className = "tile-bg"
            }
            return;
        }

        setHand(null)
        wakeLock.current.release().then(() => {
            wakeLock.current = null
            inWait.current = false;
            setEndingText(<p>{defaultText}</p>)
            document.getElementById("ending-text").className = "ending-text"
        });
        document.getElementById("fill-left-" + id).className = "";
        document.getElementById("fill-right-" + id).className = "";
        document.getElementById("wait-container-" + id).className = "wait-container"
        document.getElementById("ending-text").className = "ending-text"
        document.getElementById("column-" + (id+ 1)).className = "column"
        if (id == 0 || id == 2){
            document.getElementById("tile-" + (id + 1)).className = "tile-bg"
        }
    }

    return (finished ? 
    <div className={"wait-container"} id={"wait-container-" + id }>
        <div className="wait-done"></div> 
    </div>
    :<div className={"wait-container"} id={"wait-container-" + id } onMouseEnter={trySetWait} onMouseLeave={breakWait}>
        { hand != null ? <div className='hand-container'><img className="hand" src={hand}/></div> : null }
        <div className="wait-half left" id={"wait-left-" + id }>
            <div id={"fill-left-" + id}></div>
        </div>
        <div className="wait-half right" id={"wait-right-" + id }>
            <div id={"fill-right-" + id}></div>
        </div>
    </div>)
    
}

export default WaitCircle