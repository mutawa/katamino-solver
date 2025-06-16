const tileSize = 40;
const gridCols = 12;
const gridRows = 5;
let grid;
let beginSolve = false;


function setup() {
    createCanvas(tileSize * gridCols, tileSize * gridRows + 300);
    grid = new Grid(gridCols, gridRows, tileSize);
    

     //grid.placePiece(Piece.u.orientations[0], 10, 1);
     //grid.placePiece(Piece.l, 0, 0);
     //grid.placePiece(Piece.z, 2, 0);
     //grid.placePiece(Piece.p, 2, 2);
    // grid.placePiece(Piece.t, 5, 0);
    // grid.placePiece(Piece.c, 9, 0);
    // grid.placePiece(Piece.w, 0, 2);
    // grid.placePiece(Piece.b, 2, 3);
    // grid.placePiece(Piece.n, 4, 2);
    // grid.placePiece(Piece.y, 9, 1);
    // grid.placePiece(Piece.e, 6, 2);
    // grid.placePiece(Piece.k, 7, 4);
    
    document.querySelector("#btn-one-step").addEventListener("click", () => { for(let i=0; i<stepsNumber; i++) solve(); });
    document.querySelector("#btn-pause").addEventListener("click", () => { beginSolve = !beginSolve; });
    document.querySelector("#btn-inc-steps").addEventListener("click", () => { stepsNumber = 10 * floor((stepsNumber + 10)/10); });
    document.querySelector("#btn-dec-steps").addEventListener("click", () => { stepsNumber = max(1, 10 * floor((stepsNumber - 10)/10));  });


    //grid.placePiece(Piece.p.orientations[0], 8, 0);


    stepsNumber = 20000; 

}

function traverse() {
    console.log("Traversing grid...");
    grid.traverse();
}

// function test() {
//     if(testIndex >= testPieces.length) {
//         console.log("No more test pieces to place.");
//         return;
//     }
//     const tp = testPieces[testIndex];
//     grid.placePiece(tp.piece, tp.col, tp.row);
//     testIndex++;

// }
// let level = 0;
// function trySolve(orientations = []) {
    
//     const tile = grid.tiles.find(t => t.isEmpty);
//     if(!tile) {
//         console.log("all tiles are filled. Completed");
//         return true;
//     }

//     const availableTiles = Piece.all.filter(p => !p.inUse);

//     if(availableTiles.length == 0) {
//         console.error('no pieces available, even though some tiles are empty... (error?)');
//         return false;
//     }

//     if(orientations.length === 0) {
//         for(let piece of availableTiles) {
//             orientations.push(piece.orientations);
//         }
//     }

//     const padding = " ".repeat((12 - orientations.length) * 2); 

//     console.log(`${padding}${orientations.length} orientations`);

//     level += 1;
//     if(level > 100) {
//         console.log(`${padding}LEVEL EXCEEDED MAXIMUM`);
//         return false;
//     }


//     if(orientations.length === 0) {
//         console.warn(`${padding}no more available orientations for tile (${tile.col}, ${tile.row})`);
//         return false;
//     }
//     all:
//     for(let i =0; i< orientations.length; i++) {
    
//         const piece = orientations[i];
//         piece:
//         for(let orientation of piece) {

//             const success = grid.placePiece(orientation, tile.col, tile.row);

//             if(success) {
//                 console.log(`${padding}${orientation.name} placed on (${tile.col}, ${tile.row})`);
//                 if(trySolve(orientations.slice(1))) {
//                     return true;
//                 }
//                 else {
//                     console.log(`${padding}didn't work out. removing ${orientation.name} from (${tile.col}, ${tile.row})`);
//                     grid.removePiece(orientation);
//                 }
//             }
//         }
//     }
//     console.log(`${padding}all possible orientations tried. no solution found`);
//     return false;
// }


const piles = [];
const pilesIndex = [];
let moveNumber = 0;
let currentTile;
let doneOnce = false;
let stepsNumber = 1;
let stepCounter = 0;

function solve() {
    
    // find an empty tile
    currentTile = grid.tiles.find(t => t.isEmpty);
    
    // if not empty tile found, then board is full
    if(!currentTile) {
        console.log(`Board is full in ${stepCounter} steps`);
        stepsNumber = 0;
        return;
    }
    stepCounter += 1;
    
    // check all orientations that could fit from all 12 pieces and add them to array
    if (!piles[moveNumber]) {
        
        
        if(piles[moveNumber].length > 0) pilesIndex[moveNumber] = 0;

        if(piles[moveNumber].length === 0) {
            console.error(`could not find any orientations for moveNumber ${moveNumber}. going back`);
            
            return;
        }
    }

    const o = piles[moveNumber][pilesIndex[moveNumber]];
    if(!o) {
        backtrack();
        currentTile = grid.tiles.find(t => t.isEmpty);
        return;
    }
    if(!o.inUse) {
        grid.placePiece(o, currentTile.col, currentTile.row);
        moveNumber += 1;
        // doneOnce = false;
    } else {
        pilesIndex[moveNumber] += 1;
        if(pilesIndex[moveNumber] > piles[moveNumber].length - 1) {
            moveNumber += 1;
        }
    }
    calculate();

}

function mousePressed() {


    for (let piece of grid.pieces) {
        if (piece.contains(mouseX, mouseY, tileSize)) {
            grid.removePiece(piece);
            piece.rotate();
        }
    }
    
}

function calculate() {
    
    currentTile = grid.tiles.find(t => t.isEmpty);
    grid.resetCanBeUsed();    
    pilesIndex[moveNumber] = -1;
    piles[moveNumber] = grid.orientationsThatFitIn(currentTile);
    piles[moveNumber].forEach(o => o.canBeUsed = true);
    if(piles[moveNumber].length > 0) {
        pilesIndex[moveNumber] = 0;
    }
}

function backtrack() {
    let optionAvailble = false;
    while(!optionAvailble && moveNumber >= 0) {
        
        pilesIndex.pop();
        piles.pop();
        moveNumber -= 1;
        if(moveNumber < 0) {
            console.log("no more moves");
            noLoop();
            break;
        }
        const o = piles[moveNumber][pilesIndex[moveNumber]];
        grid.removePiece(o);

        if(pilesIndex[moveNumber] < piles[moveNumber].length - 1) {
            pilesIndex[moveNumber] += 1;
            optionAvailble = true;
        }

    };
}

function draw() {
 
    if(!doneOnce && !beginSolve) {

        calculate();
        doneOnce = true;
    }

    background(220);
    grid.show();
    grid.showMap(10, grid.rows * tileSize + 20, 6);
    grid.highlight(currentTile);
    if(beginSolve) { 
        for(let i = 0 ; i < stepsNumber ; i++) {
            solve();
        }
    }
    //grid.placePiece(Piece.l.orientations[3], 0, 0);
    //grid.placePiece(Piece.z.orientations[3], 2, 0);
    //grid.placePiece(Piece.u.orientations[3], 1, 1);
    
    showCalculation();
    
}

function showCalculation() {
    const x = 10;
    const y = grid.rows * tileSize + 150;
    push();
    
    textSize(7);
    translate(x, y);
    text(`stepCounter: ${stepCounter}        steps: ${stepsNumber}      moveNumber: ${moveNumber}`, 0, 40);
    textAlign(CENTER, CENTER);
    for(let i = 0; i < piles.length; i++) {
        
        stroke((i===moveNumber) ? 0 : 255);
        fill((i===moveNumber) ? "gold" : 255);
        rect(20 * i, 0, 20, 20);
        noStroke();
        fill(0);
        text(pilesIndex[i] + 1, 20 * i + 10, 5 );
        text(piles[i].length, 20 * i + 10, 15 );

    }
    pop();
}

String.prototype.hexToRgb = function() {
 
    const hex = this.replace("#", "");
  const arrBuff = new ArrayBuffer(4);
  const vw = new DataView(arrBuff);
  vw.setUint32(0, parseInt(hex, 16), false);
  var arrByte = new Uint8Array(arrBuff);

  return arrByte[1] + "," + arrByte[2] + "," + arrByte[3];

}