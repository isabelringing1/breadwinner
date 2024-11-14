import { useState, useEffect } from "react";
import { formatNumber } from "./Util";
import timer from "/images/timer.png";
import "./Wallet.css";

function Wallet(props) {
	const {
		clicks,
		keys,
		multiplier,
		convertClicks,
		convertKeys,
		toggleClicksTooltip,
		toggleKeysTooltip,
		keyUnlocked,
		timers,
		timersUnlocked,
		toggleTimerInfoTooltip,
		useTimerMode,
		setUseTimerMode,
		canUseTimers,
		timerButtonHovered,
		setTimerButtonHovered,
	} = props;

	const [showTimerButton, setShowTimerButton] = useState(false);

	useEffect(() => {
		const num = document.getElementById("click-num");
		num.classList.remove("punch");
		void num.offsetWidth;
		num.classList.add("punch");
	}, [clicks]);

	useEffect(() => {
		const num = document.getElementById("key-num");
		if (!num) {
			return;
		}
		num.classList.remove("punch");
		void num.offsetWidth;
		num.classList.add("punch");
	}, [keys]);

	useEffect(() => {
		punchMultiplier();
	}, [multiplier]);

	const punchMultiplier = () => {
		const num = document.getElementById("multiplier-num");
		num.classList.remove("punch");
		void num.offsetWidth;
		num.classList.add("punch");
	};

	return (
		<div id="wallet">
			<div id="click-wallet">
				<div id="click-container">
					<span id="click-num">
						{clicks ? formatNumber(clicks) : "0"}
					</span>{" "}
					{clicks == 1 ? "click" : "clicks"}
				</div>
				<div id="multiplier-div">
					{" "}
					<span id="multiplier-x">×</span>{" "}
					<span id="multiplier-num">
						{String(formatNumber(multiplier, true)) ?? "1"}
					</span>
				</div>
				<button
					className="button"
					id="convert-clicks"
					onClick={(e) => {
						if (e.detail == 0) {
							// Occurs when someone holds down enter
							return;
						}
						convertClicks();
					}}
					onMouseMove={(e) => {
						var x =
							e.clientX < window.innerWidth - 300
								? e.clientX + 30
								: e.clientX - 240;
						toggleClicksTooltip(true, [x, e.clientY + 30]);
					}}
					onMouseLeave={() => {
						toggleClicksTooltip(false);
					}}
				>
					Convert
				</button>
			</div>
			<div className="br"></div>
			{keyUnlocked ? (
				<div id="key-wallet">
					<div id="key-container">
						<span id="key-num">{formatNumber(keys)}</span>{" "}
						{keys == 1 ? "key" : "keys"}
					</div>
					<button
						className="button"
						id="convert-keys"
						onClick={() => {
							convertKeys();
						}}
						onMouseMove={(e) => {
							var x =
								e.clientX < window.innerWidth - 300
									? e.clientX + 30
									: e.clientX - 240;
							toggleKeysTooltip(true, [x, e.clientY + 30]);
						}}
						onMouseLeave={() => {
							toggleKeysTooltip(false);
						}}
					>
						Convert
					</button>
				</div>
			) : null}
			<div className="br"></div>
			{timersUnlocked ? (
				<div
					id="timers-wallet"
					onMouseMove={(e) => {
						var x =
							e.clientX < window.innerWidth - 300
								? e.clientX + 30
								: e.clientX - 240;
						toggleTimerInfoTooltip(
							true,
							[x, e.clientY + 30],
							canUseTimers()
						);
						setTimerButtonHovered(true);
					}}
					onMouseLeave={() => {
						toggleTimerInfoTooltip(false);
						setTimerButtonHovered(false);
						if (!canUseTimers()) {
							document
								.getElementById("timer-icon")
								.classList.remove("timer-icon-gray");
						} else {
							document
								.getElementById("timer-icon")
								.classList.remove("timer-icon-hover");
						}
					}}
					onClick={() => {
						setUseTimerMode(!useTimerMode);
					}}
					onMouseEnter={(e) => {
						if (canUseTimers()) {
							document
								.getElementById("timer-icon")
								.classList.add("timer-icon-hover");
						} else {
							document
								.getElementById("timer-icon")
								.classList.add("timer-icon-gray");
						}
					}}
					onMouseDown={() => {
						if (!canUseTimers()) {
							return;
						}
						document
							.getElementById("timer-icon")
							.classList.add("timer-icon-clicked");
					}}
					onMouseUp={() => {
						if (!canUseTimers()) {
							return;
						}
						document
							.getElementById("timer-icon")
							.classList.remove("timer-icon-clicked");
					}}
				>
					{timers}{" "}
					<img
						src={timer}
						id="timer-icon-copy"
						className={
							"timer-icon" +
							(canUseTimers() ? "" : " timer-icon-gray")
						}
					/>
					<img src={timer} id="timer-icon" className={"timer-icon"} />
				</div>
			) : null}
		</div>
	);
}

export default Wallet;
