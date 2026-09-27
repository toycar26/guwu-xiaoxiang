# -*- coding: utf-8 -*-
import json
import math
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = r"C:\Users\wjc09\.cursor\projects\c-Users-wjc09-Desktop\agent-tools\23e57cab-c576-4a99-a531-7d51b01b928b.txt"

ID_MAP = {
    "长沙市": "changsha",
    "株洲市": "zhuzhou",
    "湘潭市": "xiangtan",
    "衡阳市": "hengyang",
    "邵阳市": "shaoyang",
    "岳阳市": "yueyang",
    "常德市": "changde",
    "张家界市": "zhangjiajie",
    "益阳市": "yiyang",
    "郴州市": "chenzhou",
    "永州市": "yongzhou",
    "怀化市": "huaihua",
    "娄底市": "loudi",
    "湘西土家族苗族自治州": "xiangxi",
}
SHORT = {
    "长沙市": "长沙",
    "株洲市": "株洲",
    "湘潭市": "湘潭",
    "衡阳市": "衡阳",
    "邵阳市": "邵阳",
    "岳阳市": "岳阳",
    "常德市": "常德",
    "张家界市": "张家界",
    "益阳市": "益阳",
    "郴州市": "郴州",
    "永州市": "永州",
    "怀化市": "怀化",
    "娄底市": "娄底",
    "湘西土家族苗族自治州": "湘西",
}


def simplify(pts, eps):
    if len(pts) < 8:
        return pts

    def dperp(p, a, b):
        x, y = p
        x1, y1 = a
        x2, y2 = b
        dx, dy = x2 - x1, y2 - y1
        if dx == 0 and dy == 0:
            return math.hypot(x - x1, y - y1)
        t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)
        t = max(0, min(1, t))
        return math.hypot(x - (x1 + t * dx), y - (y1 + t * dy))

    def rec(seq):
        if len(seq) <= 2:
            return seq
        a, b = seq[0], seq[-1]
        imax, dmax = 0, 0
        for i in range(1, len(seq) - 1):
            d = dperp(seq[i], a, b)
            if d > dmax:
                imax, dmax = i, d
        if dmax > eps:
            left = rec(seq[: imax + 1])
            right = rec(seq[imax:])
            return left[:-1] + right
        return [a, b]

    closed = pts[0] == pts[-1] or (
        abs(pts[0][0] - pts[-1][0]) < 1e-12 and abs(pts[0][1] - pts[-1][1]) < 1e-12
    )
    core = pts[:-1] if closed else pts
    out = rec(core)
    if closed:
        out.append(out[0])
    return out


def ring_area_centroid(ring):
    a = 0
    cx = 0
    cy = 0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i]
        x2, y2 = ring[i + 1]
        cross = x1 * y2 - x2 * y1
        a += cross
        cx += (x1 + x2) * cross
        cy += (y1 + y2) * cross
    a *= 0.5
    if abs(a) < 1e-12:
        xs = [p[0] for p in ring]
        ys = [p[1] for p in ring]
        return 0, (sum(xs) / len(xs), sum(ys) / len(ys))
    return abs(a), (cx / (6 * a), cy / (6 * a))


def main():
    os.makedirs(os.path.join(ROOT, "assets"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "js"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "css"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "media", "videos"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "media", "images"), exist_ok=True)

    with open(SRC, "r", encoding="utf-8") as f:
        data = json.load(f)

    minx = miny = 999
    maxx = maxy = -999
    for feat in data["features"]:
        for poly in feat["geometry"]["coordinates"]:
            for ring in poly:
                for x, y in ring:
                    minx = min(minx, x)
                    maxx = max(maxx, x)
                    miny = min(miny, y)
                    maxy = max(maxy, y)

    pad, width, height = 48, 720, 860
    scale = min(width / (maxx - minx), height / (maxy - miny))
    offx = (width - (maxx - minx) * scale) / 2 + pad
    offy = (height - (maxy - miny) * scale) / 2 + pad
    vbw = width + pad * 2
    vbh = height + pad * 2

    def proj(lng, lat):
        return (offx + (lng - minx) * scale, offy + (maxy - lat) * scale)

    regions = []
    paths = []
    for feat in data["features"]:
        name = feat["properties"]["name"]
        rid = ID_MAP[name]
        dparts = []
        best_a = -1
        best_c = None
        for poly in feat["geometry"]["coordinates"]:
            ring = simplify([(x, y) for x, y in poly[0]], 0.006)
            area, centroid = ring_area_centroid(poly[0])
            if area > best_a:
                best_a = area
                best_c = centroid
            cmds = []
            for i, (lng, lat) in enumerate(ring):
                x, y = proj(lng, lat)
                cmds.append(("M" if i == 0 else "L") + f"{x:.1f} {y:.1f}")
            cmds.append("Z")
            dparts.append("".join(cmds))
        d = "".join(dparts)
        cx, cy = proj(*best_c)
        regions.append(
            {
                "id": rid,
                "name": SHORT[name],
                "full": name,
                "x": round(cx, 1),
                "y": round(cy, 1),
                "d": d,
            }
        )
        paths.append((rid, SHORT[name], d))

    drums_src = [
        ("tujia", "土家族", "湘西", 109.78, 28.72),
        ("miao", "苗族", "湘西·怀化", 109.95, 28.05),
        ("bai", "白族", "张家界·桑植", 110.38, 29.58),
        ("dong", "侗族", "怀化·通道", 109.72, 26.38),
        ("yao", "瑶族", "永州·江华", 111.62, 25.28),
    ]
    drums = []
    for did, name, place, lng, lat in drums_src:
        x, y = proj(lng, lat)
        drums.append(
            {
                "id": did,
                "name": name,
                "place": place,
                "x": round(x, 1),
                "y": round(y, 1),
            }
        )

    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vbw:.1f} {vbh:.1f}" fill="none">',
        '<g id="hunan-land">',
    ]
    for rid, short, d in paths:
        svg.append(
            f'<path id="region-{rid}" data-id="{rid}" data-name="{short}" class="region" d="{d}"/>'
        )
    svg.append("</g></svg>")
    svg_text = "\n".join(svg) + "\n"
    with open(os.path.join(ROOT, "assets", "hunan.svg"), "w", encoding="utf-8") as f:
        f.write(svg_text)

    geo = {
        "viewBox": [0, 0, round(vbw, 1), round(vbh, 1)],
        "regions": regions,
        "drums": drums,
    }
    with open(os.path.join(ROOT, "js", "geo.js"), "w", encoding="utf-8") as f:
        f.write("window.HUNAN_GEO = ")
        json.dump(geo, f, ensure_ascii=False, indent=2)
        f.write(";\n")

    print("viewBox", vbw, vbh)
    print("svg bytes", len(svg_text))
    print(json.dumps(drums, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
