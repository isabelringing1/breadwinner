import { useState, useEffect } from 'react'
import { useInterval, msToTime } from './Util'

function Timer(props){
    const { endTime, onTimerEnd } = props

    var [ timeLeft, setTimeLeft ] = useState(null);
    const [status, setStatus] = useState('idle');

    useInterval(() => {
        var t = endTime - Date.now();
        if (t <= 0){
            setStatus('done');
            onTimerEnd();
        }
        setTimeLeft(t);
    }, status === 'running' ? 1000 : null);

    useEffect(()=>{
        var t = endTime - Date.now();
        if (t >= 0){
            setStatus('running');
            setTimeLeft(t);
        }
        else{
            setStatus('done');
            onTimerEnd();
        }
    }, [])

    var timeLeftString = timeLeft != null ? msToTime(timeLeft, true) : "";
    var timerClassName = timeLeft != null && timeLeftString.length > 8 ? "timer small-timer" : "timer";

    return (<div className={timerClassName}> { status === 'done' ? "Done!" : timeLeftString } </div>)

}

export default Timer;