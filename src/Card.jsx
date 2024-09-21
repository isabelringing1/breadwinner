import { formatNumber } from "./Util";
import BCSymbol from "./BCSymbol";

function Card(props) {
	const { item, onClick, toggleTooltip, isDisabled } = props;
	var className = isDisabled ? "card-container disabled" : "card-container";

	return (
		<button
			className={className}
			onClick={(e) => onClick(item.id, [e.clientX - 100, e.clientY - 50])}
			onMouseMove={(e) => {
				var x =
					e.clientX < window.innerWidth - 300
						? e.clientX + 30
						: e.clientX - 240;
				toggleTooltip(true, item, [x, e.clientY + 30]);
			}}
			onMouseLeave={() => {
				toggleTooltip(false);
			}}
		>
			<div className="card-title">{item.display_name}</div>
			<div className="card-price">
				<BCSymbol color="green" />
				{formatNumber(item.save.cost ?? item.cost)}
			</div>
			<img
				className="card-img"
				src={window.location.origin + item.image_path}
			/>
		</button>
	);
}

export default Card;
