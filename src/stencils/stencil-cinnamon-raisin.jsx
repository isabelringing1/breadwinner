import * as React from "react";
const StencilCinnamonRaisin = (props) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="-18 -5 99 59" {...props}>
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

		<path d="M2.135 17.88c-16.972-22.834 74.193-24.592 57.331-.018l-2.011 34.312a2 2 0 0 1-1.997 1.883H6.141a2 2 0 0 1-1.996-1.883z" />
		<mask
			id="stencil-cinnamon-raisin_svg__a"
			x={0}
			y={0}
			maskUnits="userSpaceOnUse"
			style={{
				maskType: "alpha",
			}}
		>
			<path
				fill="#FBD39E"
				d="M2.117 17.793C-14.855-5.04 76.31-6.8 59.448 17.775l-2.01 34.312a2 2 0 0 1-1.997 1.883H6.124a2 2 0 0 1-1.997-1.883z"
			/>
		</mask>
		<g mask="url(#stencil-cinnamon-raisin_svg__a)">
			<path
				fillOpacity={0.15}
				fill="#000"
				d="M1.966 38.357c8.09 9.914 45.808 10.739 56.687 10.224l-.176 9.1H1.966z"
			/>
			<path
				fill="#890101"
				fillOpacity={0.3}
				d="M13.122 53.616C71.995 42.412 29.657-2.286 11.434 20.96 6.02 33.385 33.497 37.513 29.276 26.133c-1.238-3.207-5.046-.767-2.616 1.206 2.292 2.713-7.523 1.8-3.884-3.027 8.968-8.95 20.15 9.855 3.317 12.267-17.095 2.196-27.855-18.516-9.437-24.831C53.391-1.925 73.34 33.887 35.888 53.647z"
			/>
		</g>
	</svg>
);
export default StencilCinnamonRaisin;
