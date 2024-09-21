import bc_red from "/images/bc_red.png";
import bc_black from "/images/bc_black.png";
import bc_green from "/images/bc_green.png";

function BCSymbol(props) {
	const { color, height, top, left } = props;
	var src = bc_black;
	if (color == "red") {
		src = bc_red;
	} else if (color == "green") {
		src = bc_green;
	}
	return (
		<span className="bc-symbol-span">
			<img
				className="bc-symbol"
				src={src}
				style={{
					height: height ?? "90%",
					top: top ?? "10%",
					marginLeft: left ?? "0%",
				}}
			/>
		</span>
	);
}

export default BCSymbol;
