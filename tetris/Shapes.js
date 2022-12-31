class Block {

    //block stuff:
    static blocks = Constants.Block.blocks;
    static size = Constants.Block.size;

    //preset stuff:
    #blockImageSize = 19;
    #markedForDeletion = false;
    #drawOffSet = Constants.World.getDrawOffSet();

    //constructor stuff:
    #x;
    #y;
    #colorIndex;
    constructor(colorIndex){
        this.#colorIndex = colorIndex;
    }

    draw(context, blocksImage){
        context.drawImage(
            blocksImage,
            this.#colorIndex * (this.#blockImageSize - 1),//this just picks which block color to draw.
            0,
            this.#blockImageSize,
            this.#blockImageSize,
            this.#x,
            // "drawOffSet" makes it appear the blocks are stoping at the bottom of the screen. 
            this.#y - this.#drawOffSet * Block.size,
            Block.size,
            Block.size
        );
    }

    getMarkedForDeletion(){ return this.#markedForDeletion; }
    
    getX(){ return this.#x; }
    
    getY(){ return this.#y; }

    move(moveYCord, moveXCord){
        const 
            futureRowOnGrid = (this.#y + moveYCord * Block.size) / Block.size,
            futureColumnOnGrid = (this.#x + moveXCord * Block.size) / Block.size;

        if(Grid[futureRowOnGrid]?.[futureColumnOnGrid] !== 0){ return; }//if where we're going is not empty and on the grid dont move there.

        this.#y += moveYCord * Block.size;
        this.#x += moveXCord * Block.size; 
    }

    setMarkedForDeletion(value){ this.#markedForDeletion = value; }

    setPosition(x, y){ [this.#x, this.#y] = [x, y]; }
}

class Shape {
    //shape stuff:
    static #image;// image refrence shared by all shapes and blocks.
    static shapes = Constants.Shape.shapes;
    static setImage(image){ this.#image = image; }
    static getImage(){ return this.#image; }

    //pre-set stuff:
    #markedForDeletion = false;
    #moveBlocksFreely = false;
    
    //constructor stuff:
    #shape;
    #x;
    #y;
    #blocks
    constructor(shape, color, x, y){
        this.#shape = JSON.parse(JSON.stringify(shape));//change pointer of nested arrays. ^-^
        this.#x = x;
        this.#y = y;
        this.#blocks = Array.from(
            Array([0].concat(this.#shape).reduce((totalBlocks, row) => 
                // we have to use concat so the first value pasted as "totalBlocks" will be zero and not an array.
                totalBlocks + row.reduce((total, num) => total + num)
            )),
            () => new Block(Block.blocks[color])
            );
        this.#setBlocksPositions();//sets the blocks positions based on the given "shape". xoxox just makes the shape on screen.
    }

    addOrRemoveBlocksOnGrid(add=true){
        const addOrRemove = add ? 1 : 0;//add if "add" else remove.
        this.getBlocksPositionOnGrid().forEach(([row, column]) => { Grid[row][column] = addOrRemove });
    }

    canMoveTo(moveYCord, moveXCord) {
        //get coordinates.
        const currentCoordinates = this.getBlocksPositionOnGrid();
        const unFilteredNewCoordinates = this.getBlocksPositionOnGrid(moveYCord, moveXCord);

        // filter out all duplicates.  this makes sure we're not colliding with ourself
        const newCoordinates = unFilteredNewCoordinates.filter( ([y1, x1]) => 
            currentCoordinates.every( ([y2, x2]) => y1 !== y2 || x1 !== x2 )
        );

        // make sure every space we are moving to is empty and on the board.
        return newCoordinates.every( ([blockY, blockX]) => Grid[blockY]?.[blockX] === 0 );
    }

    checkFloatingBlocks(){
        let row, column = -1;
        for (row = 0; row < this.#shape.length; row++) {//shape is still a 2d array lengths n*n btw ;-;, xoxo square
            column = this.#shape[row].indexOf(1);//find the position of any "1" in the "shape" array
            if(column !== -1){ break; }
        }
        if( findFloatingBlocks(this.#shape, row, column, this.#blocks.length)){ this.#moveBlocksFreely = true; }
    }

    draw(context){
        this.#blocks.forEach( block => block.draw(context, Shape.getImage()) );
    }

    getBlocks(){ return this.#blocks; }

    getBlocksPositionOnGrid(moveYCord=0, moveXCord=0){
        return this.#blocks.map( block => [
            ( block.getY() / Block.size ) + moveYCord,
            ( block.getX() / Block.size ) + moveXCord
            ]);
    }

    getMarkedForDeletion(){ return this.#markedForDeletion; }

    getShape(){ return this.#shape; }

    getX(){ return this.#x; }
    
    getY(){ return this.#y; }

    move([moveYCord, moveXCord]){
        if( !this.canMoveTo(moveYCord, moveXCord) && !this.#moveBlocksFreely ){ return; }

        //remove ourself from grid.
        //this will update our position on the grid
        this.addOrRemoveBlocksOnGrid(false);

        this.#blocks.forEach( block => block.move(moveYCord, moveXCord) );

        this.#y += moveYCord * Block.size;
        this.#x += moveXCord * Block.size;

        this.addOrRemoveBlocksOnGrid(true);//addd ourselves back to grid but with new coordinates
    }

    rotate(clockwards=true){//rotates shape 90 degrees clockwards if clockwards is true, else 90 degrees anticlockwards.
        let left = 0, right = this.#shape.length - 1;
        while(left < right){
            for(let i = 0; i < right - left; i++) { this.#rotateShape(clockwards, left, right, i); }
            // once a full 90 degrees rotation is complete,
            // move inwards so we can the inner squares as well
            left++;
            right--;
        }
        //update the "blocks" positions, so it shows on screen
        this.addOrRemoveBlocksOnGrid(false);//remove our positions so we dont check for collding with outself 
        this.#setBlocksPositions();
        this.addOrRemoveBlocksOnGrid(true);// add positions to new coordinates.
    }

    //note: make this method work for any length of "shape".
    #setBlocksPositions(){//only works odd length squares 
        let blockCount = 0;
        for (let row = 0; row < this.#shape.length; row++) {
            for (let column = 0; column < this.#shape[row].length; column++) {
                if( this.#shape[row][column] !== 1 ){ continue; }

                const
                // this makes the center of the grid (0,0).
                blockXPos = this.#x + (column - Math.floor(this.#shape.length / 2)) * Block.size,
                blockYPos = this.#y + (row - Math.floor(this.#shape.length / 2)) * Block.size;

                if(Grid[blockYPos / Block.size]?.[blockXPos / Block.size] !== 0){
                    //if any of the blocks go off screen or collides with another block, rotate all of the blocks back to there original positions.
                    return this.rotate(false);//still returns undefined :3
                }

                this.#blocks[blockCount].setPosition( blockXPos, blockYPos );
                blockCount++;
                if(blockCount === this.#blocks.length){ return; }//if we did all blocks just return.
            }
        
        }

    }

    #rotateShape(clockwards, left, right, index) {
        const top = left, bottom = right;//ik its a square but its more readable
        if(clockwards){

            //save top left value
            const topLeft = this.#shape[top][left + index];

            //move the bottom left value into the top left positon
            this.#shape[top][left + index] = this.#shape[bottom - index][left];
            
            //move the bottom right value into the bottom left positon
            this.#shape[bottom - index][left] = this.#shape[bottom][right - index];
            
            //move the top right value into the bottom right positon
            this.#shape[bottom][right - index] = this.#shape[top + index][right];
            
            //move the original top left value into the top right position
            this.#shape[top + index][right] = topLeft;

        }else{//anticlockwards
            
            //save top left value
            let topLeft = this.#shape[top][left + index];

            //move the top right value into the top left positon
            this.#shape[top][left + index] = this.#shape[top + index][right];
            
            //move the bottom right value into the top right positon
            this.#shape[top + index][right] = this.#shape[bottom][right - index];
            
            //move the bottom left value into the bottom right positon
            this.#shape[bottom][right - index] = this.#shape[bottom - index][left];
            
            //move the original top left value into the bottom left position
            this.#shape[bottom - index][left] = topLeft;
        }
    }
    update(){
        
        //if every block that makes up the shape is gone this shape no longer exists.
        if(this.#blocks.length === 0){ this.#markedForDeletion = true; }
        
        //try to move down
        this.move(Constants.directionToCoordinates["down"]);

        // filter out irrelevant blocks
        this.#blocks = this.#blocks.filter( block => {
            if(block.getMarkedForDeletion()){
                if(!this.#moveBlocksFreely){
                    //remove irrelevant blocks from the shape we are 
                    const
                        blocksShapeGridY = ( block.getY() - this.#y ) / Block.size + Math.floor(this.#shape.length / 2),
                        blocksShapeGridX = ( block.getX() - this.#x ) / Block.size + Math.floor(this.#shape.length / 2);
        
                    this.#shape[blocksShapeGridY][blocksShapeGridX] = 0;
                }
                //remove the block from the grid as well.
                Grid[ block.getY() / Block.size ][ block.getX() / Block.size ] = 0;
                return false;
            }
            return true;
        });
        this.checkFloatingBlocks();
    }
}

