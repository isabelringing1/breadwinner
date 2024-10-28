import { useState, useEffect } from "react";
import { resetCheat } from "../public/debug";
import { msToTime } from "./Util";

import "./BlockingScreen.css";

function BlockingScreen(props) {
	const {
		extensionDetected,
		visited,
		isMobile,
		blockingCategory,
		setBlockingCategory,
		delay,
		startTime,
		envelopeUnlocks,
		resetProgress,
	} = props;

	var shouldShow = !extensionDetected || isMobile || blockingCategory;

	const [content, setContent] = useState(false);

	const [delayPassed, setDelayPassed] = useState(false);

	const mobileInfo =
		"Sorry, but Bread Winner does not work on mobile!\nPlease visit on Desktop to play.";

	const questionMarkInfo = (
		<div>
			<div className="blocking-screen-title">
				Welcome to Bread Winner!
			</div>
			<div className="blocking-screen-text">
				Where no matter what you do... you can't NOT be productive.{" "}
			</div>
			<div className="blocking-screen-text">
				You'll need the{" "}
				<a
					href="https://chromewebstore.google.com/detail/bread-winner-companion/mlfplmodeiemagcbcfofdmfcahjaafel"
					target="_blank"
					rel="noreferrer"
				>
					Chrome
				</a>{" "}
				or{" "}
				<a
					href="https://addons.mozilla.org/en-US/firefox/addon/bread-winner-companion/"
					target="_blank"
					rel="noreferrer"
				>
					Firefox
				</a>{" "}
				extension to play (other browsers not supported yet, sorry!)
			</div>
			<div className="credits">
				<div className="blocking-screen-text">
					Have thoughts, questions, or bugs to report? Any{" "}
					<a
						href="https://forms.gle/XZsfyj8Vem2RhEYHA"
						target="_blank"
						rel="noreferrer"
					>
						feedback
					</a>{" "}
					is welcome.
				</div>
				<div className="blocking-screen-text">v1.0.0b</div>
			</div>
		</div>
	);

	const noExtensionInfo = (
		<div>
			<div className="blocking-screen-title">
				Welcome to Bread Winner!
			</div>
			<div className="blocking-screen-text">
				We noticed you don't have the Bread Winner companion extension
				installed yet. Follow these links to the right extension page
				and we'll be waiting for you when you get back!
			</div>
			<div className="blocking-screen-link">
				<a
					className="extension-link"
					href="https://chromewebstore.google.com/detail/bread-winner-companion/mlfplmodeiemagcbcfofdmfcahjaafel"
					target="_blank"
					rel="noreferrer"
				>
					Chrome
				</a>
				&emsp;
				<a
					className="extension-link"
					href="https://addons.mozilla.org/en-US/firefox/addon/bread-winner-companion/"
					target="_blank"
					rel="noreferrer"
				>
					Firefox
				</a>
			</div>
			{visited ? (
				<div className="blocking-screen-hint">
					Having trouble? Try refreshing the page, or allowing
					permissions if you're using the Firefox extension.
				</div>
			) : null}
		</div>
	);

	const endingInfo = () => {
		return (
			<div className="blocking-screen-container">
				<div className="blocking-screen-title">Congrats, Baker!</div>
				<div className="blocking-screen-text">
					You reached banana bread in {getEndingTime()}.
				</div>
				<button
					className="button reset-button"
					onClick={() => {
						resetProgress();
						resetCheat();
					}}
				>
					Reset Progress
				</button>
			</div>
		);
	};

	const loader = <div className="loader"></div>;

	const getEndingTime = () => {
		var endTime = Date.now();
		for (var i in envelopeUnlocks) {
			if (envelopeUnlocks[i][0] == "banana") {
				endTime = envelopeUnlocks[i][2];
			}
		}
		var timeStr = msToTime(endTime - startTime, true);
		return timeStr;
	};

	setTimeout(() => {
		setDelayPassed(true);
	}, delay);

	const onBGClicked = () => {
		if (blockingCategory != null) {
			setBlockingCategory(null);
		}
	};

	useEffect(() => {
		if (isMobile) {
			setContent(mobileInfo);
		} else if (blockingCategory == "question-mark") {
			setContent(questionMarkInfo);
		} else if (blockingCategory == "ending-crown") {
			setContent(endingInfo);
		} else if (delayPassed) {
			setContent(noExtensionInfo);
		} else {
			setContent(loader);
		}
	}, [blockingCategory, isMobile]);

	return shouldShow ? (
		<div className="blocking-screen" onClick={onBGClicked}>
			<div className="blocking-div">
				<div className="inner-border">{content}</div>
			</div>
		</div>
	) : null;
}

export default BlockingScreen;
