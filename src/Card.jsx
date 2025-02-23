import { formatNumber } from "./Util";
import BCSymbol from "./BCSymbol";

var decorDict = {
	0: "",
	5: " bronze-border",
	50: " silver-border",
	100: " gold-border",
	200: " bronze-border bronze-bg",
	450: " silver-border bronze-bg",
	700: " gold-border bronze-bg",
	1000: " bronze-border silver-bg",
	1300: " silver-border silver-bg",
	1600: " gold-border silver-bg",
	2000: " bronze-border gold-bg",
	2500: " silver-border gold-bg",
	3000: " gold-border gold-bg",
};

function Card(props) {
	const { item, onClick, toggleTooltip, isDisabled } = props;
	var className = "glitchable ";
	className += isDisabled ? "card-container disabled" : "card-container";

	var decorClass = "";
	if (item.save.purchase_count) {
		Object.entries(decorDict).map(([threshold, classes]) => {
			if (item.save.purchase_count >= parseInt(threshold)) {
				decorClass = classes;
			}
		});
	}
	className += decorClass;

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
