(function () {
  const files = {
    hand: "media/drums/tujia-hand.png?v=4",
    bronze: "media/drums/miao-bronze.png?v=4",
    long: "media/drums/yao-long.png?v=4",
    tower: "media/drums/dong-tang.png?v=4",
    stick: "media/drums/bai-staff.png?v=5",
    rawhide: "media/drums/rawhide.png",
    lacquer: "media/drums/lacquer.png",
    stage: "media/drums/stage.png",
  };

  function src(kind) {
    return files[kind] || files.bronze;
  }

  window.drumInner = function (kind) {
    const href = src(kind);
    return `<image class="drum-img" href="${href}" xlink:href="${href}" x="4" y="4" width="92" height="92" preserveAspectRatio="xMidYMid meet"/>`;
  };

  window.drumSvg = function (kind, className) {
    return `<img class="drum-svg ${className || ""}" src="${src(kind)}" alt="" />`;
  };
})();
