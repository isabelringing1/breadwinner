import { useState, useEffect, useRef } from 'react'

import "./WaitCircle.css"
import hand1 from '/images/hand1.svg'
import hand2 from '/images/hand2.svg'

function WaitCircle(props) {
    const { id, inWait, setInWait, onCancel, onFinished, seconds, emitEvent } = props
    const [hand, setHand] = useState(null)

    document.getElementById("root").style.setProperty("--wait-seconds", seconds + "s");
    document.getElementById("root").style.setProperty("--wait-seconds-half", (seconds/2) + "s");

    const wakeLock = useRef(null)
    const finished = useRef(false)
    const eventInterval = useRef(null)
    const counter = useRef(0);

    useEffect(() => {
        document.addEventListener("visibilitychange", async () => {
            breakWait();
        });
    }, []);

    const trySetWait = async () => {
        console.log("try set wait")
        if (finished.current){
            return;
        }
        try {
            var wl = await navigator.wakeLock.request("screen");
            wakeLock.current = wl;
            //setEndingText(<p>Good.</p>)
            setTimeout(() => {
                if (!inWait){
                    return
                }
                //setEndingText(<p>Now go!</p>)
                //document.getElementById("ending-text").className = "ending-text fade-out"
            }, 2000)

            document.getElementById("fill-left-" + id).className = "fill";
            document.getElementById("fill-right-" + id).className = "fill";
            document.getElementById("wait-container-" + id).className = "wait-container wait-transition"
            setHand(hand1)
            setTimeout(() => {
                document.getElementById("wait-container-" + id).className = "wait-container wait-activated"
                setHand(hand2)
            }, 600);

            eventInterval.current = setInterval(() => {
                counter.current += 1;
                emitEvent("productivity", Number(id.slice(-1)), counter.current);
            }, 1000)

            setTimeout(() => {
                if (!inWait){
                    return
                }
                onFinished();
                breakWait();
                clearInterval(eventInterval.current);
            }, seconds * 1000);

        } catch (err) {
            // The Wake Lock request has failed - usually system related, such as battery.
            console.log(`${err.name}, ${err.message}`)
            //setWakeLockError("We aren't able to keep the screen awake for you. Please make sure low battery mode is off or change your settings manually to keep the screen awake.")
        }
    }

    const breakWait = () => {
        if (wakeLock.current == null || finished.current){
            setInWait(false);
            clearInterval(eventInterval.current);
            emitEvent("productivity", Number(id.slice(-1)), 0);
            onCancel()
            return;
        }

        onCancel();
        setHand(null)
        wakeLock.current.release().then(() => {
            wakeLock.current = null
            setInWait(false);
            clearInterval(eventInterval.current);
            emitEvent("productivity", Number(id.slice(-1)), 0);
            //setEndingText(<p>{defaultText}</p>)
            //document.getElementById("ending-text").className = "ending-text"
        });
        document.getElementById("fill-left-" + id).className = "";
        document.getElementById("fill-right-" + id).className = "";
        document.getElementById("wait-container-" + id).className = "wait-container"
        //document.getElementById("ending-text").className = "ending-text"
    }

    return (finished.current ? 
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