// main.ts

/// <reference path="./../../node_modules/pixi-typescript/pixi.js.d.ts" />

import PIXI = require("pixi.js");
const PATH_BG_1 = "./images/bg1.jpg";
const PATH_BG_2 = "./images/bg2.png";
const PATH_LOGO = "./images/logo.bmp";
const PATH_MAINMENU_BG = "./images/mainmenu_bg.bmp";
const PATH_BUTTON_NORMAL = "./images/btn_normal.bmp";
const PATH_BUTTON_EXIT = "./images/btn_exit.bmp";
const PATH_PLAYER_SHIP = "./images/player_ship.png";
const PATH_ALIEN_SHIP = "./images/alien_ship.png";
const PATH_SPARKLE = "./images/sparkle.png";

//clamp v between a and b
function math_clamp(v,a,b)
{
	return Math.max(a,Math.min(b,v));
}

function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  
  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );
  
  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };
  
  return key;
}



const params = {
	splash_screen_fade_in_time : 0.5,
	splash_screen_stay_time : 2,
	splash_screen_fade_out_time : 1,
    backgroundColor: 0x000000,
	bg_slow_speed : 0.6,
	bg_fast_speed : 1.6,
    canvasW: 800,
    canvasH: 600,
	alienSpawnSeconds : 2,
	alienShipMinSpeed : 1,
	alienShipMaxSpeed : 2,
	alienShipMinRotation : 200 * Math.PI / 180,
	alienShipMaxRotation : 340 * Math.PI / 180
}

class SplashScreen
{
	constructor(fadeInTime,fadeOutTime,stayTime, finish_callback)
	{
		this.fadeInTime = fadeInTime;
		this.fadeOutTime = fadeOutTime;
		this.stayTime = stayTime;
		this.phase = 0; //0 fade-in, 1 stay, 2 fade-out
		this.callback = finish_callback;
		console.log("splash screen is constructed");
		
		
		this.bitmap = new PIXI.Sprite(PIXI.loader.resources[PATH_LOGO].texture);
		this.bitmap.width = app.renderer.width;
		this.bitmap.height = app.renderer.height;
		this.bitmap.alpha = 0;
		app.stage.addChild(this.bitmap);
		
		this.time = 0;
		
		this.start();
	}
	
	start() : void
	{
		app.ticker.add(this.update,this);
		this.phase = 0;
		this.time = this.fadeInTime;
		this.bitmap.alpha = 0;
	}
	
	update(delta) : void
	{
		let alpha = 0;
		switch(this.phase)
		{
			case 0:
				alpha = 1-(this.time / this.fadeInTime);
				break;
			case 1:
				alpha = 1;
				break;
			default:
				alpha = this.time / this.fadeOutTime;
				break;
		}
		this.bitmap.alpha = math_clamp(alpha,0,1);
		
		this.time -= (app.ticker.elapsedMS /1000);
		if(this.time <= 0)
		{
			this.phase++;
			if(this.phase == 1)
				this.time = this.stayTime;
			else if(this.phase == 2)
				this.time = this.fadeOutTime;
			else
				this.stop();
		}
	}
	stop() : void
	{
		app.ticker.remove(this.update,this);
		this.bitmap.destroy();
		this.callback();
	}
	
	
}

class MainMenu
{
	constructor()
	{
		this.background = new PIXI.extras.TilingSprite(PIXI.loader.resources[PATH_MAINMENU_BG].texture, app.renderer.width, app.renderer.height);
		this.logo = new PIXI.Sprite(PIXI.loader.resources[PATH_LOGO].texture);
		let that = this;
		this.btn_game1 = new PIXI.Sprite(PIXI.loader.resources[PATH_BUTTON_NORMAL].texture);
		this.btn_game1.interactive = true;
		this.btn_game1.buttonMode = true;
		this.btn_game1.on('click', this.onClick_Game.bind(this));
		this.btn_game1.on('mouseover',()=>{that.btn_game1.tint = 0xAAFFAA;});
		this.btn_game1.on('mousedown',()=>{that.btn_game1.tint = 0xFFAAAA;});
		this.btn_game1.on('mouseout',()=>{that.btn_game1.tint = 0xFFFFFF;});
		this.btn_game1.on('mouseup',()=>{that.btn_game1.tint = 0xFFFFFF;});
		
		
		this.btn_game2 = new PIXI.Sprite(PIXI.loader.resources[PATH_BUTTON_NORMAL].texture);
		this.btn_game2.interactive = true;
		this.btn_game2.buttonMode = true;
		this.btn_game2.on('click', this.onClick_Game.bind(this));
		this.btn_game2.on('mouseover',()=>{that.btn_game2.tint = 0xAAFFAA;});
		this.btn_game2.on('mousedown',()=>{that.btn_game2.tint = 0xFFAAAA;});
		this.btn_game2.on('mouseout',()=>{that.btn_game2.tint = 0xFFFFFF;});
		this.btn_game2.on('mouseup',()=>{that.btn_game2.tint = 0xFFFFFF;});
		
		
		this.btn_game3 = new PIXI.Sprite(PIXI.loader.resources[PATH_BUTTON_NORMAL].texture);
		this.btn_game3.interactive = true;
		this.btn_game3.buttonMode = true;
		this.btn_game3.on('click', this.onClick_Game.bind(this));
		this.btn_game3.on('mouseover',()=>{that.btn_game3.tint = 0xAAFFAA;});
		this.btn_game3.on('mousedown',()=>{that.btn_game3.tint = 0xFFAAAA;});
		this.btn_game3.on('mouseout',()=>{that.btn_game3.tint = 0xFFFFFF;});
		this.btn_game3.on('mouseup',()=>{that.btn_game3.tint = 0xFFFFFF;});
		
		
		this.btn_exit = new PIXI.Sprite(PIXI.loader.resources[PATH_BUTTON_EXIT].texture);
		this.btn_exit.interactive = true;
		this.btn_exit.buttonMode = true;
		this.btn_exit.on('click', this.onClick_Exit.bind(this));
		this.btn_exit.on('mouseover',()=>{that.btn_exit.tint = 0xAAFFAA;});
		this.btn_exit.on('mousedown',()=>{that.btn_exit.tint = 0xFFAAAA;});
		this.btn_exit.on('mouseout',()=>{that.btn_exit.tint = 0xFFFFFF;});
		this.btn_exit.on('mouseup',()=>{that.btn_exit.tint = 0xFFFFFF;});
		
		this.container = new PIXI.Container();
		this.container.addChild(this.background);
		this.container.addChild(this.logo);
		this.container.addChild(this.btn_game1);
		this.container.addChild(this.btn_game2);
		this.container.addChild(this.btn_game3);
		this.container.addChild(this.btn_exit);
		
		//set ui positions here
		this.logo.width = 300;
		this.logo.height = 150;
		this.logo.position.set(100,50);
		
		this.btn_game1.width = 200;
		this.btn_game1.height = 75;
		this.btn_game1.position.set(this.btn_game1.width*0.5 + 150,this.btn_game1.height*0.5 + 225);
		this.btn_game2.width = 200;
		this.btn_game2.height = 75;
		this.btn_game2.position.set(this.btn_game2.width*0.5 + 150,this.btn_game2.height*0.5 + 305);
		this.btn_game3.width = 200;
		this.btn_game3.height = 75;
		this.btn_game3.position.set(this.btn_game3.width*0.5 + 150,this.btn_game3.height*0.5 + 385);
		this.btn_exit.width = 200;
		this.btn_exit.height = 75;
		this.btn_exit.position.set(this.btn_exit.width*0.5 + 150,this.btn_exit.height*0.5 + 465); 
		
		this.btn_game1.anchor.set(0.5);
		this.btn_game2.anchor.set(0.5);
		this.btn_game3.anchor.set(0.5);
		this.btn_exit.anchor.set(0.5);
		//===================
		
		//setting text
		let style = new PIXI.TextStyle({
		  fontFamily: "Arial",
		  fontSize: 128,
		  fill: "white",
		  dropShadow: true,
		  dropShadowColor: "#000000",
		  dropShadowBlur: 4,
		  dropShadowAngle: Math.PI / 6,
		  dropShadowDistance: 6,
		});
		let text = new PIXI.Text("Game 1", style);
		text.anchor.set(0.5);
		this.btn_game1.addChild(text);
		text.position.set(0,0);
		
		text = new PIXI.Text("Game 2", style);
		text.anchor.set(0.5);
		this.btn_game2.addChild(text);
		text.position.set(0,0);
		
		text = new PIXI.Text("Game 3", style);
		text.anchor.set(0.5);
		this.btn_game3.addChild(text);
		text.position.set(0,0);
		
		text = new PIXI.Text("Exit", style);
		text.anchor.set(0.5);
		text.scale.set(1.5,1.25);
		this.btn_exit.addChild(text);
		text.position.set(0,0);
		//=======================
		
		this.visible = false;
		
		app.ticker.add(this.update,this);
		console.log("main menu is constructed");
	}
	public show() : void 
	{
		app.stage = this.container;
		this.visible = true;
	}
	
	public hide() : void
	{
		app.stage = new PIXI.Container();
		this.visible = false;
	}
	
	update(delta) : void
	{
		if(!this.visible)
			return;
		
		this.background.tilePosition.x -= 0.75 * delta;
		this.background.tilePosition.y -= 0.65 * delta;
	}
	
	onClick_Game() : void
	{
		if(!this.visible)
			return;
		console.log("game clicked");
		this.hide();
		startGame();
	}
	
	onClick_Exit() : void
	{
		if(!this.visible)
			return;
		console.log("exit clicked");
		//navigate somewhere
		window.location.href = 'http://www.google.com';
	}
}

class SimpleParticleEmitter
{
	constructor(x,y,size,emission,lifespan,minSpeed,maxSpeed)
	{
		this.maxLife = lifespan;
		this.life = lifespan;
		
		
		this.container = new PIXI.particles.ParticleContainer();
		this.particles = [];
		for(let i = 0; i< emission; i++)
		{
			let particle = new PIXI.Sprite(PIXI.loader.resources[PATH_SPARKLE].texture);
			particle.width = size;
			particle.height = size;
			particle.anchor.set(0.5);
			particle.rotation = Math.random() * Math.PI*2;
			particle.speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
			this.particles.push(particle);
			this.container.addChild(particle);
		}
		
		app.ticker.add(this.update,this);
		app.stage.addChild(this.container);
		this.container.position.set(x,y);
	}
	
	update(delta) : void
	{
		this.life -= app.ticker.elapsedMS /1000;
		if(this.life <= 0)
		{
			this.destroy();
		}
		else
		{
			this.container.alpha = this.life/this.maxLife;
			for(let i = 0;i<this.particles.length;i++)
			{
				let particle = this.particles[i];
				particle.x += particle.speed * delta * Math.sin(particle.rotation);
				particle.y -= particle.speed * delta * Math.cos(particle.rotation);
			}
		}
	}
	public destroy() : void
	{
		app.ticker.remove(this.update,this);
		this.container.destroy({children : true});
	}
}

class Game
{
	constructor()
	{
		this.bg_layer_slow = null;
		this.bg_layer_fast = null;
		this.player_ship = null;
		this.key_left = null;
		this.key_right = null;
		this.key_up = null;
		this.key_down = null;
		this.key_space = null;
		this.timeToSpawnAlienShip = params.alienSpawnSeconds;
		this.allObjects = [];
		this.allRockets = [];
		this.gameOverDelayTime = 3;
		console.log("game is constructed");
		
		this.create();
	}
	
	public destroy() : void
	{
		app.ticker.remove(this.gameLoop,this);
		app.stage.destroy({children : true});
		app.stage = new PIXI.Container();
	}
	
	shipCrashed() : void
	{
		this.player_ship.visible = false;
		//setting text
		let style = new PIXI.TextStyle({
		  fontFamily: "Arial",
		  fontSize: 128,
		  fill: "red",
		  dropShadow: true,
		  dropShadowColor: "#000000",
		  dropShadowBlur: 4,
		  dropShadowAngle: Math.PI / 6,
		  dropShadowDistance: 6,
		});
		let text = new PIXI.Text("GAME OVER", style);
		text.anchor.set(0.5);
		text.position.set(app.renderer.width /2, app.renderer.height / 2);
		text.width = 400;
		text.height = 150;
		app.stage.addChild(text);
	}
	
	public create () : void {
		console.log("create called");
		this.bg_layer_slow = new PIXI.extras.TilingSprite(PIXI.loader.resources[PATH_BG_1].texture, app.renderer.width, app.renderer.height);
		this.bg_layer_fast = new PIXI.extras.TilingSprite(PIXI.loader.resources[PATH_BG_2].texture, app.renderer.width, app.renderer.height);
		app.stage.addChild(this.bg_layer_slow);
		app.stage.addChild(this.bg_layer_fast);
		
		this.player_ship = new PIXI.Sprite(PIXI.loader.resources[PATH_PLAYER_SHIP].texture);
		this.player_ship.scale.x = 0.15;
		this.player_ship.scale.y = 0.15;
		this.player_ship.anchor.set(0.5);
		this.player_ship.rotation = Math.PI/2;
		this.player_ship.rotRate = 5 * Math.PI / 180;
		this.player_ship.rotDir = 0;
		this.player_ship.thrust = 0;
		this.player_ship.maxThrust = 10; // zero for infinite
		this.player_ship.thrustPower = 1;
		this.player_ship.brakePower = 0.65;
		this.player_ship.thrustDamp = 0.04;
		this.player_ship.x = this.player_ship.width*0.5;
		this.player_ship.y = (app.renderer.height * 0.5) + (this.player_ship.height*0.5);

		
		app.stage.addChild(this.player_ship);
		this.allObjects.push(this.player_ship);

		app.ticker.add(this.gameLoop,this);

		this.key_left = keyboard("ArrowLeft");
		this.key_up = keyboard("ArrowUp");
		this.key_right = keyboard("ArrowRight");
		this.key_down = keyboard("ArrowDown");
		this.key_space = keyboard(" ");
		
		let that = this;

		this.key_left.press = () => {
			if(that.player_ship.visible)
				that.player_ship.rotDir -= 1;
		};

		this.key_left.release = () => {
			if(that.player_ship.visible)
				that.player_ship.rotDir += 1;
		};

		this.key_right.press = () => {
			if(that.player_ship.visible)
				that.player_ship.rotDir += 1;
		};

		this.key_right.release = () => {
			if(that.player_ship.visible)
				that.player_ship.rotDir -= 1;
		};
		
		this.key_space.press = () => {
			if(that.player_ship.visible)
				that.launchRocket();
		};
		
	}


	public gameLoop(delta) : void{

		if(!this.player_ship.visible)
		{
			this.gameOverDelayTime -= app.ticker.elapsedMS /1000;
			if(this.gameOverDelayTime <= 0)
			{
				endGame();
			}
			return;
		}
		
		
		this.bg_layer_slow.tilePosition.x -= params.bg_slow_speed * delta;
		this.bg_layer_fast.tilePosition.x -= params.bg_fast_speed * delta;
		
		this.player_ship.rotation += delta * this.player_ship.rotRate * this.player_ship.rotDir;
		if(this.key_up.isDown)
		{
		  this.player_ship.thrust += this.player_ship.thrustPower * delta;
		}
		if(this.key_down.isDown)
		{
		  this.player_ship.thrust -= this.player_ship.brakePower * delta;
		}
		if(this.player_ship.maxThrust != 0)
			this.player_ship.thrust = Math.min(this.player_ship.maxThrust, this.player_ship.thrust);
		this.player_ship.thrust *= (1-this.player_ship.thrustDamp);
		this.player_ship.thrust = Math.max(this.player_ship.thrust, 0);
		let r = this.player_ship.thrust * delta;
		this.player_ship.x += r * Math.sin(this.player_ship.rotation);
		this.player_ship.y -= r * Math.cos(this.player_ship.rotation);
		
		
		this.timeToSpawnAlienShip -= app.ticker.elapsedMS /1000;
		if(this.timeToSpawnAlienShip <=0)
		{
			this.spawnAlienShip();
			this.timeToSpawnAlienShip = params.alienSpawnSeconds;
		}
		
		
		this.edgesLogic(delta);
		this.alienShipMovement(delta);
		this.rocketsLife(delta);
		this.collisionDetection(delta);
	}

	public edgesLogic(delta) : void
	{
		for(let i = this.allObjects.length-1; i>=0;i--)
		{
			let child = this.allObjects[i];
			if(child.x - child.width * 0.5 > app.renderer.width)
				child.x = 0;
			if(child.x + child.width * 0.5 < 0)
				child.x = app.renderer.width;
			if(child.y - child.height * 0.5 > app.renderer.height)
				child.y = 0;
			if(child.y + child.height * 0.5  < 0)
				child.y = app.renderer.height;
		}
	}

	public launchRocket() : void
	{
		let rocket = new PIXI.Graphics();
		rocket.beginFill(0xFFFFFF);
		rocket.drawCircle(0, 0, 10);
		rocket.endFill();
		rocket.x = this.player_ship.x;
		rocket.y = this.player_ship.y;
		rocket.rotation = this.player_ship.rotation;
		app.stage.addChild(rocket);
		this.allRockets.push(rocket);
	}

	public rocketsLife(delta) : void
	{	
		let i = this.allRockets.length-1;
		while(i>=0)
		{
			let rocket = this.allRockets[i];
			let r = 25 * delta;
			rocket.x += r * Math.sin(rocket.rotation);
			rocket.y -= r * Math.cos(rocket.rotation);
			if(rocket.x > app.renderer.width || rocket.x < 0 || rocket.y > app.renderer.height || rocket.y < 0)
			{
				rocket.destroy();
				this.allRockets.splice(i,1);
			}
			i--;
		}
		
	}

	public collisionDetection(delta) : void
	{
		let i = this.allRockets.length - 1;
		while(i>=0)
		{
			let rocket = this.allRockets[i];
			let j = this.allObjects.length - 1;
			while (j>=0)
			{
				let obj = this.allObjects[j];
				if(obj != this.player_ship)
				{
					if(boxesIntersect(rocket,obj))
					{
						let particles = new SimpleParticleEmitter(obj.x,obj.y,50,25,0.75,0.5,1);
						obj.destroy();
						rocket.destroy();
						this.allObjects.splice(j,1);
						this.allRockets.splice(i,1);
						
						break;
					}
				}
				j--;
			}
			i--;
		}
		i = this.allObjects.length - 1;
		while (i>=0)
		{
			if(!this.player_ship.visible)
				break;
			let obj = this.allObjects[i];
			if(obj != this.player_ship)
			{
				if(boxesIntersect(this.player_ship,obj))
				{
					let particles = new SimpleParticleEmitter(obj.x,obj.y,50,25,0.75,0.5,1);
					particles = new SimpleParticleEmitter(this.player_ship.x,this.player_ship.y,50,25,0.75,0.5,1);
					
					obj.destroy();
					this.allObjects.splice(i,1);
					this.allObjects.splice(this.allObjects.indexOf(this.player_ship),1);
					this.shipCrashed();
					break;
				}
			}
			i--;
		}
		
	}

	public spawnAlienShip() : void
	{
		let alienShip = new PIXI.Sprite(PIXI.loader.resources[PATH_ALIEN_SHIP].texture);
		alienShip.scale.x = 0.15;
		alienShip.scale.y = 0.15;
		alienShip.anchor.set(0.5);
		alienShip.position.set(app.renderer.width, Math.random() * app.renderer.height);
		alienShip.speed = params.alienShipMinSpeed + Math.random() * (params.alienShipMaxSpeed - params.alienShipMinSpeed);
		alienShip.motionRotation = params.alienShipMinRotation + Math.random() * (params.alienShipMaxRotation - params.alienShipMinRotation);
		app.stage.addChild(alienShip);
		this.allObjects.push(alienShip);
	}

	public alienShipMovement(delta) : void
	{
		let i = this.allObjects.length - 1;
		while(i >= 0)
		{
			let ship = this.allObjects[i];
			if(ship != this.player_ship)
			{
				let r = ship.speed * delta;
				ship.x += r * Math.sin(ship.motionRotation);
				ship.y -= r * Math.cos(ship.motionRotation);
			}
			i--;
		}
	}
}

//Create a Pixi Application
let app = new PIXI.Application({ 
	width: params.canvasW,         // default: 800
	height: params.canvasH,        // default: 600
	antialias: true,    // default: false
	transparent: false, // default: false
	resolution: 1       // default: 1
  }
);

let splashScreenContext = null, mainmenuContext = null, gameContext = null;


document.body.appendChild(app.view);

PIXI.loader
	  .add(PATH_PLAYER_SHIP)
	  .add(PATH_ALIEN_SHIP)
	  .add(PATH_BG_1)
	  .add(PATH_BG_2)
	  .add(PATH_LOGO)
	  .add(PATH_MAINMENU_BG)
	  .add(PATH_BUTTON_NORMAL)
	  .add(PATH_BUTTON_EXIT)
	  .add(PATH_SPARKLE)
	  .load(init);
	  
function init()
{
	splashScreenContext = new SplashScreen(params.splash_screen_fade_in_time,params.splash_screen_fade_out_time,params.splash_screen_stay_time,splashScreenEnd);
	mainmenuContext = new MainMenu();
}

function splashScreenEnd()
{
	mainmenuContext.show();
}

function startGame()
{
	gameContext = new Game();
}
function endGame()
{
	if(gameContext != null)
	{
		gameContext.destroy();
		gameContext = null;
		mainmenuContext.show();
	}
}

function create() {

	bg_layer_slow = new PIXI.extras.TilingSprite(PIXI.loader.resources[PATH_BG_1].texture, app.renderer.width, app.renderer.height);
	bg_layer_fast = new PIXI.extras.TilingSprite(PIXI.loader.resources[PATH_BG_2].texture, app.renderer.width, app.renderer.height);
	app.stage.addChild(bg_layer_slow);
	app.stage.addChild(bg_layer_fast);
	
	player_ship = new PIXI.Sprite(PIXI.loader.resources[PATH_PLAYER_SHIP].texture);
	player_ship.scale.x = 0.15;
	player_ship.scale.y = 0.15;
	player_ship.anchor.set(0.5);
	player_ship.rotation = Math.PI/2;
	player_ship.rotRate = 5 * Math.PI / 180;
	player_ship.rotDir = 0;
	player_ship.thrust = 0;
	player_ship.maxThrust = 10; // zero for infinite
	player_ship.thrustPower = 1;
	player_ship.brakePower = 0.65;
	player_ship.thrustDamp = 0.04;
	player_ship.x = player_ship.width*0.5;
	player_ship.y = (app.renderer.height * 0.5) + (player_ship.height*0.5);

	
	app.stage.addChild(player_ship);
	allObjects.push(player_ship);

	let gameLoopFn = new gameLoop();
	app.ticker.add(delta => gameLoop(delta));

	key_left = keyboard("ArrowLeft");
	key_up = keyboard("ArrowUp");
	key_right = keyboard("ArrowRight");
	key_down = keyboard("ArrowDown");
	key_space = keyboard(" ");

	key_left.press = () => {
		if(player_ship.visible)
			player_ship.rotDir -= 1;
	};

	key_left.release = () => {
		if(player_ship.visible)
			player_ship.rotDir += 1;
	};

	key_right.press = () => {
		if(player_ship.visible)
			player_ship.rotDir += 1;
	};

	key_right.release = () => {
		if(player_ship.visible)
			player_ship.rotDir -= 1;
	};
	
	key_space.press = () => {
		if(player_ship.visible)
			launchRocket();
	};
	
}

function boxesIntersect(a, b)
{
  var ab = a.getBounds();
  var bb = b.getBounds();
  return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}