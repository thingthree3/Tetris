window.addEventListener('load', () => {
    const CANVAS = this.document.getElementById('GameCanvas');
    const CTX = CANVAS.getContext('2d');
    CANVAS.width = Constants.World.width;
    CANVAS.height = Constants.World.height;
    
    class Game{

        //random stuff
        #isGameStoped = false;
        #gameSpeed = 1;//was going to make the game speed up :/
        #score = 0;
        #width = Constants.World.width;
        #height = Constants.World.height;

        //time stuff
        #movShapeseDown_1Timer = 0;
        #moveShapesDown_1Interval = 250;
        #movementInterval = 100;
        #movementTimer = 0;
        #rotateInterval = 150;
        #rotateTimer = 0;

        //array stuff
        #shapes = [];
        #allBlocks = [];
        // constructor stuff
        #IMAGES;
        #UI;
        #input;
        #shapeQueue = Object.values(Shape.shapes);
        
        constructor(){
            //all images used in game
            this.#IMAGES = {
                blocks: document.querySelector("#tetrisBlocks")
            }
            
            //have to set shapes image once it has loaded in the browser.
            Shape.setImage( this.getImage("blocks") );
            this.#UI = new UI(this);
            this.#input = new InputHandler();

            this.addShape();
        }

        addShape(){
            if(this.#shapeQueue.length == 0) {
                this.#shapeQueue = Object.values(Shape.shapes);
            }
            const newShape = new Shape(
                this.#shapeQueue.splice(Math.floor(this.#shapeQueue.length * Math.random()), 1),// random tetris shape
                this.getRandom(Object.keys(Block.blocks)),//random color of block
                //make sure all the blocks spone on the grid horizontaly
                ( Math.floor( Math.random() * ( this.#width / Block.size - 4 ) ) + 2) * Block.size,
                Block.size * 2//make sure all the blocks spone on the grid verticaly
            );
            this.#allBlocks.push( ...newShape.getBlocks() );
            this.#shapes.push( newShape );
        }

        checkAirBornShape(){
            const airBornShape = this.#shapes[ this.#shapes.length - 1 ];
            
            //if shape cant move down then the shape  is already at the bottom and the player
            // needs a new shape to control
            if( airBornShape === undefined){ return; }
            if( airBornShape.canMoveTo( ...Constants.directionToCoordinates.down ) ){ return; }

            Grid[4].forEach((num, index) => {
                if(num === 1){
                    if(towerTraveler(Grid, 4, index) > 0){
                        this.#isGameStoped = true;
                    }
                }
            });
            this.addShape();
        }
        
        checkForFullRows(){
            const rowsToBeCleared = Grid
                .map((row, index) => row.includes(0) ? null : index)
                .filter(item => item !== null);

            //remove all blocks filling the row.
            this.#allBlocks.forEach(block => {
                if(rowsToBeCleared.includes(block.getY() / Block.size)){ block.setMarkedForDeletion(true); }
            });

            //reset all the full rows on the grid to 0's.
            rowsToBeCleared.forEach( unclearRow => {
                Grid[unclearRow] = Array.from(Grid[unclearRow], () => 0);//zero's
                this.#score++;
            })
        }

        clearScreen(context){
            context.save();
            context.fillStyle = "rgb(40,40,40)"
            context.fillRect(0,0, CANVAS.width, CANVAS.height);
            context.restore();
        }

        draw(context){
            //draw stuff.
            this.#drawGriddLines(context);
            this.#shapes.forEach( shape => shape.draw(context) );
            this.#UI.draw(context);
        }

        #drawGriddLines(context){//bad code ik :3 dont care enough to fix <3
            context.fillStyle = "black";
            for (let row = 0; row < Math.floor(this.#width / Block.size) + 1; row++) {
                //just draws 3 lines instead of 1
                for (let line = 0; line < 3; line++) {
                    const linePos = line - 1;
                    context.beginPath();
                    context.moveTo(row * Block.size + linePos, 0);
                    context.lineTo(row * Block.size + linePos, this.#height);
                    context.stroke();
                }
            }
            for (let column = 0; column < Math.floor(this.#height / Block.size) + 1; column++) {
                //just draws 3 lines instead of 1
                for (let line = 0; line < 3; line++) {
                    const linePos = line - 1;
                    context.beginPath();
                    context.moveTo(0, column * Block.size + linePos);
                    context.lineTo(this.#width, column * Block.size + linePos);
                    context.stroke();
                }
            }
        }

        displayGameOverScreen(context){ this.#UI.displayGameOverScreen(context, this.#width, this.#height); }

        getGameIsPaused(){ return this.#input.getGameIsPaused(); }
        
        getImage(imagesName){ return this.#IMAGES[imagesName]; }

        getIsGameStoped(){ return this.#isGameStoped; }

        getRandom(thingy){
            const array = thingy instanceof Array ? thingy : Object.values(thingy);
            return array[ Math.floor( Math.random() * array.length ) ];
        }

        getScore(){ return this.#score; }

        

        #handlePlayerInputs(keysPressed) {
            //the floating shape should be the only shape thats moving
            const airBornShape = this.#shapes[ this.#shapes.length - 1 ];

            if(keysPressed.includes("rotate")){
                keysPressed.splice(keysPressed.indexOf("rotate"), 1);
                if(this.#rotateTimer <= 0){
                    this.#rotateTimer = this.#rotateInterval;
                    airBornShape.rotate();
                }
            }
            //too soon to run: return 
            if(this.#movementTimer > 0){ return; }
                
            //no inputs: return.
            if(keysPressed.length === 0){ return; }
            
            //reset movement timer.
            this.#movementTimer = this.#movementInterval;

            //handle keyBoard inputs
            for (const currentKey of keysPressed) {
                airBornShape.move(Constants.directionToCoordinates[currentKey]);
            }
        }

        async pauseGame(context){
            // pause the game by making it wait for this promise
            return await new Promise((resolve, reject) => {

                const thisInterval = setInterval(() => {

                    //draw pause screen.
                    context.save();
                    context.fillStyle = "rgba(83, 173, 254, 0.4)";
                    context.fillRect(0, 0, this.#width, this.#height);
                    context.restore();
                    
                    //draw everything else already on the screen so it doesn't just turn blue.
                    this.draw(context)

                    //every 10th of a second check if the player has unpaused the game, if so start game.
                    if(!game.getGameIsPaused()){
                        clearInterval(thisInterval);
                        resolve();
                    }
                }, 100);
            });
        }

        update(deltatime){

            //increment deltatime
            this.#movementTimer -= deltatime;
            this.#rotateTimer -= deltatime;
            this.#movShapeseDown_1Timer -= deltatime;

            //move all blocks down if they dont have anything under them
            if(this.#movShapeseDown_1Timer <= 0){
                this.#movShapeseDown_1Timer = this.#moveShapesDown_1Interval;
                this.checkAirBornShape();
                this.#shapes.forEach( shape => shape.update() );
            }

            //make it so every other block moves down when a row is full
            this.checkForFullRows();
            
            //handle inputs
            this.#handlePlayerInputs([...this.#input.getKeys()]);

            //filter out irrelevant shapes that have no blocks.
            this.#shapes = this.#shapes.filter( shape => !shape.getMarkedForDeletion() );

            //if(Grid[4].includes(1)){ this.#isGameStoped = true; }// if theres blocks
        }
    }

    this.game = new Game();
    let lastime = 0;
    async function animate(timestamp){//this is the game loop
        const deltatime = timestamp - lastime;
        lastime = timestamp;
        game.update(deltatime);
        //clear screen for next drawing
        game.clearScreen(CTX);
        game.draw(CTX);
        if(game.getGameIsPaused()) { await game.pauseGame(CTX); }
        if(!game.getIsGameStoped()) { requestAnimationFrame(animate); }
        else { game.displayGameOverScreen(CTX); }
    }
    //start game:
    animate(0);
});
