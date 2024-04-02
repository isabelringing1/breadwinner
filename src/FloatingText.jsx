import { useEffect } from "react";

function FloatingText(props){
    const { text, setText, mousePos } = props;

    useEffect(() => {
        if (text == ""){
            return;
        }
        var t = document.getElementById("floating-text");
        t.classList.add('activated');
        setTimeout(() => {
            t.classList.remove('activated');
            setText("")
        }, 600);
    } , [text])

    return (<div id="floating-text" style={{top: mousePos[1] + "px", left: mousePos[0] + "px"}}>
        {text}
    </div>)
}

export default FloatingText;