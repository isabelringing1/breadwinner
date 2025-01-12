import { useState, useEffect, useRef } from "react";
import endingData from "./config/ending.json";

function EndGameController(props) {
	const {
		events,
		storyState,
		totalDailyOrders,
		endingEnvelopeOrder,
		setEndingEnvelopeOrder,
		unlockEnvelope,
		unlockEnvelopes,
		loaded,
	} = props;

	const getEnvelopeOrder = (totalDailyOrders) => {
		var envelopes = Array(30).fill(null);

		envelopes[29] = "ending";
		for (const [id, dayEnvelope] of Object.entries(
			endingData.days_sequence
		)) {
			envelopes[dayEnvelope.days + totalDailyOrders - 1] = id;
		}

		for (const [id, orderEnvelope] of Object.entries(
			endingData.orders_sequence
		)) {
			envelopes[orderEnvelope.orders - 1] = id;
		}
		// Now go back and fill all the gaps with misc envelopes
		var miscIndex = 0;
		var miscEnvelopes = Object.entries(endingData.misc_envelopes);
		for (var i = 0; i < envelopes.length; i++) {
			if (
				i > totalDailyOrders &&
				!envelopes[i] &&
				miscIndex < miscEnvelopes.length
			) {
				envelopes[i] = miscEnvelopes[miscIndex][0];
				miscIndex += 1;
			}
		}
		return envelopes;
	};

	useEffect(() => {
		for (var i = 0; i < events.length; i++) {
			var event = events[i];
			switch (event.id) {
				case "reveal-epilogue":
					var envelopeOrder = getEnvelopeOrder(
						Math.min(totalDailyOrders.length, 4)
					);
					//console.log("Setting envelope order to: ", envelopeOrder);
					setEndingEnvelopeOrder(envelopeOrder);
					if (totalDailyOrders.length > 4) {
						unlockEnvelopes(
							envelopeOrder.slice(0, totalDailyOrders.length - 4)
						);
					}
					break;
				case "daily-order-claim":
					if (
						(storyState == 2 || storyState == 3) &&
						endingEnvelopeOrder.length
					) {
						// we should show an envelope
						var envelopeId = endingEnvelopeOrder.at(
							totalDailyOrders.length - 1
						);
						if (envelopeId != null && envelopeId != "ending") {
							unlockEnvelope(envelopeId);
						}
					}
					break;
				case "all-achievements":
					unlockEnvelope("ending");
					break;
			}
		}
	}, [events]);

	return null;
}

export default EndGameController;
