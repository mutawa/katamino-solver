const tileSize = 40;
const gridCols = 12;
const gridRows = 5;
let grid;


function setup() {
    createCanvas(tileSize * gridCols, tileSize * gridRows + 100);
    grid = new Grid(gridCols, gridRows, tileSize);
    
    // grid.placePiece(Piece.k, 7, 4);
    // grid.placePiece(Piece.l, 0, 0);
    // grid.placePiece(Piece.w, 0, 2);
    // grid.placePiece(Piece.u, 1, 1);
    // grid.placePiece(Piece.z, 2, 0);
    // grid.placePiece(Piece.t, 5, 0);
    // grid.placePiece(Piece.p, 7, 0);
    // grid.placePiece(Piece.c, 9, 0);
    // grid.placePiece(Piece.y, 9, 1);
    // grid.placePiece(Piece.b, 2, 3);
    // grid.placePiece(Piece.n, 4, 2);
    // grid.placePiece(Piece.e, 6, 2);
    
    document.querySelector("#btn-solve").addEventListener("click", solve);
    //pieces.push(Piece.k);

}

function solve() {
    console.log("Solving...");
    for(let j = 0; j < gridRows; j++) {
        for(let i = 0; i < gridCols; i++) {
            if(grid.squares[i][j] !== 0) {
                console.log(`Skipping occupied square at (${i}, ${j})`);
                continue; // Skip if the square is already occupied
            }
piecesLoop:
            for(let piece of Piece.all.filter(p => !p.inUse)) {
                console.log(`Trying to place piece ${piece.name} at (${i}, ${j})`);
                for (let k = 0; k < 4; k++) {
                    if(grid.canPlace(piece, i, j)) {
                        grid.placePiece(piece, i, j);
                        console.log(`Placed piece ${piece.name} at (${i}, ${j})`);
                        break piecesLoop; // Break out of the loop if the piece is placed successfully
                    } else {
                        piece.rotate(); // Rotate the piece for the next attempt
                        console.log(`Rotated piece ${piece.name} to try again`);
                    
                    }
                }

                    // } else {
                    //     piece.rotate(); // Rotate the piece for the next attempt
                // }
                
            }
            
        }
    }
    console.log("Finished solving.");
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
    grid.showMap(50, height - 70, 6);
    
}

