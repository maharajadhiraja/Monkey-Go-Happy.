var monkey,monkey_run;
var bg,bg_img;
var banana ,banana_img;
var obstacle,obstacle_img;
var orange, orange_img;
//Group variables
var foodGroup,obsGroup,orangeGroup;
//Score & losing system
var survivalTime,score,chances;
var ground,ground_img;
var gameOver,gameOver_img;
var restart,restart_img;
//Game States
var START=1;
var PLAY=2;
var END=0;
var gameState=START;
//sound variables
var longjump_sound;
var jumpSound;
var dieSound;
var checkPointSound;
var gameOverSound;

function preload()
{
  //To add animation for monkey
  monkey_run=loadAnimation("Monkey_01.png","Monkey_02.png","Monkey_03.png","Monkey_04.png","Monkey_05.png","Monkey_06.png","Monkey_07.png","Monkey_08.png","Monkey_09.png","Monkey_10.png");
  
  //To image to the background sprite
  bg_img=loadImage("jungle.jpg");
  
  //To add image to banana, oranges and obstacles
  banana_img=loadImage("banana.png");
  orange_img=loadImage("orange.png");
  obstacle_img=loadImage("obstacle4.png");
  gameOver_img=loadImage("gameover.png");
  restart_img=loadImage("restart.png");
  
  //To load sounds  
  longjump_sound=loadSound("longjump.mp3");
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkPointSound=loadSound("checkPoint.mp3");
  gameOverSound=loadSound("gameOver.mp3");
  
  
}

function setup() {
  createCanvas(500,400);
  
  //To create background sprite
  bg=createSprite(250,200,500,400);
  
  //To create monkey sprite
  monkey=createSprite(60,325,10,10);  
  monkey.addAnimation("run",monkey_run);
  //Scaling to adjust the animation
  monkey.scale=0.1;
  //monkey.debug=true;
  //To make monkey look like it is on the ground not outside it
  monkey.setCollider("rectangle",0,0,550,400);
  
  //To create ground sprite
  ground=createSprite(200,358,1200,8);
  ground.visible=false;
  
  //Initial value of score
  score=0;
 
  //To declare new Groups
  foodGroup=new Group();
  obsGroup=new Group();
  orangeGroup=new Group();
  
  //To create gameOver sprite
  gameOver=createSprite(250,160,10,10)
  gameOver.addImage(gameOver_img);
  gameOver.scale=1.5;
  
  //To create restart 
  restart=createSprite(250,230,10,10);
  restart.addImage(restart_img);
  restart.scale=0.3;
}

function draw() {
  background("white");
  
 if(gameState===START)
 {
   //To make restart & game Over invisible
   gameOver.visible=false;
   restart.visible=false;
    
   //To make monkey,bg & ground invisible during start state
   monkey.visible=false;
   ground.visible=false;
   bg.visible=false;
   
   //Instructions for playing this game/USER GUIDE
   background("green");
   fill("yellow");
   textSize(20);
   text("Read all the instructions carefully before playing:-",20,80);
   fill("yellow");
   textSize(18);
   stroke(1);
   text("1.Press Space Key to Start the Game",20,110);
   fill("white");
   noStroke();
   text("2.Press UP Arrow Key for long jump",20,135);
   text("3.Press Space Key to Jump",20,160);
   text("4.Try to collect max oranges to feed monkey well",20,190);
   text("5.Don't Let Monkey Size So Small otherwise game will end",20,220);
   text("6.Collect bananas to feed and increase the size of monkey",20,250);
   text("7.Hitting obstacles results in decresed size of monkey",20,280);
   text("8.The more you score, the more will be the speed",20,310);
   text("9.Unnecessary Long Jump decreases the monkey size",20,340);
    
   textSize(30);
   text("ALL THE BEST!!",150,385);
   
   //Condition for entering in PLAY state
   if(keyDown("space"))
   {
     gameState=PLAY;
   }
   
  }
  else if(gameState===PLAY)
  {
    //To assign velocity to ground 
    bg.velocityX=-4;
    //To add jungle background only in play state\
    bg.addImage(bg_img);
    
    //To make restart & game Over invisible
    gameOver.visible=false;
    restart.visible=false;
    monkey.visible=true;
    
    //To make bg visible during play state
    bg.visible=true;
    //To make the monkey jump to surmount obstacles
    if(keyDown("space")&&monkey.y>320)
    { 
      //To assign upward velocity to monkey
      monkey.velocityY=-12;
      jumpSound.play();
    }
    
    //To make monkey long jump to collect oranges
    else if(keyDown("UP_ARROW")&&monkey.y>320)
    {
      //To make monkey move up
      monkey.velocityY=-16.5;
      //Monkey get hungry and size become small
      monkey.scale=monkey.scale-0.008;
      //To play long jump sound
      longjump_sound.play();
    } 
    //To add gravity 
    monkey.velocityY=monkey.velocityY+0.5;
    
    monkey.collide(ground);
    
    //To increase the score when monkey touches banana
    if(monkey.isTouching(foodGroup))
    {
      foodGroup.destroyEach();
      score=score+2;
      monkey.scale=monkey.scale+0.0080;
    }
    
    //To add bonus to score when monkey touches oranges
    if(monkey.isTouching(orangeGroup))
    {
      orangeGroup.destroyEach();
      score=score+4;
      monkey.scale=monkey.scale+0.015
    } 
    
    //To decrease monkey size also if it does not get food for long time
    if(frameCount%4000===0)
    {
      monkey.scale=monkey.scale-0.01; 
    }
     
    //To detect and decrease the chanes when monkey touches any         obstacles
    if(monkey.isTouching(obsGroup))
    {
      monkey.scale=monkey.scale-0.01;
      obsGroup.destroyEach();
      dieSound.play();
    }
    
    //To play a beep sound in multiple of 20 i.e.20,40,60,80
    if(score>0&&score%6===0)
    {
      //Adding beep sound 
      //checkPointSound.play();
    }
    
    //Calling other functions in draw functions
    obstacles();
    food();
    bonusFood();
    
    /*switch(score)
    {
      case 10: monkey.scale=0.120;
        break; 
      
      case 20: monkey.scale=0.140;
        break;
        
      case 30: monkey.scale=0.160;
        break;
        
      case 40: monkey.scale=0.180;
        break;
        
      case 60: monkey.scale=0.200;
        break;                  
    }*/
  }
  else if(gameState===END)
  {
    //To make restart & game Over visible
    gameOver.visible=true;
    restart.visible=true;
    monkey.collide(ground);
    
    //Destroying objects and setting up their velocity 0 when the       game ends
    bg.velocityX=0;
    foodGroup.setVelocityEach(0);
    foodGroup.destroyEach();
    orangeGroup.setVelocityEach(0);
    orangeGroup.destroyEach();
    obsGroup.setVelocityEach(0);
    obsGroup.destroyEach();
  }
  
  if(bg.x<0)
  { 
    //To give infinite scrolling effect to ground
    bg.x=width/2; 
  }
  
  //End state condition
  if(monkey.scale===0.001||monkey.scale<0.001)
  {
    gameState=END;
  }
  
  //To restart the game when clicked on restart button
  if(mousePressedOver(restart))
  {
    //Calling restart function
    reset();
  }
  
  //To draw the sprites
  drawSprites();
  
  
  
  //Displaying scoring & losing system
  fill("white");
  //stroke(1);
  textSize(20);
  text("Score Board: "+score,175,35);
}

function obstacles()
{
  if(frameCount%120===0)
  {
    //To create obstacle sprite
    obstacle=createSprite(500,330,10,10);
    //To add image to obstacle sprite
    obstacle.addImage(obstacle_img);
    //Scaling to adjust the size of obstacle image
    obstacle.scale=0.2;
    //To assign velocity to obstacle
    obstacle.velocityX=-(5.5+score/12);
    //To assign lifetime to obstacle 
    obstacle.lifetime=130;
    
    //To add obstacle to obsGroup
    obsGroup.add(obstacle);
  }
}

function food()
{
  //To make banana appear at interval of 150 frames
  if(frameCount%100===0)
  {
    //To create banana sprite
    banana=createSprite(500,Math.round(random(120,300)),10,10);
    //To add image to banana
    banana.addImage(banana_img);
    //To assign velocity to banana
    banana.velocityX=-(4.8+score/10);
    //Scaling to adjust image
    banana.scale=0.08;
    //To assign lifetime to banana
    banana.lifetime=200;
    //Add banana to foodgroup
    foodGroup.add(banana);
  }
}

function bonusFood()
{
  //To make orange appear at interval of 250 frames
  if(frameCount%175===0)
  {
  //To create orange sprite
  orange=createSprite(500,Math.round(random(40,180)),10,10);
  //To add image to orange 
  orange.addImage(orange_img);
  //Scaling to adjust the image
  orange.scale=0.015;
  //To assign velocity to orange
  orange.velocityX=-(6+score/8);
  //To assign velocity to orange
  orange.lifetime=120;
  //To add orange to orangegroup
  orangeGroup.add(orange);
  }
}

function reset()
{
  //Initial 
  gameState=PLAY;
  score=0;
  monkey.scale=0.1;
  gameOver.visible=false;
  restart.visible=false;
}