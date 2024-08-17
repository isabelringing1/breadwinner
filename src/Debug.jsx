import { useRef, useState, useEffect } from 'react'
import { resetCheat, setClicksCheat } from '../public/debug';
import { broadcastBc } from '../public/extension';

function Debug(props) {
    const { resetProgress, setBreadCoin, ovenQueue, setOvenQueue } = props;
    const [showDebug, setShowDebug] = useState(false);
    const clickInputRef = useRef();
    const BCInputRef = useRef();

    const toggleShowDebug = () => {
        setShowDebug(prevShowDebug => !prevShowDebug);
    }

    const finishOven = () => {
        var newOvenQueue = [ ...ovenQueue ]
        for (var i = 0; i < newOvenQueue.length; i++){
            if (newOvenQueue[i] != null){
                console.log(newOvenQueue[i])
                newOvenQueue[i].end_time = Date.now() - 1;
            }
        }
        setOvenQueue(newOvenQueue);
    }

    useEffect(() => {
        document.addEventListener("keydown", (event) => {
            if (event.code === "KeyD") {
                toggleShowDebug();
            }
        });
        return document.removeEventListener("keydown", (event) => {
            if (event.code === "KeyD") {
                toggleShowDebug();
            }
        });
    }, [])

    return (showDebug ? <div className="debug-menu">
        <button className="button reset-button" onClick={() => { resetProgress(); resetCheat(); }}>Reset?</button><br />
        <input type="number" ref={clickInputRef} /> <button id="set-clicks-button" onClick={() => setClicksCheat(parseInt(clickInputRef.current.value))}> Set Click Count </button>
        <input type="number" ref={BCInputRef} /> <button id="set-bread-coin-button" onClick={() => {
            broadcastBc(parseInt(BCInputRef.current.value))
            setBreadCoin(parseInt(BCInputRef.current.value))
        }}> Set Bread Coin </button>
        <button id="finish-oven-button" onClick={finishOven}> Finish Baking </button>

    </div> : null
    )
}


export default Debug