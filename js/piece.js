class Piece {
    static u = new Piece(["111","101",], "#F1C001", "U");
    static t = new Piece(["111","010","010",], "#2C752F", "T");
    static w = new Piece(["001","011","110",], "#618D20", "W");
    static l = new Piece(["11","10","10","10",], "#D75B35", "L");
    static z = new Piece(["1110","0011"], "#482A66", "Z");
    static p = new Piece(["010","111","010"], "#F12530", "P");
    static c = new Piece(["111","001","001"], "#039FC9", "C");
    static y = new Piece(["010","110","011"], "#5b5b5b", "Y");
    static b = new Piece(["011","111"], "#ce3665", "B");
    static n = new Piece(["110","010","011"], "#00adc2", "N");
    static e = new Piece(["0100","1111"], "#633a36", "E");
    static k = new Piece(["11111"], "#0f3681", "K");
    static all = [Piece.u, Piece.t 
        , Piece.w, Piece.l, Piece.z,Piece.p, Piece.c, Piece.y, Piece.b, Piece.n, Piece.e, Piece.k 
        ];

    constructor(arr, fillColor, name) {
        this.name = name;
        this.fillColor = fillColor || "gold";
        this.width = arr[0].length;
        this.height = arr.length;
        this.row;
        this.col;
        this.shape = [];
        this.order = 0;
        for (let i = 0; i < this.height; i++) {
            this.shape[i] = [];
            for (let j = 0; j < this.width; j++) {
                this.shape[i][j] = arr[i][j] === '1' ? 1 : 0;
            }
        }
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