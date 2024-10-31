import StencilDefault from "./stencils/stencil-default.jsx";
import StencilSourdough from "./stencils/stencil-sourdough.jsx";
import StencilChallah from "./stencils/stencil-challah.jsx";
import StencilPumpernickel from "./stencils/stencil-pumpernickel.jsx";
import StencilPotato from "./stencils/stencil-potato.jsx";
import StencilBrioche from "./stencils/stencil-brioche.jsx";
import StencilBanana from "./stencils/stencil-banana.jsx";
import StencilCinnamonRaisin from "./stencils/stencil-cinnamon-raisin.jsx";

function LoafStencil(props) {
	const { type } = props;

	switch (type) {
		case "white":
			return <StencilDefault {...props} />;
		case "whole_wheat":
			return <StencilDefault {...props} />;
		case "sourdough":
			return <StencilSourdough {...props} />;
		case "challah":
			return <StencilChallah {...props} />;
		case "cinnamon_raisin":
			return <StencilCinnamonRaisin {...props} />;
		case "pumpernickel":
			return <StencilPumpernickel {...props} />;
		case "potato":
			return <StencilPotato {...props} />;
		case "brioche":
			return <StencilBrioche {...props} />;
		case "banana":
			return <StencilBanana {...props} />;
	}

	console.log("ERROR: Did not regonize loaf of type ", type);
	return <StencilDefault {...props} />;
}

export default LoafStencil;
