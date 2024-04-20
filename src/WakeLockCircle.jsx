import { useState, useEffect, useRef } from 'react'

import "./WakeLockCircle.css"

function WakeLockCircle(props) {
    const { id, setInWakeLock, finished, onFinished } = props

    const wakeLock = useRef(null)

    useEffect(() => {
        document.addEventListener("visibilitychange", async () => {
            console.log("You switched screens!")
            breakWakeLock();
        });
    }, []);

    const trySetWakeLock = async () => {
        if (finished){
            console.log("Already done")
            return;
        }
        try {
            var wl = await navigator.wakeLock.request("screen");
            wakeLock.current = wl;
            setInWakeLock(true)
            console.log(wl)
            document.getElementById("fill-left").className = "fill";
            document.getElementById("fill-right").className = "fill";
            document.getElementById("wake-lock-container-" + id).className = "wake-lock-container wake-transition"
            setTimeout(() => {
                document.getElementById("wake-lock-container-" + id).className = "wake-lock-container wake-activated"
            }, 400);

            setTimeout(() => {
                console.log("6 seconds have passed.")
                breakWakeLock();
                onFinished();
            }, 6000);

        } catch (err) {
            // The Wake Lock request has failed - usually system related, such as battery.
            console.log(`${err.name}, ${err.message}`)
            console.log("We aren't able to keep the screen awake for you. Please turn off any low battery mode.")
        }
    }

    const breakWakeLock = () => {
        if (wakeLock.current == null || finished){
            console.log(wakeLock.current)
            console.log(finished)
            return;
        }
        console.log("Breaking wake lock")
        wakeLock.current.release().then(() => {
            wakeLock.current = null
            setInWakeLock(false)
        });
        document.getElementById("fill-left").className = "";
        document.getElementById("fill-right").className = "";
        document.getElementById("wake-lock-container-" + id).className = "wake-lock-container"
        document.getElementById("ending-text").className = "ending-text"
        document.getElementById("ending-text").className = "ending-text"
    }

    return (finished ? 
    <div className={"wake-lock-container"} id={"wake-lock-container-" + id }>
        <div className="wake-lock-done"></div> 
    </div>
    :<div className={"wake-lock-container"} id={"wake-lock-container-" + id } onMouseEnter={trySetWakeLock} onMouseLeave={breakWakeLock}>
        <div className="wake-lock-half left" id={"wake-lock-left-" + id }>
            <div id="fill-left"></div>
        </div>
        <div className="wake-lock-half right" id={"wake-lock-right-" + id }>
            <div id="fill-right"></div>
        </div>
    </div>)
    
}

export default WakeLockCircle