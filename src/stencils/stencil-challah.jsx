import * as React from "react";
const StencilChallah = (props) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="-15 -3 100 55" {...props}>
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

		<path d="M34.272 51.29c30.079.316 32.904-10.46 33.277-19.405.095-3.518-1.723-7.726-4.713-11.839.192-1.273.284-2.748.266-4.455C62.073 8.907 54.97 3.18 46.99 3.061c-1.645.048-2.853.51-3.73 1.252-.046-1.821-4.003-3.292-8.878-3.292-4.57 0-8.335 1.293-8.823 2.956-.86-.654-2.013-1.058-3.544-1.101-7.98.117-15.083 5.845-16.111 12.53-.017 1.577.06 2.955.224 4.16C2.895 23.792.891 28.118.958 31.636c.195 9.538 3.236 19.337 33.314 19.654" />
		<mask
			id="stencil-challah_svg__a"
			maskUnits="userSpaceOnUse"
			style={{
				maskType: "alpha",
			}}
		>
			<path
				fill="#CC6926"
				d="M67.682 31.762c-.374 8.962-3.205 19.76-33.343 19.444C4.2 50.888 1.153 41.069.958 31.513.752 20.678 20.14 2.209 34.693 2.445c14.553.236 33.29 18.208 32.989 29.317"
			/>
			<path
				fill="#CC6926"
				d="M27.1 18.255c-.187 3.486 3.808 9.361-5.084 9.361S5.762 29.323 5.915 15.25c1.03-6.697 8.148-12.437 16.143-12.554 8.694.249 5.229 12.074 5.042 15.56M42.041 18.442c.187 3.485-3.808 9.361 5.084 9.361s16.254 1.706 16.101-12.367C62.196 8.738 55.078 2.999 47.083 2.88c-8.694.25-5.229 12.075-5.042 15.56"
			/>
			<path
				fill="#CC6926"
				d="M43.345 4.166c0 1.84-3.982 3.33-8.895 3.33s-8.895-1.49-8.895-3.33c0-1.839 3.983-3.33 8.895-3.33 4.913 0 8.895 1.491 8.895 3.33"
			/>
		</mask>
		<g mask="url(#stencil-challah_svg__a)">
			<path
				fill="#000"
				fillOpacity={0.24}
				d="M1.041 29.796c12.66 20.966 54.686 15.208 70.794 10.138l-.453 4.616a14 14 0 0 1-13.813 12.631l-20.73.179-22.49.038C6.38 57.413.008 50.785.335 42.825l.32-7.776z"
			/>
		</g>
	</svg>
);
export default StencilChallah;
