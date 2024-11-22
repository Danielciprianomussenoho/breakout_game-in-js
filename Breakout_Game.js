const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20;
let xDirection = -2;
let yDirection = 2;
let timerId;
let score = 0;

const userStart = [230,10];
let currentPosition = userStart;

const ballStart = [270,40]
let ballCurrentPosition = ballStart;

//create a block 
class block {
  constructor(xAxis, yAxis){
    this.bottomLeft = [xAxis , yAxis];
    this.bottomRight = [xAxis + blockWidth , yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth , yAxis + blockHeight];
  }  
}
//all my bloks
const blocks = [
  //first line
  new block(10, 270),
  new block(120, 270),
  new block(230, 270),
  new block(340, 270),
  new block(450, 270),
  //second line
  new block(10, 240),
  new block(120, 240),
  new block(230, 240),
  new block(340, 240),
  new block(450, 240),
  //3rtht line
  new block(10, 210),
  new block(120, 210),
  new block(230, 210),
  new block(340, 210),
  new block(450, 210),
  ]

console.log(blocks[0])
//draw all my blocks
function addBlocks () {
  
  for(let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div');
    block.classList.add('block');
    block.style.left = blocks[i].bottomLeft[0] + 'px';
    block.style.bottom = blocks[i].bottomLeft[1] + 'px';
    grid.appendChild(block);
  }
}
addBlocks();

//add user
const user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);

//draw the user
function drawUser() {
  user.style.left = currentPosition[0] + 'px';
  user.style.bottom = currentPosition[1] + 'px';
}

//draw the ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px';
  ball.style.bottom = ballCurrentPosition[1] + 'px';   
}

//move user
function moveUser(e) {
  
  switch(e.key) {

    case 'ArrowLeft':
      if(currentPosition[0]  > 0){
        currentPosition[0] = currentPosition[0] - 10;
        drawUser();
      }
      break;

    case 'ArrowRight':
      if(currentPosition[0]  < boardWidth - blockWidth){
        currentPosition[0] = currentPosition[0] + 10;
        drawUser();
      }
      break;
  }
}
document.addEventListener('keydown',moveUser);

//add ball
const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

//move the ball
function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}
timerId = setInterval(moveBall,30);

//check for collisions
function checkForCollisions() {
  //check for block collisions
  for(let i = 0; i < blocks.length; i++) {
    if(
        (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && 
        ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
        ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] &&
        ballCurrentPosition[1] < blocks[i].topLeft[1])
      ){
        const allBlocks = Array.from(document.querySelectorAll('.block'));
        allBlocks[i].classList.remove('block')
        blocks.splice(i, 1);
        changeDirection();
        score++
        scoreDisplay.innerHTML = score;

        //check for the win
        if(blocks.length === 0) {
          scoreDisplay.innerHTML = 'YOU WIN!';
          clearInterval(timerId);
          document.removeEventListener('keydown', moveUser)

        }
       
      }
  }
  //check for wall collisions
  if(
    ballCurrentPosition[0] >= (boardWidth - ballDiameter) || 
    ballCurrentPosition[1] >= (boardHeight - ballDiameter)||
    ballCurrentPosition[0] <= 0)
    {
    changeDirection();
  }
  //check for user collisions
  if(
    (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
    (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
    ){
      changeDirection();
    }
  //check for game over
  if(ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = 'YOU LOSE!'; 
    document.removeEventListener('keydown', moveUser)
  }
}

//changging directions
function changeDirection() {
  if(xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return
  }
  if(xDirection === 2 && yDirection === -2){
    xDirection = -2;
    return
  }
  if(xDirection === -2 && yDirection === -2){
    yDirection = 2;
    return
  }
  if(xDirection === -2 && yDirection === 2){
    xDirection = 2;
    return
  }
}