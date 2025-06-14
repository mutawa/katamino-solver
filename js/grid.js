class Grid {
    constructor(cols, rows, cellSize) {
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.isFull = false;
        
        this.tiles = [];
        this.pieces = [];
        
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i < this.cols; i++) {
                const tile = new Tile(i, j, this.cellSize, rows, cols);
                
                this.tiles.push(tile);
            }
        }

    }

   

    removePiece(orientation) {
        
        for (let i = 0; i < orientation.height; i++) {
            for (let j = 0; j < orientation.width; j++) {
                const tileIndex = (orientation.col + j - orientation.topLeft.col) + (orientation.row + i - orientation.topLeft.row) * this.cols; // Calculate the index in the 1D tiles array
                const tile = this.tiles[tileIndex];
                if(tile.isGap) {
                    tile.isGap = false; // Reset gap status
                }
                if (orientation.shape[i][j] === 0) continue; // Skip empty squares in the piece shape
                
                //console.log(`Removing piece ${piece.name} from (${piece.col + j}, ${piece.row + i})`);
                this.tiles[tileIndex].color = ""; // Reset the color of the tile
                this.tiles[tileIndex].name = ""; // Reset the name of the tile
                this.tiles[tileIndex].isEmpty = true; // Mark the tile as empty
                
            }
        }

        orientation.inUse = false; // Mark the piece as not in use
        this.pieces = this.pieces.filter(p => p.name !== orientation.name);
        this.traverse(); // Check for gaps after removing the piece
    }

    placePiece(o, col, row) {
        
        
        if (row + o.height - o.topLeft.row > this.rows || col + o.width - o.topLeft.col > this.cols) {
            console.warn(`Piece ${o.name} is too large to fit in (${col},${row}) the grid.`);
            return false; // Piece is too large for the grid
        }

        if (col - o.topLeft.col < 0 || col + o.width - o.topLeft.col > this.cols ||
            row - o.topLeft.row < 0 || row + o.height - o.topLeft.row > this.rows) {
            console.warn(`Piece ${o.name} cannot be placed at (${col}, ${row}) due to out of bounds.`);
            return false; // Piece is out of bounds
        }

        // check if the piece collides with any existing piece
        for (let i = 0; i < o.height; i++) {
            for (let j = 0; j < o.width; j++) {
                if (o.shape[i][j] === 0) continue; // Skip empty squares in the piece shape
                const tileIndex = (col + j - o.topLeft.col) + (row + i - o.topLeft.row) * this.cols; // Calculate the index in the 1D tiles array
                if (!this.tiles[tileIndex].isEmpty) {
                    console.warn(`Piece ${o.name} cannot be placed at (${col}, ${row}) due to collision with existing piece.`);
                    return false; // Collision detected
                }
            }
        }

        


        this.occupy(o, col, row);
        o.col = col; // Set the column of the piece
        o.row = row; // Set the row of the piece
        
        

        let succefullyPlaced = true;
        
        if(this.traverse()) {
            console.warn("Gaps found after placing piece:", o.name);
            // remove the piece if it creates gaps
                setTimeout(() => {
                    // console.warn(`Removing piece ${piece.name} due to gaps.`);
                    // this.removePiece(piece);
                }
                , 100); // Delay to allow visual feedback
                this.removePiece(o);
                succefullyPlaced = false; // Mark as unsuccessfully placed
        }
            
        this.isFull = this.checkIfAllSquaresFilled();
        o.inUse = succefullyPlaced;
        return succefullyPlaced;
        
    }

    traverse() {
        // clear visit flags
        for(let tile of this.tiles) {
            if(tile.isEmpty) {
                tile.isVisited = false; // Reset visited status
                tile.name = ""; // Reset name
                tile.isGap = false; // Reset gap status
            }
            
        }
        const gaps = [];
        let gapCount = 0;
        while(!this.isFull && gaps.length === 0) {
            const unfilledTile = this.tiles.find(tile => tile.isEmpty && !tile.isVisited);
            if(!unfilledTile) {
                break;
            }
            this.visit(unfilledTile, gapCount); // Traverse from the unfilled tile to mark all reachable empty tiles
            gapCount++;
        }
        let hasGaps = false;
        for(let i = 0; i < gapCount; i++) {
            const gapTiles = this.tiles.filter(tile => tile.name === `g-${i}`);
            if(gapTiles.length < 5) {
                console.warn(`Found a gap of ${gapTiles.length} tiles: ${gapTiles.map(t => `(${t.col}, ${t.row})`).join(", ")}`);
                hasGaps = true; // If any gap has less than 5 tiles, we consider it a gap
                for(let tile of gapTiles) {
                    tile.isGap = true; // Mark as a gap
                }
            } else if (gapTiles.length === 5) {
                console.warn(`Found a gap of 5 tiles: ${gapTiles.map(t => `(${t.col}, ${t.row})`).join(", ")}`);
                // check existing unplaced pieces to see if they can fill this gap
                const piece = Piece.all.find(p => !p.inUse && p.canFillGap(gapTiles));
                if (!piece) {
                    hasGaps = true; // If no piece can fill the gap, we consider it a gap
                    for(let tile of gapTiles) {
                        tile.isGap = true; // Mark as a gap
                    }
                } else {
                    console.log(piece.name);
                }
            }

        
        }
        return hasGaps;
            
        
    }

    visit(tile, gapCount) {
        
     
        if(tile.isVisited || !tile.isEmpty) {
            return; // Already visited or not empty
        }
        tile.isVisited = true; // Mark as visited
        tile.name = `g-${gapCount}`; // Assign a name based on the gap count
        const tileIndex = (tile.col) + (this.cols * tile.row); // Calculate the index in the 1D tiles array
        const northIndex = tileIndex - this.cols;
        const southIndex = tileIndex + this.cols;
        const eastIndex = tileIndex + 1;
        const westIndex = tileIndex - 1;

        if(tile.hasSouthNeighbor && !this.tiles[southIndex].isVisited && this.tiles[southIndex].isEmpty) {
             this.visit(this.tiles[southIndex], gapCount); // Move down
         }
        if(tile.hasNorthNeighbor && !this.tiles[northIndex].isVisited && this.tiles[northIndex].isEmpty) {
            this.visit(this.tiles[northIndex], gapCount); // Move up
        }
        if(tile.hasEastNeighbor && !this.tiles[eastIndex].isVisited && this.tiles[eastIndex].isEmpty) {
            this.visit(this.tiles[eastIndex], gapCount); // Move right
        }
        if(tile.hasWestNeighbor && !this.tiles[westIndex].isVisited && this.tiles[westIndex].isEmpty) {
            this.visit(this.tiles[westIndex], gapCount); // Move left
        }
        
        
    }


    occupy(orientation, col, row) {
        if(orientation.topLeft.col !== 0 || orientation.topLeft.row !== 0) {
            col -= orientation.topLeft.col; // Adjust column based on the piece's top-left corner
            row -= orientation.topLeft.row; // Adjust row based on the piece's top-left corner
        }
        for (let i = 0; i < orientation.height; i++) {
            for (let j = 0; j < orientation.width; j++) {
                if (orientation.shape[i][j] === 0) continue; // Skip empty squares in the piece shape
                const tileIndex = (col + j) + (row + i) * this.cols; // Calculate the index in the 1D tiles array

                this.tiles[tileIndex].color = orientation.fillColor; // Set the color of the tile
                this.tiles[tileIndex].name = orientation.name; // Set the name of the tile
                this.tiles[tileIndex].isEmpty = false; // Mark the tile as not empty

            }
        }
        
    }

    getAdjacentEmptySquares(col, row) {
        let cells = [{col, row}]; // Start with the current square
        // find all cells that are adjacent and empty,
        // but also keep finding adjacent empty cells until the boundary is reached
        // or another filled cell is found
        const directions = [
            {col: 1, row: 0}, // right
            {col: -1, row: 0}, // left
            {col: 0, row: 1}, // down
            {col: 0, row: -1} // up
        ];
        let index = 0;
        while (index < cells.length) {
            const {col: currentCol, row: currentRow} = cells[index];
            for (let dir of directions) {
                const newCol = currentCol + dir.col;
                const newRow = currentRow + dir.row;
                if (newCol >= 0 && newCol < this.cols && newRow >= 0 && newRow < this.rows) {
                    if (this.tiles[newCol][newRow] === 0 && !cells.some(cell => cell.col === newCol && cell.row === newRow)) {
                        cells.push({col: newCol, row: newRow});
                    }
                }
            }
            index++;
        }
        return cells;
    }

    show() {
        
        for(let tile of this.tiles) {
            tile.show();
        }

        // for (let piece of this.pieces.sort((a, b) => a.order - b.order)) {
        //     piece.show(piece.col * tileSize, piece.row * tileSize, tileSize);
        // }
    }

    checkIfAllSquaresFilled() {
        for(let tile of this.tiles) {
            if (tile.isEmpty) {
                return false; // Found an empty square
            }
        }

        return true; // All squares are filled
    }

    showMap(x, y) {
        push();
        noStroke();
        translate(x, y);
        scale(0.25); // Scale down the grid for better visibility

        for(let tile of this.tiles) {
            tile.show(true);
        }

        
        pop();

        // // show legend of unused pieces
        push();
        translate(x + 130, y );
        scale(0.50); // Scale down the legend for better visibility
        fill(0);
        textSize(12);
        textAlign(LEFT, TOP);
        text(this.isFull ? "FULL" : "Unused:", 0, 0);
        let offsetX = 15;
        for (let piece of Piece.all.filter(p => !p.inUse)) {
            push();
            translate(offsetX, 15);
            scale(0.25);
            piece.show(0, 0, tileSize);
            pop();
            text(piece.name, offsetX + 10, 60);
            
            
            
            offsetX += piece.width  + 45; // Adjust offset for next piece
        }
         pop();

    }
}