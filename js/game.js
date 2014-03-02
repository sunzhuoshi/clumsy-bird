var query = (function() {
    var result = {};
    if (window && window.location.search) {
        var params = window.location.search.substr(1).split("&");
        var i, tmp;
        for (i=0; i < params.length; ++i)
        {
            tmp = params[i].split("=");
            result[tmp[0]] = decodeURI(tmp[1]);
        }
    }
    result.toString = function() {
        var ret = '', key, i = 0;
        for(key in result) {
            if (result.hasOwnProperty(key)) {
                if (key !== 'toString') {
                    if (0 < i) {
                        ret += '&';
                    }
                    ++i;
                    if (!ret) {
                        ret += '?';
                    }
                    ret += key;
                    ret += '=';
                    ret += result[key];
                }
            }
        }
        return ret;
    };
    return result;
}());

var game = {
  siteUrl: 'http://flappydragon.net',
  data : {
    score : 0,
    steps: 0,
    start: false,
    newHiScore: false
  },

  "onload" : function () {
    if (!me.video.init("screen", 900, 600, true, 'auto')) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    me.audio.init("mp3,ogg");
    me.loader.onload = this.loaded.bind(this);
    me.loader.preload(game.resources);
    me.state.change(me.state.LOADING);
  },

  "loaded" : function () {
    me.state.set(me.state.MENU, new game.TitleScreen());
    me.state.set(me.state.PLAY, new game.PlayScreen());
    me.state.set(me.state.GAME_OVER, new game.GameOverScreen());
    me.state.transition("fade", "#000", 100);

    me.input.bindKey(me.input.KEY.SPACE, "fly", true);
    me.input.bindTouch(me.input.KEY.SPACE);

    me.pool.register("clumsy", BirdEntity);
    me.pool.register("pipe", PipeEntity, true);
    me.pool.register("hit", HitEntity, true);

    // in melonJS 1.0.0, viewport size is set to Infinity by default
    me.game.viewport.setBounds(0,0, 900, 600);
    me.state.change(me.state.MENU);
	}
};

var replayController = {
    _replayMode: false,
    _flyItems: [],
    _pipeItems: [],
    _shortenReplayUrl: null,
    inReplayMode: function() {
        return this._replayMode;
    },
    getShortenReplayUrl: function() {
        return this._shortenReplayUrl;
    },
    eatFly: function() {
        if (this._replayMode) {
            if (this._flyItems.length) {
                if (me.game.world.pipeGenerator.generate === this._flyItems[0]) {
                    this._flyItems.shift();
                    return true;
                }
                else {
                    return false;
                }
            }
            return false;
        }
        else {
            return false;
        }
    },
    eatPipe: function() {
        if (this._replayMode) {
            if (this._flyItems.length) {
                return this._pipeItems.shift();
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    },
    init: function(query) {
        var f = query['f'], p = query['p'];
        try {
            if (f && p) {
                this._flyItems = JSON.parse(f);
                this._pipeItems = JSON.parse(p);
            }
            if (this._flyItems && this._pipeItems && this._pipeItems.length) {
                this._replayMode = true;
            }
        } catch (e) {
            console.error("invalid parameters: ", e);
            this._replayMode = false;
        }
    },
    onGameOver: function() {
        var accessToken = '406fb7020b04efb7aeb8edb65705eede2c41a2d3';
        var apiUrl = 'https://api-ssl.bitly.com/v3/shorten';
        var url = apiUrl + '?source=' + accessToken + '&url_long=' + encodeURIComponent(game.siteUrl + '/' + this.queryString());
        var me = this;
        $.getJSON(
            url,
            {},
            function(response) {
                if (200 === response.status_code) {
                    me._shortenReplayUrl = response.data.url;
                }
            }
        );
    },
    reset: function() {
        this._replayMode = false;
        this._flyItems = [];
        this._pipeItems = [];
        this._shortenReplayUrl = null;
    },
    saveFly: function() {
        if (!this._replayMode) {
            this._flyItems.push(me.game.world.pipeGenerator.generate);
        }
    },
    savePipe: function(posY) {
        if (!this._replayMode) {
            this._pipeItems.push(posY);
        }
    },
    queryString: function() {
        query['f'] = JSON.stringify(this._flyItems);
        query['p'] = JSON.stringify(this._pipeItems);
        return query.toString();
    }
};

replayController.init(query);