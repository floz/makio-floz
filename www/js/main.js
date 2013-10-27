var Main;

$(window).ready(function() {
  return new Main();
});

Main = (function() {
  function Main() {
    new WeeklyBar();
  }

  return Main;

})();

var WeeklyBar,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

WeeklyBar = (function() {
  WeeklyBar.prototype._$ul = null;

  WeeklyBar.prototype._$li = null;

  function WeeklyBar() {
    this._resizeHandler = __bind(this._resizeHandler, this);
    this._$ul = $("#weekly_bar ul");
    this._$li = $("#weekly_bar li");
    this._$li.css("display", "block");
    this._organize();
    $(window).resize(this._resizeHandler);
  }

  WeeklyBar.prototype._organize = function() {
    var $img, $li, h, li, px, w, wLi, _i, _len, _ref, _results;
    w = $(window).width();
    h = $(window).height();
    this._$ul.width(w);
    wLi = w / this._$li.length;
    px = 0;
    _ref = this._$li;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      li = _ref[_i];
      $li = $(li);
      $li.css({
        "width": wLi + "px",
        "left": px + "px"
      });
      $img = $li.find("img");
      if ($img.width() < wLi) {
        $img.css("width", wLi + "px");
      }
      $img.css({
        "left": wLi - $img.width() >> 1,
        "top": 70 - $img.height()
      });
      _results.push(px += wLi);
    }
    return _results;
  };

  WeeklyBar.prototype._resizeHandler = function() {
    return this._organize();
  };

  return WeeklyBar;

})();
