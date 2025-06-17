class Solver {

    piles = [];
    pilesIndex = [];
    moveNumber = 0;
    currentTile;
    doneOnce = false;
    stepsNumber = 1;
    stepCounter = 0;
    grid;
    resumeStepsNumber = 0;

    constructor({ grid, steps }) {
        this.grid = grid;
        this.stepsNumber = steps;
    }

    solve() {

        if(this.grid.isFull) {
            setTimeout(()=>{
                if(confirm("Solution found. Do you want to continue?")) {
                    this.stepsNumber = this.resumeStepsNumber;
                    this.backtrack();

                }
            }, 1000);
        }

        this.currentTile = this.grid.tiles.find(t => t.isEmpty);
    
    
        if(!this.currentTile) {
            console.log(`Board is full in ${this.stepCounter} steps`);
            this.resumeStepsNumber = this.stepsNumber;
            this.stepsNumber = 0;
            return;
            
        }

        this.stepCounter += 1;
    
    
        if (!this.piles[this.moveNumber]) {
            
            
            if(this.piles[this.moveNumber].length > 0) this.pilesIndex[this.moveNumber] = 0;

            if(this.piles[this.moveNumber].length === 0) {
                console.error(`could not find any orientations for moveNumber ${moveNumber}. going back`);
                return;
            }
        }

        const o = this.piles[this.moveNumber][this.pilesIndex[this.moveNumber]];
        if(!o) {
            this.backtrack();
            this.currentTile = this.grid.tiles.find(t => t.isEmpty);
            return;
        }

        if(!o.inUse) {
            this.grid.placePiece(o, this.currentTile.col, this.currentTile.row);
            this.moveNumber += 1;
            // doneOnce = false;
        } else {
            this.pilesIndex[this.moveNumber] += 1;
            if(this.pilesIndex[moveNumber] > this.piles[this.moveNumber].length - 1) {
                this.moveNumber += 1;
            }
        }
        this.calculate();
    }




    calculate() {
    
        this.currentTile = this.grid.tiles.find(t => t.isEmpty);
        this.grid.resetCanBeUsed();    
        this.pilesIndex[this.moveNumber] = -1;
        this.piles[this.moveNumber] = this.grid.orientationsThatFitIn(this.currentTile);
        this.piles[this.moveNumber].forEach(o => o.canBeUsed = true);
        if(this.piles[this.moveNumber].length > 0) {
            this.pilesIndex[this.moveNumber] = 0;
        }
    }



    backtrack() {
        let optionAvailble = false;
        while(!optionAvailble && this.moveNumber >= 0) {
        
            this.pilesIndex.pop();
            this.piles.pop();
            this.moveNumber -= 1;
            if(this.moveNumber < 0) {
                noLoop();
                break;
            }
            const o = this.piles[this.moveNumber][this.pilesIndex[this.moveNumber]];
            this.grid.removePiece(o);

            if(this.pilesIndex[this.moveNumber] < this.piles[this.moveNumber].length - 1) {
                this.pilesIndex[this.moveNumber] += 1;
                optionAvailble = true;
            }
        }
    }

    incSteps(inc = 10) {
        this.stepsNumber = inc * floor((this.stepsNumber + inc)/inc);
    }
    decSteps(dec = 10) {
        this.stepsNumber = max(1, dec * floor((this.stepsNumber - dec)/dec));
    }

    show() {
        const x = 10;
        const y = grid.rows * tileSize + 150;
        push();
    
        textSize(7);
        translate(x, y);
        text(`stepCounter: ${this.stepCounter}        steps: ${this.stepsNumber}      moveNumber: ${this.moveNumber}`, 0, 40);
        textAlign(CENTER, CENTER);
        for(let i = 0; i < this.piles.length; i++) {
            
            stroke((i === this.moveNumber) ? 0 : 255);
            fill((i === this.moveNumber) ? "gold" : 255);
            rect(20 * i, 0, 20, 20);
            noStroke();
            fill(0);
            text(this.pilesIndex[i] + 1, 20 * i + 10, 5 );
            text(this.piles[i].length, 20 * i + 10, 15 );

        }
        pop();
    }

}
