const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var rope, rope2, fruit, ground, bunny;
var fruit_con, fruit_con_2, fruit_con_3;
var bgImg, fruitImg;
var playerImg, eatImg, sadImg;
//botões, analisar botão novo (balaoB)
var cutB1, cutB2, balaoB, muteB;
var bk_song, cut_sound, sad_sound, eating_sound, air_sound;

//variáveis aula 34, analisar e descomentar.
//sprite das estrelas (star e star2) e variável para imagem de uma estrela preenchida(star.png)
var star1, star2, starImg;
//sprite do display de estrelas
var Edisplay;
//var auxiliares do display: displayVazio, com uma estrela, com duas estrelas
var displayV, display1, display2;

function preload() {

  bgImg = loadImage('background.png');
  fruitImg = loadImage('melon.png');
  playerImg = loadImage('sad_1.png');
  eatImg = loadImage('eat.png');
  sadImg = loadImage('sad_2.png');
  
  
  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air_sound = loadSound('air.wav');


  
 
 

  //descomentar carregamento de (ler linha debaixo) (explicar para prof)
  //imagens aula 34 - displayVazio/display1Etrela/display2Estrelas/estrelaSozinha
  displayV = loadAnimation("empty.png");
    display1 = loadAnimation("one_star.png");
    display2 = loadAnimation("stars.png");
    starImg = loadImage('star.png');




  
 
}

function setup() {
  createCanvas(600, 700);

  frameRate(80);


  bk_song.play();
  bk_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;


  cutB1 = createImg('cut_btn.png');
  cutB1.position(100, 90);
  cutB1.size(50, 50);
  cutB1.mouseClicked(drop);


  cutB2 = createImg('cut_btn.png');
  cutB2.position(450, 90);
  cutB2.size(50, 50);
  cutB2.mouseClicked(drop2);


  muteB = createImg('mute.png');
  muteB.position(width - 50, 20);
  muteB.size(50, 50);
  muteB.mouseClicked(mute);


  rope = new Rope(7, { x: 120, y: 90 });
  rope2 = new Rope(7, { x: 490, y: 90 });


  ground = new Ground(270, 700, 660, 20);

  


  bunny = createSprite(120, 620, 100, 100);
  bunny.scale = 0.2;
  
  //criar sprite para display e suas caracteristicas
  Edisplay = createSprite(85,55)
  Edisplay.addAnimation('empty', displayV );
  Edisplay.scale = 0.3;
  Edisplay.addAnimation('one', display1 );
  Edisplay.addAnimation('two', display2 );
  Edisplay.changeAnimation('empty' );


  //criar sprite para star1 e suas caracteristicas 
  star1 =  createSprite(300, 55, 100, 100);
  star1.addImage (starImg);
  star1.scale = 0.03;



  //criar sprite para star2 e suas características 
  star2 =  createSprite(100, 350, 100, 100);
  star2.addImage (starImg);
  star2.scale = 0.03;




  //criar botão balão e suas características
  balaoB = createImg('baloon2.png');
  balaoB.position(290, 350);
  balaoB.size(100, 100);
  balaoB.mouseClicked(force);
   





  fruit = Bodies.circle(300, 300, 20);
  Matter.Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);
  fruit_con_2 = new Link(rope2, fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);

}

function draw() {
  background(51);

  image(bgImg, 0, 0, width, height);

  push();
  imageMode(CENTER);
  if (fruit != null) {
    image(fruitImg, fruit.position.x, fruit.position.y, 70, 70);
  }
  pop();

  rope.show();
  rope2.show();

  Engine.update(engine);

  ground.show();

  drawSprites();

  //passar novo parâmetro de distância
  if (collide(fruit, bunny, 80) == true) {
    World.remove(engine.world, fruit);
    fruit = null;
    bunny.changeAnimation('eating');
    eating_sound.play();
  }

  if (fruit != null && fruit.position.y >= 650) {
    bunny.changeAnimation('crying');
    bk_song.stop();
    sad_sound.play();
    fruit = null;
  }

  //verificação de colisão com uma estrela
     if (collide(fruit, star1, 20) === true) {
       star1.visible = false;
       Edisplay.changeAnimation('one');

     }



  //verificação de colisão com segunda estrela
  if (collide(fruit, star2, 40) === true) {
    star2.visible = false;
    Edisplay.changeAnimation('two');

  }



}


function drop() {
  cut_sound.play();
  rope.break();
  fruit_con.dettach();
  fruit_con = null;
}


function drop2() {
  cut_sound.play();
  rope2.break();
  fruit_con_2.dettach();
  fruit_con_2 = null;
}

//reaproveitamento de função, conferir o novo parâmetro
function collide(body, sprite, x) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= x) {
      return true;
    } else {
      return false;
    }
  }
}


function mute() {
  if (bk_song.isPlaying()) {
    bk_song.stop();
  } else {
    bk_song.play();
  }
}

//função de aplicação de força 
  function force () {
     Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0, y:-0.04}) 
  }
