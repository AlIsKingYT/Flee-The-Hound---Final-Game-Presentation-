var c = document.querySelector("canvas"); 
var ctx = c.getContext("2d");
var fps = 1000 / 60;

var state;
var avatar;
var goal = new GameObject();
var groundSegments = [];
var platforms = [];
var walls = [];
var gameTime = 120;

// avatar 
var avatarImg = new Image();
avatarImg.src = "images/snoop-1.png";
avatarImg.onload = function () {
    avatar = new GameObject();
    avatar.img = avatarImg; 
    avatar.w = 50;
    avatar.h = 70;
    init();
    setInterval(main, fps);
};

// music
var bgMusic = document.getElementById("bg-music");
// Start music on first press
document.addEventListener("keydown", () => {
    if(bgMusic.paused) bgMusic.play();
}, { once: true });

// Restart R
document.addEventListener("keydown", function (e) {
    if (e.key === "r" || e.key === "R") {
        if (state === win || state === lose) {
            init();
        }
    }
});

// MAIN LOOP
function main() {
    ctx.fillStyle = "#51b0d6"; // sky
    ctx.fillRect(0, 0, c.width, c.height);

    if(state) state();

    if (state === game) {
        gameTime -= 1 / 60;
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Time: " + Math.ceil(gameTime), 650, 40);
        if (gameTime <= 0) state = lose;
    }
}

/* -- INIT -- */
function init() {
    state = game;
    gameTime = 120;

    platforms = [];
    walls = [];
    groundSegments = [];

    // Avatar start
    avatar.x = 0;
    avatar.y = 360;
    avatar.vx = 0;
    avatar.vy = 0;
    avatar.canJump = false;

    // Ground 
    function addGround(x, width) {
        let g = new GameObject();
        g.x = x + width / 2;
        g.y = 500 - 60;
        g.w = width;
        g.h = 120;
        g.color = "#8B5A2B";
        groundSegments.push(g);
    }

    addGround(-500, 1450);
    addGround(1200, 400);
    addGround(1700, 400);
    addGround(2200, 400);
    addGround(2800, 500);
    addGround(3000, 400);
    addGround(3900, 600);
    addGround(5000, 800);
    addGround(5900, 600);

    // Platforms
    function addPlatform(x, y) {
        let p = new GameObject();
        p.x = x;
        p.y = y;
        p.w = 150;
        p.h = 28;
        p.color = "#d4d1cc";
        platforms.push(p);
    }

    addPlatform(1250, 300);
    addPlatform(1550, 320);
    addPlatform(1850, 260);
    addPlatform(2300, 300);
    addPlatform(2550, 260);
    addPlatform(2750, 340);
    addPlatform(3050, 210);
    addPlatform(3650, 260);
    addPlatform(3950, 200);
    addPlatform(4250, 225);
    addPlatform(4550, 310);
    addPlatform(4850, 380);

    // spikes
    function addWall(x, height = 160) {
        let w = new GameObject();
        w.w = 40;
        w.h = height;
        w.color = "#931b1b";
        w.x = x;
        w.y = 500 - height / 2;
        walls.push(w);
    }

    addWall(1250);
    addWall(1300);
    addWall(1350);
    addWall(1400);
    addWall(1450);
    addWall(1500);
    addWall(1550);

    addWall(2000, 300);
    addWall(2400, 300);
    addWall(2650, 350);
    addWall(2850);
    addWall(2900);
    addWall(2950);
    addWall(3000);
    addWall(3050);
    addWall(3100);

    addWall(3600, 225);
    addWall(4100, 400);
    addWall(4700, 300);
    addWall(5200, 225);
    addWall(5600, 230);
    addWall(6100, 230);

    // end 
    goal.w = 90;
    goal.h = 1120;
    goal.color = "#FFD700";
    goal.x = 6250;
    goal.y = 500 - goal.h / 2;
}

/* -- STATES -- */
function win() {
    let message = "YOU WIN!";
    drawCenteredMessage(message, "green", 50);
    drawRestartText(6); // push below lines
}

function lose() {
    let message = "HOW DARE YOU LOSE DURING YOUR FINAL PRESENTATION! TRY AGAIN AND PRAY JOEL DOESN'T FLUNK YOU FOR SIMPLY SUCKING AT YOUR OWN GAME!";
    drawCenteredMessage(message, "red", 28, 700);
    drawRestartText(7); // push below lines
}

// Draws wrapped text and black bg
function drawCenteredMessage(message, color, fontSize = 28, maxWidth = 700) {
    let words = message.split(' ');
    let lines = [];
    let line = '';
    ctx.font = `${fontSize}px Arial`;
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > maxWidth && line !== '') {
            lines.push(line.trim());
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line.trim());

    let lineHeight = fontSize + 8;
    let centerX = c.width / 2;
    let startY = 150;

    // Black background
    let rectPadding = 20;
    let rectHeight = lines.length * lineHeight + rectPadding * 2;
    let rectY = startY - rectPadding;
    ctx.fillStyle = "black";
    ctx.fillRect(centerX - maxWidth / 2 - rectPadding, rectY, maxWidth + rectPadding * 2, rectHeight);

    // Draw text
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], centerX, startY + i * lineHeight);
    }
}

// Draw "Restart" centered
function drawRestartText(extraLines = 0) {
    let centerX = c.width / 2;
    let startY = 150;
    let lineHeight = 36;
    ctx.font = "22px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Press R to Restart", centerX, startY + lineHeight * extraLines + 10);
}

/* -------------------- GAME -------------------- */
function game() {
    // Jump
    if (sp && avatar.canJump) {
        avatar.canJump = false;
        avatar.vy = -16;
    }

    // Movement
    if (a) avatar.vx -= 0.7;
    if (d) avatar.vx += 0.7;

    avatar.vx *= 0.88;
    avatar.vy += 0.75;
    avatar.x += avatar.vx;
    avatar.y += avatar.vy;

    // Ground collision
    let onGround = false;
    for (let g of groundSegments) {
        while (avatar.y + avatar.h / 2 > g.y - g.h / 2 &&
               avatar.y + avatar.h / 2 < g.y + g.h / 2 &&
               avatar.x + avatar.w / 2 > g.x - g.w / 2 &&
               avatar.x - avatar.w / 2 < g.x + g.w / 2) {
            avatar.vy = 0;
            avatar.y--;
            avatar.canJump = true;
            onGround = true;
        }
    }

    // Platforms
    for (let p of platforms) {
        while (avatar.y + avatar.h / 2 > p.y - p.h / 2 &&
               avatar.y + avatar.h / 2 < p.y + p.h / 2 &&
               avatar.x + avatar.w / 2 > p.x - p.w / 2 &&
               avatar.x - avatar.w / 2 < p.x + p.w / 2) {
            avatar.vy = 0;
            avatar.y--;
            avatar.canJump = true;
            onGround = true;
        }
    }

    // Deadly spikes
    for (let w of walls) {
        if (avatar.overlaps(w)) {
            state = lose;
            return;
        }
    }

    // Pit fall
    if (!onGround && avatar.y > 700) {
        state = lose;
        return;
    }

    // Win
    if (avatar.overlaps(goal)) {
        state = win;
        return;
    }

    // Camera lock
    let offsetX = c.width / 2 - avatar.x;
    ctx.save();
    ctx.translate(offsetX, 0);

    // Draw ground
    for (let g of groundSegments) {
        ctx.fillStyle = g.color;
        ctx.fillRect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h);
    }

    // Draw platforms
    for (let p of platforms) p.render();

    // Draw deadly spikes
    for (let w of walls) w.render();

    // Draw goal
    ctx.fillStyle = goal.color;
    goal.render();

    // Draw avatar
    avatar.render();

    ctx.restore();
}
