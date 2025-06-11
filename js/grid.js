class Grid {
    constructor(cols, rows, cellSize) {
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.isFull = false;
        
        this.squares = [];
        this.pieces = [];
        
        for (let i = 0; i < this.cols; i++) {
            this.squares[i] = [];
            for (let j = 0; j < this.rows; j++) {
                this.squares[i][j] = 0; // Initialize all squares to 0
            }
        }

    }

    pieceWillGoOutOfBounds(piece, col, row) {
        if (col < 0 || col + piece.width > this.cols || row < 0 || row + piece.height > this.rows) {
            return true; // Piece goes out of bounds
        }
        return false; // Piece fits within bounds
    }

    pieceWillCollideWithExistingPieces(piece, col, row) {
        
        for (let i = 0; i < piece.height; i++) {
            for (let j = 0; j < piece.width; j++) {
                if (piece.shape[i][j] === 1 && this.squares[col + j][row + i] !== 0) {
                    return true; // Collision with existing piece
                }
            }
        }
        return false;

    }

    pieceFits(piece, col, row) {
        const outOfBounds = this.pieceWillGoOutOfBounds(piece, col, row);
        if (outOfBounds) {
            console.log(`Piece ${piece.name} does not fit at (${col}, ${row}) - out of bounds`);
            return false; // Piece goes out of bounds
        }        
        const collides = this.pieceWillCollideWithExistingPieces(piece, col, row);
        if (collides) {
            console.log(`Piece ${piece.name} does not fit at (${col}, ${row}) - collision with existing pieces`);
            return false; 
        }
        
        return true;
    }

    canPlace(piece, col, row) {
        
        const fits = this.pieceFits(piece, col, row);
        if (!fits) { return false; } // Piece does not fit
        const createsGaps = this.pieceFitsButWillLeaveUnfillableGap(piece, col, row);
        if (createsGaps) {
            return false; // Piece does not fit or will create unfillable gaps
        }
        return true;
    }

    pieceFitsButWillLeaveUnfillableGap(piece, col, row) {
        
        this.placePiece(piece, col, row); // Temporarily place the piece to check for gaps
        const remainingPieces = Piece.all.filter(p => !p.inUse && p !== piece); // Get all unused pieces except the one we just placed
        if (remainingPieces.length === 0) {
            console.log(`No remaining pieces to fill gaps after placing ${piece.name} at (${col}, ${row})`);
            this.removePiece(piece); // Remove the piece after checking
            return false; // No remaining pieces to fill gaps
        }
        let willLeaveUnfillableGap = true;
        // Check if placing the piece will leave unfillable gaps

        checkAll:
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.squares[i][j] === 0) {
                    // Check if this square can be filled by any other piece

                    for (let otherPiece of remainingPieces) {
                        if (otherPiece === piece) continue; // Skip the piece we just placed
                        
                        
                        if (this.pieceFits(otherPiece, i, j)) {
                            console.log(`Placing ${otherPiece.name} at (${i}, ${j}) can fill the gap`);
                            willLeaveUnfillableGap = false; // Found a piece that can fill the gap
                            break checkAll; // Found a piece that can fill the gap
                        }
                    
                    }
                    
                }
            }
        }
        this.removePiece(piece); // Remove the piece after checking
        
        return willLeaveUnfillableGap; // Return true if it will leave unfillable gaps
    }

    removePiece(piece) {
        piece.inUse = false; // Mark the piece as not in use
        this.pieces = this.pieces.filter(p => p.name !== piece.name);
        for (let i = 0; i < piece.height; i++) {
            for (let j = 0; j < piece.width; j++) {
                if (piece.shape[i][j] === 1) {
                    this.squares[piece.col + j][piece.row + i] = 0; // Reset the square to 0
                }
            }
        }
    }

    placePiece(piece, col, row) {
        
        for (let i = 0; i < piece.height; i++) {
            for (let j = 0; j < piece.width; j++) {
                if (piece.shape[i][j] === 1) {
                    this.squares[col + j][row + i] = 1;
                }
            }
        }
        piece.col = col;
        piece.row = row;
        piece.inUse = true;
        this.pieces.push(piece);
        this.isFull = this.checkIfAllSquaresFilled();
        
    }

    show() {
        stroke("#ccc");
        for (let i = 0; i <= this.cols; i++) {
            line(i * this.cellSize, 0, i * this.cellSize, 5*this.cellSize);
        }
        for (let j = 0; j <= this.rows; j++) {
            line(0, j * this.cellSize, 12*this.cellSize, j * this.cellSize);
        }

        for (let piece of this.pieces.sort((a, b) => a.order - b.order)) {
            piece.show(piece.col * tileSize, piece.row * tileSize, tileSize);
        }
    }

    checkIfAllSquaresFilled() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.squares[i][j] === 0) {
                    return false; // Found an empty square
                }
            }
        }
        return true; // All squares are filled
    }

    showMap(x, y, tileSize = 10) {
        push();
        noStroke();
        translate(x, y);
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                const squareValue = this.squares[i][j];
                switch (squareValue) {
                    case 1:
                        fill(250, 200, 100);
                        break;
                    case -1:
                        fill(200, 50, 50);
                        break;
                    default:
                        fill(100, 100, 100);
                }
                
                rect(i * tileSize, j * tileSize, tileSize, tileSize);
            }
        }
        pop();

        // show legend of unused pieces
        push();
        translate(x + this.cols * tileSize + 10, y);
        fill(0);
        textSize(12);
        textAlign(LEFT, TOP);
        text("Unused Pieces:", 0, 0);
        let offsetX = 15;
        for (let piece of Piece.all.filter(p => !p.inUse)) {
            piece.show(offsetX, 15, tileSize);
            
            
            fill(0);
            
            offsetX += 20;
        }
        pop();

    }
}