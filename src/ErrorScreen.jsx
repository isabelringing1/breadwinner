function ErrorScreen(props) {
	var { error, resetErrorBoundary } = props;

	const copySaveData = async () => {
		var button = document.getElementById("copy-button");
		try {
			await navigator.clipboard.writeText(localStorage.bread_data);
			button.innerHTML = "Copied!";
			setTimeout(() => {
				button.innerHTML = "Copy Save";
			}, 500);
		} catch (err) {
			console.error("Failed to copy: ", err);
			button.innerHTML = "Error";
			setTimeout(() => {
				button.innerHTML = "Copy Save";
			}, 500);
		}
	};
	console.log(error);

	return (
		<div className="blocking-screen" id="blocking-screen">
			<div className="blocking-div">
				<div className="inner-border">
					<div className="blocking-screen-title">
						Something went wrong!
					</div>
					<div className="blocking-screen-text">
						Looks like you're in a weird state. Please try reloading
						the game.
					</div>
					<div className="blocking-screen-text">
						If the issue persists, please copy your save data using
						the button below and submit it to the{" "}
						<a
							href="https://forms.gle/XZsfyj8Vem2RhEYHA"
							target="_blank"
							rel="noreferrer"
						>
							feedback form
						</a>
						. Thanks for your patience!
					</div>

					<div className="blocking-screen-buttons">
						<button
							className="red button"
							onClick={() => {
								resetErrorBoundary();
							}}
						>
							Try Reload
						</button>
						<button
							className="button env-button"
							id="copy-button"
							onClick={() => {
								copySaveData();
							}}
						>
							Copy Save
						</button>
					</div>
					<div
						className="blocking-screen-text"
						style={{ color: "red", marginTop: "2vh" }}
					>
						Error: {error.message}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ErrorScreen;
