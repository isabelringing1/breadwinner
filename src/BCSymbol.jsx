import bc_red from "/images/bc_red.png";
import bc_black from "/images/bc_black.png";
import bc_green from "/images/bc_green.png";

function BCSymbol(props) {
	const { color, height, top, left } = props;
	var src = bc_black;
	var opacity = 1;
	if (color == "red") {
		src = bc_red;
	} else if (color == "green") {
		src = bc_green;
	} else if (color == "gray") {
		opacity = 0.5;
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
					opacity: opacity,
				}}
			/>
		</span>
	);
}

export default BCSymbol;
