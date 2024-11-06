import { useState, useEffect } from "react";
import { resetCheat } from "../public/debug";
import { msToTime, formatNumber } from "./Util";

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
		inTrialMode,
		startTrialMode,
		breadBaked,
		totalClicks,
		totalKeys,
		AchievementsObject,
	} = props;

	var shouldShow =
		(!extensionDetected && !inTrialMode) || isMobile || blockingCategory;

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
				You’ll want the companion extension installed for the full
				experience:
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
			<div className="blocking-screen-text">
				Want to check it out without the extension? You can play in{" "}
				<a onClick={startTrialMode}>trial mode</a> first, where clicks
				are only tracked in the Bread Winner website.
			</div>
			<div className="blocking-screen-hint">
				Having trouble with the extension? Try refreshing the page, or
				allowing permissions if you're using Firefox. Or, check out the{" "}
				<a
					onClick={() => {
						goToFAQ();
					}}
				>
					FAQ
				</a>
				.
			</div>
		</div>
	);

	const welcomeBackInfo = (
		<div>
			<div className="blocking-screen-title">
				{blockingCategory != "trial-mode" ? "Welcome Back!" : "Psst!"}
			</div>
			<div className="blocking-screen-text">
				We've noticed you’ve been playing in Trial Mode so far.
			</div>
			<div className="blocking-screen-text">
				For the full experience, get the Bread Winner companion
				extension! Then, clicks on <b>any website you visit</b> can be
				used in the bakery. How productive!
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
			<div className="blocking-screen-text">
				Have questions? Concerns? Check out the{" "}
				<a
					onClick={() => {
						goToFAQ();
					}}
				>
					FAQ
				</a>
				.
			</div>
			<div className="blocking-screen-text">
				<a onClick={startTrialMode}>
					No thanks, take me back to Trial Mode
				</a>
			</div>
			{visited ? (
				<div className="blocking-screen-hint">
					Having trouble with the extension? Try refreshing the page,
					or allowing permissions if you're using Firefox.
				</div>
			) : null}
		</div>
	);

	const endingInfo = () => {
		return (
			<div className="blocking-screen-container">
				<div className="blocking-screen-title">Congrats!</div>
				<div className="blocking-screen-text">
					You reached Banana Bread in {getEndingTime()}.
				</div>
				{getAchievementsEndingTime() ? (
					<div className="blocking-screen-text">
						You completed all achievements in{" "}
						{getAchievementsEndingTime()}.
					</div>
				) : null}
				<div className="blocking-screen-text">
					Total Clicks: {formatNumber(totalClicks)}
				</div>
				<div className="blocking-screen-text">
					Total Keys: {formatNumber(totalKeys)}
				</div>
				<div className="blocking-screen-text">
					Total Loaves: {formatNumber(breadBaked)}
				</div>

				<div className="blocking-screen-buttons">
					<button
						className="button never-mind"
						onClick={() => {
							var clipboard = "I'm a bread winner!";
							if (getAchievementsEndingTime() != null) {
								clipboard +=
									"\nAchievements: " +
									getAchievementsEndingTime();
							}
							clipboard +=
								"\nBanana Bread: " +
								getEndingTime() +
								"\nTotal Clicks: " +
								formatNumber(totalClicks) +
								"\nTotal Keys: " +
								formatNumber(totalKeys) +
								"\nTotal Loaves: " +
								formatNumber(breadBaked);
							navigator.clipboard.writeText(clipboard);
						}}
					>
						Copy Stats
					</button>

					<button
						className="button reset-button"
						onClick={() => {
							goToResetCheck();
						}}
					>
						Reset Progress
					</button>
				</div>
			</div>
		);
	};

	const resetCheck = () => {
		return (
			<div className="blocking-screen-container">
				<div className="blocking-screen-title">Are you sure?</div>
				<div className="blocking-screen-text">
					All progress will be deleted.
				</div>
				<div className="blocking-screen-buttons">
					<button
						className="button never-mind"
						onClick={() => {
							setBlockingCategory(null);
						}}
					>
						Never Mind
					</button>
					<button
						className="button reset-button"
						onClick={() => {
							resetProgress();
							resetCheat();
						}}
					>
						Yes, Reset
					</button>
				</div>
			</div>
		);
	};

	const FAQ = () => {
		return (
			<div className="blocking-screen-container">
				<div className="blocking-screen-title">
					Frequently Asked Questions
				</div>
				<div className="blocking-screen-text question">
					Tracking my activity across the entire browser is a little
					scary. How safe is the companion extension?
				</div>
				<div className="blocking-screen-text answer">
					No data is collected from the extension at all! You can see
					for yourself; the source code for the extensions is public{" "}
					<a
						href="https://github.com/isabelringing1/click-counter-chrome"
						target="_blank"
						rel="noreferrer"
					>
						here
					</a>{" "}
					and{" "}
					<a
						href="https://github.com/isabelringing1/click-counter-firefox"
						target="_blank"
						rel="noreferrer"
					>
						here
					</a>
					.
				</div>
				<div className="blocking-screen-text question">
					Are there only extensions for Chome and Firefox?
				</div>
				<div className="blocking-screen-text answer">
					At the moment, yes. If you have a burning desire for a
					different browser, make it{" "}
					<a
						href="https://forms.gle/XZsfyj8Vem2RhEYHA"
						target="_blank"
						rel="noreferrer"
					>
						known
					</a>
					!
				</div>
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
		var timeStr = msToTime(endTime - startTime, true, false, true);
		return timeStr;
	};

	const getAchievementsEndingTime = () => {
		var lastAchievementTime = 0;
		for (const [categoryName, array] of Object.entries(
			AchievementsObject
		)) {
			for (var i = 0; i < array.length; i++) {
				if (!array[i].save.claimed) {
					return null;
				}
				if (lastAchievementTime < array[i].save.claim_time) {
					lastAchievementTime = array[i].save.claim_time;
				}
			}
		}
		var timeStr = msToTime(
			lastAchievementTime - startTime,
			true,
			false,
			true
		);
		return timeStr;
	};

	const goToFAQ = () => {
		setBlockingCategory("FAQ");
	};

	const goToResetCheck = () => {
		setBlockingCategory("reset-check");
	};

	setTimeout(() => {
		setDelayPassed(true);
	}, delay);

	const onBGClicked = (e) => {
		if (blockingCategory != null && e.target.id == "blocking-screen") {
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
		} else if (blockingCategory == "trial-mode") {
			setContent(welcomeBackInfo);
		} else if (blockingCategory == "FAQ") {
			setContent(FAQ);
		} else if (blockingCategory == "reset-check") {
			setContent(resetCheck);
		} else if (delayPassed) {
			if (visited) {
				setContent(welcomeBackInfo);
			} else {
				setContent(noExtensionInfo);
			}
		} else {
			setContent(loader);
		}
	}, [blockingCategory, isMobile, delayPassed]);

	return shouldShow ? (
		<div
			className="blocking-screen"
			id="blocking-screen"
			onClick={onBGClicked}
		>
			<div className="blocking-div">
				<div className="inner-border">{content}</div>
			</div>
		</div>
	) : null;
}

export default BlockingScreen;
