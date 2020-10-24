var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey, monkey_running
var banana, bananaImage, obstacle, obstacleImage
var foodGroup, obstacleGroup
var score
var ground
var bananaGroup
var forestImage
var forest
var survivalTime
var gameOver
var restart
var restartImage
var monkeyCollided
var gameOverImage

function preload() {


  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png")

  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  forestImage = loadImage("forest.jpg")
  monkeyCollided = loadImage("sprite_0.png")
  gameOverImage = loadImage("game_iver-removebg-preview.png")

  restartImage = loadImage("restart-removebg-preview.png")

}



function setup() {
  createCanvas(600, 600)
  //background
  forest = createSprite(0, 0, 600, 600);
  forest.addImage(forestImage);
  forest.scale = 2.5
  
  //monkey 
  monkey = createSprite(80, 315, 20, 20);
  monkey.addAnimation("running", monkey_running);
  monkey.addAnimation("collided", monkeyCollided);
  monkey.scale = 0.2

//ground
  ground = createSprite(400, 400, 1000, 10);
  ground.visible = false
  ground.x = ground.width / 2;
  
  //groups
  foodGroup = createGroup();
  obstaclesGroup = createGroup();

  
  //endgame
  gameOver = createSprite(300, 240);
  gameOver.addImage(gameOverImage)
  gameOver.scale = 0.3
  restart = createSprite(300, 300);
  restart.addImage(restartImage)
  restart.scale = 0.1

  
  //score and survival time
  score = 0
  survivalTime = 0
}


function draw() {


  if (gameState === PLAY) {

//survival time
    survivalTime = Math.ceil(frameCount / frameRate())
    
    forest.velocityX = -4
    if (forest.x < 0) {
      forest.x = forest.width / 2;
    }
    gameOver.visible = false;
    restart.visible = false;

    spawnFood()
    spawnObstacles()


//jumping monkey
    if (keyDown("space") && monkey.y >= 320) {
      monkey.velocityY = -12;

    }


    monkey.velocityY = monkey.velocityY + 0.8

    if (foodGroup.isTouching(monkey)) {
      foodGroup.destroyEach()

      score = score + 2
    }

    if (obstaclesGroup.isTouching(monkey)) {
      gameState = END;
      frameCount = frameCount
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    forest.velocityX = 0

    //collided monkey
    monkey.changeAnimation("collided", monkeyCollided);

    if (mousePressedOver(restart)) {
      reset();

    }

    obstaclesGroup.setLifetimeEach(-1);
    foodGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    foodGroup.setVelocityXEach(0);
  }


 monkey.collide(ground)



  drawSprites()

  textSize(20)
  fill("white")
  textFont("Comic Sans MS")
  text("Score: " + score, 430, 50)
  text("Survival Time: " + survivalTime, 60, 50)



}

function spawnFood() {
 
  //creating bananas
  if (frameCount % 80 === 0) {
    banana = createSprite(600, 165, 10, 40);
    banana.addImage(bananaImage)
    banana.scale = 0.134
    banana.velocityX = -5
    banana.y = Math.round(random(120, 270));
    banana.lifetime = 200;
    foodGroup.add(banana)

 }
}



function spawnObstacles() {
  
  //creating stones
  if (frameCount % 300 === 0) {
    obstacle = createSprite(600, 370, 10, 40);

    obstacle.addImage(obstacleImage)
    obstacle.velocityX = -6


    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  
  //game reset
  gameState = PLAY;
  gameOver.visible = false
  restart.visible = false
  obstaclesGroup.destroyEach()
  foodGroup.destroyEach()
  monkey.changeAnimation("running", monkey_running);
  score = 0
  survivalTime = 0
  frameCount = 0

}