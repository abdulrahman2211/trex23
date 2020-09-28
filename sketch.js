var cloud,cloudimage,ground,groundimage,obstacle,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6,trex,trexanimation1,trexanimation2,gameover,gameoverimage,restart,restart,restartimage,invisibleGround,ObstaclesGroup,CloudsGroup
var PLAY = 1;
var END = 0;
var gameState = PLAY;
function preload(){
  cloudimage = loadImage("cloud.png");
  groundimage = loadImage("ground2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  trexanimation1 = loadAnimation("trex1.png","trex3.png","trex4.png");
trexanimation2 = loadAnimation("trex_collided.png");
restartimage = loadImage("restart.png");
gameoverimage = loadImage("gameOver.png");
}
function setup() {
  createCanvas(400, 400);
 trex = createSprite(200,380,20,50);
trex.addAnimation("tas",trexanimation1);
trex.addAnimation("abcd",trexanimation2);
//set collision radius for the trex
trex.setCollider("circle",0,0,30);

//scale and position the trex
trex.scale = 0.5;
trex.x = 50;

//create a ground sprite
ground = createSprite(200,380,400,20);
ground.addImage(groundimage);
ground.x = ground.width /2;

//invisible Ground to support Trex
 invisibleGround = createSprite(200,385,400,5);
invisibleGround.visible = false;

//create Obstacle and Cloud Groups
ObstaclesGroup = createGroup();
CloudsGroup = createGroup();

//place gameOver and restart icon on the screen
gameover = createSprite(200,300);
restart = createSprite(200,340);
gameover.addImage(gameoverimage);
gameover.scale = 0.5;
restart.addImage(restartimage);
restart.scale = 0.5;

gameover.visible = false;
restart.visible = false;
}
var count = 0;
function draw() {
  background(220);
  //display score
  text("Score: "+ count, 250, 100);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    count = count+Math.round(World.frameCount/90);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 359){
      trex.velocityY = -12 ;
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
    }
  }
  
  else if(gameState === END) {
    gameover.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("abcd",trexanimation2);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //console.log(trex.y);
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}
function reset(){
  gameState = PLAY;
  gameover.visible = false;
  restart.visible = false;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  count = 0;
  trex.changeAnimation("tas",trexanimation1);
}

function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(400,365,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1 : obstacle.addImage(obstacle1);
    break;
    case 2 : obstacle.addImage(obstacle2);
    break;
    case 3 : obstacle.addImage(obstacle3);
    break;
    case 4 : obstacle.addImage(obstacle4);
    break;
    case 5 : obstacle.addImage(obstacle5);
    break;
    case 6 : obstacle.addImage(obstacle6);
    break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 70;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
    var cloud = createSprite(400,320,40,10);
    cloud.y = Math.round(random(280,320))
    cloud.addImage(cloudimage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}