const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
    },
    values: {
        hitPosition: 0,
        result: 0,
        currentTime: 0,
        currentLives: 0,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    },
    gameOver: false, // Add a flag to track game over state
};

let lastRandomNumber = null;
let countDownInterval = null; // Create an interval variable

function countDown() {
    if (!state.gameOver && state.values.currentTime > 0) {
        state.values.currentTime--;
        state.view.timeLeft.textContent = state.values.currentTime;
    } else if (!state.gameOver && state.values.currentTime === 0) {
        state.gameOver = true;
        playSound("level-completed", () => {
            alert("Fim de jogo! O seu resultado foi: " + state.values.result);
            initialize();
        });
    }
}

function playSound(name, callback) {
    let audio = new Audio(`src/audios/${name}.wav`);
    audio.addEventListener('ended', callback);
    audio.play();
}

function randomSquare() {
    if (!state.gameOver) {
        state.view.squares.forEach((square) => {
            square.classList.remove("enemy");
        });

        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * 9);
        } while (randomNumber === lastRandomNumber);

        lastRandomNumber = randomNumber;

        let randomSquare = state.view.squares[randomNumber];
        randomSquare.classList.add("enemy");
        state.values.hitPosition = randomSquare.id;
    }
}

function addListenerHitbox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (!state.gameOver && state.values.currentLives > 0) {
                if (square.id === state.values.hitPosition) {
                    state.values.result++;
                    playSound("hit");
                    randomSquare();
                    state.view.score.textContent = state.values.result;
                } else {
                    state.values.currentLives--;
                    state.view.lives.textContent = "x" + state.values.currentLives;
                    if (state.values.currentLives === 0) {
                        state.gameOver = true;
                        playSound("game-over", () => {
                            alert("Você perdeu!");
                            initialize();
                        });
                    }
                }
            }
        });
    });
}

function initialize() {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    state.values.currentTime = 60;
    state.values.result = 0;
    state.view.score.textContent = "0";
    state.view.timeLeft.textContent = "60";
    state.values.currentLives = 3;
    state.view.lives.textContent = "x" + state.values.currentLives;
    state.actions.countDownTimerId = setInterval(countDown, 1000);
    countDownInterval = state.actions.countDownTimerId;
    state.gameOver = false; // Reset the game over flag
    randomSquare();
}

initialize();
addListenerHitbox();
