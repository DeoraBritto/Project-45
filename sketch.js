var PLAY = 1;
var END = 0;
var gameState = PLAY;
var bgImg;
var mario, marioImg,mario_collided;
var obstacle,obs1, obs2, obs3, obs4;
var cloud, cloudImage;
var brick,brickImage;
var ground, groundImg, invisibleGround;
var obstaclesGroup,cloudsGroup,bricksGroup;
var gameOver,gameOverImg;
var restart,restartImg;
var score=0;
var jumpSound , checkPointSound, dieSound;

function preload() {
  bgImg = loadImage("bg.png");
  
  marioImg = loadAnimation("mario01.png","mario02.png","mario03.png");
  
  mario_collided = loadAnimation("mario_collided.png");
  
  obs1= loadImage("obstacle1.png");
  obs2= loadImage("obstacle1.png");
  obs3= loadImage("obstacle1.png");
  obs4= loadImage("obstacle1.png");
  
  cloudImage = loadImage("cloud.png");
  brickImage = loadImage("brick.png");
  groundImg = loadImage("ground2.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  background = createSprite(0,0,600,600);
  background.addImage(bgImg);
  background.scale = 2.5;
  
  mario = createSprite(50,280,50,50);
  mario.addAnimation("running",marioImg);
  mario.addAnimation("collided", mario_collided);
  mario.scale=1.5;
  
  ground = createSprite(600,371,600,20);
  ground.addImage(groundImg);
  ground.velocityX=-3;
  
  invisibleGround = createSprite(100,335,600,20);
  invisibleGround.visible=false;
  
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1;
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  bricksGroup = createGroup();
  
  mario.setCollider("circle",0,0,10);
  mario.debug=true;
}

function draw() {
  background.velocityX=-3;
  
  if(gameState===PLAY){
    gameOver.visible = false;
    restart.visible = false;
           
    //jump when the space key is pressed
    if(keyDown("space")&& mario.y >= 100) {
        mario.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    mario.velocityY = mario.velocityY + 0.8;
       
    spawnObstacles();
    spawnClouds();
    spawnBricks();
    
    if(bricksGroup.isTouching(mario)) {
       bricksGroup.destroyEach();
       }
    
    if(obstaclesGroup.isTouching(mario)){
        gameState = END;
        dieSound.play();
      
    }
  }
  
  else if(gameState===END) {
    gameOver.visible = true;
    restart.visible = true;
    
    background.velocityX = 0;
    mario.velocityX = 0;
    mario.velocityY=0;
    ground.velocityX=0;
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     bricksGroup.setVelocityXEach(0);
    
    mario.changeAnimation("collided",mario_collided);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  if (background.x < 0){
      background.x = background.width/2;
    }
  
  if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
  mario.collide(invisibleGround);
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(600,310,10,40);
   obstacle.velocityX = -6;
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obs1);
              break;
      case 2: obstacle.addImage(obs2);
              break;
      case 3: obstacle.addImage(obs3);
              break;
      case 4: obstacle.addImage(obs4);
              break;
      default: break;
    }
   
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,20,40,10);
    cloud.y = Math.round(random(20,100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = mario.depth;
    mario.depth = mario.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnBricks() {
  if (frameCount % 60 === 0) {
    var brick = createSprite(width+20,100,40,10);
    brick.y = Math.round(random(100,220));
    brick.addImage(brickImage);
    brick.scale = 1;
    brick.velocityX = -3;
    
     //assign lifetime to the variable
    brick.lifetime = 300;
    
    //adjust the depth
    brick.depth = mario.depth;
    mario.depth = mario.depth+1;
    
    //add each cloud to the group
    bricksGroup.add(brick);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  bricksGroup.destroyEach();
  
  mario.changeAnimation("running",marioImg);
 }
