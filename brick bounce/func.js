var fadeList = [],
	canvas = document.getElementsByTagName("canvas")[0],
	resizeBar = document.getElementById("resizeBar"),
	ctx = canvas.getContext("2d"),
	previousCursor,
	cw = 480,
	ch = 340,
	killVar = false,
	started = false,
	paused = false,
	rightDown = false,
	leftDown = false;

function start(e) {
	go(e);
	killVar = true;
}

function ratio(total, pixels) {
	let div = total;
	if (total === canvas.width) div = cw;
	if (total === canvas.height) div = ch;
	return total * (pixels / div);
}

function color(newColor = `rgb(${diff * 100}, 255, 255)`, stroke = false) {
	return stroke ? (ctx.strokeStyle = newColor) : (ctx.fillStyle = newColor);
}

function killBrickAnimation(frames) {
	for (let i = 0; i < fadeList.length; i++) {
		let b = fadeList[i];
		b.elapsedFadeTime++;
		color(`rgba(225,75,75,${(frames - b.elapsedFadeTime) / frames})`);
		color(`rgba(0,0,0,${(frames - b.elapsedFadeTime) / frames})`, true);
		roundedRect(b.x, b.y, b.w, b.h, b.h / 2, true, 1);
		if (b.elapsedFadeTime == frames) {
			fadeList.splice(i);
		}
	}
}

function roundedRect(
	x,
	y,
	width,
	height,
	radius,
	useStroke = false,
	strokeWidth = false
) {
	width -= strokeWidth / 2;
	height -= strokeWidth / 2;

	ctx.beginPath();
	ctx.moveTo(x, y + radius);
	ctx.lineTo(x, y + height - radius);
	ctx.arcTo(x, y + height, x + radius, y + height, radius);
	ctx.lineTo(x + width - radius, y + height);
	ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
	ctx.lineTo(x + width, y + radius);
	ctx.arcTo(x + width, y, x + width - radius, y, radius);
	ctx.lineTo(x + radius, y);
	ctx.arcTo(x, y, x, y + radius, radius);
	ctx.fill();

	if (useStroke) {
		ctx.lineWidth = strokeWidth ? strokeWidth : ctx.lineWidth;
		ctx.stroke();
	}
}

// External event listeners

(() => {
	let buttons = document.getElementsByClassName("difficulty");
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener("click", start);
	}

	document.getElementById("reset").addEventListener("click", () => {
		location.reload();
	});
	canvas.addEventListener("click", pauseButton);
	document.getElementById("pause").addEventListener("click", pause);
	window.addEventListener("visibilitychange", pause);
	window.addEventListener("blur", pause);

	function pause(e = { type: 0 }) {
		e.preventDefault ? e.preventDefault() : null;
		rightDown = false;
		leftDown = false;
		if (e.type === "visibilitychange") {
			document.hidden ? (paused = true) : null;
		} else if (e.type == "blur" || e.type == "focus") {
			paused = e.type == "blur";
		} else {
			paused = !paused;
		}
		if (!paused) return;
		pauseShape();
	}

	function pauseShape() {
		if (!started || !paused) return;
		let topLeftX = cw / 2.5,
			topLeftY = ch / 3,
			rightX = cw - cw / 2.5,
			rightY = ch / 2,
			bottomLeftX = cw / 2.5,
			bottomLeftY = ch - ch / 3;
		ctx.beginPath();
		ctx.fillStyle = "deepblue";
		ctx.moveTo(topLeftX, topLeftY);
		ctx.lineTo(rightX, rightY);
		ctx.lineTo(bottomLeftX, bottomLeftY);
		ctx.fill();
		ctx.closePath();
		paused ? requestAnimationFrame(pauseShape) : null;
	}

	function pauseButton() {
		pause();
	}

	resizeBar.addEventListener("mousedown", initResize, false);
	function initResize(e) {
		window.addEventListener("mousemove", resize, false);
		window.addEventListener("mouseup", stopResize, false);
	}
	function resize(e) {
		if (!document.body.style.cursor) document.body.style.cursor = "default";
		if (!previousCursor) previousCursor = document.body.style.cursor;
		document.body.style.cursor = "se-resize";
		let width = e.clientX - canvas.offsetLeft + canvas.style.borderWidth * 2,
			height = e.clientY - canvas.offsetTop + canvas.style.borderWidth * 2;
		if (canvas.offsetHeight / height > canvas.offsetWidth / width) {
			canvas.style.width = `${width}px`;
			canvas.parentElement.style.width = `${width}px`;
			canvas.style.height = `${(width * ch) / cw}px`;
			canvas.parentElement.style.height = `${(width * ch) / cw}px`;
		} else {
			canvas.style.width = `${(height * cw) / ch}px`;
			canvas.parentElement.style.width = `${(height * cw) / ch}px`;
			canvas.style.height = `${height}px`;
			canvas.parentElement.style.height = `${height}px`;
		}
	}
	function stopResize(e) {
		document.body.style.cursor = previousCursor;
		window.removeEventListener("mousemove", resize, false);
		window.removeEventListener("mouseup", stopResize, false);
	}
})();
