import * as React from "react";
const StencilPotato = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="-9 -6 84 60"
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

		<path d="M1.56 17.83C.748 10.159 5.881 3.033 13.511 1.893c14.381-2.15 25.752-2.112 39.863 0 7.636 1.144 12.773 8.274 11.962 15.952l-3.4 32.197a4 4 0 0 1-3.978 3.58H8.939a4 4 0 0 1-3.978-3.58z" />
		<mask
			id="stencil-potato_svg__a"
			x={1}
			y={0}
			maskUnits="userSpaceOnUse"
			style={{
				maskType: "alpha",
			}}
		>
			<path
				fill="#FFA41C"
				d="M1.56 17.83C.748 10.159 5.881 3.033 13.511 1.893c14.381-2.15 25.752-2.112 39.863 0 7.636 1.144 12.773 8.274 11.962 15.952l-3.4 32.197a4 4 0 0 1-3.978 3.58H8.939a4 4 0 0 1-3.978-3.58z"
			/>
		</mask>
		<g mask="url(#stencil-potato_svg__a)">
			<path
				fill="#000"
				fillOpacity={0.15}
				d="M1.828 37.29C6.29 50.43 54.912 47.72 62.993 47.515l-.19 9.1H1.828z"
			/>
		</g>
	</svg>
);
export default StencilPotato;
