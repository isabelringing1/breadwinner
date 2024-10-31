import * as React from "react";
const SvgStencilBrioche = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="-12 -5 95 55"
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

		<path d="M3.39 21.574C-8.98 7.054 24.73-4.2 33.743 3.466c.738.628 2.709.584 3.452-.038 8.377-7.007 41.382 1.73 29.707 19.159l-2.782 24.487a3 3 0 0 1-2.981 2.661H9.795a3 3 0 0 1-2.974-2.6z" />
		<mask
			id="stencil-brioche_svg__a"
			x={0}
			y={0}
			maskUnits="userSpaceOnUse"
			style={{
				maskType: "alpha",
			}}
		>
			<path
				fill="#CC7C03"
				d="M3.39 21.574C-8.98 7.054 24.73-4.2 33.743 3.466c.738.628 2.709.584 3.452-.038 8.377-7.007 41.382 1.73 29.707 19.159l-2.782 24.487a3 3 0 0 1-2.981 2.661H9.795a3 3 0 0 1-2.974-2.6z"
			/>
		</mask>
		<g mask="url(#stencil-brioche_svg__a)">
			<path
				fill="#000"
				fillOpacity={0.15}
				d="M-1.122 33.341c5.017 13.14 59.672 10.43 68.756 10.225l-.214 9.1H-1.122z"
			/>
		</g>
	</svg>
);
export default SvgStencilBrioche;
