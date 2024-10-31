import * as React from "react";
const SvgStencilBanana = (props) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -9 95 55" {...props}>
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

		<path d="M.105 14.942c-.733-4.98 41.982-21.609 44.08-11.32 12.256-5.216 30.987 7.468 30.432 11.32-.419 2.9-3.141 18.749-4.461 26.405a4.99 4.99 0 0 1-4.925 4.145H9.487a4.99 4.99 0 0 1-4.923-4.142C3.274 33.9.652 18.665.105 14.942" />
		<mask
			id="stencil-banana_svg__a"
			x={0}
			y={0}
			maskUnits="userSpaceOnUse"
			style={{
				maskType: "alpha",
			}}
		>
			<path
				fill="#A96521"
				d="M.105 14.942c-.733-4.98 41.982-21.609 44.08-11.32 12.256-5.216 30.987 7.468 30.432 11.32-.419 2.9-3.141 18.749-4.461 26.405a4.99 4.99 0 0 1-4.925 4.145H9.487a4.99 4.99 0 0 1-4.923-4.142C3.274 33.9.652 18.665.105 14.942"
			/>
		</mask>
		<g mask="url(#stencil-banana_svg__a)">
			<path
				fill="#000"
				fillOpacity={0.15}
				d="M1.748 29.405c5.243 13.14 62.355 10.43 71.848 10.225l-.223 9.1H1.748z"
			/>
		</g>
	</svg>
);
export default SvgStencilBanana;
