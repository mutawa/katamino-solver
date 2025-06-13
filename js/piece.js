class Piece {
    static u = new Piece(["111","101",], "#F1C001", "U", 4, false);
    static t = new Piece(["111","010","010",], "#2C752F", "T", 4, false);
    static w = new Piece(["001","011","110",], "#618D20", "W", 4, false);
    static l = new Piece(["11","10","10","10",], "#D75B35", "L", 4, true);
    static z = new Piece(["1110","0011"], "#482A66", "Z", 4, true);
    static p = new Piece(["010","111","010"], "#F12530", "P", 1, false);
    static c = new Piece(["111","001","001"], "#039FC9", "C", 4, false);
    static y = new Piece(["010","110","011"], "#5b5b5b", "Y", 4, true);
    static b = new Piece(["011","111"], "#ce3665", "B", 4, true);
    static n = new Piece(["110","010","011"], "#00adc2", "N", 2, true);
    static e = new Piece(["0100","1111"], "#633a36", "E", 4, true);
    static k = new Piece(["11111"], "#0f3681", "K", 4, false);
    static all = [Piece.u, Piece.t 
        , Piece.w, Piece.l, Piece.z,Piece.p, Piece.c, Piece.y, Piece.b, Piece.n, Piece.e, Piece.k 
        ];

    constructor(arr, fillColor, name, rotationCount, isFlipable) {
        this.name = name;
        this.fillColor = fillColor || "gold";
        this.width = arr[0].length;
        this.height = arr.length;
        this.rotationCount = rotationCount; // Number of rotations the piece can have
        this.isFlipable = isFlipable; // Whether the piece can be flipped
        this.shape = [];
        this.order = 0;
        for (let i = 0; i < this.height; i++) {
            this.shape[i] = [];
            for (let j = 0; j < this.width; j++) {
                this.shape[i][j] = arr[i][j] === '1' ? 1 : 0;
            }
        }
        this.calcuateTopLeft();
    }

    contains(x, y, gridSize) {
        const gridX = Math.floor(x / gridSize);
        const gridY = Math.floor(y / gridSize);
        return (
            gridX >= this.col &&
            gridX < this.col + this.width &&
            gridY >= this.row &&
            gridY < this.row + this.height &&
            this.shape[gridY - this.row][gridX - this.col] === 1
        );
    }

    flip() {
        // flip the piece horizontally
        if (!this.isFlipable) {
            console.warn(`Piece ${this.name} cannot be flipped.`);
            return;
        }
        for (let i = 0; i < this.height; i++) {
            this.shape[i].reverse();
        }
        this.calcuateTopLeft();
        // Update width and height if necessary
        // In this case, flipping does not change the dimensions
        // so we do not need to modify width and height.

    }

    canFillGap(gapTiles) {


        let minCol = Infinity, maxCol = -Infinity;
        let minRow = Infinity, maxRow = -Infinity;
        for (let tile of gapTiles) {
            if (tile.col < minCol) minCol = tile.col;
            if (tile.col > maxCol) maxCol = tile.col;
            if (tile.row < minRow) minRow = tile.row;
            if (tile.row > maxRow) maxRow = tile.row;
        }
        const gapWidth = maxCol - minCol + 1;
        const gapHeight = maxRow - minRow + 1;

        let answer;

checkFlips:
        for(let f = 0; f < 1 + (this.isFlipable ? 1 : 0); f++) {
checkRotations:
            for(let r = 0; r < this.rotationCount; r++) {
                answer = true;
                
                // Check if the piece can fit in the gap
                if (gapWidth !== this.width || gapHeight !== this.height) {
                    
                    
                    answer = false;

                }
                // Check if the piece can fill the gap
                // Iterate through the gap tiles and check if the piece can fill them
                if(answer) {
                    
                    checkGapTiles:
                    for (let tile of gapTiles) {
                        const pieceX = tile.col - minCol;
                        const pieceY = tile.row - minRow;
                        
                        if (pieceX < 0 || pieceX >= this.width || pieceY < 0 || pieceY >= this.height) {
                            
                            answer = false; // Tile is out of bounds of the piece
                            break checkGapTiles;
                        }
                        if (this.shape[pieceY][pieceX] !== 1) {
                            
                            answer = false; // Piece cannot fill this tile
                            break checkGapTiles;
                        }
                    }
                }

                if(answer) { 
                    
                    answer = true;
                    break checkFlips;
                }
                else {
                    
                    this.rotate(); // Rotate the piece for the next check
                }
                
            }
            if(this.isFlipable) { this.flip(); } // Flip the piece if it is flipable
        }

        return answer; // If no rotation or flip allows the piece to fill the gap, return false


        
        
    }

    rotate() {
        // rotate the piece 90 degrees clockwise
        // function should not return a new piece, but modify the existing one
        const newShape = [];
        for (let j = 0; j < this.width; j++) {
            newShape[j] = [];
            for (let i = this.height - 1; i >= 0; i--) {
                newShape[j][this.height - 1 - i] = this.shape[i][j];
            }
        }
    
        this.shape = newShape;
        this.width = newShape[0].length;
        this.height = newShape.length;
        
        this.calcuateTopLeft();
        
    }

    calcuateTopLeft() {
        // Calculate the top-left corner of the piece based on its shape
        this.topLeftX = 0;
        this.topLeftY = 0;

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.shape[i][j] === 1) {
                    this.topLeftX = j;
                    this.topLeftY = i;
                    return;
                }
            }
        }
    }

    show(x, y, gridSize = 40) {
        push();
        stroke(200, 40);
        translate(x, y);
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.shape[i][j] === 1) {
                    fill(this.fillColor);
                    rect(j * gridSize, i * gridSize, gridSize, gridSize);
                }
            }
        }
        pop();
    }
}