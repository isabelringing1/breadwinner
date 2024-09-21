import "./DailyOrder.css";

function DailyOrderCard(props) {
	const { order, i } = props;
	var breadName = "";
	var split = order[0].split("_");
	split.forEach((word) => {
		breadName += word.charAt(0).toUpperCase() + word.slice(1) + " ";
	});
	var progressClass =
		"daily-order-info" + (order[2] < order[1] ? " notreached" : " reached");
	return (
		<div id={"daily-order-card-" + i} className="daily-order-card">
			<img
				className="daily-order-bread"
				src={
					window.location.origin + "/images/" + order[0] + "_full.png"
				}
			/>
			<img className="daily-order-bg" src={order[5]} />
			<div className="daily-order-info"> {breadName} </div>
			<div className={progressClass}>{order[2] + "/" + order[1]}</div>
		</div>
	);
}

export default DailyOrderCard;
