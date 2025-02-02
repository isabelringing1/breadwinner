import { useRef, useState, useEffect } from "react";
import { resetCheat, setClicksCheat } from "../public/debug";
import { broadcastBc } from "../public/extension";

function Debug(props) {
	const {
		resetProgress,
		setBreadCoin,
		ovenQueue,
		setOvenQueue,
		achievements,
		setAchievements,
		setTimers,
		emitEvent,
		inTrialMode,
		setClicks,
		setDebugEnvelope,
	} = props;
	const [showDebug, setShowDebug] = useState(false);
	const clickInputRef = useRef();
	const BCInputRef = useRef();
	const timersRef = useRef();
	const envelopeIdRef = useRef();

	const devMode = false;

	const toggleShowDebug = () => {
		setShowDebug((prevShowDebug) => !prevShowDebug);
	};

	const finishOven = () => {
		var newOvenQueue = [...ovenQueue];
		for (var i = 0; i < newOvenQueue.length; i++) {
			if (newOvenQueue[i] != null) {
				console.log(newOvenQueue[i]);
				newOvenQueue[i].end_time = Date.now() - 1;
			}
		}
		setOvenQueue(newOvenQueue);
	};

	const finishAchievements = () => {
		var newAchievements = { ...achievements };
		for (var categoryName in newAchievements) {
			var category = newAchievements[categoryName];
			for (var i in category) {
				if (
					category[i].save.epilogue ||
					category[i].id == "stretch_6"
				) {
					continue;
				}
				category[i].save.revealed = true;
				category[i].save.achieved = true;
				if (category[i].manual) {
					category[i].save.claimed = true;
				}
			}
		}
		setAchievements(newAchievements);
	};

	const copySaveData = async () => {
		var button = document.getElementById("copy-button");
		try {
			await navigator.clipboard.writeText(localStorage.bread_data);
			button.innerHTML = "Copied!";
			setTimeout(() => {
				button.innerHTML = "Copy Save";
			}, 500);
		} catch (err) {
			console.error("Failed to copy: ", err);
			button.innerHTML = "Error";
			setTimeout(() => {
				button.innerHTML = "Copy Save";
			}, 500);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", (event) => {
			if (event.code === "KeyD" && event.ctrlKey) {
				toggleShowDebug();
			}
		});
		return document.removeEventListener("keydown", (event) => {
			if (event.code === "KeyD" && event.ctrlKey) {
				toggleShowDebug();
			}
		});
	}, []);

	return showDebug ? (
		<div className="debug-menu">
			<button
				className="button reset-button"
				onClick={() => {
					resetProgress();
					resetCheat();
				}}
			>
				Reset?
			</button>

			<button
				className="button env-button"
				id="copy-button"
				onClick={() => {
					copySaveData();
				}}
			>
				Copy Save
			</button>

			{devMode ? (
				<div>
					<br />
					<input type="number" ref={clickInputRef} />{" "}
					<button
						id="set-clicks-button"
						onClick={() => {
							if (inTrialMode) {
								setClicks(
									parseInt(clickInputRef.current.value)
								);
							} else {
								setClicksCheat(
									parseInt(clickInputRef.current.value)
								);
							}
						}}
					>
						{" "}
						Set Click Count{" "}
					</button>
					<input type="number" ref={BCInputRef} />{" "}
					<button
						id="set-bread-coin-button"
						onClick={() => {
							broadcastBc(parseInt(BCInputRef.current.value));
							setBreadCoin(parseInt(BCInputRef.current.value));
						}}
					>
						{" "}
						Set Bread Coin{" "}
					</button>
					<input type="number" ref={timersRef} />{" "}
					<button
						id="set-clicks-button"
						onClick={() =>
							setTimers(parseInt(timersRef.current.value))
						}
					>
						{" "}
						Set Timers{" "}
					</button>
					<button id="finish-oven-button" onClick={finishOven}>
						{" "}
						Finish Baking{" "}
					</button>
					<button
						id="set-achievements-button"
						onClick={finishAchievements}
					>
						Finish Achievements
					</button>
					<button
						id="skip-envelope-button"
						onClick={() => {
							emitEvent("skip-envelope");
						}}
					>
						Skip Envelope
					</button>
					<input type="text" ref={envelopeIdRef} />{" "}
					<button
						id="show-envelope-button"
						onClick={() => {
							setDebugEnvelope(envelopeIdRef.current.value);
						}}
					>
						{" "}
						Show Envelope{" "}
					</button>
					<button
						id="refresh-daily-order"
						onClick={() => {
							emitEvent("refresh-daily-order");
						}}
					>
						Refresh Daily Order
					</button>
					<button
						id="complete-daily-order"
						onClick={() => {
							emitEvent("complete-daily-order");
						}}
					>
						Complete Daily Order
					</button>{" "}
				</div>
			) : null}
		</div>
	) : null;
}

export default Debug;
