class Tile {
    constructor(x, y, col, row, size, gridRows, gridCols) {
        this.col = col;
        this.row = row;
        this.x = x + col * size;
        this.y = y + row * size;
        this.width = size;
        this.height = size;
        this.isVisited = false;
        this.color = "white";
        this.name = "";
        this.isEmpty = true; // Indicates if the tile is empty
        this.isGap = false;
        this.gridCols = gridCols; // Total number of columns in the grid
        this.gridRows = gridRows; // Total number of rows in the grid

        this.hasNorthNeighbor = row > 0; // Has a neighbor above
        this.hasSouthNeighbor = row < gridRows - 1; // Has a neighbor below
        this.hasEastNeighbor = col < gridCols - 1; // Has a neighbor to the right
        this.hasWestNeighbor = col > 0; // Has a neighbor to the left

    }
    contain(x, y) {
        return x>=this.x && x<=this.x + this.width && y >= this.y && y <= this.y + this.height;
    }
    show(asLegend = false) {
        push();
        if(!asLegend) {
            if(!this.isEmpty) {
                fill(this.color);
            }
            

        }
        else {
            if(this.isGap) {
                fill("red");
            } else if(this.isEmpty) {
                fill(255);
            } else {
                fill(0);
            }
        }
        
        rect(this.x, this.y, this.width, this.height);
        noStroke();
        fill(0);
        textAlign(CENTER, CENTER);
        
        
        if (!asLegend) {
            if(this.isEmpty) {
                
                textSize(7);
                textAlign(RIGHT, TOP);
                // text(`(${this.col}, ${this.row})`, this.x + this.width -3, this.y + 2);
            }
            if(!this.isGap && !this.isEmpty) {

                // text(this.name, this.x + this.width / 2, this.y + this.height / 2);
            }
            
            if(this.isGap) {
                // draw red cross in the center of the tile
                stroke(255, 0, 0, 50);
                strokeWeight(4);
                line(this.x + 2, this.y + 2, this.x + this.width - 2, this.y + this.height - 2);
                line(this.x + this.width - 2, this.y + 2, this.x + 2, this.y + this.height - 2);
            }
        }
        
        
        
        pop();
    }
    
    
}