//to declare all of the variables
var trex, ground, obstacles, clouds, invisibleground, trex_running, groundImage, trex_collided, diesound, jumpsound, checkpointsound;

//initiate Game STATES
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var count = 0;

var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, cloud1, restart, gameOver, gameOverImage, restartImage;

//to load the animations and images before the game starts
function preload() {
  trex_running = loadAnimation('trex1.png', 'trex3.png', 'trex4.png');
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  cloud1 = loadImage("cloud.png");

  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");

  jumpsound = loadSound("jump.mp3");
  checkpointsound = loadSound("checkPoint.mp3");
  diesound = loadSound("die.mp3");
}

//to run all the code that runs one time
function setup() {
  //creates the canvas and can be changed
  createCanvas(600, 200);

  trex = createSprite(100, 175, 10, 10);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.40;

  trex.debug = false;
  trex.setCollider("circle", 0, 0, 30)

  ground = createSprite(300, 180, 600, 20)
  ground.addImage(groundImage);

  //makes the ground infinite
  ground.x = ground.width / 2;

  invisibleground = createSprite(300, 180, 600, 5);
  invisibleground.visible = false;

  cloudsGroup = new Group();

  ObstaclesGroup = new Group();

  //Makes the gameover sprite
  gameOver = createSprite(300, 100, 10, 10);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;

  //Makes the restart sprite
  restart = createSprite(300, 130, 10, 10);
  restart.scale = 0.5;
  restart.addImage(restartImage);
}

//runs everything that runs several times
function draw() {
  //generates the background
  background(255);

  text("Score: " + count, 500, 50);

  if (gameState === PLAY) {
    //makes the ground move left
    ground.velocityX = -7;

    //makes the ground infinite
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }

    //makes the trex jump when UP ARROW is pressed and prevents double-jumps
    if (keyDown(UP_ARROW) && trex.y > 150) {
      trex.velocityY = -14;
      jumpsound.play();
    }

    //to add gravity
    trex.velocityY = trex.velocityY + 0.9;

    spawnClouds();

    spawnObstacles();

    if (count % 200 === 0 && count > 0) {
      checkpointsound.play();
    }

    if (ObstaclesGroup.isTouching(trex)) {
      //trex.velocityY = -14;
      gameState = END;
      diesound.play();
    }
    count = count + Math.round(getFrameRate() / 60);

    gameOver.visible = false;
    restart.visible = false;
  } else if (gameState === END) {
    //to stop the sprites from moving
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //to stop obstacles and clouds from disappearing
    ObstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    //change the animation to collided
    trex.changeAnimation("collided", trex_collided);
    //to make gameOver and restart visible
    gameOver.visible = true;
    restart.visible = true;

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  //makes the trex stay on top of the ground
  trex.collide(invisibleground);

  //draws all sprites
  drawSprites();
}

function reset() {
  gameState = PLAY;
  ObstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  count = 0;
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 10, 10)
    cloud.y = Math.round(random(0, 80));
    cloud.addImage(cloud1);
    cloud.scale = 0.5;
    cloud.velocityX = -5;

    cloud.lifetime = 120

    cloud.depth = trex.depth
    trex.depth = trex.depth + 1

    cloudsGroup.add(cloud);
  }


}

function spawnObstacles() {
  // to create obstacles after 60 frames
  if (frameCount % 60 === 0) {

    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6 + count / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 120;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}