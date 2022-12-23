// Start the game
var game = new Object();
const flourBought = new Event('flourBought');
const waterBought = new Event('waterBought');
const macaroniBought = new Event('macaroniBought');
const millerBought = new Event('millerBought');
const pumpBought = new Event('pumpBought');
const chefBought = new Event('chefBought');

function startGame() {
    //set default game values
    game.flour = 0;
    game.water = 0;
    game.macaroni = 0;
    game.miller = 0;
    game.pump = 0;
    game.chef = 0;
    game.waterUnlocked = false;
    game.macaroniUnlocked = false;
    game.millerUnlocked = false;
    game.pumpUnlocked = false;
    game.chefUnlocked = false;
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
            if(!game.millerUnlocked){
                revealCell(4);
                game.millerUnlocked = true;
                document.getElementById("macaroniBar").max = 100;

                //add an onclick event to millerButton that calls buyMiller()
                document.getElementById("millerButton").onclick = () => { buyMiller(1); };

                //add an onclick event to millerButton2 that calls sellMiller()
                document.getElementById("millerButton2").onclick = () => { sellMiller(1); };
            }
            
        }
    });

    //add an event listener for millerBought
    document.addEventListener('millerBought', function(e) {
        if(game.miller >= 10) {
            //reveal fifth cell
            if(!game.pumpUnlocked){
                revealCell(5);
                game.pumpUnlocked = true;

                //add an onclick event to pumpButton that calls buyPump()
                document.getElementById("pumpButton").onclick = () => { buyPump(1); };

                //add an onclick event to pumpButton2 that calls sellPump()
                document.getElementById("pumpButton2").onclick = () => { sellPump(1); };

                //remove the event listener
                document.removeEventListener('millerBought', arguments.callee);
            }
        }
    });

    //add an event listener for pumpBought
    document.addEventListener('pumpBought', function(e) {
        if(game.pump >= 10) {
            //reveal sixth cell
            if(!game.chefUnlocked){
                revealCell(6);
                game.chefUnlocked = true;

                //add an onclick event to chefButton that calls buyChef()
                document.getElementById("chefButton").onclick = () => { buyChef(1); };

                //add an onclick event to chefButton2 that calls sellChef()
                document.getElementById("chefButton2").onclick = () => { sellChef(1); };

                //remove the event listener
                document.removeEventListener('pumpBought', arguments.callee);
            }
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

    //dispatch the macaroniBought event
    document.dispatchEvent(macaroniBought);

    //add a particle
    game.particles.push({x: Math.random() * game.canvas.width, y: 0, radius: 1, color: "yellow", speed: 3});
}

//buyMiller increases miller by x but reduces macaroni by 10x
function buyMiller(x) {
    if(game.macaroni < 10*x) {
        return;
    }

    //increase miller by 1
    game.miller += x;

    //decrease macaroni by 10
    game.macaroni -= 10*x;

    //dispatch the millerBought event
    document.dispatchEvent(millerBought);
}

//sellMiller decreases miller by x but increases macaroni by 5x
function sellMiller(x) {
    if(game.miller < x) {
        return;
    }

    //decrease miller by 1
    game.miller -= x;

    //increase macaroni by 5
    game.macaroni += 5*x;
}

//buyPump increases pump by x but reduces macaroni by 10x
function buyPump(x) {
    if(game.macaroni < 10*x) {
        return;
    }

    //increase pump by 1
    game.pump += x;

    //decrease macaroni by 10
    game.macaroni -= 10*x;

    //dispatch the pumpBought event
    document.dispatchEvent(pumpBought);
}

//sellPump decreases pump by x but increases macaroni by 5x
function sellPump(x) {
    if(game.pump < x) {
        return;
    }

    //decrease pump by 1
    game.pump -= x;

    //increase macaroni by 5
    game.macaroni += 5*x;
}

//buyChef increases chef by x but reduces macaroni by 10x
function buyChef(x) {
    if(game.macaroni < 10*x) {
        return;
    }

    //increase chef by 1
    game.chef += x;

    //decrease macaroni by 10
    game.macaroni -= 10*x;

    //dispatch the chefBought event
    document.dispatchEvent(chefBought);
}

//sellChef decreases chef by x but increases macaroni by 5x
function sellChef(x) {
    if(game.chef < x) {
        return;
    }

    //decrease chef by 1
    game.chef -= x;

    //increase macaroni by 5
    game.macaroni += 5*x;
}

//millFlour makes flour but consumes macaroni
function millFlour(x) {
    if(game.macaroni < 0.1*x) {
        return;
    }
    game.flour += x;
    game.macaroni -= 0.1*x;
}

//pumpWater makes water but consumes macaroni
function pumpWater(x) {
    if(game.macaroni < 0.1*x) {
        return;
    }
    game.water += x;
    game.macaroni -= 0.1*x;
}

//cookMacaroni makes macaroni but consumes flour, water, and macaroni
function cookMacaroni(x) {
    if(game.flour < x || game.water < x || game.macaroni < 0.1*x) {
        return;
    }
    game.macaroni += x;
    game.flour -= x;
    game.water -= x;
    game.macaroni -= 0.1*x;
}

// Update the game
function updateGame() {
    drawGame();
    //update the flour display
    document.getElementById("flourDisplay").innerHTML = Math.floor(game.flour);
    document.getElementById("flourBar").value = game.flour;
    document.getElementById("waterDisplay").innerHTML = Math.floor(game.water);
    document.getElementById("waterBar").value = game.water;
    document.getElementById("macaroniDisplay").innerHTML = Math.floor(game.macaroni);
    document.getElementById("macaroniBar").value = game.macaroni;
    document.getElementById("millerDisplay").innerHTML = Math.floor(game.miller);
    document.getElementById("millerBar").value = game.miller;
    document.getElementById("pumpDisplay").innerHTML = Math.floor(game.pump);
    document.getElementById("pumpBar").value = game.pump;
    document.getElementById("chefDisplay").innerHTML = Math.floor(game.chef);
    document.getElementById("chefBar").value = game.chef;

    //run autobuyers
    millFlour(game.miller);
    pumpWater(game.pump);
    cookMacaroni(game.chef);

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