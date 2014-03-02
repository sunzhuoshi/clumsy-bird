

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

var SHARE_VIA_SINA_WEIBO_BUTTON_WIDTH = 187;

function getShareText(lang) {
    var shareText;
    switch (lang) {
        case 'zhCN':
            shareText = '#flappydragon#' + '我刚刚在蛋龙宝宝大冒险中获得了' + game.data.steps + '分，你行么！？'
            if (replayController.getShortenReplayUrl()) {
                shareText += '点击查看我的游戏回放';
                shareText += replayController.getShortenReplayUrl();
            }
            else {
                shareText += '点击就玩儿!';
                shareText += game.siteUrl;
            }
            break;
        case 'enUS':
        default:
            shareText = 'I just made ' + game.data.steps + ' step' + (game.data.steps>1?'s':'') + ' on Flappy Dragon! Can you beat me?';
            if (replayController.getShortenReplayUrl()) {
                shareText += ' Watch my replay here! ';
                shareText += replayController.getShortenReplayUrl();
            }
            else {
                shareText += ' Try it online here! ';
                shareText += game.siteUrl
            }
            break;
    }
    return shareText;
}

function getShareUrl() {
    var shareUrl = replayController.getShortenReplayUrl();
    if (!shareUrl) {
        shareUrl = game.siteUrl;
    }
    return shareUrl;
}

var Share = me.GUI_Object.extend({
  init: function(){
    var settings = {};
    var x = me.video.getWidth()/2 - 185 - SHARE_VIA_SINA_WEIBO_BUTTON_WIDTH / 2;
    var y = me.video.getHeight()/2 + 200;
    settings.image = "share";
    settings.spritewidth = 150;
    settings.spriteheight = 75;
    this.parent(x, y, settings);
  },

  onClick: function(event){
    FB.ui(
      {
       method: 'feed',
       name: 'My Flappy Dragon Score!',
       caption: "Share to your friends",
       description: (
           getShareText('enUS')
       ),
       link: getShareUrl(),
       picture: 'http://flappydragon.net/data/img/Icon@2x.png'
      }
    );
    return false;
  }

});

var Tweet = me.GUI_Object.extend({
  init: function(){
    var settings = {};
    var x = me.video.getWidth()/2 + 39 + SHARE_VIA_SINA_WEIBO_BUTTON_WIDTH / 2;
    var y = me.video.getHeight()/2 + 200;
    settings.image = "tweet";
    settings.spritewidth = 152;
    settings.spriteheight = 75;
    this.parent(x, y, settings);
  },
  onClick: function(event){
    var hashtags = 'flappydragon,clumsybird,melonjs'
    window.open('https://twitter.com/intent/tweet?text=' + getShareText('enUS') + '&hashtags=' + hashtags, 'Tweet!', 'height=300,width=400')
    return false;
  }
});

var ShareViaSinaWeibo = me.GUI_Object.extend({
    init: function() {
        var settings = {};
        var x = me.video.getWidth()/2 - SHARE_VIA_SINA_WEIBO_BUTTON_WIDTH / 2;
        var y = me.video.getHeight()/2 + 200;
        settings.image = "shareviasinaweibo";
        settings.spritewidth = 187;
        settings.spriteheight = 75;
        this.parent(x, y, settings);
    },
    onClick: function(event){
        WB2.anyWhere(function(W){
            W.widget.publish({
                'id' : 'publish',
                'default_text' : getShareText('zhCN'),
                'default_image': 'http://flappydragon.net/data/img/Icon@2x.png'
            });
        });
        return false;
    }
});

