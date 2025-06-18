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

    //document.querySelector("canvas").addEventListener('contextmenu', event => event.preventDefault());

    solver.calculate();
    Piece.setupSelectors(gridPaddingX, gridPaddingY + gridRows * tileSize + 20, tileSize * .25);
}


function draw() {
    background(220);
    grid.show();
    // grid.showMap(10, grid.rows * tileSize + 20, 6);
    // grid.highlight(solver.currentTile);
    if(beginSolving) { 
        for(let i = 0 ; i < solver.stepsNumber ; i++) {
            solver.solve();
        }
    }

    for(let piece of Piece.all) {
        piece.showSelector();
    }
    
    
    selectedPiece && selectedPiece.show(mouseX, mouseY, selectedPiece.orientations[selectedOrientationIndex], tileSize, 0.5);
    const selectorPiece = Piece.all.find(p => p.contains(mouseX, mouseY, tileSize * 0.25));
    if(selectorPiece && selectorPiece.selectorVisible) {
        selectorPiece.highlite();
    }
}
let selectedOrientationIndex = 0;
let selectedPiece = null;
function mouseWheel(e) {
    if(e.deltaY < 0) {
        selectedOrientationIndex -= 1;
        if(selectedOrientationIndex < 0) selectedOrientationIndex = selectedPiece.orientations.length - 1;
    }
    else if(e.deltaY > 0)
    {
        selectedOrientationIndex += 1;
        if(selectedOrientationIndex >= selectedPiece.orientations.length) selectedOrientationIndex = 0;
    }
    
}

function mouseClicked() {
    
    
    if(mouseY > gridPaddingY + grid.height && selectedPiece) {
        console.log("Deselecting piece");
        selectedPiece.enableSelector();
        selectedPiece = null;
        return;
    
    }
    const selectorPiece = Piece.all.find(p => p.contains(mouseX, mouseY, tileSize * 0.25));
    if(selectorPiece && selectorPiece.selectorVisible) {
        
        selectedPiece = selectorPiece;
        selectedPiece.disableSelector();
        selectedOrientationIndex = selectorPiece.selectorOrientationIndex;
        
        //console.log(selectedPiece.orientations[selectedOrientationIndex].name);
        
        return;
    }
    const tile = grid.tiles.find(t => t.contain(mouseX, mouseY));
    if(!tile) return;
    if(tile.isEmpty && selectedPiece) {
        grid.placePiece(selectedPiece.orientations[selectedOrientationIndex], tile.col, tile.row, true);
        selectedPiece = null;
    } else if(!tile.isEmpty && !selectedPiece) {
        
        const p = (Piece.all.find(p => p.orientations.find(o => o.name === tile.name)));
        const o = p.orientations.find(o => o.name === tile.name);
        grid.removePiece(o);
        
        selectedOrientationIndex = o.id;
        selectedPiece = p;
    }
}



