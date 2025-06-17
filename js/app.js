"use strict";
const gridPaddingX = 20;
const gridPaddingY = 20;
const tileSize = 40;
const gridCols = 12;
const gridRows = 5;
let grid;
let beginSolving = false;
let solver;

function setup() {
    const cnv = createCanvas(tileSize * 13, tileSize * gridRows + 260);
    cnv.parent("#canvas");
    grid = new Grid(gridPaddingX, gridPaddingY, gridCols, gridRows, tileSize);
    solver = new Solver({ grid, steps: 1});

    document.querySelector("#btn-one-step").addEventListener("click", () => { for(let i=0; i<solver.stepsNumber; i++) solver.solve(); });
    document.querySelector("#btn-pause").addEventListener("click", () => { beginSolving = !beginSolving; });
    document.querySelector("#btn-inc-steps").addEventListener("click", () => { solver.incSteps(100); });
    document.querySelector("#btn-dec-steps").addEventListener("click", () => { solver.decSteps(100);  });

    
    solver.calculate();
}


function draw() {
    background(220);
    grid.show();
    // grid.showMap(10, grid.rows * tileSize + 20, 6);
    grid.highlight(solver.currentTile);
    if(beginSolving) { 
        for(let i = 0 ; i < solver.stepsNumber ; i++) {
            solver.solve();
        }
    }
    // solver.show();
    
    selectedPiece && selectedPiece.show(mouseX, mouseY, selectedPiece.orientations[ii]);
}
let ii = 0;
let selectedPiece = Piece.e;
function mouseWheel() {
    ii += 1;
    if(ii >= selectedPiece.orientations.length) ii = 0;
}

function mouseClicked() {
    const tile = grid.tiles.find(t => t.contain(mouseX, mouseY));
    if(!tile) return;
    if(tile.isEmpty && selectedPiece) {
        grid.placePiece(selectedPiece.orientations[ii], tile.col, tile.row);
        selectedPiece = null;
    } else if(!tile.isEmpty && !selectedPiece) {
        
        const p = (Piece.all.find(p => p.orientations.find(o => o.name === tile.name)));
        const o = p.orientations.find(o => o.name === tile.name);
        grid.removePiece(o);
        
        ii = o.id;
        selectedPiece = p;
    }
}



