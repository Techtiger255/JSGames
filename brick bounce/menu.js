let startButton = {
		w: 100,
		h: 35,
		x: canvas.width / 2,
		y: (canvas.height / 3) * 2
	},
	x = 0;
function drawButton() {
	ctx.fillStyle = "azure";
	ctx.strokeStyle = "black";
	roundedRect(
		startButton.x - startButton.w / 2,
		startButton.y - startButton.h / 2,
		startButton.w,
		startButton.h,
		startButton.h / 2,
		true,
		2
	);
	x++;
	startButton.x = -16 * x ** 2 + 10 * x + 5;
	startButton.y = -16 * x ** 2 + 10 * x + 5;
	requestAnimationFrame(drawButton);
}

drawButton();
