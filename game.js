// Start the game
var game = new Object();
const flourBought = new Event('flourBought');
const waterBought = new Event('waterBought');
const macaroniBought = new Event('macaroniBought');

function startGame() {
    //set default game values
    game.flour = 0;
    game.water = 0;
    game.macaroni = 0;
    game.waterUnlocked = false;
    game.macaroniUnlocked = false;
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
        if(game.flour >= 20) {
            //reveal second cell
            revealCell(2);
            game.waterUnlocked = true;
            document.getElementById("flourBar").style.display = "none";

            //add an onclick event to waterButton that calls buyWater()
            document.getElementById("waterButton").onclick = () => { buyWater(1); };

            //remove the event listener
            document.removeEventListener('flourBought', arguments.callee);
        }
    });

    //add an event listener for waterBought
    document.addEventListener('waterBought', function(e) {
        if(game.water >= 20) {
            //reveal third cell
            revealCell(3);
            game.macaroniUnlocked = true;
            document.getElementById("waterBar").style.display = "none";

            //add an onclick event to macaroniButton that calls buyMacaroni()
            document.getElementById("macaroniButton").onclick = () => { buyMacaroni(1); };

            //remove the event listener
            document.removeEventListener('waterBought', arguments.callee);
        }
    });

    //add an event listener for macaroniBought
    document.addEventListener('macaroniBought', function(e) {
        if(game.macaroni >= 50) {
            //reveal fourth cell
            revealCell(4);
            document.getElementById("macaroniBar").max = 1000;

            //remove the event listener
            document.removeEventListener('macaroniBought', arguments.callee);
        }
    });
    
}

//buyFlour increases flour by x
function buyFlour(x) {
    //increase flour by 1
    game.flour += x;

    //dispatch the flourBought event
    document.dispatchEvent(flourBought);

    //add a particle
    game.particles.push({x: Math.random() * game.canvas.width, y: 0, radius: 1, color: "lightgrey", speed: 1});
}

//buyWater increases water by x
function buyWater(x) {
    //increase water by 1
    game.water += x;

    //dispatch the waterBought event
    document.dispatchEvent(waterBought);

    //add a particle
    game.particles.push({x: Math.random() * game.canvas.width, y: 0, radius: 1, color: "blue", speed: 2});
}

//buyMacaroni increases macaroni by x but reduces flour and water by x
function buyMacaroni(x) {
    if(game.flour < x || game.water < x) {
        return;
    }

    //increase macaroni by 1
    game.macaroni += x;

    //decrease flour by 1
    game.flour -= x;

    //decrease water by 1
    game.water -= x;

    //add a particle
    game.particles.push({x: Math.random() * game.canvas.width, y: 0, radius: 1, color: "yellow", speed: 3});
}

// Update the game
function updateGame() {
    drawGame();
    //update the flour display
    document.getElementById("flourDisplay").innerHTML = game.flour;
    document.getElementById("flourBar").value = game.flour;
    document.getElementById("waterDisplay").innerHTML = game.water;
    document.getElementById("waterBar").value = game.water;
    document.getElementById("macaroniDisplay").innerHTML = game.macaroni;
    document.getElementById("macaroniBar").value = game.macaroni;
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