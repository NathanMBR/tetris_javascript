'use strict';

// Configurando as telas | Configuring the screens
let constGameScreen = new Array(21);
let dynamGameScreen = new Array(21);
for (let i = 0; i < 21; i++) {
	constGameScreen[i] = new Array(10);
	dynamGameScreen[i] = new Array(10);
	for (let j = 0; j < 10; j++) {
		constGameScreen[i][j] = 0;
		dynamGameScreen[i][j] = 0;
	}
}

// Configurando as peças | Configuring the pieces
const T_PIECE = [[0, 0, 0, 0, 0],
				[0, 0, 1, 0, 0],
				[0, 1, 1, 1, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0]];

const CUBE_PIECE = 	[[0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0],
					 [0, 0, 1, 1, 0],
					 [0, 0, 1, 1, 0],
					 [0, 0, 0, 0, 0]];

const I_PIECE = 	[[0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0],
					[1, 1, 1, 1, 1],
					[0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0]];

const LEFT_Z_PIECE =	[[0, 0, 0, 0, 0],
						[0, 0, 1, 1, 0],
						[0, 1, 1, 0, 0],
						[0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0]];

const RIGHT_Z_PIECE = [[0, 0, 0, 0, 0],
					 [0, 1, 1, 0, 0],
					 [0, 0, 1, 1, 0],
					 [0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0]];

const LEFT_L_PIECE =  [[0, 0, 0, 0, 0],
					 [0, 1, 1, 0, 0],
					 [0, 0, 1, 0, 0],
					 [0, 0, 1, 0, 0],
					 [0, 0, 0, 0, 0]];

const RIGHT_L_PIECE = [[0, 0, 0, 0, 0],
					 [0, 0, 1, 1, 0],
					 [0, 0, 1, 0, 0],
					 [0, 0, 1, 0, 0],
					 [0, 0, 0, 0, 0]];
					 
let actualPiece = [];

// Configurações Gerais | General Settings
let fallFrequency = 1200;
let fallFrequencyHolder = fallFrequency;
let isFallFrequencyHolding = false;
const FAST_FALL_VALUE = 50;

let piecePositionX = 2;
let piecePositionY = 0;
let referencePointY = 0;
let lastPiece = 0;
let fallCount = 0;
let isScreenRendering = false;
let isZPiece = false;
let rotateBack = false;
let fallTime;

const LEFT_ARROW_VALUE = 37;
const UP_ARROW_VALUE = 38;
const RIGHT_ARROW_VALUE = 39;
const DOWN_ARROW_VALUE = 40;

document.addEventListener("keydown", doMovement);
document.addEventListener("keyup", resetFastFall);


// Lógica do Jogo | Game Logic
function constructCube(y, x) {
	//    Borda: rgb(143, 12, 18)	(Border)
	// 	  Fundo: rgb(255, 0, 0)		(Background)
	// Quadrado: rgb(241, 78, 86)	(Internal Square)
	ctx.fillStyle = "rgb(143, 12, 18)";
	ctx.fillRect(x * 10, y * 10, 10, 10);
	
	ctx.fillStyle = "rgb(255, 0, 0)";
	ctx.fillRect((x * 10) + 1, (y * 10) + 1, 8, 8);
	
	ctx.fillStyle = "rgb(241, 78, 86)";
	ctx.fillRect((x * 10) + 3, (y * 10) + 3, 4, 4);
}

function clearScreen() {
	ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function clearDynam() {
	for (let i = 0; i < 21; i++) {
		for (let j = 0; j < 10; j++) {
			dynamGameScreen[i][j] = 0;
		}
	}
}

function clearConst() {
	for (let i = 0; i < 21; i++) {
		for (let j = 0; j < 10; j++) {
			constGameScreen[i][j] = 0;
		}
	}
}

function drawDynamScreen() {
	for (let i = 0; i < 21; i++) {
		for (let j = 0; j < 10; j++) {
			if (dynamGameScreen[i][j] === 1) {
				constructCube(i, j);
			}
		}
	}
}

function drawConstScreen() {
	for (let i = 0; i < 21; i++) {
		for (let j = 0; j < 10; j++) {
			if (constGameScreen[i][j] === 1) {
				constructCube(i, j);
			}
		}
	}
}

function rotatePiece() {
	let way;
	
	if (actualPiece === CUBE_PIECE) {
		way = null;
	} else  {
		way = "clockwise";
		if (actualPiece === LEFT_Z_PIECE || actualPiece === RIGHT_Z_PIECE) {
			isZPiece = true;
		}
	}
	
	if (isZPiece) {
		if (rotateBack) {
			actualPiece = revertMatrix(transposeMatrix(actualPiece));
			rotateBack = false;
		} else {
			actualPiece = transposeMatrix(revertMatrix(actualPiece));
			rotateBack = true;
		}
	} else {
		if (way === "clockwise") {
			actualPiece = revertMatrix(transposeMatrix(actualPiece));
		} else {
			if (way === "counter-clockwise") {
				actualPiece = transposeMatrix(revertMatrix(actualPiece));
			}
		}
	}
	
	function transposeMatrix(matrix) {
		let transposed = new Array(5);
		for (let k = 0; k < 5; k++) {
			transposed[k] = new Array(5);
		}
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				transposed[i][j] = matrix[j][i];
			}
		}
		return transposed;
	}
	
	function revertMatrix(matrix) {
		let reverted = new Array(5);
		for (let k = 0; k < 5; k++) {
			reverted[k] = new Array(5);
		}
		for (let i = 0; i < 5; i++) {
			reverted[i] = matrix[i].reverse();
		}
		return reverted;
	}
	
	function adjustXcoordinate() {
		let actualX = piecePositionX;
		let leftReference;
		let rightReference;
		for (let j = 0; j < 5; j++) {
			for (let i = 0; i < 5; i++) {
				if (actualPiece[i][j] === 1) {
					leftReference = j;
					j = 5;
					i = 5;
				}
			}
		}
		
		for (let jj = 4; jj >= 0; jj--) {
			for (let ii = 4; ii >= 0; ii--) {
				if (actualPiece[ii][jj] === 1) {
					rightReference = jj;
					jj = -1;
					ii = -1;
				}
			}
		}
		
		function adjustPieceOnScreen() {
			adjustLeftSide();
			adjustRightSide();
			
			function adjustLeftSide() {
				if (piecePositionX - leftReference + (rightReference - 1) < 0) {
					piecePositionX++;
					adjustLeftSide();
				}
			}
			
			function adjustRightSide() {
				if (piecePositionX + rightReference > 9) {
					piecePositionX--;
					adjustRightSide();
				}
			}
			
			playActualPiece();
		}
		
		adjustPieceOnScreen();
	}
	
	adjustReferencePoint();
	adjustXcoordinate();
}

function renderScreen() {
	if (isScreenRendering) {
		clearScreen();
		drawConstScreen();
		drawDynamScreen();
		score.innerHTML = "Score: " + scoreValue;
		requestAnimationFrame(renderScreen);
	}
}

function getNewPiece() {
	drawRandomPiece();
	pieceChooser(lastPiece);
	adjustReferencePoint();
	playActualPiece();
}

function fallLoop() {
	if (isScreenRendering) {
		if (new Date().getTime() >= fallTime + fallFrequencyHolder) {
			fall();
			fallTime = new Date().getTime();
		}
		setTimeout(() => fallLoop(), 50);	
	}
}

function startGame() {
	function generateGame() {
		// Pause
		window.pauseButton = document.createElement("button");
		pauseButton.innerHTML = "Pause";
		pauseButton.onclick = function() {
			if (pauseButton.innerHTML === "Pause") {
				pauseButton.innerHTML = "Continue";
			} else {
				pauseButton.innerHTML = "Pause";
			}
			isScreenRendering = !isScreenRendering;
			renderScreen();
		}
		/*gameBody.appendChild(pauseButton);
		let brElement = document.createElement("br");
		gameBody.appendChild(brElement);*/
		
		// Configurando o canvas | Configuring the canvas
		window.gameBody = document.getElementById("gameBody");
		window.gameCanvas = document.createElement("canvas");
		gameCanvas.width = "100";
		gameCanvas.height = "210";
		window.ctx = gameCanvas.getContext("2d");
		gameBody.removeChild(document.getElementById("startButton"));
		gameBody.appendChild(gameCanvas);
		
		// Score
		window.scoreValue = 0;
		window.score = document.createElement("p");
		score.innerHTML = "Score: " + scoreValue;
		gameBody.appendChild(score);
	}
	generateGame();
	isScreenRendering = true;
	renderScreen();
	getNewPiece();
	fallTime = new Date().getTime();
	fallLoop();
	function gameLoop() {
		if (isScreenRendering) {
			testEnd();
			setTimeout(() => gameLoop(), 10);
		}
	}
	gameLoop();
}

function testEnd() {
	for (let j = 0; j < 10; j++) {
		if (constGameScreen[0][j] === 1) {
			endGame();
		}
	}
	
	function endGame() {
		isScreenRendering = false;
	}
}



function adjustReferencePoint() {
	referencePointY = 0;
	let isAdjustNeeded = true;
	function testAdjustment() {
		for (let j = 0; j < 5; j++) {
			if (actualPiece[referencePointY][j] === 1) {
				isAdjustNeeded = false;
			}
		}
		if (isAdjustNeeded) {
			referencePointY++;
			testAdjustment();
		}
	}
	testAdjustment();
}

function playActualPiece() {
	adjustReferencePoint();
	clearDynam();
	for (let i = 0; i + referencePointY < 5; i++) {
		for (let j = 0; j < 5; j++) {
			if (actualPiece[i + referencePointY][j] === 1) {
				dynamGameScreen[i + piecePositionY][j + piecePositionX] = actualPiece[i + referencePointY][j];
			}
		}
	}
}

function drawRandomPiece() {
	let randomPiece = Math.floor(Math.random() * 7) + 1;
	if (randomPiece === lastPiece) {
		drawRandomPiece();
	} else {
		lastPiece = randomPiece;
	}
}

function pieceChooser(piece) {
	switch (piece) {
		case 1:
			actualPiece = T_PIECE;
			break;
		case 2:
			actualPiece = CUBE_PIECE;
			break;
		case 3:
			actualPiece = I_PIECE;
			break;
		case 4:
			actualPiece = LEFT_Z_PIECE;
			break;
		case 5:
			actualPiece = RIGHT_Z_PIECE;
			break;
		case 6:
			actualPiece = LEFT_L_PIECE;
			break;
		case 7:
			actualPiece = RIGHT_L_PIECE;
			break;
		default:
			throw new Error("Unexpected piece ID.");
	}
	isZPiece = false;
	rotateBack = false;
}

function doMovement() { // object literals
	if (validateKey() && isScreenRendering) {
		switch (event.keyCode) {
			case LEFT_ARROW_VALUE:
				movePieceLeft();
				break;
				
			case UP_ARROW_VALUE:
				rotatePiece();
				break;
				
			case RIGHT_ARROW_VALUE:
				movePieceRight();
				break;
				
			case DOWN_ARROW_VALUE:
				fastFall();
				break;
				
			default:
				throw new Error("Unexpected movement.");
		}
		playActualPiece();
	}
}

function fastFall() {
	if (!isFallFrequencyHolding) {
		isFallFrequencyHolding = true;
		fallFrequencyHolder = FAST_FALL_VALUE;
	}
}

function resetFastFall() {
	if (event.keyCode === DOWN_ARROW_VALUE) {
		fallFrequencyHolder = fallFrequency;
		isFallFrequencyHolding = false;
	}
}

function validateKey() {
	const validKeys = [LEFT_ARROW_VALUE, UP_ARROW_VALUE, RIGHT_ARROW_VALUE, DOWN_ARROW_VALUE];
	let returnValue = false;
	for (let i = 0; i < validKeys.length; i++) {
		if (event.keyCode === validKeys[i]) {
			returnValue = true;
			i = validKeys.length;
		}
	}
	return returnValue;
}

function movePieceRight() {
	let canMove = true;
	for (let i = 0; i < 21; i++) {
		for (let j = 0; j < 10; j++) {
			if (dynamGameScreen[i][9] === 1 || dynamGameScreen[i][j] === 1 && constGameScreen[i][j + 1] === 1) {
				canMove = false;
			}
		}
	}
	if (canMove) {
		piecePositionX++;
	}
}

function movePieceLeft() {
	let canMove = true;
	for (let i = 0; i < 21; i++) {
		for (let j = 0; j < 10; j++) {
			if (dynamGameScreen[i][0] === 1 || dynamGameScreen[i][j] === 1 && constGameScreen[i][j - 1] === 1) {
				canMove = false;
			}
		}
	}
	if (canMove) {
		piecePositionX--;
	}
}

function fixPiece() {
	for (let i = 0; i < 21; i++) {
		for (let j = 0; j < 10; j++) {
			if (dynamGameScreen[i][j] === 1) {
				constGameScreen[i][j] = dynamGameScreen[i][j];
			}
		}
	}
}

function fall() {
	let doFall = true;
	function validateFall() {
		for (let i = 19; i >= 0; i--) {
			for (let j = 9; j >= 0; j--) {
				if (dynamGameScreen[i][j] === 1 && constGameScreen[i + 1][j] === 1 || dynamGameScreen[20][j] === 1) {
					doFall = false;
				}
			}
		}
	}
	validateFall();
	if (doFall) {
		piecePositionY++;
		playActualPiece();
	} else {
		fixPiece();
		piecePositionY = 0;
		piecePositionX = 2;
		getScore();
		if (actualPiece === I_PIECE) {
			scoreValue += 50;
		} else {
			scoreValue += 40;
		}
		getNewPiece();
	}
}

function getScore() {
	let scoreArray = new Array();
	for (let i = 0; i < 10; i++) {
		scoreArray.push(1);
	}
	let doConstFall = true;
	let scoreLines = [];
	function verifyScore() {
		for (let i = 0; i < 21; i++) {
			for (let j = 0; j < 10; j++) {
				if (constGameScreen[i][j] === 0) {
					doConstFall = false;
				}
			}
			if (doConstFall) {
				scoreLines.push(i);
				scoreValue += 100;
				fallCount++;
				if (fallCount >= 5) {
					console.log("Speeding up! Fall Frequency: " + fallFrequency);
					fallCount -= 5;
					accelerateFall();
				}
			}
			doConstFall = true;
		}
	}
	function fallConstScreen() {
		for (let line of scoreLines) {
			for (let i = line; i >= 1; i--) {
				for (let j = 0; j < 10; j++) {
					constGameScreen[i][j] = constGameScreen[i - 1][j];
				}
			}
		}
	}
	function accelerateFall() {
		if (fallFrequency > 200) {
			fallFrequency -= 100;
		}
	}
	verifyScore();
	fallConstScreen();
}