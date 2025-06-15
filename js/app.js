const tileSize = 40;
const gridCols = 12;
const gridRows = 5;
let grid;
let beginSolve = false;

let testIndex = 0;
let testPieces = [
    // {piece: Piece.p, col: 2, row: 2}, 
    {piece: Piece.u, col: 1, row: 0}, 
    {piece: Piece.z, col: 1, row: 3}, 
    
    {piece: Piece.l, col: 2, row: 3},
    {piece: Piece.t, col: 9, row: 2}, 
]
    // {piece: Piece.l, col: 6, row: 0},

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
    
    document.querySelector("#btn-solve").addEventListener("click", () => solve());
    document.querySelector("#btn-test").addEventListener("click", () => { beginSolve = !beginSolve; });
    document.querySelector("#btn-traverse").addEventListener("click", traverse);

    //pieces.push(Piece.k);

}

function traverse() {
    console.log("Traversing grid...");
    grid.traverse();
}

function test() {
    if(testIndex >= testPieces.length) {
        console.log("No more test pieces to place.");
        return;
    }
    const tp = testPieces[testIndex];
    grid.placePiece(tp.piece, tp.col, tp.row);
    testIndex++;

}
let level = 0;
function trySolve(orientations = []) {
    
    const tile = grid.tiles.find(t => t.isEmpty);
    if(!tile) {
        console.log("all tiles are filled. Completed");
        return true;
    }

    const availableTiles = Piece.all.filter(p => !p.inUse);

    if(availableTiles.length == 0) {
        console.error('no pieces available, even though some tiles are empty... (error?)');
        return false;
    }

    if(orientations.length === 0) {
        for(let piece of availableTiles) {
            orientations.push(piece.orientations);
        }
    }

    const padding = " ".repeat((12 - orientations.length) * 2); 

    console.log(`${padding}${orientations.length} orientations`);

    level += 1;
    if(level > 100) {
        console.log(`${padding}LEVEL EXCEEDED MAXIMUM`);
        return false;
    }


    if(orientations.length === 0) {
        console.warn(`${padding}no more available orientations for tile (${tile.col}, ${tile.row})`);
        return false;
    }
    all:
    for(let i =0; i< orientations.length; i++) {
    
        const piece = orientations[i];
        piece:
        for(let orientation of piece) {

            const success = grid.placePiece(orientation, tile.col, tile.row);

            if(success) {
                console.log(`${padding}${orientation.name} placed on (${tile.col}, ${tile.row})`);
                if(trySolve(orientations.slice(1))) {
                    return true;
                }
                else {
                    console.log(`${padding}didn't work out. removing ${orientation.name} from (${tile.col}, ${tile.row})`);
                    grid.removePiece(orientation);
                }
            }
        }
    }
    console.log(`${padding}all possible orientations tried. no solution found`);
    return false;
}


const piles = [];
const pilesIndex = [];
let moveNumber = 0;
let currentTile;
let doneOnce = false;

function solve() {
 
    // find an empty tile
    currentTile = grid.tiles.find(t => t.isEmpty);

    // if not empty tile found, then board is full
    if(!currentTile) {
        console.log(`could not find an empty tile. Board is full`);
        return;
    }
    
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
        return;
    }
    if(!o.inUse) {
        grid.placePiece(o, currentTile.col, currentTile.row);
        moveNumber += 1;
        doneOnce = false;
    } else {
        pilesIndex[moveNumber] += 1;
        if(pilesIndex[moveNumber] > piles[moveNumber].length - 1) {
            moveNumber += 1;
        }
    }






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
    while(!optionAvailble && moveNumber > 0) {
        
        pilesIndex.pop();
        moveNumber -= 1;
        const o = piles[moveNumber][pilesIndex[moveNumber]];
        grid.removePiece(o);

        if(pilesIndex[moveNumber] < piles[moveNumber].length - 1) {
            pilesIndex[moveNumber] += 1;
            optionAvailble = true;
        }

    };
}

function draw() {
 
    if(!doneOnce) {

        calculate();
        doneOnce = true;
    }

    background(220);
    grid.show();
    grid.showMap(10, grid.rows * tileSize + 20, 6);
    grid.highlight(currentTile);
    if(beginSolve) solve();
    
}

String.prototype.hexToRgb = function() {
 
    const hex = this.replace("#", "");
  const arrBuff = new ArrayBuffer(4);
  const vw = new DataView(arrBuff);
  vw.setUint32(0, parseInt(hex, 16), false);
  var arrByte = new Uint8Array(arrBuff);

  return arrByte[1] + "," + arrByte[2] + "," + arrByte[3];

}