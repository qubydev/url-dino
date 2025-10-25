document.addEventListener("DOMContentLoaded", function () {
    // constants
    const HEIGHT = 4;
    const WIDTH = 30;
    const SPACE = "_"
    let INIT_SCREEN = SPACE.repeat(WIDTH);
    FPS = 15;
    const PIXELS = {
        1: "⡀",
        2: "⠄",
        3: "⠂",
        4: "⠁",
    };
    const MIN_SEP = 10;
    const MAX_SEP = 25;
    const OBSTACLES = {
        "„": 2,
        "¬": 2,
        "◞": 2,
        "◟": 2,
        "◡": 2,
        "∴": 2,
    };

    // global vars
    let interval;
    let SCREEN = INIT_SCREEN;
    let running = false;
    let jumping = 0;
    const playerPos = {
        x: 1,
        y: 5
    };
    const keys = {};
    let obstacleAfter = getRandomObstacleSep();
    let score = 0;
    const scores = [];
    let heighestScore = 0;

    // dom
    const scoreboard = document.getElementById('scoreboard');
    const hscore = document.getElementById('hscore');

    // functions
    function addScore(score) {
        scores.push(score);
        const newScoreRow = document.createElement('div');
        newScoreRow.textContent = `Score: ${score}`;
        scoreboard.prepend(newScoreRow);

        if (score > heighestScore) {
            heighestScore = score;
            hscore.textContent = heighestScore;
        }
    };

    function setScreenToUrl(screen, details) {
        const newUrl = `${location.origin}${location.pathname}${location.search}#|${encodeURIComponent(screen)}|[${details ? encodeURIComponent(details) : ''}]`;
        history.replaceState(null, "", newUrl);
    };

    function putObstacle() {
        if (obstacleAfter === 0) {
            const obstacle = Object.keys(OBSTACLES)[Math.floor(Math.random() * Object.keys(OBSTACLES).length)];
            SCREEN = SCREEN.slice(0, WIDTH - 1) + obstacle;
            obstacleAfter = getRandomObstacleSep();
        } else {
            obstacleAfter -= 1;
        }
    };

    function putPlayer() {
        if (jumping === 1) {
            if (playerPos.x < HEIGHT) {
                playerPos.x += 1;
            } else {
                jumping = 2;
            }
        } else if (jumping === 2) {
            if (playerPos.x > 1) {
                playerPos.x -= 1;
            } else {
                jumping = 0;
            }
        }

        // game logic
        if (OBSTACLES[SCREEN[playerPos.y]]) {
            if (OBSTACLES[SCREEN[playerPos.y]] >= playerPos.x) {
                // game over
                addScore(score);
                stop();
                return [SCREEN.slice(0, playerPos.y) + PIXELS[playerPos.x] + SCREEN.slice(playerPos.y + 1), `GAME-OVER`];
            } else {
                score += 1;
            }
        }

        return [SCREEN.slice(0, playerPos.y) + PIXELS[playerPos.x] + SCREEN.slice(playerPos.y + 1), `score-${score}`];
    }

    function refresh() {
        let nextScreen = '';

        // move pixels forward
        for (let y = 0; y < WIDTH - 1; y++) {
            nextScreen += SCREEN[y + 1];
        }

        // new pixel
        nextScreen += SPACE;

        SCREEN = nextScreen;
    }

    function render(init = false) {
        if (init) {
            setScreenToUrl(INIT_SCREEN, 'score-0');
            return;
        }

        putObstacle();
        setScreenToUrl(...putPlayer());
    }

    function handleKeys() {

        // space
        if (keys["Space"]) {
            if (jumping === 0) {
                jump();
            }
        }
    };

    function start() {
        if (running) return;

        interval = setInterval(() => {
            // debug
            // console.log("running...");

            render();
            refresh();
            handleKeys();
        }, 1000 / FPS);

        running = true;
    }

    function stop() {
        clearInterval(interval);
        running = false;
        jumping = 0;
        playerPos.x = 1;
        obstacleAfter = getRandomObstacleSep();
        score = 0;
        SCREEN = INIT_SCREEN;

        render(true);
    }

    function jump() {
        jumping = 1;
    }

    function getRandomObstacleSep() {
        return Math.ceil(MIN_SEP + Math.random() * (MAX_SEP - MIN_SEP));
    }


    // event listeners
    document.addEventListener('keydown', (event) => {
        code = event.code;
        if (code) {
            keys[code] = true;
        }
    });
    document.addEventListener('keyup', (event) => {
        code = event.code;
        if (code) {
            keys[code] = false;
        }
    });
    document.addEventListener('keydown', (event) => {
        if (running) return;

        if (code === "Space") {
            stop();
            start();
        }
    });


    // start up
    render(true);

});
