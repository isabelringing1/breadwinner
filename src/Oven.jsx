import Loaf from './Loaf'
import './Oven.css'

import engravement from "/images/engravement.png"

function Oven(props) {
    const { queue, sellLoaf, toggleTooltip, updateTooltip, shouldShow, setAllDone } = props;
    
    const onLoafDone = (i) => {
        for (var i = 0; i < queue.length; i++){
            if (queue[i] == null || Date.now() < queue[i].end_time){
                setAllDone(false);
                return;
            }
        }
        setAllDone(true);
    }

    const getSlot = (i) => {
        if (i >= queue.length) {
            return null;
        }
        if (queue[i] != null) {
            return <Loaf loaf={queue[i]} index={i} key={queue[i].id + "-" + i} sellLoaf={sellLoaf} toggleTooltip={toggleTooltip} updateTooltip={updateTooltip} loafDone={onLoafDone} />
        }
        return <div className="loaf empty" key={"empty-slot-" + i}></div>
    }
    const rows = [];

    for (let i = 0; i < queue.length; i += 4) {
        rows.push(<div className="oven-row-container" id={"oven-row-container-" + i} key={"oven-row-container-" + i}>
            <div className="oven-row">
                <div className="loaf-container">{getSlot(i)}</div>
                <div className="loaf-container">{getSlot(i + 1)}</div>
                <div className="loaf-container">{getSlot(i + 2)}</div>
                <div className="loaf-container">{getSlot(i + 3)}</div>
            </div>
        </div>)
    }
    return (shouldShow ? <div id="oven">
        <div id="oven-engravement">Dough & Co <img src={engravement} className="oven-engravement-img"/> </div>
        {rows}
    </div> : null)
}

export default Oven;