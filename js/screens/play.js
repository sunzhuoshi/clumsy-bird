game.PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {
    me.input.bindKey(me.input.KEY.SPACE, "fly", true);

    game.data.steps = 0;
    game.data.start = false;
    game.data.newHiscore = false;

    me.game.world.addChild(new BackgroundLayer('bg', 1));

    var groundImage = me.loader.getImage('ground');

    this.ground = new me.SpriteObject(
      0,
      me.video.getHeight() - groundImage.height,
      groundImage
    );
    me.game.world.addChild(this.ground, 11);

    this.HUD = new game.HUD.Container();
    me.game.world.addChild(this.HUD);

    this.bird = me.pool.pull("clumsy", 60, me.game.viewport.height/2 - 100);
    me.game.world.addChild(this.bird, 10);

    //inputs
    me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.SPACE);
    me.state.transition("fade", "#fff", 100);

    this.getReady = new me.SpriteObject(
      me.video.getWidth()/2 - 200,
      me.video.getHeight()/2 - 100,
      me.loader.getImage('getready')
    );
    me.game.world.addChild(this.getReady, 11);
    var posY = -132;
    if (replayController.inReplayMode()) {
        posY -= 100;
    }
    var popOut = new me.Tween(this.getReady.pos).to({y: posY}, 2000)
      .easing(me.Tween.Easing.Linear.None)
      .onComplete(function(){
            var pipeGenerator = new PipeGenerator;
            me.game.world.pipeGenerator = pipeGenerator;
            game.data.start = true;
            me.game.world.addChild(pipeGenerator, 0);
            if (replayController.inReplayMode()) {
                me.game.world.addChild(new (me.Renderable.extend ({
                    // constructor
                    init : function() {
                        this.parent(new me.Vector2d(), 100, 100);
                        this.font = new me.Font('Arial Black', 20, 'black', 'left');
                        this.text = 'REPLAYING...';
                    },
                    draw : function (context) {
                        var measure = this.font.measureText(context, this.text);
                        this.font.draw(context, this.text,  me.game.viewport.width/2 - measure.width/2, 30);
                    }
                })), 12);
            }
       }).start();
  },

	onDestroyEvent: function() {
    me.audio.stopTrack('theme');
    // free the stored instance
    this.HUD = null;
    this.bird = null;
    me.input.unbindKey(me.input.KEY.SPACE);
	}

});