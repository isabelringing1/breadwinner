import "./OrderBoard.css";

import BCSymbol from "./BCSymbol";
import OrderCard from "./OrderCard";

import timer from "/images/timer.png";
import { formatNumber } from "./Util";

function OrderContainer(props) {
	const { order, i, canClaim, tryClaimReward, tryStartOrder } = props;

	var bgColor = order.started ? "#E7BCFF" : "#bda1cc";
	return (
		<div
			id={"order-container-" + i}
			className="order-container"
			style={{ backgroundColor: bgColor }}
		>
			<div className="order-card-flexbox">
				{order.suborders.map((suborder, j) => {
					return (
						<OrderCard
							key={"order-card-" + i + "-" + j}
							order={suborder}
							i={j}
							mode="order-board"
							useSmall={order.suborders.length == 4}
						/>
					);
				})}
			</div>
			<div className="order-card-reward-info">
				{order.bc_reward == -1 ? (
					<div className="order-board-reward-info">
						Reward: Claimed!
					</div>
				) : (
					<div className="order-board-reward-info">
						Reward:{" "}
						<div>
							{" "}
							<BCSymbol
								color="black"
								height={"1.7vh"}
								top={".2vh"}
							/>
							{formatNumber(order.bc_reward)}
						</div>
						<div>
							+ {order.timer_reward}{" "}
							<img src={timer} className="order-board-timer" />{" "}
						</div>
					</div>
				)}

				<div className="order-container-claim-button">
					{order.started ? (
						<button
							className="order-board-button do-button"
							id={"order-board-button-" + i}
							disabled={!canClaim(order)}
							onClick={(e) => tryClaimReward(e, order, i)}
						>
							CLAIM
						</button>
					) : (
						<button
							className="order-board-button do-button"
							onClick={(e) => tryStartOrder(e, order)}
						>
							START
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default OrderContainer;
