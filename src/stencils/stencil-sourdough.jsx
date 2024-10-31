import * as React from "react";
const StencilSourdough = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="-15 0 100 55"
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

		<path d="M11.966 54.555C6.132 54.555.791 50.642.283 44.83c-4.221-48.262 71.97-51.122 69.363-.538-.311 6.046-5.774 10.263-11.828 10.263z" />
		<path d="M33.001 4.295c.34-.272 1.077.14 1.04.574-.156 1.838.499 2.609 1.061 2.644l-12.97 2.478c1.852-.218 7.777-3.214 10.869-5.696" />
		<mask
			id="stencil-sourdough_svg__a"
			x={0}
			y={7}
			maskUnits="userSpaceOnUse"
			style={{
				maskType: "alpha",
			}}
		>
			<path
				fill="#DF882E"
				d="M11.966 54.555C6.132 54.555.791 50.642.283 44.83c-4.221-48.262 71.97-51.122 69.363-.538-.311 6.046-5.774 10.263-11.828 10.263z"
			/>
		</mask>
		<g mask="url(#stencil-sourdough_svg__a)">
			<path
				fill="#000"
				fillOpacity={0.2}
				d="M-2.923 34.652c27.056 17.144 54.583 11.736 73.38 10.253l-.108.417A14 14 0 0 1 56.89 55.798l-23.263.152-23.084.03c-8.037.01-14.433-6.733-13.998-14.759l.137-2.511z"
			/>
		</g>
	</svg>
);
export default StencilSourdough;
