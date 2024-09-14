import "./Achievements.css";
import { useState, useRef } from "react";

import WaitCircle from "./WaitCircle";

import lock from "/images/lock.png";
import corner from "/images/corner.png";

function Achievement(props) {
	const {
		achievement,
		toggleTooltip,
		claimAchievement,
		claimButtonPressed,
		emitEvent,
	} = props;
	const [inWait, setInWait] = useState(false);
	const lastTooltipPos = useRef([0, 0]);
	const updateTooltipInterval = useRef(null);
	var state = "locked";
	if (achievement.save.claimed) {
		state = "claimed";
	} else if (achievement.save.achieved) {
		state = "achieved";
	} else if (achievement.save.revealed) {
		state = "revealed";
	}
	if (achievement.save.epilogue) {
		state += " epilogue";
	}

	const onHover = () => {
		if (!achievement.save.achieved || achievement.save.claimed) {
			return;
		}
		document.getElementById(achievement.id).classList.add("ready-to-claim");
	};

	const onHoverEnd = () => {
		if (
			document
				.getElementById(achievement.id)
				.classList.contains("ready-to-claim")
		) {
			document
				.getElementById(achievement.id)
				.classList.remove("ready-to-claim");
		}
	};

	const onClick = (e) => {
		e.stopPropagation();
		if (achievement.save.achieved && !achievement.save.claimed) {
			claimAchievement(achievement);
		}
	};

	const startButtonPressed = (e) => {
		setInWait(true);
		updateTooltipInterval.current = setInterval(() => {
			toggleTooltip(true, lastTooltipPos.current, achievement);
		}, 1000);
	};

	const onWaitCircleFinished = (achievement) => {
		onWaitCircleCancel();
		emitEvent(achievement.category, Number(achievement.id.slice(-1)));
	};

	const onWaitCircleCancel = () => {
		setInWait(false);
		clearInterval(updateTooltipInterval.current);
	};

	return (
		<div
			className={achievement.category + "-category achievement " + state}
			id={achievement.id}
			onMouseMove={(e) => {
				onHover();
				var x =
					e.clientX < window.innerWidth - 300
						? e.clientX + 30
						: e.clientX - 240;
				lastTooltipPos.current = [x, e.clientY + 30];
				toggleTooltip(true, [x, e.clientY + 30], achievement);
			}}
			onMouseLeave={() => {
				onHoverEnd();
				toggleTooltip(false);
			}}
			onClick={onClick}
		>
			{achievement.save.revealed ? (
				<img src={achievement.image_path} className="achievement-img" />
			) : null}
			{!achievement.save.revealed && !achievement.save.epilogue ? (
				<div className="question-mark">?</div>
			) : null}
			{achievement.save.revealed && !achievement.save.achieved ? (
				<div className="shadow">
					<img src={lock} className="lock" />
				</div>
			) : null}
			{achievement.save.achieved && !achievement.save.claimed ? (
				<img src={corner} className="corner" />
			) : null}

			{achievement.manual &&
			!achievement.save.claimed &&
			achievement.save.revealed ? (
				<div className="claim-achievement-div">
					{" "}
					<button
						className="claim-achievement green button"
						onClick={claimButtonPressed}
					>
						Claim
					</button>
				</div>
			) : null}

			{achievement.timer &&
			!achievement.save.achieved &&
			achievement.save.revealed &&
			!inWait ? (
				<div className="claim-achievement-div">
					{" "}
					<button
						className="claim-achievement green button"
						onClick={startButtonPressed}
					>
						Start
					</button>
				</div>
			) : null}

			{inWait ? (
				<WaitCircle
					id={achievement.id}
					inWait={inWait}
					setInWait={setInWait}
					onCancel={onWaitCircleCancel}
					onFinished={() => {
						onWaitCircleFinished(achievement);
					}}
					seconds={Number(achievement.timer)}
					emitEvent={emitEvent}
				/>
			) : null}
		</div>
	);
}

export default Achievement;
