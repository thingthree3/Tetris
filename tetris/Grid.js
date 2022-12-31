const Grid = Array.from(
    // add a couple more rows so blocks can spone off screen.
    Array(Constants.World.height / Constants.Block.size + Constants.World.getDrawOffSet()),
    () => Array.from(
        Array(Constants.World.width / Constants.Block.size),
        () => 0
    )
);// all 0's

//checks if a tower (made by stacking shapes) goes from the bottom of the screen to the top  
const towerTraveler = (grid, row, column, memo=[]) => {
    if(memo.includes(row+","+column)){ return 0; }
    if(grid[row]?.[column] !== 1){ return 0; }
    if(row === grid.length - 1) { return 1; }
    memo.push(row+","+column);
    return (
        towerTraveler(grid, row + 1, column, memo) +
        towerTraveler(grid, row, column + 1, memo) +
        towerTraveler(grid, row, column - 1, memo)
    ); 
}

const findFloatingBlocks = (grid, row, column, blockCount, memo=[]) => {
    if(memo.includes(row+","+column)){ return true; }
    if(grid[row]?.[column] !== 1){ return true; }
    memo.push(row+","+column);
    if(memo.length >= blockCount) { return false; }
    return (
        findFloatingBlocks(grid, row + 1, column, blockCount, memo) &&
        findFloatingBlocks(grid, row, column + 1, blockCount, memo) &&
        findFloatingBlocks(grid, row, column - 1, blockCount, memo)
    ); 
}