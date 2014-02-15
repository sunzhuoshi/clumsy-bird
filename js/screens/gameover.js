game.GameOverScreen = me.ScreenObject.extend({

  init: function(){
    this.savedData = null;
    this.handler = null;
    this.dialog = null;
    this.share = null;
    this.tweet = null;
    this.shareViaSinaWeibo = null;
  },

  onResetEvent: function() {
    me.audio.play('gameover', false);  
    //save section
    this.savedData = {
      score: game.data.score,
      steps: game.data.steps
    };
    me.save.add(this.savedData);
    if (!me.save.topSteps) me.save.add({topSteps: game.data.steps});
    if (game.data.steps > me.save.topSteps){
      me.save.topSteps = game.data.steps;
      game.data.newHiScore = true;
    }
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    me.input.bindKey(me.input.KEY.SPACE, "enter", false)
    me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER);

    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
        if (action === "enter") {
            me.state.change(me.state.MENU);
        }
    });

    me.game.world.addChild(new BackgroundLayer('bg', 1));

    var gImage =  me.loader.getImage('gameover');
    me.game.world.addChild(new me.SpriteObject(
        me.video.getWidth()/2 - gImage.width/2,
        me.video.getHeight()/2 - gImage.height/2 - 80,
        gImage
    ), 10);

    var gImageBoard = me.loader.getImage('gameoverbg');
    me.game.world.addChild(new me.SpriteObject(
      me.video.getWidth()/2 - gImageBoard.width/2,
      me.video.getHeight()/2 - gImageBoard.height/2,
      gImageBoard
    ), 10);

    // share button
    this.share = new Share();
    me.game.world.addChild(this.share, 12);

    //tweet button
    this.tweet = new Tweet();
    me.game.world.addChild(this.tweet, 12);

    // share via sina weibo button
    this.shareViaSinaWeibo = new ShareViaSinaWeibo();
    me.game.world.addChild(this.shareViaSinaWeibo, 12);

    // add the dialog witht he game information
    if (game.data.newHiScore){
      var newRect = new me.SpriteObject(
          235,
          385,
          me.loader.getImage('new')
      );
      me.game.world.addChild(newRect, 12);
    }

    this.dialog = new (me.Renderable.extend({
      // constructor
      init : function() {
          // size does not matter, it's just to avoid having a zero size
          // renderable
          this.parent(new me.Vector2d(), 100, 100);
          this.font = new me.Font('Arial Black', 40, 'black', 'left');
          this.steps = 'Steps: ' + game.data.steps.toString();
          this.topSteps= 'Top Step: ' + me.save.topSteps.toString();
      },

      update : function () {
        return true;
      },

      draw : function (context) {
        var stepsText = this.font.measureText(context, this.steps);
        var topStepsText = this.font.measureText(context, this.topSteps);

        var scoreText = this.font.measureText(context, this.score);
        //steps
        this.font.draw(
            context,
            this.steps,
            me.game.viewport.width/2 - stepsText.width/2,
            me.game.viewport.height/2 + 10
        );
        //top score
        this.font.draw(
            context,
            this.topSteps,
            me.game.viewport.width/2 - topStepsText.width/2,
            me.game.viewport.height/2 + 80
        );

      }
    }));
    me.game.world.addChild(this.dialog, 12);
  },

	onDestroyEvent : function() {
        me.audio.stop('gameover');	
		// unregister the event
		me.event.unsubscribe(this.handler);
    me.input.unbindKey(me.input.KEY.ENTER);
    me.input.unbindKey(me.input.KEY.SPACE);
		me.input.unbindMouse(me.input.mouse.LEFT);
	}

});
