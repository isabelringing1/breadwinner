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
		endingEnvelopeOrder,
		resetProgress,
		inTrialMode,
		startTrialMode,
		breadBaked,
		totalClicks,
		totalKeys,
		AchievementsObject,
		reportFAQOpened,
	} = props;

	var shouldShow =
		(!extensionDetected && !inTrialMode) || isMobile || blockingCategory;

	const [content, setContent] = useState(false);

	const [delayPassed, setDelayPassed] = useState(false);

	const mobileInfo = (
		<div className="blocking-screen-mobile">
			Sorry, but Bread Winner does not work with this screen size!
			<br />
			<br />
			Please use a bigger screen to play.
		</div>
	);

	const questionMarkInfo = (
		<div>
			<div className="blocking-screen-title">
				Welcome to Bread Winner!
			</div>
			<div className="blocking-screen-text">
				Where no matter what you do... you can't NOT be productive.{" "}
			</div>
			<div className="blocking-screen-text">
				You'll need the Chrome or Firefox extension to play (other
				browsers not supported yet, sorry!)
			</div>
			<div className="blocking-screen-link">
				<a
					className="extension-link button"
					href="https://chromewebstore.google.com/detail/bread-winner-companion/mlfplmodeiemagcbcfofdmfcahjaafel"
					target="_blank"
					rel="noreferrer"
				>
					Chrome
				</a>
				&emsp;
				<a
					className="extension-link button"
					href="https://addons.mozilla.org/en-US/firefox/addon/bread-winner-companion/"
					target="_blank"
					rel="noreferrer"
				>
					Firefox
				</a>
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
					is welcome. Or, check out the{" "}
					<a
						onClick={() => {
							goToFAQ();
						}}
					>
						FAQ
					</a>
					.
				</div>
				<div className="blocking-screen-text">v1.2.1</div>
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
					className="extension-link button"
					href="https://chromewebstore.google.com/detail/bread-winner-companion/mlfplmodeiemagcbcfofdmfcahjaafel"
					target="_blank"
					rel="noreferrer"
				>
					Chrome
				</a>
				&emsp;
				<a
					className="extension-link button"
					href="https://addons.mozilla.org/en-US/firefox/addon/bread-winner-companion/"
					target="_blank"
					rel="noreferrer"
				>
					Firefox
				</a>
			</div>
			<div className="blocking-screen-text">
				Want to check it out without the extension? You can play the{" "}
				<span style={{ backgroundColor: "rgb(248 244 70)" }}>
					lite version
				</span>{" "}
				first, where clicks are only tracked in the Bread Winner
				website.
			</div>
			<div className="blocking-screen-buttons" onClick={startTrialMode}>
				<button className="trial-mode-button button">
					Start Bread Winner Lite
				</button>
			</div>

			<div className="blocking-screen-hint">
				No data leaves your browser. Extension not working? See{" "}
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
				We've noticed you’ve been playing the Lite version so far.
			</div>
			<div className="blocking-screen-text">
				For the full experience, get the Bread Winner{" "}
				<span style={{ backgroundColor: "rgb(248 244 70)" }}>
					companion extension
				</span>
				! That way, clicks on <b>any website you visit</b> can be used
				in the bakery. How productive!
			</div>
			<div className="blocking-screen-link">
				<a
					className="extension-link button"
					href="https://chromewebstore.google.com/detail/bread-winner-companion/mlfplmodeiemagcbcfofdmfcahjaafel"
					target="_blank"
					rel="noreferrer"
				>
					Chrome
				</a>
				&emsp;
				<a
					className="extension-link button"
					href="https://addons.mozilla.org/en-US/firefox/addon/bread-winner-companion/"
					target="_blank"
					rel="noreferrer"
				>
					Firefox
				</a>
			</div>
			<div className="blocking-screen-hint">
				No data leaves your browser. Extension not working? See{" "}
				<a
					onClick={() => {
						goToFAQ();
					}}
				>
					FAQ
				</a>
				.
			</div>
			<div className="blocking-screen-text trial-mode-link">
				<a
					onClick={() => {
						startTrialMode();
						setBlockingCategory(null);
					}}
				>
					No thanks, take me back to Bread Winner Lite
				</a>
			</div>
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
				<div className="blocking-screen-text">
					Total Envelopes:{" "}
					{getTotalReadEnvelopes() + "/" + getTotalEnvelopes()}
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
					Bread Winner only counts the number of clicks and keystrokes
					you make in the browser, never what you actually do. Data is
					stored locally and does not leave your browser.{" "}
					<div className="faq-break"></div>
					If you're curious, feel free to check out the source code!
					It's publicly available{" "}
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
					I still don't want to install an extension. Can I play?
				</div>
				<div className="blocking-screen-text answer">
					Totally understandable! Yes, the lite version of the game is
					completely beatable.
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
				<div className="blocking-screen-text question">
					I installed the extension. Why aren't my clicks being
					registered?
				</div>
				<div className="blocking-screen-text answer">
					If you had a page open before installing, you'll need to
					refresh it to pick up any future clicks. Firefox users also
					need to open the extension to explictly allow permissions.{" "}
					<div className="faq-break"></div>
					Find a website that's consistently not picking up activity?
					Please{" "}
					<a
						href="https://forms.gle/XZsfyj8Vem2RhEYHA"
						target="_blank"
						rel="noreferrer"
					>
						report it
					</a>
					.
				</div>
			</div>
		);
	};

	const loader = <div className="loader"></div>;

	const getEndingTime = () => {
		var endTime = Date.now();
		for (var i in envelopeUnlocks) {
			if (envelopeUnlocks[i].category == "banana") {
				endTime = envelopeUnlocks[i].finish_time;
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

	const getTotalReadEnvelopes = () => {
		var total = 0;
		for (var i in envelopeUnlocks) {
			if (envelopeUnlocks[i].finish_time) {
				total++;
			}
		}
		return total;
	};

	const getTotalEnvelopes = () => {
		var total = 14;
		if (endingEnvelopeOrder != null) {
			for (var i in endingEnvelopeOrder) {
				if (endingEnvelopeOrder[i] != null) {
					total++;
				}
			}
		}
		return total;
	};

	const goToFAQ = () => {
		setBlockingCategory("FAQ");
		reportFAQOpened();
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

	var cn = "blocking-div";
	if (isMobile) {
		cn = "blocking-div-mobile " + cn;
	}
	if (blockingCategory == "FAQ") {
		cn = "faq " + cn;
	}
	return shouldShow ? (
		<div
			className="blocking-screen"
			id="blocking-screen"
			onClick={onBGClicked}
		>
			<div className={cn}>
				<div className="inner-border">{content}</div>
			</div>
		</div>
	) : null;
}

export default BlockingScreen;
