class UI {
    #game
    fontFamily = "Helvetica";
    constructor(game){
        this.#game = game;
    }

    draw(context){

        //display Score.
        context.font = 40 + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = "yellow";
        context.fillText("Score: " + this.#game.getScore(), 20, 50);
    }

    displayGameOverScreen(context, worldWidth, worldHeight){
        //more bad code ik :3
        let blackScreenThickness = 0;
        let wordThickness = 0;
        let restartWordThickness = 0;
        const blackScreenThicknessAdder = 0.05;
        setInterval(()=>{
            //kristen ITC
            context.fillStyle = 'rgba(0, 0, 0, ' + blackScreenThickness + ')'
            context.fillRect(0, 0, worldWidth, worldHeight);
            if(blackScreenThickness >= 1.5){
                if(wordThickness >= 1.5){
                    if(restartWordThickness >= 1.5 || restartWordThickness < 0) blackScreenThickness = -blackScreenThickness;
                    restartWordThickness += blackScreenThickness
                    context.fillStyle = 'white';
                    context.font = 50 + 'px kristen ITC';
                    context.fillText('Press "R" To Try Again.', worldWidth / 2, worldHeight / 2 + 70);
                }
                else wordThickness += blackScreenThickness;
                context.font = 100 + 'px kristen ITC';
                context.textAlign = 'center';
                context.save();
                context.fillStyle = 'red';
                context.fillText('YOU DIED', worldWidth / 2, worldHeight / 2);
                context.restore();
            }else blackScreenThickness += blackScreenThicknessAdder;
        },50);
    
    }

}