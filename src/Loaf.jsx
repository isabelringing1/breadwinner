import { useState } from 'react'
import { interpolateColor, useInterval } from './Util';
import Timer from './Timer'

function Loaf(props){
    const { loaf, index, sellLoaf, toggleTooltip, updateTooltip, loafDone } = props;
    
    const [ready, setReady] = useState(false)
    const [hovered, setHovered] = useState(false)

    const get_percent_done = () => {
        return 1 - (loaf.end_time - Date.now()) / (loaf.end_time - loaf.start_time)
    }

    const get_color = () => {
        const percentDone = get_percent_done()
        if (percentDone >= 1) return loaf.ending_color
        return interpolateColor(loaf.starting_color, loaf.ending_color, percentDone)
    }

    const [color, setColor] = useState(get_color())
    const onLoafDone = () =>{
        loafDone(index);
        setReady(true);
    }

    useInterval(() => {
        setColor(get_color())
        if (hovered){
            updateTooltip(loaf, get_percent_done())
        }
    }, Date.now() >= loaf.end_time ? null : 10);
    

    return <div className={"loaf" + (ready ? " done" : " baking")} id={loaf.id+"-"+index} style={{ backgroundColor: color}}
            onMouseMove={(e) => { 
                var x  = e.clientX < window.innerWidth - 300 ? e.clientX + 30 : e.clientX - 240
                toggleTooltip(true, loaf, [x, e.clientY + 30], get_percent_done());
            }}
            onMouseLeave={() => {
                toggleTooltip(false)
                setHovered(false)
            }}
            onMouseEnter={() => {
                setHovered(true)
                if (!ready){
                    return;
                }
                document.getElementById(loaf.id+"-"+index).classList.remove('done-anim');
                void document.getElementById(loaf.id+"-"+index).offsetWidth;
                document.getElementById(loaf.id+"-"+index).classList.add('done-anim'); 
            }}
            > 
        { ready ? 
        <button className="loaf-button" onClick={() => sellLoaf(index)}>SELL</button>
         : <Timer endTime={loaf.end_time} onTimerEnd={onLoafDone}/>}
    </div>
}

export default Loaf;