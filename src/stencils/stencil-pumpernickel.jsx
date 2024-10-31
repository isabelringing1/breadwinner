import * as React from "react";
const StencilPumpernickel = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="-15.5 -7 105 55"
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

		<path d="M13.769 46.841c-5.8 0-11.367-3.332-12.745-8.966-11.328-46.32 76.842-51.884 71.634-1.745-.674 6.487-6.749 10.71-13.271 10.71z" />
		<mask
			id="stencil-pumpernickel_svg__a"
			x={0}
			y={0}
			maskUnits="userSpaceOnUse"
			style={{
				maskType: "alpha",
			}}
		>
			<path
				fill="#614529"
				d="M13.769 46.841c-5.8 0-11.367-3.332-12.745-8.966-11.328-46.32 76.842-51.884 71.634-1.745-.674 6.487-6.749 10.71-13.271 10.71z"
			/>
		</mask>
		<g mask="url(#stencil-pumpernickel_svg__a)">
			<path
				fill="#000"
				fillOpacity={0.3}
				d="M-2.435 26.544C4.928 43.51 55.505 42.47 72.182 37.142l-.232 9.433H-2.435z"
			/>
		</g>
	</svg>
);
export default StencilPumpernickel;
