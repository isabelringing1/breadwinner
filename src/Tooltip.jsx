import BCSymbol from "./BCSymbol";
import Markdown from "react-markdown";

import timer from "/images/timer.png";
import bwTimer from "/images/bw_timer.png";

function Tooltip(props) {
	const { show, mousePos, contentArray } = props;

	// prevents text from getting cut off at bottom
	if (mousePos[1] > window.innerHeight - 150) {
		mousePos[1] -= document.getElementById("tooltip").offsetHeight + 50;
	}

	return (
		<div
			id="tooltip"
			style={{
				opacity: show ? 1 : 0,
				top: mousePos[1] + "px",
				left: mousePos[0] - 80 + "px",
			}}
		>
			<div id="tooltip-text">
				{contentArray.map((content, i) => {
					content = String(content);
					if (content == "[BC]") {
						return (
							<BCSymbol
								color="black"
								height={15}
								top={1}
								left={1}
								key={"tooltip-content-" + i}
							/>
						);
					} else if (content == "[timer]") {
						return (
							<img
								src={timer}
								id="tooltip-timer-icon"
								key={"tooltip-content-" + i}
								style={{
									top: "-1",
									marginLeft: ".3vh",
								}}
							/>
						);
					} else if (content == "[bw timer]") {
						return (
							<img
								src={bwTimer}
								id="tooltip-timer-icon"
								key={"tooltip-content-" + i}
								style={{
									top: "-1",
									marginLeft: ".3vh",
								}}
							/>
						);
					} else if (content.substr(0, 6) == "[gray]") {
						return (
							<span
								className="gray-text"
								key={"tooltip-content-" + i}
							>
								{content.substr(6)}
							</span>
						);
					} else if (content == "[gray end]") {
					} else {
						if (content.substr(0, 1) == "*") {
							return (
								<Markdown key={"tooltip-content-" + i}>
									{content}
								</Markdown>
							);
						}
						return (
							<span key={"tooltip-content-" + i}>{content}</span>
						);
					}
				})}
			</div>
		</div>
	);
}

export default Tooltip;
