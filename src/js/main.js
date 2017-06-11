var game = new Phaser.Game(945, 582, Phaser.AUTO);

// var player = {
//   'name': 'Jolie',
//   'points': 50
// };
//
// var addScore = function() {
//   player.points += 10;
// };
//
// function addScore2() {
//   player.points += 20;
// }

// TEST

// var windowW = document.documentElement.clientWidth;
// console.log(`The window width ${windowW}`)
var isAnimPlaying = false


var GameState = {
  preload: function() {``
    this.load.image('background', 'images/background.png');
    // this.load.image('hippo', 'images/hippo.png');
    // this.load.image('herby', 'images/herby.png');
    // this.load.image('deer', 'images/deer.png');
    // this.load.image('cat', 'images/cat.png');
    this.load.image('broccoli', 'images/broccoli.png');
    this.load.image('meat', 'images/meat.png');
    this.load.image('arrow', 'images/arrow.png');

    //load sprites
    this.load.spritesheet('hippo', 'images/hippo_sprite.png', 195, 150, 4);
    this.load.spritesheet('herby', 'images/herby_sprite.png', 120, 150, 4);
    this.load.spritesheet('deer', 'images/deer_sprite.png', 195, 150, 3);
    this.load.spritesheet('cat', 'images/cat_sprite.png', 120, 150, 6);

    //load audio
    this.load.audio('hippoSound', 'images/hippo_sound.mp3');
    this.load.audio('herbySound', 'images/herby_sound.mp3');
    this.load.audio('deerSound', 'images/deer_sound.mp3');
    this.load.audio('catSound', 'images/cat_sound.mp3');

    // addScore();
    // addScore2();
    // console.log(`The name is ${player.name} and points is ${player.points}`);
  },

  create: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.background = this.game.add.sprite(0, 0, 'background');
    // this.hippo = this.game.add.sprite(300, 447, 'hippo');
    // this.hippo.anchor.setTo(0.5);
    this.broccoli = this.game.add.sprite(500, 200, 'broccoli');
    this.broccoli.anchor.setTo(0.5);
    this.broccoli.angle = 95;
    this.meat = this.add.sprite(100, 165, 'meat');
    this.meat.anchor.setTo(0.5);
    this.meat.scale.setTo(-1, 1);

    //group animals
    var animalData = [
      {key: 'hippo', text: 'Jolie', audio: 'hippoSound'},
      {key: 'herby', text: 'Herby', audio: 'herbySound'},
      {key: 'deer', text: 'Deer', audio: 'deerSound'},
      {key: 'cat', text: 'Cat', audio: 'catSound'},  
    ];

    this.animals = this.game.add.group();
    var self = this;
    var animal;  
    animalData.forEach(function(element) {
      animal = self.animals.create(-1000, 445, element.key);
      animal.customParams = {text: element.text, sound: self.game.add.audio(element.audio)};
      animal.anchor.setTo(0.5);

      // create animal animation
      animal.animations.add('animate', [0, 1, 2, 3, 0, 1, 2, 3, 0], 6, false);
      animal.animations.add('animate', [0, 1, 2, 3, 0, 1, 2, 3, 0], 6, false);
      animal.animations.add('animate', [0, 1, 2, 0, 1, 2, 0], 3, false);
      animal.animations.add('animate', [0, 1, 2, 3, 4, 5, 0], 6, false);

      //enable user input on sprite
      animal.inputEnabled = true;
      animal.input.pixelPerfectClick = true;
      animal.events.onInputDown.add(self.animateAnimal, self);

    }); 

    this.currentAnimal = this.animals.next();
    this.currentAnimal.position.set(300, 445);

    //show name
    this.showText(this.currentAnimal);

    //left arrow
    this.arrowLeft = this.game.add.sprite(100, 400, 'arrow');
    this.arrowLeft.anchor.setTo(0.5);
    this.arrowLeft.scale.x = -1;
    this.arrowLeft.customParams = {direction: -1};

    //left arrow user input
    this.arrowLeft.inputEnabled = true;
    // this.arrowLeft.input.pixelPerfectClick = true;
    this.arrowLeft.events.onInputDown.add(this.switchAnimal, this);

    //right arrow
    this.arrowRight = this.game.add.sprite(500, 400, 'arrow');
    this.arrowRight.anchor.setTo(0.5);
    this.arrowRight.customParams = {direction: 1, y: 20};

    //right arrow user input
    this.arrowRight.inputEnabled = true;
    this.arrowRight.input.pixelPerfectClick = true;
    this.arrowRight.events.onInputDown.add(this.switchAnimal, this);

  },
  update: function() {
  },

  animateAnimal: function(sprite, event) {
    if (isAnimPlaying === false) {
      sprite.play('animate');
      sprite.customParams.sound.play();``
      isAnimPlaying = true;
    } 
  },

  switchAnimal: function(sprite, event) {
    var newAnimal, finalX;

    if(this.isMoving) {
      return false;
    }
    this.isMoving = true;

    //hide name
    this.animalText.visible = false;

    if(sprite.customParams.direction > 0) {
      newAnimal = this.animals.next();
      newAnimal.x = -newAnimal.width / 2;
      finalX = 945 + this.currentAnimal.width / 2;
    }
    else {
      newAnimal = this.animals.previous();
      newAnimal.x = 945 + newAnimal.width / 2;
      finalX = -this.currentAnimal.width / 2;
    }

    //animations
    var newAnimalAnim = game.add.tween(newAnimal);
    newAnimalAnim.to({x: 300}, 500);
    newAnimalAnim.onComplete.add(function(){
      this.isMoving = false;
      this.showText(newAnimal);
    }, this); 
    newAnimalAnim.start();
    
    var currentAnimalAnim = game.add.tween(this.currentAnimal);
    currentAnimalAnim.to({x: finalX}, 500);
    currentAnimalAnim.start();
        
    this.currentAnimal = newAnimal;
  },

  showText: function(animal) {
    if(!this.animalText) {
      var style = {
        font: 'bold 30pt Helvetica',
        fill: '#FFF',
        align: 'center'
      }
      this.animalText= this.game.add.text(300, this.game.height * 0.55, '', style);
      this.animalText.anchor.setTo(0.5);
    }

    this.animalText.setText(animal.customParams.text);
    this.animalText.visible = true;
  }

 
};

game.state.add('GameState', GameState);
game.state.start('GameState');

