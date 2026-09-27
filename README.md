# 鼓舞潇湘 · 湖南非遗舞蹈数据库

以一面鼓为门径，走进湖南五个民族的鼓舞档案。首页是可点选的湖南市州地图，鼓落在有记载的土地上；点开之后，同一族分成田野调查、教育转化、舞台展演三条路径。左侧「数智览」对照档案缺口，右侧「寻鼓助手」按这套库回答问题。

这是一个纯静态网站：不需要构建，也不需要后端。用浏览器直接打开 `index.html`，或放到任意静态托管即可。

在线访问：<https://toycar26.github.io/guwu-xiaoxiang/>

仓库地址：<https://github.com/toycar26/guwu-xiaoxiang>

## 收录

| 民族 | 鼓舞 | 鼓 | 主要分布 |
| --- | --- | --- | --- |
| 土家族 | 摆手鼓舞 | 摆手鼓 | 湘西 · 张家界 |
| 苗族 | 跳鼓舞 | 木鼓 · 铜鼓 | 湘西 · 怀化 |
| 瑶族 | 长鼓舞 | 长鼓 | 永州 · 江华 |
| 侗族 | 吹笙挞鼓 | 堂鼓 | 怀化 · 通道 |
| 白族 | 仗鼓舞 | 仗鼓 | 张家界 · 桑植 |

每族目前结构对齐：田野调查 2 则、教育转化 3 节、舞台展演 2 条。条目、地点与说明写在 `js/data.js`。照片和视频只登记了路径，文件放进对应目录后，页面会自动显示；没放之前显示「影像待载入」。

有鼓记载的市州：湘西、张家界、怀化、永州、邵阳、郴州。白族与土家族、苗族与侗族、苗族与瑶族在部分市州重叠。

## 怎么逛

地址用 hash 路由，刷新不会丢页面。

| 地址 | 页面 |
| --- | --- |
| `#/` | 湖南地图与数智览 |
| `#/e/tujia` | 民族页。id 还可以是 `miao`、`yao`、`dong`、`bai` |
| `#/e/tujia/field` | 田野调查 |
| `#/e/tujia/course` | 教育转化 |
| `#/e/tujia/video` | 舞台展演 |

首页可以做这些事：

- 点市州，高亮该地，并在底栏写出这里记了哪些民族。
- 点地图上的鼓，进入该族。
- 右上角「朱 / 靛」切换朱砂与靛蓝两套皮肤，选择记在本机。
- 左侧数智览汇总民族数、有鼓州府、三类条目和图片槽位，并标出档案缺口。
- 「让助手解读这份档案」会把缺口问题交给寻鼓助手。

民族页用三面鼓分别进入三条路径。路径页左侧鼓栏可以在三条路径之间切换。

## 寻鼓助手

助手浮在页面右侧，头像是一枚会随语气变化的情绪球。没配置模型时，它直接检索本站档案，可以回答五面鼓在哪里、当前这一族怎么介绍、三条路径各记了什么、档案还缺什么。回答限定在 `js/data.js` 已有内容里，不会补造村寨、日期或统计数字。

配好大模型之后，同一类问题会交给兼容 OpenAI 的接口，档案文本仍作为依据。支持的服务写在助手设置里：

- DeepSeek
- 通义千问
- OpenRouter
- OpenAI
- 硅基流动
- Moonshot
- 本机 Ollama（`http://localhost:11434/v1`）
- 自定义 Base URL

密钥只存在浏览器本地，不会写进仓库。设置里可以检测模型列表、测试连通，也可以打开语音伴读。

## 本地打开

任意静态服务器都可以。在项目根目录执行下面其中一条，然后打开终端里给出的地址。

```powershell
python -m http.server 8080
```

```powershell
npx --yes serve .
```

直接双击 `index.html` 也能看地图和文案。部分浏览器对本地视频、字体或接口请求更严格，补影像和调用大模型时，用上面的本地服务器更稳。

## 补入影像与条目

民族 id：`tujia`、`miao`、`yao`、`dong`、`bai`。

```text
media/images/{民族id}/field-01.jpg
media/images/{民族id}/field-02.jpg
media/images/{民族id}/field-03.jpg
media/images/{民族id}/poster-01.jpg
media/images/{民族id}/poster-02.jpg
media/videos/{民族id}/course-01.mp4
media/videos/{民族id}/course-02.mp4
media/videos/{民族id}/course-03.mp4
media/videos/{民族id}/01.mp4
media/videos/{民族id}/02.mp4
```

文件名与 `js/data.js` 里 `CONTENT` 的路径一致就会出现。要改标题、地点、日期或说明，直接改这一份数据；首页数智览按条目数量实时汇总。

地图上的族鼓与三条路径的鼓面图在 `media/drums/`，由 `js/drums.js` 引用。

## 目录

```text
index.html              页面骨架，按顺序载入样式与脚本
css/main.css            地图、档案页、数智览
css/assistant.css       寻鼓助手
css/sizes.css           字号与面板尺寸
js/data.js              站点名、五族档案、市州对应关系
js/geo.js               湖南市州路径与鼓的落点
js/app.js               路由、地图交互、三类内容页
js/drums.js             鼓面图片
js/assistant.js         寻鼓助手与大模型配置
js/emotion-ball/        助手头像
assets/hunan.svg        地图源文件
media/drums/            已放入的鼓面图
tools/build_map.py      由边界数据生成 js/geo.js
```

`tools/build_map.py` 读取一份本地 GeoJSON 文本，简化市州轮廓，写出 `js/geo.js` 里的路径、标注位置和鼓坐标。换数据源时改脚本顶部的 `SRC` 路径后再运行。

## 技术

- 原生 HTML、CSS、JavaScript，无框架、无打包。
- 地图是内联 SVG，市州可悬停、点选。
- 皮肤与助手配置使用 `localStorage`。
- 中文衬线字体使用 Google Fonts 上的「马善政」与「Noto Serif SC」，离线时回退到楷体。
