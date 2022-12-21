// Start the game
var game = new Object();
const flourBought = new Event('flourBought');

function startGame() {
    //set default game values
    game.flour = 0;
    game.canvas = document.getElementById("canvas");
    game.particles = new Array();
    game.canvas.width = window.innerWidth;
    game.canvas.height = window.innerHeight;
    game.cell1 = document.getElementById("cell1")

    //reveal first cell
    revealCell(1);
    
    //run updateGame() 20 times per second
    setInterval(updateGame, 50);

    //add an onclick event to flourButton that calls buyFlour()
    document.getElementById("flourButton").onclick = () => { buyFlour(1); };

    //add an event listener for flourBought
    document.addEventListener('flourBought', function(e) {
        if(game.flour >= 10) {
            //reveal second cell
            revealCell(2);

            //remove the event listener
            document.removeEventListener('flourBought', arguments.callee);
        }
    });
    
}

//buyFlour increases flour by x
function buyFlour(x) {
    //dispatch the flourBought event
    document.dispatchEvent(flourBought);

    //increase flour by 1
    game.flour += x;

    //add a particle
    game.particles.push({x: Math.random() * game.canvas.width, y: 0, radius: 1, color: "lightgrey", speed: 1});
}

// Update the game
function updateGame() {
    drawGame();
    //update the flour display
    document.getElementById("flourDisplay").innerHTML = game.flour;
}

// Draw the game
function drawGame() {
    //get the canvas context
    var context = game.canvas.getContext("2d");

    //clear the canvas
    context.clearRect(0, 0, game.canvas.width, game.canvas.height);

    //if there are too many particles, remove all but 1000
    if (game.particles.length > 1000) {
        game.particles.splice(0, game.particles.length - 1000);
    }


    //draw the particles
    for (var i = 0; i < game.particles.length; i++) {
        //if a particle is off the screen, remove it
        if (game.particles[i].y > game.canvas.height) {
            game.particles.splice(i, 1);
            continue;
        }
        game.particles[i].y += game.particles[i].speed;
        context.beginPath();
        context.arc(game.particles[i].x, game.particles[i].y, game.particles[i].radius, 0, 2 * Math.PI, false);
        context.fillStyle = game.particles[i].color;
        context.fill();
    }
}

//reveal cellx
function revealCell(x) {
    var cellx = document.getElementById("cell" + x)
    cellx.style.opacity = 0
    cellx.style.display = "table-cell"

    //increase cell opacity over 1 second
    var opacity = 0;
    var interval = setInterval(function() {
        opacity += 0.02;
        cellx.style.opacity = opacity;
        if (opacity >= 0.9) {
            clearInterval(interval);
        }
    }, 50);
}


startGame();