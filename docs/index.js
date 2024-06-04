let jarState = 0;
let windStrength = 0;
let targetWindStrength = 0;
let julianMovement = 0;
let leftKeyDown = false;
let rightKeyDown = false;
let windDirectionChangeSpeedStep = 1;

const JULIAN_SPEED = 0.005;
const MAX_WIND_DIRECTION_CHANGE_SPEED = 0.05;

let tempStop = false;

const sleep = async function (timeMs) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), timeMs);
	});
};

const jarEl = document.getElementById("jar");
const milkEl = document.getElementById("milk");
const legLeftEl = document.getElementById("legleft");
const legRightEl = document.getElementById("legright");
const windDirectionArrowEl = document
	.getElementById("windDirectionArrow")
	.getElementsByTagName("div")[0];

function lerp(a, b, alpha) {
	return a + alpha * (b - a);
}

function gameOver() {
	tempStop = true;
	jarEl.remove();
	legLeftEl.style.animation = "none";
	legRightEl.style.animation = "none";

	const puddleEl = document.getElementById("puddle");
	puddleEl.style.display = "block";
}

const updateGame = function () {
	if (tempStop) {
		return;
	}

	if (Math.random() > 0.995) {
		targetWindStrength = (Math.random() - 0.5) * 0.5;
		windDirectionChangeSpeedStep++;
		console.log("new target windstrength", targetWindStrength);
	}
	const windDirectionChangeSpeed = lerp(
		0.01,
		MAX_WIND_DIRECTION_CHANGE_SPEED,
		windDirectionChangeSpeedStep * 0.01
	);
	windStrength = lerp(
		windStrength,
		targetWindStrength,
		windDirectionChangeSpeed
	);
	if (Math.abs(windStrength - targetWindStrength) < 0.001) {
		windStrength = targetWindStrength;
	}

	windDirectionArrowEl.style.transform =
		"perspective(200px) rotateX(50deg) rotateZ(" +
		windStrength * -360 +
		"deg)";
	windDirectionArrowEl.style.color =
		"rgb(" +
		Math.max(0, windStrength) * 4 * 255 +
		",100," +
		Math.max(0, -windStrength) * 4 * 255 +
		")";

	jarState += windStrength * 0.02;

	if (leftKeyDown) {
		julianMovement -= JULIAN_SPEED;
		if (julianMovement < -0.5) {
			julianMovement = -0.5;
		}
	} else if (rightKeyDown) {
		julianMovement += JULIAN_SPEED;
		if (julianMovement > 0.5) {
			julianMovement = 0.5;
		}
	} else {
		if (julianMovement > 0) {
			julianMovement -= JULIAN_SPEED / 2;
			if (julianMovement <= 0) {
				julianMovement = 0;
			}
		} else if (julianMovement < 0) {
			julianMovement += JULIAN_SPEED / 2;
			if (julianMovement >= 0) {
				julianMovement = 0;
			}
		}
	}

	let animationSpeed = Math.max(1.5 - Math.abs(julianMovement) * 4, 0.15);
	legLeftEl.style.animationDuration = animationSpeed + "s";
	legRightEl.style.animationDuration = animationSpeed + 0.1 + "s";

	jarState += julianMovement * 0.01;

	if (jarState < -0.25 || jarState > 0.25) {
		gameOver();
	}

	jarEl.style.transform =
		"rotateZ(" + jarState * 100 + "deg) translateX(" + jarState * 20 + "%)";

	milkEl.style.transform = "rotateZ(" + jarState * -100 + "deg)";
};

document.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "ArrowLeft":
			leftKeyDown = true;
			break;
		case "ArrowRight":
			rightKeyDown = true;
			break;
	}
});

document.addEventListener("keyup", (e) => {
	switch (e.key) {
		case "ArrowLeft":
			leftKeyDown = false;
			break;
		case "ArrowRight":
			rightKeyDown = false;
			break;
	}
});

const gameloop = function () {
	updateGame();
	window.requestAnimationFrame(() => gameloop());
};
gameloop();
