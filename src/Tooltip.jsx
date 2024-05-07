import BCSymbol from './BCSymbol'

function Tooltip(props){
    const { show, text, textAfter, mousePos } = props;

    // prevents text from getting cut off at bottom
    if (mousePos[1] > window.innerHeight - 150){
        mousePos[1] -= document.getElementById("tooltip").offsetHeight + 50
    }

    return (<div id="tooltip" style={{opacity: show ? 1 : 0, top: mousePos[1] + "px", left: (mousePos[0] - 80) + "px"}}>
        <div id="tooltip-text">{text} {textAfter ? <BCSymbol color="black" height={15} top={1}/> : null}{textAfter}</div>
        
    </div>)
}

export default Tooltip;