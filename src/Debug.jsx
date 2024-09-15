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
	} = props;
	const [showDebug, setShowDebug] = useState(false);
	const clickInputRef = useRef();
	const BCInputRef = useRef();
	const timersRef = useRef();

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
				if (category[i].save.epilogue) {
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
			<br />
			<input type="number" ref={clickInputRef} />{" "}
			<button
				id="set-clicks-button"
				onClick={() =>
					setClicksCheat(parseInt(clickInputRef.current.value))
				}
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
				onClick={() => setTimers(parseInt(timersRef.current.value))}
			>
				{" "}
				Set Timers{" "}
			</button>
			<button id="finish-oven-button" onClick={finishOven}>
				{" "}
				Finish Baking{" "}
			</button>
			<button id="set-achievements-button" onClick={finishAchievements}>
				Finish Achievements
			</button>
		</div>
	) : null;
}

export default Debug;
