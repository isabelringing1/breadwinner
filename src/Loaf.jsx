import { useState, useEffect } from "react";
import { interpolateColor, useInterval } from "./Util";
import Timer from "./Timer";
import timer from "/images/timer.png";
import bwTimer from "/images/bw_timer.png";
import LoafStencil from "./LoafStencil.jsx";

function Loaf(props) {
	const {
		loaf,
		index,
		sellLoaf,
		toggleTooltip,
		updateTooltip,
		loafDone,
		onLoafClicked,
		timers,
		getTimerCost,
		useTimerMode,
		setUseTimerMode,
		timerButtonHovered,
	} = props;

	const [ready, setReady] = useState(false);
	const [hovered, setHovered] = useState(false);

	const get_percent_done = () => {
		return (
			1 - (loaf.end_time - Date.now()) / (loaf.end_time - loaf.start_time)
		);
	};

	const get_color = () => {
		const percentDone = get_percent_done();
		if (percentDone >= 1) return loaf.ending_color;
		return interpolateColor(
			loaf.starting_color,
			loaf.ending_color,
			percentDone
		);
	};

	const [color, setColor] = useState(get_color());
	const onLoafDone = () => {
		setTimeout(() => {
			document
				.getElementById(loaf.id + "-div-" + index)
				.classList.add("done-anim");
			setTimeout(() => {
				if (
					document.getElementById(loaf.id + "-div-" + index) != null
				) {
					document
						.getElementById(loaf.id + "-div-" + index)
						.classList.remove("done-anim");
				}
			}, 250);
		}, 100);
		loafDone(index);
		setReady(true);
		setColor(loaf.ending_color);
		setUseTimerMode(false);
	};

	useInterval(
		() => {
			setColor(get_color());
			if (hovered) {
				updateTooltip(loaf, get_percent_done(), getTimerCost(loaf));
			}
		},
		Date.now() >= loaf.end_time ? null : 10
	);

	var classname = "loaf";
	var buttonClassname = "timer-mode-button button";
	var filter = "";
	if (ready) {
		classname += " done";
	} else if (
		timerButtonHovered &&
		!useTimerMode &&
		getTimerCost(loaf) <= timers
	) {
		classname += " loaf-hint";
	} else if (!useTimerMode) {
		classname += " baking";
		filter = "url(#baking)";
	} else if (getTimerCost(loaf) <= timers) {
		classname += " loaf-breathe";
	} else {
		buttonClassname += " not-enough-timers";
	}

	return (
		<div className="loaf-div" id={loaf.id + "-div-" + index}>
			<LoafStencil
				filter={filter}
				preserveAspectRatio="none"
				type={loaf.id}
				fill={color}
				className={classname}
				id={loaf.id + "-" + index}
				onMouseMove={(e) => {
					var x =
						e.clientX < window.innerWidth - 300
							? e.clientX + 30
							: e.clientX - 240;
					toggleTooltip(
						true,
						loaf,
						[x, e.clientY + 30],
						get_percent_done(),
						getTimerCost(loaf)
					);
				}}
				onMouseLeave={() => {
					toggleTooltip(false);
					setHovered(false);
				}}
				onMouseEnter={() => {
					setHovered(true);
					if (!ready) {
						return;
					}
					document
						.getElementById(loaf.id + "-div-" + index)
						.classList.add("done-anim");
					setTimeout(() => {
						if (
							document.getElementById(
								loaf.id + "-div-" + index
							) != null
						) {
							document
								.getElementById(loaf.id + "-div-" + index)
								.classList.remove("done-anim");
						}
					}, 250);
				}}
			/>

			{ready ? (
				<button
					className="loaf-button"
					onClick={() => sellLoaf(index)}
					onMouseMove={(e) => {
						var x =
							e.clientX < window.innerWidth - 300
								? e.clientX + 30
								: e.clientX - 240;
						toggleTooltip(
							true,
							loaf,
							[x, e.clientY + 30],
							get_percent_done(),
							getTimerCost(loaf)
						);
					}}
					onMouseLeave={() => {
						toggleTooltip(false);
						setHovered(false);
					}}
				>
					SELL
				</button>
			) : useTimerMode ? (
				<div className="timer-mode">
					<button
						className={buttonClassname}
						onClick={(e) => {
							onLoafClicked(index);
							e.stopPropagation();
						}}
					>
						{getTimerCost(loaf)}
						{getTimerCost(loaf) > timers ? (
							<img src={bwTimer} className="loaf-timer" />
						) : (
							<img src={timer} className="loaf-timer" />
						)}
					</button>
				</div>
			) : null}
			<Timer
				endTime={loaf.end_time}
				onTimerEnd={onLoafDone}
				visible={!useTimerMode && !ready}
			/>
		</div>
	);
}

export default Loaf;
