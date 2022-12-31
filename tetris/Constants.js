const Constants = {

    directionToCoordinates: {
        up: [-1, 0],
        down: [1, 0],
        left: [0, -1],
        right: [0, 1]
    },

    Block: {
        blocks: {
            blue: 0,
            purple: 1,
            red: 2,
            green: 3,
            yellow: 4,
            lightblue: 5,
            orange: 6,
        },
        size: 32
    },

    Shape: {
        //the shape i picked doesn't matter because all of the shapes have same length grid, (and there all squares).
        getLengthOfallShapesGrid: function(){return this.shapes._1by4.length;},
        shapes: {
            _1by4: [
                [0,0,0,0,0],
                [0,0,0,0,0],
                [1,1,1,1,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
            ],
            _2by2: [
                [0,0,0,0,0],
                [0,1,1,0,0],
                [0,1,1,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
            ],
            almostAPlus: [
                [0,0,0,0,0],
                [0,0,1,0,0],
                [0,1,1,0,0],
                [0,0,1,0,0],
                [0,0,0,0,0],
            ],
            backwardsL: [
                [0,0,0,0,0],
                [0,0,1,0,0],
                [0,0,1,0,0],
                [0,1,1,0,0],
                [0,0,0,0,0],
            ],
            backwardsZ: [
                [0,0,0,0,0],
                [0,0,1,1,0],
                [0,1,1,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
            ],
            normalL: [
                [0,0,0,0,0],
                [0,0,1,0,0],
                [0,0,1,0,0],
                [0,0,1,1,0],
                [0,0,0,0,0],
            ],
            normalZ: [
                [0,0,0,0,0],
                [0,1,1,0,0],
                [0,0,1,1,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
            ],
        }
    },

    World:{
        //length of all shapes is also the needed draw offset
        getDrawOffSet: function(){ return Constants.Shape.getLengthOfallShapesGrid(); },
        height: 608,
        width: 576,
    },
}