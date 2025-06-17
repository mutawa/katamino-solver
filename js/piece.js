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

    static {
        const originalObject = {property: 'XXX', propertyToWatch: 'YYY'};
        const watchedProp = 'orientations';
        const handler = {
            set(target, key, value) {
                if (key === watchedProp) {
                debugger;
                }
                target[key] = value;
            }
        };
        const wrappedObject = new Proxy(Piece.z, handler);
    }

    constructor(arr, fillColor, name, rotationCount, isFlipable) {
        this.name = name;
        this.fillColor = fillColor;
        
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

    show(x, y, orientation, gridSize = 40) {
        push();
        stroke(200, 40);
        translate(x, y);
        
        // const pileUsed = (this.orientations.find(o => o.inUse)) ? true : false;
        let opacity = 0.5;
        if(orientation.inUse) opacity = 1;
        for (let i = 0; i < orientation.height; i++) {
            for (let j = 0; j < orientation.width; j++) {
                const fillColor = `rgba(${orientation.fillColor.hexToRgb()}, ${opacity})`;
                fill(fillColor);
                // if(pileUsed) opacity = 0.25;
                if (orientation.shape[i][j] === 1) {
                    rect((j-orientation.topLeft.col - 0.5) * gridSize, (i - .5 )* gridSize, gridSize, gridSize);
                    //rect(0, 0, 20, 20);
                }
            }
        }
        // if(orientation.canBeUsed) {
        //     fill(0, 200, 0, 100);
        //     circle(x, y, 50);
        // }
        pop();
    }
}