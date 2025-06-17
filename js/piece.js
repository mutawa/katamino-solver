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
    static n = new Piece(["110","010","011"], "#6BD9E5", "N", 2, true);
    static e = new Piece(["0100","1111"], "#633a36", "E", 4, true);
    static k = new Piece(["11111"], "#0f3681", "K", 2, false);
    static all = [
        Piece.u, 
        Piece.t, 
        Piece.w, 
        Piece.l, 
        Piece.z,
        Piece.p, 
        Piece.c, 
        Piece.y, 
        Piece.b, 
        Piece.n, 
        Piece.e, 
        Piece.k 
    ];

    static setupSelectors(x, y, gridSize = 5) {
        Piece.u.setSelectorPosition(x, y, 3, gridSize);
        Piece.t.setSelectorPosition(x + 40, y, 3, gridSize);
        Piece.w.setSelectorPosition(x + 90, y, 3, gridSize);
        Piece.l.setSelectorPosition(x + 130, y, 7, gridSize);
        Piece.z.setSelectorPosition(x + 160, y, 1, gridSize);
        Piece.p.setSelectorPosition(x + 220, y, 0, gridSize);
        Piece.c.setSelectorPosition(x + 250, y, 1, gridSize);
        Piece.y.setSelectorPosition(x + 290, y, 1, gridSize);
        Piece.b.setSelectorPosition(x + 330, y, 0, gridSize);
        Piece.n.setSelectorPosition(x + 380, y, 0, gridSize);
        Piece.e.setSelectorPosition(x + 400, y, 0, gridSize);
        Piece.k.setSelectorPosition(x + 430, y, 0, gridSize);

    }

    constructor(arr, fillColor, name, rotationCount, isFlipable) {
        this.name = name;
        this.fillColor = fillColor;
        this.selectorVisible = true;
        this.rotationCount = rotationCount; // Number of rotations the piece can have
        this.isFlipable = isFlipable; // Whether the piece can be flipped
        this.order = 0;
        this.orientations = [];
        
        let shape = this.convertArrayToShape(arr);

        
        for(let r = 0; r < (isFlipable ? 2 : 1); r++) {
            
            for(let i = 0; i < rotationCount; i++) {
                
                const id = rotationCount * r + i;
                
                shape = this.#rotate(shape);
                if(r === 1 && i === 0 && isFlipable) {
                    shape = this.#flip(shape);    
                }
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
            
        }
    }

    enableSelector() {
        this.selectorVisible = true;
    }
    disableSelector() {
        this.selectorVisible = false;
    }

    setSelectorPosition(x, y, orientationIndex, gridSize = 5) {
        this.x = x;
        this.y = y;
        this.selectorOrientationIndex = orientationIndex;
        this.selectorGridSize = gridSize;
    }

    showSelector() {
        if (!this.selectorVisible) return;
        push();
        translate(this.x, this.y);
        const orientation = this.orientations[this.selectorOrientationIndex];
        stroke(200, 40);
        for (let i = 0; i < orientation.height; i++) {
            for (let j = 0; j < orientation.width; j++) {
                if (orientation.shape[i][j] === 1) {
                    fill(`rgba(${orientation.fillColor.hexToRgb()}, 1)`);
                    rect((j-orientation.topLeft.col - 0.5) * this.selectorGridSize, (i - .5 )* this.selectorGridSize, this.selectorGridSize, this.selectorGridSize);
                }
            }
        }
        pop();
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
        // Check if the point (x, y) is within the bounds of the piece's selector
        const orientation = this.orientations[this.selectorOrientationIndex];
        const topLeft = orientation.topLeft;
        const width = orientation.width;
        const height = orientation.height;

        return x >= this.x  &&
               x <= this.x + (width) * gridSize &&
               y >= this.y  &&
               y <= this.y + (height) * gridSize;
    }

    #flip(shape) {
        
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

        const alredyUsed = this.orientations.find(o => o.inUse);
        if(alredyUsed) return false;


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

        
        for(let o of this.orientations) {
            let answer = true;
            if (gapWidth === o.width && gapHeight === o.height) {
                for (let tile of gapTiles) {
                    const pieceX = tile.col - minCol;
                    const pieceY = tile.row - minRow;
                    
                    if (pieceX < 0 || pieceX >= o.width || pieceY < 0 || pieceY >= o.height) {
                        answer = false; // Tile is out of bounds of the piece
                        continue;
                    }
                    if (o.shape[pieceY][pieceX] !== 1) {
                        
                        answer = false; // Piece cannot fill this tile
                        continue;
                    }
                }
                if(answer) { 
                    // console.log(`piece ${o.name} can be used to fill gap (${gapTiles[0].col}, ${gapTiles[0].row})`);
                    return true;
                }
            }
        }
        return false;
    }

    #rotate(oldShape) {
        // rotate the piece 90 degrees clockwise
        const oldWidth = oldShape[0].length;
        const oldHeight = oldShape.length;
        
        const newShape = [];
        for (let j = 0; j < oldWidth; j++) {
            newShape[j] = [];
            for (let i = oldHeight - 1; i >= 0; i--) {
                newShape[j][oldHeight - 1 - i] = oldShape[i][j];
            }
        }

        return newShape;
    }

    calcuateTopLeft(shape) {
        // Calculate the top-left corner of the piece based on its shape
        let col = 0;
        let row = 0;

        const shapeWidth = shape[0].length;
        const shapeHeight = shape.length;
        

        main:
        for (let i = 0; i < shapeHeight; i++) {
            for (let j = 0; j < shapeWidth; j++) {
                if (shape[i][j] === 1) {
                    col = j;
                    row = i;
                    break main;
                }
            }
        }
        return {col, row};
    }

    show(x, y, orientation, gridSize = 40, opacity = 1) {
        push();
        stroke(200, 40);
        translate(x, y);
        
        // if(orientation.inUse) opacity = 1;
        for (let i = 0; i < orientation.height; i++) {
            for (let j = 0; j < orientation.width; j++) {
                const fillColor = `rgba(${orientation.fillColor.hexToRgb()}, ${opacity})`;
                fill(fillColor);
        
                if (orientation.shape[i][j] === 1) {
                    rect((j-orientation.topLeft.col - 0.5) * gridSize, (i - .5 )* gridSize, gridSize, gridSize);
                }
            }
        }
        
        pop();
    }
}