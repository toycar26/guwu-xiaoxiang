/* 后续把图片放到 media/images/{民族id}/ ，视频放到 media/videos/{民族id}/
   民族id：tujia | miao | yao | dong | bai
   文件名与下方 CONTENT 中的路径一致即可自动出现。
*/
window.SITE = {
  name: "鼓舞潇湘",
  subtitle: "湖南非遗舞蹈数据库",
  skins: {
    cinnabar: { key: "cinnabar", label: "朱" },
    indigo: { key: "indigo", label: "靛" },
  },
};

window.REGION_ETHNICS = {
  xiangxi: ["tujia", "miao"],
  zhangjiajie: ["bai", "tujia"],
  huaihua: ["dong", "miao"],
  yongzhou: ["yao"],
  shaoyang: ["miao", "yao"],
  chenzhou: ["yao"],
};

window.BRANCHES = [
  {
    id: "field",
    name: "田野调查",
    drum: "rawhide",
    line: "走村入寨，记下鼓声从何处起",
  },
  {
    id: "course",
    name: "教育转化",
    drum: "lacquer",
    line: "把步伐与鼓点拆开，再合上",
  },
  {
    id: "video",
    name: "舞台展演",
    drum: "stage",
    line: "鼓面一响，舞便立在场中",
  },
];

window.ETHNICS = {
  tujia: {
    id: "tujia",
    name: "土家族",
    dance: "摆手鼓舞",
    drumName: "摆手鼓",
    glyph: "hand",
    place: "湘西 · 张家界",
    intro: "鼓声落在摆手堂前。土家族以鼓为节，摆手为舞，把祭祀、劳作与团聚写进同一套动作里。",
    note: "西兰卡普的暖色铺底，鼓点沉、步伐稳。",
  },
  miao: {
    id: "miao",
    name: "苗族",
    dance: "跳鼓舞",
    drumName: "木鼓 · 铜鼓",
    glyph: "bronze",
    place: "湘西 · 怀化",
    intro: "苗年与跳鼓相连。木鼓近人，铜鼓近神，银饰一闪，鼓点便把山地的日子敲亮。",
    note: "蜡染的蓝与绣花的红在鼓面上相遇。",
  },
  yao: {
    id: "yao",
    name: "瑶族",
    dance: "长鼓舞",
    drumName: "长鼓",
    glyph: "long",
    place: "永州 · 江华",
    intro: "长鼓细腰，两端蒙皮。江华瑶族把盘王的记忆敲进旋转与蹲踏，鼓横在身前，人便是鼓架。",
    note: "红黑织锦，鼓身如梭。",
  },
  dong: {
    id: "dong",
    name: "侗族",
    dance: "吹笙挞鼓",
    drumName: "堂鼓",
    glyph: "tower",
    place: "怀化 · 通道",
    intro: "鼓楼是村寨的心跳。芦笙与挞鼓把人从吊脚楼下唤到坪上，踩堂一圈，鼓声便把族亲围住。",
    note: "杉木色与鼓楼的朱红同在。",
  },
  bai: {
    id: "bai",
    name: "白族",
    dance: "仗鼓舞",
    drumName: "仗鼓",
    glyph: "stick",
    place: "张家界 · 桑植",
    intro: "桑植白族仗鼓舞，国家级非遗。鼓如杖、舞如征，迁徙路上的勇气被一记一记还留在湘西北。",
    note: "月白衣襟，青扎染，鼓仗相和。",
  },
};

window.CONTENT = {
  tujia: {
    field: [
      {
        title: "摆手堂前的第一通鼓",
        place: "湘西州 · 待补具体村寨",
        date: "日期待载入",
        text: "田野笔记将放在这里：谁在击鼓、鼓如何支起、摆手的圆如何打开。照片与口述待补入。",
        images: ["media/images/tujia/field-01.jpg", "media/images/tujia/field-02.jpg"],
      },
      {
        title: "西兰卡普与鼓点的同一套纹",
        place: "湘西州",
        date: "日期待载入",
        text: "织锦上的几何，常与舞蹈队形相应。补入访谈与纹样照片后，这一则便是入口。",
        images: ["media/images/tujia/field-03.jpg"],
      },
    ],
    course: [
      { title: "鼓点入门：三拍与呼应", duration: "课时待定", src: "media/videos/tujia/course-01.mp4" },
      { title: "摆手基本步：单摆 · 双摆", duration: "课时待定", src: "media/videos/tujia/course-02.mp4" },
      { title: "堂前成圆：完整组合", duration: "课时待定", src: "media/videos/tujia/course-03.mp4" },
    ],
    video: [
      { title: "摆手鼓舞 · 完整场次", src: "media/videos/tujia/01.mp4", poster: "media/images/tujia/poster-01.jpg" },
      { title: "节庆片段", src: "media/videos/tujia/02.mp4", poster: "media/images/tujia/poster-02.jpg" },
    ],
  },
  miao: {
    field: [
      {
        title: "跳鼓的场地与鼓架",
        place: "湘西州 · 待补",
        date: "日期待载入",
        text: "记录木鼓、铜鼓如何入场，谁来开鼓，围观的人站在哪一层。照片与笔记待补入。",
        images: ["media/images/miao/field-01.jpg", "media/images/miao/field-02.jpg"],
      },
      {
        title: "银饰与鼓声的节奏",
        place: "湘西 · 怀化",
        date: "日期待载入",
        text: "银饰的响动有时会叠在鼓点上。待补入服饰特写与音声说明。",
        images: ["media/images/miao/field-03.jpg"],
      },
    ],
    course: [
      { title: "持槌与鼓面分区", duration: "课时待定", src: "media/videos/miao/course-01.mp4" },
      { title: "跳鼓步伐：进退与转身", duration: "课时待定", src: "media/videos/miao/course-02.mp4" },
      { title: "男女对鼓的基本结构", duration: "课时待定", src: "media/videos/miao/course-03.mp4" },
    ],
    video: [
      { title: "苗族鼓舞 · 完整场次", src: "media/videos/miao/01.mp4", poster: "media/images/miao/poster-01.jpg" },
      { title: "木鼓片段", src: "media/videos/miao/02.mp4", poster: "media/images/miao/poster-02.jpg" },
    ],
  },
  yao: {
    field: [
      {
        title: "江华长鼓的形制",
        place: "永州市江华瑶族自治县",
        date: "日期待载入",
        text: "量一量鼓的腰、头、皮，问一问鼓腔里的木从哪座山来。形制与照片待补入。",
        images: ["media/images/yao/field-01.jpg", "media/images/yao/field-02.jpg"],
      },
      {
        title: "盘王节的场图",
        place: "江华",
        date: "日期待载入",
        text: "长鼓舞在节庆中的位置、队列如何走圆，待补入场图与口述。",
        images: ["media/images/yao/field-03.jpg"],
      },
    ],
    course: [
      { title: "横鼓于腹：持鼓与重心", duration: "课时待定", src: "media/videos/yao/course-01.mp4" },
      { title: "击两端：轻重与对答", duration: "课时待定", src: "media/videos/yao/course-02.mp4" },
      { title: "蹲转组合", duration: "课时待定", src: "media/videos/yao/course-03.mp4" },
    ],
    video: [
      { title: "瑶族长鼓舞 · 完整场次", src: "media/videos/yao/01.mp4", poster: "media/images/yao/poster-01.jpg" },
      { title: "盘王节片段", src: "media/videos/yao/02.mp4", poster: "media/images/yao/poster-02.jpg" },
    ],
  },
  dong: {
    field: [
      {
        title: "鼓楼坪上的挞鼓",
        place: "怀化市通道侗族自治县",
        date: "日期待载入",
        text: "鼓楼、芦笙、堂鼓如何共用一块坪。平面图与现场照片待补入。",
        images: ["media/images/dong/field-01.jpg", "media/images/dong/field-02.jpg"],
      },
      {
        title: "踩堂的圆与鼓点",
        place: "通道",
        date: "日期待载入",
        text: "人圈、笙圈、鼓点三层关系，待补入口述。",
        images: ["media/images/dong/field-03.jpg"],
      },
    ],
    course: [
      { title: "堂鼓基本点", duration: "课时待定", src: "media/videos/dong/course-01.mp4" },
      { title: "芦笙与鼓的对位", duration: "课时待定", src: "media/videos/dong/course-02.mp4" },
      { title: "踩堂行进", duration: "课时待定", src: "media/videos/dong/course-03.mp4" },
    ],
    video: [
      { title: "吹笙挞鼓 · 完整场次", src: "media/videos/dong/01.mp4", poster: "media/images/dong/poster-01.jpg" },
      { title: "鼓楼坪片段", src: "media/videos/dong/02.mp4", poster: "media/images/dong/poster-02.jpg" },
    ],
  },
  bai: {
    field: [
      {
        title: "桑植仗鼓的形制与持法",
        place: "张家界市桑植县",
        date: "日期待载入",
        text: "仗鼓何以像杖，舞何以像征。形制、持鼓方式与迁徙口述待补入。",
        images: ["media/images/bai/field-01.jpg", "media/images/bai/field-02.jpg"],
      },
      {
        title: "白族村落里的排练场",
        place: "桑植",
        date: "日期待载入",
        text: "日常排练与节庆上场的差别，待补入调查。",
        images: ["media/images/bai/field-03.jpg"],
      },
    ],
    course: [
      { title: "持仗与击鼓位置", duration: "课时待定", src: "media/videos/bai/course-01.mp4" },
      { title: "步伐：进、踏、转", duration: "课时待定", src: "media/videos/bai/course-02.mp4" },
      { title: "队形与对鼓", duration: "课时待定", src: "media/videos/bai/course-03.mp4" },
    ],
    video: [
      { title: "白族仗鼓舞 · 完整场次", src: "media/videos/bai/01.mp4", poster: "media/images/bai/poster-01.jpg" },
      { title: "桑植节庆片段", src: "media/videos/bai/02.mp4", poster: "media/images/bai/poster-02.jpg" },
    ],
  },
};
