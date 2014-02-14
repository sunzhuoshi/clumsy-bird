

/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.ObjectContainer.extend({

	init: function() {
		// call the constructor
		this.parent();

		// persistent across level change
		this.isPersistent = true;

		// non collidable
		this.collidable = false;

		// make sure our object is always draw first
		this.z = Infinity;

		// give a name
		this.name = "HUD";

		// add our child score object at the top left corner
		this.addChild(new game.HUD.ScoreItem(5, 5));
	}
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
	/**
	 * constructor
	 */
	init: function(x, y) {

		// call the parent constructor
		// (size does not matter here)
		this.parent(new me.Vector2d(x, y), 10, 10);

		// local copy of the global score
    this.stepsFont = new me.Font('Helvetica', 60, '#000', 'center');

		// make sure we use screen coordinates
		this.floating = true;
	},

	update : function () {
    return true;
	},

	draw : function (context) {
    if (game.data.start && me.state.isCurrent(me.state.PLAY))
      this.stepsFont.draw(context, game.data.steps, 50, 10);
	}

});

var BackgroundLayer = me.ImageLayer.extend({
  init: function(image, z, speed){
    name = image;
    width = 900;
    height = 600;
    ratio = 1;
    this.fixed = speed > 0 ? false : true;
    // call parent constructor
    this.parent(name, width, height, image, z, ratio);
  },

  update: function() {
    if (!this.fixed){
      if (this.pos.x >= this.imagewidth - 1)
        this.pos.x = 0;
      this.pos.x += this.speed;
    }
    return true;
  }
});

var Share = me.GUI_Object.extend({
  init: function(){
    var settings = {};
    var x = me.video.getWidth()/2 - 170;
    var y = me.video.getHeight()/2 + 200;
    settings.image = "share";
    settings.spritewidth = 150;
    settings.spriteheight = 75;
    this.parent(x, y, settings);
  },

  onClick: function(event){
    var shareText = 'I just made ' + game.data.steps + ' step' + (game.data.steps>1?'s':'') + ' on Flappy Dragon! Can you beat me? Try it online here!';
    var url = 'http://flappydragon.net/';
    FB.ui(
      {
       method: 'feed',
       name: 'My Flappy Dragon Score!',
       caption: "Share to your friends",
       description: (
          shareText
       ),
       link: url,
       picture: 'http://flappydragon.net/data/img/Icon@2x.png'
      }
    );
    return false;
  }

});

var Tweet = me.GUI_Object.extend({
  init: function(){
    var settings = {};
    var x = me.video.getWidth()/2 + 10;
    var y = me.video.getHeight()/2 + 200;
    settings.image = "tweet";
    settings.spritewidth = 152;
    settings.spriteheight = 75;
    this.parent(x, y, settings);
  },

  onClick: function(event){
      console.log(game.data);

    var shareText = 'I just made ' + game.data.steps + ' step' + (game.data.steps>1?'s':'') + ' on Flappy Dragon! Can you beat me? Try it online here!';
      console.log(shareText);
    var url = 'http://flappydragon.net/';
    var hashtags = 'flappydragon,clumsybird,melonjs'
    window.open('https://twitter.com/intent/tweet?text=' + shareText + '&hashtags=' + hashtags + '&count=' + url + '&url=' + url, 'Tweet!', 'height=300,width=400')
    return false;
  }

});
