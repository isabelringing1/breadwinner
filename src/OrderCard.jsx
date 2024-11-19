import "./OrderBoard.css";

function OrderCard(props) {
	const { order, i, mode } = props;
	var breadName = "";
	var split = order.id.split("_");
	split.forEach((word) => {
		breadName += word.charAt(0).toUpperCase() + word.slice(1) + " ";
	});
	var progressClass =
		mode +
		"-info" +
		(order.counter < order.amount ? " notreached" : " reached");
	return (
		<div id={mode + "-card-" + i} className={mode + "-card"}>
			<img
				className={mode + "-bread"}
				src={
					window.location.origin + "/images/" + order.id + "_full.png"
				}
			/>
			<img className={mode + "-bg"} src={order.card} />
			<div className={mode + "-info"}> {breadName} </div>
			<div className={progressClass}>
				{order.counter + "/" + order.amount}
			</div>
		</div>
	);
}

export default OrderCard;
