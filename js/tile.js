class Tile {
    constructor(col, row, size, gridRows, gridCols) {
        this.col = col;
        this.row = row;
        this.x = col * size;
        this.y = row * size;
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
        //fill( asLegend ? (this.isEmpty ? 255: 0) : this.color);
        rect(this.x, this.y, this.width, this.height);
        noStroke();
        fill(0);
        textAlign(CENTER, CENTER);
        // put tile coordinates in the center of the tile
        
        if (!asLegend) {
            if(this.isEmpty) {
                
                textSize(7);
                textAlign(RIGHT, TOP);
                text(`(${this.col}, ${this.row})`, this.x + this.width -3, this.y + 2);
            }
            if(!this.isGap && !this.isEmpty) {

                text(this.name, this.x + this.width / 2, this.y + this.height / 2);
            }
            const index = this.row * gridCols + this.col;
            fill(0, 100);
            textSize(7);
            textAlign(LEFT, TOP);
            // text(`${index}`, this.x + 2, this.y + 2);

            
            // noStroke();
            // fill(0, 50);
            // textSize(12);
            // if(this.hasNorthNeighbor) {
            //     textAlign(CENTER, TOP);
            //     text("⬆", this.x + this.width / 2, this.y );
            // }
            // if(this.hasSouthNeighbor) {
            
            //     textAlign(CENTER, BOTTOM);
            //     text("⬇", this.x + this.width / 2, this.y + this.height );
            // }
            // if(this.hasEastNeighbor) {
            
            //     textAlign(RIGHT, CENTER);
            //     text("➡", this.x + this.width, this.y + this.height / 2);
            // }
            // if(this.hasWestNeighbor) {
            
            //     textAlign(LEFT, CENTER);
            //     text("⬅", this.x, this.y + this.height / 2);
            // }
            // if(this.isVisited) {
            //     fill(0);
            //     noStroke();
            //     ellipse(this.x + this.width / 2 + 15, this.y + 15, 6);
            // }
            if(this.isGap) {
                // draw red cross in the center of the tile
                stroke("red");
                strokeWeight(2);
                line(this.x + 2, this.y + 2, this.x + this.width - 2, this.y + this.height - 2);
                line(this.x + this.width - 2, this.y + 2, this.x + 2, this.y + this.height - 2);
            }
        }
        
        
        
        pop();
    }
    
    
}