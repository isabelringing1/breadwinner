import bc_red from "/images/bc_red.png";
import bc_black from "/images/bc_black.png";

function BCSymbol(props) {
	const { color, height, top, left } = props;
	const src = color == "black" ? bc_black : bc_red;
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
