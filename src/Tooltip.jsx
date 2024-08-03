import BCSymbol from './BCSymbol'
import Markdown from 'react-markdown'

function Tooltip(props) {
    const { show, text, textAfter, textAfterAfter, mousePos } = props;

    // prevents text from getting cut off at bottom
    if (mousePos[1] > window.innerHeight - 150) {
        mousePos[1] -= document.getElementById("tooltip").offsetHeight + 50
    }

    return (<div id="tooltip" style={{ opacity: show ? 1 : 0, top: mousePos[1] + "px", left: (mousePos[0] - 80) + "px" }}>
        <div id="tooltip-text"><Markdown>{text}</Markdown> {textAfter ? <BCSymbol color="black" height={15} top={1} /> : null}{textAfter}{textAfterAfter ? <BCSymbol color="black" height={15} top={1} /> : null}{textAfterAfter}</div>
    </div>)
}

export default Tooltip;