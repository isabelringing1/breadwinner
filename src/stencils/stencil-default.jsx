import * as React from "react";
const StencilDefault = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="-18 -5 99 59"
		fill="none"
		{...props}
	>
		<defs>
			<filter id="baking">
				<feFlood floodColor="maroon" floodOpacity={0.8} />
				<feComposite operator="out" in2="SourceGraphic" />

				<feMorphology id="glow-radius" operator="dilate" radius="1" />
				<feGaussianBlur id="glow-std" stdDeviation="0" />

				<feComposite operator="atop" in2="SourceGraphic" />
			</filter>
			<animate
				xlinkHref="#glow-radius"
				id="baking-radius"
				attributeName="radius"
				values="1;2;1"
				dur="3s"
				repeatCount="indefinite"
			/>

			<animate
				xlinkHref="#glow-std"
				id="baking-glow"
				attributeName="stdDeviation"
				values="3;9;3"
				dur="3s"
				repeatCount="indefinite"
			/>
		</defs>

		<path
			{...props}
			className={"main-path"}
			d="M2.708 18.252C-14.264-4.581 76.901-6.34 60.04 18.234l-2.011 34.312a2 2 0 0 1-1.997 1.883H6.715a2 2 0 0 1-1.997-1.883z"
		/>
		<mask
			id="stencil-default-1_svg__a"
			x={0}
			y={0}
			maskUnits="userSpaceOnUse"
			style={{
				maskType: "alpha",
			}}
		>
			<path
				fill="#D59313"
				d="M2.712 18.246C-14.26-4.587 76.905-6.346 60.043 18.229l-2.01 34.311a2 2 0 0 1-1.997 1.883H6.719a2 2 0 0 1-1.997-1.883z"
			/>
		</mask>
		<g mask="url(#stencil-default-1_svg__a)">
			<path
				fill="#000"
				fillOpacity={0.15}
				d="M1.478 36.242C5.081 52.2 46.492 47.619 58.165 46.466l-.176 9.1H1.478z"
			/>
		</g>
	</svg>
);
export default StencilDefault;
