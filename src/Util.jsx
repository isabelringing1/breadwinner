import { useState, useEffect, useRef } from "react";

//https://www.joshwcomeau.com/snippets/react-hooks/use-interval/
function useInterval(callback, delay) {
	const intervalRef = useRef(null);
	const savedCallback = useRef(callback);
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);
	useEffect(() => {
		const tick = () => savedCallback.current();
		if (typeof delay === "number") {
			intervalRef.current = window.setInterval(tick, delay);
			return () => window.clearInterval(intervalRef.current);
		}
	}, [delay]);
	return intervalRef;
}

//https://stackoverflow.com/a/19700358
function msToTime(
	duration,
	clipZeroes = false,
	noSeconds = false,
	showMs = false
) {
	var milliseconds = Math.floor((duration % 1000) / 100),
		seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	var strhours = hours;
	var strminutes = minutes;
	var strseconds = seconds;
	var strtime = "";
	if (!clipZeroes || hours != 0) {
		strtime += strhours + "h ";
	}
	if (!clipZeroes || minutes != 0) {
		strtime += strminutes + "m ";
	}
	if (!noSeconds || strtime == "") {
		strtime += strseconds + "s";
	}
	if (showMs) {
		strtime += " " + milliseconds + "ms";
	}

	return strtime;
}

function formatNumber(num, isDecimal = false, addSuffix = true) {
	if (num == null) return false;
	if (isDecimal) {
		return num.toLocaleString("en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 8,
		});
	}
	if (addSuffix) {
		// Decillion
		if (num > 1000000000000000000000000000000000) {
			return +(num / 1e33).toFixed(1) + "De";
		}
		// Nonillion
		if (num > 1000000000000000000000000000000) {
			return +(num / 1e30).toFixed(1) + "No";
		}
		// Octillion
		if (num > 1000000000000000000000000000) {
			return +(num / 1e27).toFixed(1) + "Oc";
		}
		// Septillion
		if (num > 1000000000000000000000000) {
			return +(num / 1e24).toFixed(1) + "Sp";
		}
		// Sextillion
		if (num > 1000000000000000000000) {
			return +(num / 1e21).toFixed(1) + "Sx";
		}
		// quintillion
		if (num > 1000000000000000000) {
			return +(num / 1e18).toFixed(1) + "Qn";
		}
		// quadrillion
		if (num > 1000000000000000) {
			return +(num / 1e15).toFixed(1) + "Qd";
		}
		// trillion
		if (num > 1000000000000) {
			return +(num / 1e12).toFixed(1) + "Tr";
		}
		// billion
		if (num > 1000000000) {
			return +(num / 1e9).toFixed(1) + "B";
		}
	}

	return num.toLocaleString();
}

function formatPercent(num, decimals = 2) {
	if (num == null) return;
	num = +(num * 100).toFixed(decimals); // plus sign drops any "extra" zeroes at the end.
	return num + "%";
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}

function interpolateColor(hex1, hex2, percent) {
	var rgbA = hexToRgb(hex1);
	var rgbB = hexToRgb(hex2);
	const colorVal = (prop) =>
		Math.round(rgbA[prop] * (1 - percent) + rgbB[prop] * percent);
	return (
		"rgb(" +
		colorVal("r") +
		", " +
		colorVal("g") +
		", " +
		colorVal("b") +
		")"
	);
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

export {
	useInterval,
	msToTime,
	formatNumber,
	formatPercent,
	interpolateColor,
	shuffleArray,
};
