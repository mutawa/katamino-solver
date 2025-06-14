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
    static k = new Piece(["11111"], "#0f3681", "K", 2, false);
    static all = [Piece.u, Piece.t, Piece.w, Piece.l, Piece.z,Piece.p, Piece.c, Piece.y, Piece.b, Piece.n, Piece.e, Piece.k ];

    constructor(arr, fillColor, name, rotationCount, isFlipable) {
        this.name = name;
        this.fillColor = fillColor;
        
        this.rotationCount = rotationCount; // Number of rotations the piece can have
        this.isFlipable = isFlipable; // Whether the piece can be flipped
        this.order = 0;
        this.orientations = [];
        let shape;


        
        for(let r = 0; r < (isFlipable ? 2 : 1); r++) {
            for(let i = 0; i < rotationCount; i++) {
                
                const id = rotationCount * r + i;
                if(!shape) shape = this.convertArrayToShape(arr);
    
                shape = this.rotate(shape);
                
                const topLeft = this.calcuateTopLeft(shape);
                this.orientations.push({
                    id,
                    name: `${name}${id}`,
                    shape, 
                    topLeft, 
                    width: shape[0].length, 
                    height: shape.length,
                    fillColor
                });
            }
            if(isFlipable) shape = this.flip(shape);
        }
    }

    convertArrayToShape(arr) {
        const shapeWidth = arr[0].length;
        const shapeHeight = arr.length;

        const shape = [];
        for (let i = 0; i < shapeHeight; i++) {
            shape[i] = [];
            for (let j = 0; j < shapeWidth; j++) {
                shape[i][j] = arr[i][j] === '1' ? 1 : 0;
            }
        }
        return shape;
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

    flip(shape) {
        
        // flip the piece horizontally
        if (!this.isFlipable) {
            console.error(`Piece ${this.name} cannot be flipped.`);
            return;
        }
        const shapeHeight = shape.length;
        let newShape = [];
        
        for (let i = 0; i < shapeHeight; i++) {
            newShape[i] = shape[i].reverse();
        }

        return newShape;

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

    rotate(shape) {
        

        const oldWidth = shape[0].length;
        const oldHeight = shape.length;


        // rotate the piece 90 degrees clockwise
        // function should not return a new piece, but modify the existing one
        const newShape = [];
        for (let j = 0; j < oldWidth; j++) {
            newShape[j] = [];
            for (let i = oldHeight - 1; i >= 0; i--) {
                newShape[j][oldHeight - 1 - i] = shape[i][j];
            }
        }

        return newShape;
    }

    calcuateTopLeft(shape) {
        // Calculate the top-left corner of the piece based on its shape
        let col = 0;
        let row = 0;

        main:
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (shape[i][j] === 1) {
                    col = j;
                    row = i;
                    break main;
                }
            }
        }
        return {col, row};
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