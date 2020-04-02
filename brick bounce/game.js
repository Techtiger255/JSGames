function go(e) {
	if (killVar) return;
	let diff = parseFloat(e.target.id) + 1,
		dead = false;
	paused = false;
	started = true;
	dead = false;
	var bricks = {},
		ball = {
			radius: ratio(canvas.width, 9 - diff),
			presetVelocityY: -ratio(canvas.height, 2 + diff * 0.75),
			presetVelocityX: ratio(
				canvas.width,
				3 + diff * 0.75 + Math.random() * 1.5
			),
			velocityX: ratio(canvas.width, 3 + diff * 0.75 + Math.random() * 1.5),
			velocityY: -ratio(canvas.height, 2 + diff * 0.75 + Math.random() * 1.5),
			x: canvas.width / 2,
			y: canvas.height - ratio(canvas.height, 30)
		},
		paddle = {
			w: ratio(canvas.width, 100 - diff * 10),
			h: ratio(canvas.height, 15 - diff * 3),
			x: (canvas.width - this.w) / 2,
			y: ratio(canvas.height, ch - 2)
		};

	// brick variables
	bricks["list"] = [];
	bricks["left"] = ratio(canvas.width, 30);
	bricks["top"] = ratio(canvas.height, 30);
	bricks["roomX"] = canvas.width - bricks.left * 2;
	bricks["cols"] = 4 + diff;
	bricks["rows"] = 3;
	bricks["w"] = bricks.roomX / (bricks.cols + 1);
	bricks["h"] = 20 - diff * 2;
	bricks["padding"] =
		(bricks.roomX - bricks.w * bricks.cols) / (bricks.cols + 1);
	bricks.left += bricks.padding;

	let score = 0,
		lives = Math.round((bricks.cols * bricks.rows) / 5);

	//Brick set
	for (let c = 0; c < bricks.rows; c++) {
		bricks.list[c] = [];
		for (let r = 0; r < bricks.cols; r++) {
			bricks.list[c][r] = {
				x: 0,
				y: 0,
				w: bricks.w,
				h: bricks.h,
				health: diff + 0.1,
				elapsedFadeTime: 0
			};
		}
	}

	function spawn() {
		let random = Math.random() < 0.5 ? -1 : 1;
		ball.x = canvas.width / 2;
		ball.y = paddle.y - paddle.h - ball.radius - ratio(canvas.height, 3);
		ball.velocityX =
			(ball.presetVelocityX + ratio(canvas.width, score / 300)) * random;
		ball.velocityY = ball.presetVelocityY - ratio(canvas.height, score / 300);
		paddle.x = (canvas.width - paddle.w) / 2;
	}

	function collideBricks() {
		for (let c = 0; c < bricks.rows; c++) {
			for (let r = 0; r < bricks.cols; r++) {
				let b = bricks.list[c][r];
				if (b.health > 0.1) {
					if (
						ball.x > b.x &&
						ball.x - ball.radius + ball.velocityX / 2 < b.x + bricks.w &&
						ball.x + ball.radius - ball.velocityX / 2 > b.x &&
						ball.y + ball.radius - ball.velocityY / 2 > b.y &&
						ball.y - ball.radius + ball.velocityY / 2 < b.y + bricks.h
					) {
						let add = Math.abs(Math.abs(b.x) - Math.abs(ball.x)) / 300;

						b.health--;
						if (b.health < 1) {
							fadeList.push(b);
							b.health = 0;
						}
						score++;

						ball.x -=
							(Math.abs(ball.velocityX) + ball.radius / 2) *
							(Math.abs(ball.velocityX) / ball.velocityX);
						ball.y -=
							(Math.abs(ball.velocityY) + ball.radius / 2) *
							(Math.abs(ball.velocityY) / ball.velocityY);

						if (
							ball.y - ball.radius > b.y + bricks.h ||
							ball.y + ball.radius < b.y
						) {
							ball.velocityY *= -1;
						} else if (
							ball.x - ball.radius > b.x + bricks.w ||
							ball.x + ball.radius < b.x
						) {
							ball.velocityX *= -1;
						}

						ball.velocityY =
							(Math.abs(ball.velocityY) +
								Math.abs(add / 2) +
								Math.random() * 0.05 * diff) *
							(Math.abs(ball.velocityY) / ball.velocityY);
						ball.velocityX =
							(Math.abs(ball.velocityX) +
								Math.abs(add) +
								Math.random() * 0.05 * diff) *
							(Math.abs(ball.velocityX) / ball.velocityX);

						console.log(
							`velocity added:`,
							Math.round(add * 1000) / 1000,
							`current direction:`,
							Math.round(ball.velocityX * 1000) / 1000,
							Math.round(ball.velocityY * 1000) / 1000,
							`/`,
							Math.abs(ball.velocityX) / ball.velocityX,
							Math.abs(ball.velocityY) / ball.velocityY
						);

						if (score == bricks.cols * bricks.rows * diff) {
							setTimeout(() => {
								alert("YOU WIN, CONGRATS!");
							}, 500);
							ball.velocityX = 0;
							ball.velocityY = 0;
							killVar = false;
						}
					}
				}
			}
		}
	}

	function collidePaddle() {
		if (ball.y + ball.velocityY > paddle.y - paddle.h - ball.radius / 2) {
			if (
				ball.x > paddle.x - ball.radius &&
				ball.x < paddle.x + paddle.w + ball.radius &&
				ball.y - ball.radius * 2 < paddle.y + paddle.h
			) {
				if (ball.x < paddle.x + paddle.w * (1 / 3)) ball.velocityX--;
				if (
					ball.x < paddle.x + paddle.w * (2 / 3) &&
					ball.x > paddle.x + paddle.w * (1 / 3)
				)
					ball.velocityX *= 0.8;
				if (ball.x > paddle.x + paddle.w * (2 / 3)) ball.velocityX++;
				ball.velocityY *= -1;
				ball.velocityX += (ball.x - paddle.x / 2) / 300;
				ball.y = paddle.y - ball.radius * 2;

				console.log(
					`current direction:`,
					Math.round(ball.velocityX * 1000) / 1000,
					Math.round(ball.velocityY * 1000) / 1000,
					`/`,
					Math.abs(ball.velocityX) / ball.velocityX,
					Math.abs(ball.velocityY) / ball.velocityY
				);
			}
		}
	}

	function collideWalls() {
		if (
			ball.x + ball.velocityX > canvas.width - ball.radius ||
			ball.x + ball.velocityX < ball.radius
		) {
			ball.velocityX *= -1;
		}
		if (ball.y + ball.velocityY < ball.radius) {
			ball.velocityY *= -1;
		}
	}

	function collideDeathBlock() {
		if (ball.y + ball.velocityY / 2 > canvas.height - ball.radius && lives) {
			lives--;
			if (lives < 1) {
				dead = true;
				alert("GAME OVER");
				ball.velocityX = 0;
				ball.velocityY = 0;
				killVar = false;
				return;
			} else {
				spawn();
			}
		}
	}

	function drawStats() {
		color("antiquewhite");
		ctx.font = `${ratio(canvas.width, 16)}px Trebuchet MS`;
		ctx.fillText("Score: " + score, 8, 20);
		ctx.fillText(
			`Lives: ${arguments[0] ? arguments[0] : lives}`,
			canvas.width - 65,
			20
		);
	}
	function drawBall() {
		color("antiquewhite");
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}
	function drawPaddle() {
		color("azure");
		ctx.strokeStyle = "black";
		roundedRect(
			paddle.x,
			paddle.y - paddle.h,
			paddle.w,
			paddle.h,
			paddle.h / 2,
			true,
			1
		);
	}
	function drawBricks() {
		for (let c = 0; c < bricks.rows; c++) {
			for (let r = 0; r < bricks.cols; r++) {
				let b = bricks.list[c][r];
				if (b.health > 0) {
					let brickX = r * (b.w + bricks.padding) + bricks.left,
						brickY = c * (b.h + bricks.padding / 2) + bricks.top,
						brickColor = bricks.list[c][r].health * 100;
					b.x = brickX;
					b.y = brickY;
					color(`rgb(${brickColor}, ${brickColor}, ${brickColor})`);
					ctx.strokeStyle = "black";
					roundedRect(brickX, brickY, b.w, b.h, b.h / 2, true, 1);
				}
			}
		}
	}

	function checkKeyState() {
		if (rightDown && paddle.x < canvas.width - paddle.w) {
			paddle.x += Math.abs(ball.velocityX) + 1.5;
		} else if (leftDown && paddle.x > 0) {
			paddle.x -= Math.abs(ball.velocityX) + 1.5;
		}
	}

	function sketch() {
		if (paused || dead) {
			requestAnimationFrame(sketch);
			return;
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		killBrickAnimation(60);
		drawBricks();
		drawBall();
		drawPaddle();
		drawStats();
		collideDeathBlock();
		collideBricks();
		collideWalls();
		collidePaddle();
		checkKeyState();

		ball.x += ball.velocityX;
		ball.y += ball.velocityY;
		paused ? null : requestAnimationFrame(sketch);
	}
	mouseMoveHandler();
	sketch();

	/* from this point on it's all event handlers */

	// keypress triggers
	document.addEventListener("keydown", keyHandler, false);
	document.addEventListener("keyup", keyHandler, false);

	function keyHandler(e) {
		if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
			rightDown = e.type.match(/down/) ? true : false;
		} else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
			leftDown = e.type.match(/down/) ? true : false;
		}
	}

	// mousemove triggers
	document.addEventListener("mousemove", mouseMoveHandler, false);

	function mouseMoveHandler(e) {
		if (!e) {
			paddle.x = (canvas.width - paddle.w) / 2;
			paddle.y = canvas.height - 2;
			return;
		}

		let mouseX =
			e.clientX * (cw / canvas.offsetWidth) -
			canvas.offsetLeft -
			canvas.style.borderWidth;
		if (mouseX > paddle.w / 2 && mouseX < canvas.width - paddle.w / 2) {
			paddle.x = mouseX - paddle.w / 2;
		} else {
			paddle.x = mouseX > paddle.w / 2 ? canvas.width - paddle.w - 2 : 2;
		}
	}
}
