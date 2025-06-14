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
    createCanvas(tileSize * gridCols, tileSize * gridRows + 100);
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
    
    document.querySelector("#btn-solve").addEventListener("click", () => beginSolve = !beginSolve);
    document.querySelector("#btn-test").addEventListener("click", trySolve);
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

function trySolve() {
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

    const orientations = [];

    for(let piece of availableTiles) {
        orientations.push(piece.orientations);
    }

    if(orientations.length === 0) {
        console.warn(`no more available orientations for tile (${tile.col}, ${tile.row})`);
        return false;
    }
    all:
    for(let piece of orientations) {
        piece:
        for(let orientation of piece) {

            const success = grid.placePiece(orientation, tile.col, tile.row);

            if(success) {
                debugger;
                if(trySolve()) {
                    return true;
                }
                else {
                    grid.removePiece(orientation);
                }
            }
        }
    }
    console.log('all possible orientations tried. no solution found');
    return false;
}


let currentEmptyTile;
let currentPieceRotationIndex;
let currentPieceFlipIndex;
let currentPiece;
let sequence = [];

function solve() {
    if (grid.isFull) { console.log("grid is full. No action needed."); return; }

    if(!currentEmptyTile) {
        currentEmptyTile = grid.tiles.find(t => t.isEmpty);
        
    }
    if (!currentEmptyTile) { console.log('could not get an empty tile, even though grid is not full'); return; }
    if (!currentPiece) {
        currentPiece = Piece.all.find(p => !p.inUse && !p.skip);
        if(!currentPiece) {
            
            
            console.log('cant get an unused piece even though the grid is not full');
            for(let i = sequence.length - 1; i>=0 ; i--) {
                grid.removePiece(sequence[i].piece);
                sequence.pop();
k
            }
            currentEmptyTile = null;
            return;
        }
        currentPieceRotationIndex = 0;
        currentPieceFlipIndex = 0;

        sequence.push({
            piece: currentPiece,
            tile: currentEmptyTile,
            rotation: currentPieceRotationIndex,
            flip: currentPieceFlipIndex,
            consumed: false
        });
    }

    

   const result = grid.placePiece(currentPiece, currentEmptyTile.col, currentEmptyTile.row);
   if (!result) {
    console.log('failed to place');
    if(currentPieceRotationIndex < currentPiece.rotationCount) {
        console.log('will rotate');
        currentPiece.rotate();
        currentPieceRotationIndex += 1;
        
    } else if(currentPieceFlipIndex < (currentPiece.isFlipable ? 1 : 0)) {
        console.log('will flip');
        currentPiece.flip();
        currentPieceRotationIndex = 0;
        currentPieceFlipIndex += 1;
    } else {
        console.log('will skip');
        
        currentPiece.skip = true;
        currentPiece = null;
        sequence.pop();
    }
   }
   else {
    console.log('Piece placed...');
    for(let piece of Piece.all.filter(p => p.skip)) { piece.skip = false; }
    currentPiece = null;
    currentEmptyTile = null;
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

function draw() {
    background(220);
    grid.show();
    grid.showMap(20, height - 70, 6);
    if(beginSolve) solve();
    
}

