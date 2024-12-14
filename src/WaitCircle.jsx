import { useState, useEffect, useRef } from "react";

import "./WaitCircle.css";
import hand1 from "/images/hand1.svg";
import hand2 from "/images/hand2.svg";

function WaitCircle(props) {
	const { id, inWait, setInWait, onCancel, onFinished, seconds, emitEvent } =
		props;
	const [hand, setHand] = useState(null);

	document
		.getElementById("root")
		.style.setProperty("--wait-seconds", seconds + "s");
	document
		.getElementById("root")
		.style.setProperty("--wait-seconds-half", seconds / 2 + "s");

	const wakeLock = useRef(null);
	const waitTimeout = useRef(null);
	const finished = useRef(false);
	const eventInterval = useRef(null);
	const counter = useRef(0);

	useEffect(() => {
		document.addEventListener("visibilitychange", async () => {
			breakWait();
		});
	}, []);

	const trySetWait = async () => {
		console.log("try set wait");
		if (finished.current) {
			return;
		}
		try {
			var wl = await navigator.wakeLock.request("screen");
			wakeLock.current = wl;
			setTimeout(() => {
				if (!inWait) {
					return;
				}
			}, 2000);

			document.getElementById("fill-left-" + id).className = "fill";
			document.getElementById("fill-right-" + id).className = "fill";
			document.getElementById("wait-container-" + id).className =
				"wait-container wait-transition";
			setHand(hand1);
			setTimeout(() => {
				if (document.getElementById("wait-container-" + id) == null) {
					return;
				}
				document.getElementById("wait-container-" + id).className =
					"wait-container wait-activated";
				setHand(hand2);
			}, 600);

			counter.current = 1;
			emitEvent("productivity", id, counter.current);
			eventInterval.current = setInterval(() => {
				counter.current += 1;
				emitEvent("productivity", id, counter.current);
			}, 1000);

			waitTimeout.current = setTimeout(() => {
				if (!inWait) {
					return;
				}
				onFinished();
				emitEvent("productivity", id, "DONE");
				breakWait(true);
				clearInterval(eventInterval.current);
			}, seconds * 1000);
		} catch (err) {
			// The Wake Lock request has failed - usually system related, such as battery.
			console.log(`${err.name}, ${err.message}`);
			//setWakeLockError("We aren't able to keep the screen awake for you. Please make sure low battery mode is off or change your settings manually to keep the screen awake.")
		}
	};

	const breakWait = (success = false) => {
		if (!success) {
			//Reset tooltip progress
			console.log("Emitting event");
			emitEvent("productivity", id, 0);
		}
		clearTimeout(waitTimeout.current);
		if (wakeLock.current == null || finished.current) {
			setInWait(false);
			clearInterval(eventInterval.current);
			if (!success) {
				onCancel();
			}
			return;
		}
		onCancel();
		setHand(null);
		wakeLock.current.release().then(() => {
			wakeLock.current = null;
			setInWait(false);
			clearInterval(eventInterval.current);
		});
		document.getElementById("fill-left-" + id).className = "";
		document.getElementById("fill-right-" + id).className = "";
		document.getElementById("wait-container-" + id).className =
			"wait-container";
	};

	return finished.current ? (
		<div className={"wait-container"} id={"wait-container-" + id}>
			<div className="wait-done"></div>
		</div>
	) : (
		<div
			className={"wait-container"}
			id={"wait-container-" + id}
			onMouseEnter={trySetWait}
			onMouseLeave={(e) => {
				breakWait();
			}}
		>
			{hand != null ? (
				<div className="hand-container">
					<img className="hand" src={hand} />
				</div>
			) : null}
			<div className="wait-half left" id={"wait-left-" + id}>
				<div id={"fill-left-" + id}></div>
			</div>
			<div className="wait-half right" id={"wait-right-" + id}>
				<div id={"fill-right-" + id}></div>
			</div>
		</div>
	);
}

export default WaitCircle;
