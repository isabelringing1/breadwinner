import { useEffect } from "react";

function SpeechBubble(props) {
	var { text, setText, duration, show, count } = props;

	useEffect(() => {
		if (text == "" || !show) {
			return;
		}
		var s = document.getElementById("speech-bubble");
		var t = document.getElementById("speech-bubble-tail");
		s.classList.remove("float-up");
		t.classList.remove("float-up-tail");
		setTimeout(() => {
			s.classList.add("float-up");
			t.classList.add("float-up-tail");
		});
	}, [count]);

	return show ? (
		<div id="speech-bubble-container">
			<div id="speech-bubble">{text}</div>
			<div id="speech-bubble-tail"></div>
		</div>
	) : null;
}

export default SpeechBubble;
