/*  Acquired \u2014 Home Depot Reel \u00b7 After Effects rebuild
    ------------------------------------------------------------------
    File > Scripts > Run Script File\u2026  \u2192 pick this file.
    (Install the fonts in ../assets/fonts first: Anton, DM Serif Display
    + Italic, Archivo Black, IBM Plex Mono SemiBold/Medium.)

    Builds a fully editable project that mirrors index.html (the
    HyperFrames master): 1080\u00d71920, 30 fps, 67 s.

      HD_Reel_MAIN            \u2190 render this
        \u251c\u2500 S1_Hook \u2026 S9_EndCard   one precomp per script shot
        \u251c\u2500 HOST_PLATE \u00d73          one comp reused for every host beat \u2014
        \u2502                         drop Ben's footage in it ONCE
        \u251c\u2500 CAPTIONS               one text layer per line, orange
        \u2502                         emphasis via Fill Color text animators
        \u251c\u2500 VIGNETTE / GRAIN
        \u2514\u2500 music_temp.wav, sfx.wav + cue markers from the script

    Every number, year and caption is a live text layer; the year
    counter (S4) and $ counter (S6) are Source Text expressions.
    All times below are the script's timecodes (seconds).
*/
(function () {
  app.beginUndoGroup("Build Home Depot Reel");

  var W = 1080, H = 1920, FPS = 30, DUR = 67;
  var AE_DIR = File($.fileName).parent;
  var ROOT = AE_DIR.parent;

  function hex(h) { return [parseInt(h.substr(1, 2), 16) / 255, parseInt(h.substr(3, 2), 16) / 255, parseInt(h.substr(5, 2), 16) / 255]; }
  var C = {
    orange: hex("#F96302"), orangeDeep: hex("#C94D00"), orangeHot: hex("#FF7A1F"), orangePaper: hex("#E55B02"),
    ink: hex("#141414"), inkWarm: hex("#262321"), paper: hex("#EFE8DC"), paperHi: hex("#F6F0E6"), paperLo: hex("#E2D8C6"),
    white: [1, 1, 1], mute: hex("#9E978B"), apple: hex("#BDBDBD"), card: hex("#1D1B19"), line: hex("#3A3632"),
    rowName: hex("#4A4540"), rowBar: hex("#6B645C"), sheet: hex("#FBF8F2"), photo: hex("#F8F4EC"), news: hex("#F4EFE4"), rule: hex("#CFC7B8")
  };
  var F = { anton: "Anton-Regular", serif: "DMSerifDisplay-Regular", ital: "DMSerifDisplay-Italic", caps: "ArchivoBlack-Regular", mono: "IBMPlexMono-SemiBold" };

  // ------------------------------------------------------------ project
  var proj = app.project || app.newProject();
  function folder(name, parent) { var f = proj.items.addFolder(name); if (parent) f.parentFolder = parent; return f; }
  var fRoot = folder("Home Depot Reel");
  var fShots = folder("Shots", fRoot), fParts = folder("Parts", fRoot), fFoot = folder("Footage & Art", fRoot), fAudio = folder("Audio", fRoot);

  function imp(file, into) {
    var f = File(file);
    if (!f.exists) { alert("Missing file:\n" + f.fsName); return null; }
    var it = proj.importFile(new ImportOptions(f));
    it.parentFolder = into;
    return it;
  }
  var ART = {};
  var artFiles = ["host_silhouette", "s2_storefront", "s2_computer", "s4_storefronts_strip", "s6_guilloche", "s7_founder_silhouette", "s8_warehouse", "s8_small_store", "s8_aisles"];
  for (var a = 0; a < artFiles.length; a++) ART[artFiles[a]] = imp(AE_DIR.fsName + "/assets/" + artFiles[a] + ".png", fFoot);
  var MUSIC = imp(ROOT.fsName + "/assets/audio/music_temp.wav", fAudio);
  var SFX = imp(ROOT.fsName + "/assets/audio/sfx.wav", fAudio);

  function comp(name, dur, into, w, h) {
    var c = proj.items.addComp(name, w || W, h || H, 1, dur, FPS);
    c.parentFolder = into || fShots;
    c.bgColor = C.ink;
    return c;
  }

  // ------------------------------------------------------------ properties & keys
  var PN = { pos: "ADBE Position", scale: "ADBE Scale", rot: "ADBE Rotate Z", op: "ADBE Opacity", anchor: "ADBE Anchor Point" };
  function tp(l, n) { return l.property("ADBE Transform Group").property(PN[n]); }
  function base(p) { return p.numKeys ? p.keyValue(p.numKeys) : p.value; }
  function dims(p) {
    var t = p.propertyValueType;
    if (t == PropertyValueType.TwoD) return 2;
    if (t == PropertyValueType.ThreeD) return 3;
    return 1;
  }
  function eases(n, inf) { var r = []; for (var i = 0; i < n; i++) r.push(new KeyframeEase(0, inf)); return r; }
  var EASE = { out: [6, 80], snap: [3, 92], "in": [80, 6], io: [65, 65], soft: [33, 55] };
  // keys: [[t, v], \u2026]  kind: lin | out | snap | in | io | soft | hold
  function K(p, keys, kind) {
    var i, idx = [];
    for (i = 0; i < keys.length; i++) p.setValueAtTime(keys[i][0], keys[i][1]);
    for (i = 0; i < keys.length; i++) idx.push(p.nearestKeyIndex(keys[i][0]));
    for (i = 0; i < idx.length; i++) {
      if (kind == "hold") { p.setInterpolationTypeAtKey(idx[i], KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD); continue; }
      if (kind == "lin" || !kind) { p.setInterpolationTypeAtKey(idx[i], KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR); continue; }
      p.setInterpolationTypeAtKey(idx[i], KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
    }
    if (kind == "hold" || kind == "lin" || !kind) return;
    var n = dims(p), e = EASE[kind];
    for (i = 0; i < idx.length - 1; i++) {
      p.setTemporalEaseAtKey(idx[i], p.keyInTemporalEase(idx[i]), eases(n, e[0]));
      p.setTemporalEaseAtKey(idx[i + 1], eases(n, e[1]), p.keyOutTemporalEase(idx[i + 1]));
    }
  }
  function each(ls, fn) { for (var i = 0; i < ls.length; i++) fn(ls[i]); }
  function fadeIn(l, t, d) { K(tp(l, "op"), [[t, 0], [t + (d || 0.3), 100]], "out"); }
  function fadeTo(l, t, v, d) { var p = tp(l, "op"); K(p, [[t, base(p)], [t + (d || 0.2), v]], "lin"); }
  function fadeUp(l, t, dy, d) {
    d = d || 0.3; var p = tp(l, "pos"), b = base(p);
    K(p, [[t, [b[0], b[1] + dy]], [t + d, b]], "out");
    fadeIn(l, t, d * 0.8);
  }
  function slideX(l, t, dx, d) { d = d || 0.3; var p = tp(l, "pos"), b = base(p); K(p, [[t, [b[0] + dx, b[1]]], [t + d, b]], "out"); fadeIn(l, t, d * 0.8); }
  function slam(l, t, s0, d) { d = d || 0.22; K(tp(l, "scale"), [[t, [s0, s0]], [t + d, [100, 100]]], "snap"); K(tp(l, "op"), [[t, 0], [t + d * 0.45, 100]], "lin"); }
  function back(l, t, s0, d) { d = d || 0.35; K(tp(l, "scale"), [[t, [s0, s0]], [t + d * 0.65, [106, 106]], [t + d, [100, 100]]], "out"); K(tp(l, "op"), [[t, 0], [t + d * 0.4, 100]], "lin"); }
  function drift(l, t0, t1, s) { K(tp(l, "scale"), [[t0, [100, 100]], [t1, [s, s]]], "lin"); }
  function span(l, t0, t1) { l.inPoint = t0; l.outPoint = t1; return l; }
  function parentTo(kids, p) { for (var i = 0; i < kids.length; i++) kids[i].parent = p; }

  // ------------------------------------------------------------ layer builders
  function txt(c, s, o) {
    var l = c.layers.addText(s);
    var sp = l.property("ADBE Text Properties").property("ADBE Text Document");
    var d = sp.value;
    d.resetCharStyle();
    d.font = o.font; d.fontSize = o.size; d.applyFill = true; d.fillColor = o.color || C.white; d.applyStroke = false;
    d.tracking = o.track || 0;
    d.justification = ParagraphJustification.CENTER_JUSTIFY;
    if (o.leading) { d.autoLeading = false; d.leading = o.leading; }
    sp.setValue(d);
    l.name = o.name || s.replace(/[\r\n]/g, " ").substr(0, 28);
    var r = l.sourceRectAtTime(0, false);
    tp(l, "anchor").setValue([r.left + r.width / 2, r.top + r.height / 2]);
    var x = o.x === undefined ? W / 2 : o.x;
    if (o.align == "l") x += r.width / 2;
    if (o.align == "r") x -= r.width / 2;
    tp(l, "pos").setValue([x, o.y]);
    if (o.rot) tp(l, "rot").setValue(o.rot);
    return l;
  }
  // colour a word range (0-based, end exclusive) with a Fill Color text animator
  function colorWords(l, w0, w1, col) {
    var anims = l.property("ADBE Text Properties").property("ADBE Text Animators");
    var idx = anims.addProperty("ADBE Text Animator").propertyIndex;
    anims.property(idx).name = "Emphasis";
    anims.property(idx).property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
    anims.property(idx).property("ADBE Text Animator Properties").property("ADBE Text Fill Color").setValue(col);
    anims.property(idx).property("ADBE Text Selectors").addProperty("ADBE Text Selector");
    var sel = anims.property(idx).property("ADBE Text Selectors").property(1);
    sel.property("ADBE Text Range Advanced").property("ADBE Text Range Units").setValue(2); // index
    sel.property("ADBE Text Range Advanced").property("ADBE Text Range Type2").setValue(3); // words
    sel.property("ADBE Text Index Start").setValue(w0);
    sel.property("ADBE Text Index End").setValue(w1);
  }
  function shapeLayer(c, name) {
    var l = c.layers.addShape(); l.name = name;
    tp(l, "pos").setValue([0, 0]);
    return l;
  }
  function addPaint(v, fill, stroke, sw) {
    if (stroke) {
      var s = v.addProperty("ADBE Vector Graphic - Stroke");
      s.property("ADBE Vector Stroke Color").setValue(stroke);
      s.property("ADBE Vector Stroke Width").setValue(sw || 3);
      s.property("ADBE Vector Stroke Line Cap").setValue(2);
      s.property("ADBE Vector Stroke Line Join").setValue(2);
    }
    if (fill) v.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(fill);
  }
  // rectangle centred on (x, y); ox/oy shift the shape inside the layer so
  // the layer's anchor (0,0) can sit on an edge for scale-from-edge wipes
  function rect(c, name, w, h, x, y, fill, stroke, sw, ox, oy) {
    var l = c.layers.addShape(); l.name = name;
    var v = l.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group").property("ADBE Vectors Group");
    var r = v.addProperty("ADBE Vector Shape - Rect");
    r.property("ADBE Vector Rect Size").setValue([w, h]);
    r.property("ADBE Vector Rect Position").setValue([ox || 0, oy || 0]);
    addPaint(v, fill, stroke, sw);
    tp(l, "pos").setValue([x, y]);
    return l;
  }
  function ellipse(c, name, d, x, y, fill, stroke, sw) {
    var l = c.layers.addShape(); l.name = name;
    var v = l.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group").property("ADBE Vectors Group");
    v.addProperty("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").setValue([d, d]);
    addPaint(v, fill, stroke, sw);
    tp(l, "pos").setValue([x, y]);
    return l;
  }
  function path(c, name, pts, stroke, sw, opts) {
    opts = opts || {};
    var l = shapeLayer(c, name);
    var v = l.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group").property("ADBE Vectors Group");
    var sh = new Shape(); sh.vertices = pts; sh.closed = !!opts.closed;
    v.addProperty("ADBE Vector Shape - Group").property("ADBE Vector Shape").setValue(sh);
    if (opts.glow) addPaint(v, null, stroke, opts.glow);
    addPaint(v, opts.fill, stroke, sw);
    if (opts.glow) v.property(2).property("ADBE Vector Stroke Opacity").setValue(18);
    if (opts.trim) v.addProperty("ADBE Vector Filter - Trim");
    return l;
  }
  function trimEnd(l) { return l.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property("ADBE Vector Filter - Trim").property("ADBE Vector Trim End"); }
  function solid(c, name, col, w, h) { return c.layers.addSolid(col, name, w || W, h || H, 1); }
  function ramp(l, p0, c0, p1, c1, radial) {
    var e = l.property("ADBE Effect Parade").addProperty("ADBE Ramp");
    e.property(1).setValue(p0); e.property(2).setValue(c0); e.property(3).setValue(p1); e.property(4).setValue(c1); e.property(5).setValue(radial ? 2 : 1);
  }
  function bgInk(c) { var s = solid(c, "BG ink", C.ink); ramp(s, [540, 670], C.inkWarm, [540, 1900], C.ink, true); s.locked = true; return s; }
  function bgPaper(c) { var s = solid(c, "BG paper", C.paper); ramp(s, [540, 770], C.paperHi, [540, 2100], C.paperLo, true); s.locked = true; return s; }
  function img(c, item, x, y, name) { var l = c.layers.add(item); tp(l, "pos").setValue([x, y]); if (name) l.name = name; return l; }
  function shadow(l) { var e = l.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow"); e.property(4).setValue(18); e.property(5).setValue(40); }
  function rig(c, name, x, y) { var n = c.layers.addNull(); n.name = name; tp(n, "anchor").setValue([x, y]); tp(n, "pos").setValue([x, y]); return n; }
  // text inside a filled box; returns [box, text] with the text parented to the box
  function boxed(c, s, o, boxCol, padX, padY, strokeOnly) {
    var t = txt(c, s, o);
    var r = t.sourceRectAtTime(0, false);
    var b = strokeOnly ? rect(c, (o.name || s) + " box", r.width + padX * 2, r.height + padY * 2, o.x === undefined ? W / 2 : o.x, o.y, null, boxCol, strokeOnly)
                       : rect(c, (o.name || s) + " box", r.width + padX * 2, r.height + padY * 2, o.x === undefined ? W / 2 : o.x, o.y, boxCol);
    b.moveAfter(t);
    t.parent = b;
    return [b, t];
  }
  function masthead(c, label, onPaper) {
    var col = onPaper ? C.ink : C.paper;
    var ls = [
      rect(c, "Masthead rule top", 900, 3, 540, 197.5, col),
      rect(c, "Masthead rule bottom", 900, 1, 540, 259.5, col),
      rect(c, "Masthead dot", 14, 14, 97, 228, C.orange),
      txt(c, "ACQUIRED", { font: F.mono, size: 22, color: col, track: 140, x: 121, y: 228, align: "l", name: "Masthead \u00b7 show" }),
      txt(c, label, { font: F.mono, size: 22, color: col, track: 140, y: 228, name: "Masthead \u00b7 chapter" }),
      txt(c, "HOME DEPOT", { font: F.mono, size: 22, color: col, track: 140, x: 990, y: 228, align: "r", name: "Masthead \u00b7 episode" })
    ];
    return ls;
  }

  // ===================================================== HOST PLATE (placeholder)
  var host = comp("HOST_PLATE  \u2190 drop Ben's footage here", DUR, fParts);
  var hb = solid(host, "PLACEHOLDER bg", C.ink); ramp(hb, [670, 730], hex("#4A3526"), [670, 1900], hex("#0E0C0B"), true);
  var rim = solid(host, "PLACEHOLDER orange rim light", C.orange, 700, 900);
  tp(rim, "pos").setValue([990, 710]); tp(rim, "op").setValue(55);
  var rm = rim.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
  var es = new Shape(); var k = 0.5523;
  es.vertices = [[350, 0], [700, 450], [350, 900], [0, 450]];
  es.inTangents = [[-350 * k, 0], [0, -450 * k], [350 * k, 0], [0, 450 * k]];
  es.outTangents = [[350 * k, 0], [0, 450 * k], [-350 * k, 0], [0, -450 * k]];
  es.closed = true;
  rm.property("ADBE Mask Shape").setValue(es); rm.property("ADBE Mask Feather").setValue([300, 300]);
  img(host, ART.host_silhouette, 540, 970, "PLACEHOLDER host silhouette");
  ellipse(host, "REC dot", 18, 790, 312, hex("#FF3B30"));
  txt(host, "HOST CAM", { font: F.mono, size: 22, color: C.paper, track: 140, x: 810, y: 312, align: "l" });
  boxed(host, "BEN", { font: F.mono, size: 24, color: C.ink, track: 140, x: 133, y: 1206, name: "Name tag \u00b7 host" }, C.orange, 18, 12);
  boxed(host, "ACQUIRED", { font: F.mono, size: 24, color: C.ink, track: 140, x: 257, y: 1206, name: "Name tag \u00b7 show" }, C.paper, 18, 12);
  var gt = txt(host, "DROP BEN'S FOOTAGE ON TOP \u2014 then switch off the PLACEHOLDER layers", { font: F.mono, size: 22, color: C.orange, y: 1700, name: "GUIDE (not rendered)" });
  gt.guideLayer = true;

  // ===================================================== S1 \u00b7 HOOK 0\u20134 (graphics over host)
  var s1 = comp("S1_Hook  00:00\u201300:04", 4);
  var s1a = txt(s1, "This is a", { font: F.ital, size: 96, color: C.paper, y: 610 });
  var s1b = txt(s1, "CRAZY STAT", { font: F.anton, size: 196, color: C.white, y: 760 });
  var s1bar = rect(s1, "Underline bar", 820, 22, 130, 880, C.orange, null, 0, 410, 0);
  fadeUp(s1a, 0.7, 30);
  slam(s1b, 1.0, 145, 0.22); // lands on the 00:01 impact
  K(tp(s1bar, "scale"), [[1.08, [0, 100]], [1.38, [100, 100]]], "snap");
  K(tp(s1b, "pos"), [[1.0, [534, 760]], [1.05, [546, 760]], [1.1, [536, 760]], [1.15, [540, 760]]], "lin");

  // ===================================================== S2 \u00b7 SETUP 4\u201310
  var s2 = comp("S2_Setup  00:04\u201300:10", 6);
  bgInk(s2);
  var L = rect(s2, "Panel \u00b7 Home Depot", 540, 1920, 270, 960, C.orange);
  var Lk = [
    txt(s2, "HOME DEPOT \u00b7 IPO", { font: F.mono, size: 34, color: C.ink, track: 140, x: 270, y: 540 }),
    txt(s2, "ARCHIVAL \u00b7 STOREFRONT", { font: F.mono, size: 18, color: C.ink, track: 140, x: 270, y: 870 })
  ];
  var y81 = txt(s2, "1981", { font: F.anton, size: 250, color: C.white, x: 270, y: 705 });
  var store = img(s2, ART.s2_storefront, 270, 1050, "Archival storefront (swap for photo)");
  parentTo(Lk.concat([y81, store]), L);
  var R = rect(s2, "Panel \u00b7 Apple", 540, 1920, 810, 960, C.ink);
  var Rk = [
    txt(s2, "APPLE \u00b7 IPO", { font: F.mono, size: 34, color: C.paper, track: 140, x: 810, y: 540 }),
    txt(s2, "ARCHIVAL \u00b7 COMPUTER", { font: F.mono, size: 18, color: C.paper, track: 140, x: 810, y: 870 })
  ];
  var y80 = txt(s2, "1980", { font: F.anton, size: 250, color: C.orange, x: 810, y: 705 });
  var compArt = img(s2, ART.s2_computer, 810, 1050, "Vintage computer (swap for footage)");
  parentTo(Rk.concat([y80, compArt]), R);
  var seam = rect(s2, "Seam", 12, 1920, 540, 0, C.paper, null, 0, 0, 960);
  var pillShadow = rect(s2, "VS pill shadow", 640, 110, 540, 367, C.ink);
  var pill = boxed(s2, "Home Depot vs. Apple", { font: F.serif, size: 64, color: C.ink, y: 355, name: "VS title" }, C.paper, 34, 20);
  colorWords(pill[1], 2, 3, C.orange);
  K(tp(L, "pos"), [[0, [-270, 960]], [0.33, [270, 960]]], "snap");
  K(tp(R, "pos"), [[0, [1350, 960]], [0.33, [810, 960]]], "snap");
  K(tp(seam, "scale"), [[0.12, [100, 0]], [0.42, [100, 100]]], "snap");
  each([pill[0], pillShadow], function (l) { fadeUp(l, 0.3, -30); }); fadeIn(pill[1], 0.3, 0.24);
  fadeUp(y81, 0.9, 60, 0.35);  // "1981"
  fadeUp(y80, 2.9, 60, 0.35);  // "Apple"
  fadeUp(store, 0.5, 40, 0.5); drift(store, 1.0, 6.0, 108);
  fadeUp(compArt, 2.6, 40, 0.5); drift(compArt, 2.6, 6.0, 106);
  masthead(s2, "02 \u00b7 THE SETUP", false);

  // ===================================================== S3 \u00b7 COMPARISON 10\u201321
  var s3 = comp("S3_Comparison  00:10\u201300:21", 11);
  bgInk(s3);
  each([[840], [970], [1100]], function (g) { rect(s3, "Grid", 900, 1, 540, g[0], C.line); });
  rect(s3, "Baseline", 900, 3, 540, 1210, C.paper);
  txt(s3, "IPO", { font: F.mono, size: 18, color: C.mute, track: 110, x: 90, y: 1194, align: "l" });
  txt(s3, "TODAY", { font: F.mono, size: 18, color: C.mute, track: 110, x: 990, y: 1194, align: "r" });
  txt(s3, "ILLUSTRATIVE \u00b7 CLAIM AS STATED IN THE EPISODE", { font: F.mono, size: 16, color: C.mute, track: 120, x: 90, y: 698, align: "l" });
  // illustrative curves \u2014 Home Depot crosses Apple at x = 0.9 (local 8.2 s)
  function sm(a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function apY(x) { return 0.944 * Math.pow(x, 0.85) + 0.035 * Math.sin(x * 23) * (1 - sm(0.55, 0.75, x)); }
  function hdY(x) { return Math.pow(x, 1.4) + 0.025 * Math.sin(x * 31 + 1) * (1 - sm(0.5, 0.72, x)); }
  function pt(x, y) { return [90 + x * 900, 1210 - y * 460]; }
  function curve(fn) { var a = []; for (var i = 0; i <= 120; i++) a.push(pt(i / 120, fn(i / 120))); return a; }
  var lineAp = path(s3, "Line \u00b7 Apple", curve(apY), C.apple, 9);
  var lineHd = path(s3, "Line \u00b7 Home Depot", curve(hdY), C.orange, 9);
  each([lineAp, lineHd], function (l) { // left-to-right reveal (mask), linear 1.0 \u2192 9.0
    var m = l.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
    function box(w) { var s = new Shape(); s.vertices = [[80, 690], [80 + w, 690], [80 + w, 1230], [80, 1230]]; s.closed = true; return s; }
    K(m.property("ADBE Mask Shape"), [[1.0, box(0)], [9.0, box(920)]], "lin");
  });
  var dAp = ellipse(s3, "Head \u00b7 Apple", 26, 90, 1210, C.apple);
  var dHd = ellipse(s3, "Head \u00b7 Home Depot", 30, 90, 1210, C.orange, C.ink, 4);
  var kAp = [], kHd = [];
  for (var i = 0; i <= 40; i++) { var x = i / 40; kAp.push([1.0 + x * 8, pt(x, apY(x))]); kHd.push([1.0 + x * 8, pt(x, hdY(x))]); }
  K(tp(dAp, "pos"), kAp, "lin"); K(tp(dHd, "pos"), kHd, "lin");
  K(tp(dHd, "scale"), [[8.2, [100, 100]], [8.32, [173, 173]], [8.44, [100, 100]]], "out");
  // cards
  function card(x, name, yr, col, stroke) {
    var b = rect(s3, "Card \u00b7 " + name, 430, 230, x, 555, C.card, stroke, 3);
    var ks = [
      txt(s3, "IPO " + yr + " \u00b7 INVESTED", { font: F.mono, size: 20, color: C.paper, track: 140, x: x - 187, y: 478, align: "l" }),
      txt(s3, name.toUpperCase(), { font: F.anton, size: 34, color: col, x: x - 187, y: 518, align: "l" }),
      txt(s3, "$1,000", { font: F.anton, size: 104, color: C.paper, x: x - 187, y: 600, align: "l" })
    ];
    return [b].concat(ks);
  }
  var cHd = card(305, "Home Depot", 1981, C.orange, C.orange);
  var cAp = card(775, "Apple", 1980, C.apple, C.line);
  each(cHd, function (l) { slideX(l, 0.4, -80, 0.4); });
  each(cAp, function (l) { slideX(l, 0.55, 80, 0.4); fadeTo(l, 8.3, 45, 0.3); });
  var stamp = boxed(s3, "WINNER", { font: F.mono, size: 26, color: C.ink, track: 140, x: 462, y: 438, rot: 0 }, C.orange, 18, 8);
  tp(stamp[0], "rot").setValue(-6);
  K(tp(stamp[0], "rot"), [[8.2, -14], [8.45, -6]], "snap"); slam(stamp[0], 8.2, 200, 0.25); fadeIn(stamp[1], 8.2, 0.1);
  var h1 = txt(s3, "$1,000 IN EACH IPO", { font: F.anton, size: 92, color: C.paper, y: 338 });
  colorWords(h1, 3, 4, C.orange);
  fadeUp(h1, 0.3, 30); fadeTo(h1, 7.9, 0, 0.15);
  var h2 = txt(s3, "HOME DEPOT BEAT APPLE", { font: F.anton, size: 92, color: C.paper, y: 338 });
  colorWords(h2, 2, 3, C.orange);
  slam(h2, 8.0, 130, 0.25); // reveal held for the spoken "Home Depot"
  var tick = txt(s3, "HD \u25b2 IPO 1981     $1,000 INVESTED     AAPL \u25b2 IPO 1980     $1,000 INVESTED     HD \u25b2 IPO 1981     $1,000 INVESTED     AAPL \u25b2 IPO 1980     $1,000 INVESTED     HD \u25b2 IPO 1981     $1,000 INVESTED     AAPL \u25b2 IPO 1980", { font: F.mono, size: 22, color: C.mute, track: 140, x: 0, y: 1259, align: "l", name: "Ticker tape" });
  var tb = base(tp(tick, "pos")); K(tp(tick, "pos"), [[0, tb], [11, [tb[0] - 1800, tb[1]]]], "lin");
  masthead(s3, "03 \u00b7 THE COMPARISON", false);

  // ===================================================== S4 \u00b7 COMPOUNDING 21\u201331
  var s4 = comp("S4_Compounding  00:21\u201300:31", 10);
  bgInk(s4);
  var strip = img(s4, ART.s4_storefronts_strip, 1600, 1150, "Storefronts 1981 \u2192 today");
  K(tp(strip, "pos"), [[0, [1600, 1150]], [9.6, [-500, 1150]]], "in"); fadeIn(strip, 0, 0.6);
  var cpts = [];
  for (var j = 0; j <= 120; j++) { var xx = j / 120, yy = (Math.pow(1.25, xx * 45) - 1) / (Math.pow(1.25, 45) - 1); cpts.push([40 + xx * 1000, 260 + 1000 - Math.pow(yy, 0.32) * 960]); }
  var cv = path(s4, "Compound curve", cpts, C.orange, 12, { glow: 40, trim: true });
  K(trimEnd(cv), [[0, 0], [9.4, 100]], "in");
  var chips = [];
  for (var c4 = 0; c4 < 12; c4++) {
    var st = 0.4 + 9.0 * Math.pow(c4 / 12, 0.6);
    var ch = txt(s4, "+25%", { font: F.mono, size: 30, color: C.orange, track: 140, x: 140 + ((c4 * 337) % 800), y: 1200, name: "Chip +25% " + (c4 + 1) });
    K(tp(ch, "pos"), [[st, [140 + ((c4 * 337) % 800), 1200]], [st + 1.6 - c4 * 0.05, [140 + ((c4 * 337) % 800), 440]]], "in");
    K(tp(ch, "op"), [[st, 0], [st + 0.2, 80], [st + 1.3 - c4 * 0.05, 80], [st + 1.55 - c4 * 0.05, 0]], "lin");
  }
  rect(s4, "Year box", 380, 110, 540, 351, null, C.paper, 3);
  txt(s4, "YEAR", { font: F.mono, size: 22, color: C.paper, track: 140, x: 370, y: 362, align: "l" });
  var yr = txt(s4, "1981", { font: F.mono, size: 84, color: C.paper, track: 40, x: 585, y: 351, name: "Year counter (expression)" });
  yr.property("ADBE Text Properties").property("ADBE Text Document").expression =
    "var p = Math.min(1, Math.max(0, (time - 0.2) / 9.3));\n'' + (1981 + Math.round(45 * Math.pow(p, 1.6)));";
  var k1 = txt(s4, "EVERY DIVIDEND", { font: F.mono, size: 26, color: C.orange, track: 140, y: 575 });
  var k2 = txt(s4, "reinvested", { font: F.serif, size: 104, color: C.paper, y: 660 });
  each([k1, k2], function (l) { fadeUp(l, 0.6, 20); fadeTo(l, 4.8, 0, 0.2); });
  var nearly = txt(s4, "Nearly", { font: F.ital, size: 110, color: C.paper, y: 525 });
  var p25 = txt(s4, "25%", { font: F.anton, size: 440, color: C.orange, y: 774, name: "25% \u2014 largest element" });
  var ayear = txt(s4, "A YEAR", { font: F.anton, size: 118, color: C.white, y: 1025 });
  fadeUp(nearly, 4.9, 30); back(p25, 5.4, 40, 0.35); fadeUp(ayear, 6.4, 30);
  drift(p25, 5.75, 10, 104);
  var y45 = boxed(s4, "FOR 45 YEARS", { font: F.anton, size: 96, color: C.ink, y: 1205 }, C.orange, 34, 10);
  K(tp(y45[0], "scale"), [[7.4, [20, 100]], [7.7, [100, 100]]], "snap"); fadeIn(y45[0], 7.4, 0.15); fadeIn(y45[1], 7.4, 0.15);
  masthead(s4, "04 \u00b7 COMPOUNDING", false);

  // ===================================================== S5 \u00b7 NUMBER ONE 31\u201342
  // ranking list lives in its own comps so it can scroll inside a window
  var list = comp("S5_list_rows", 11, fParts, 900, 3840);
  for (var r5 = 0; r5 < 40; r5++) {
    var ry = r5 * 96 + 48;
    txt(list, "#" + (500 - r5 * 12), { font: F.mono, size: 34, color: C.paper, track: 100, x: 12, y: ry, align: "l" });
    rect(list, "Name (redacted)", 180 + ((r5 * 97) % 220), 26, 138 + (180 + ((r5 * 97) % 220)) / 2, ry, C.rowName);
    rect(list, "Bar", 60 + ((r5 * 53) % 160), 14, 888 - (60 + ((r5 * 53) % 160)) / 2, ry, C.rowBar);
    rect(list, "Divider", 900, 1, 450, ry + 47.5, C.line);
  }
  var win = comp("S5_list_window", 11, fParts, 900, 760);
  var lst = win.layers.add(list);
  K(tp(lst, "pos"), [[0, [450, 1920]], [3.8, [450, -1080]]], "in");
  var s5 = comp("S5_NumberOne  00:31\u201300:42", 11);
  bgInk(s5);
  var A = [];
  A.push(txt(s5, "The S&P 500", { font: F.serif, size: 96, color: C.paper, y: 340 }));
  A.push(txt(s5, "TOTAL RETURN \u00b7 IPO TO TODAY", { font: F.mono, size: 22, color: C.orange, track: 140, y: 420 }));
  fadeUp(A[0], 0.1, 24); fadeUp(A[1], 0.1, 24);
  var wl = s5.layers.add(win); tp(wl, "pos").setValue([540, 860]); A.push(wl);
  var blur = wl.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
  K(blur.property(1), [[0, 0], [3.8, 3]], "in");
  A.push(rect(s5, "Window rule top", 900, 3, 540, 481.5, C.paper));
  A.push(rect(s5, "Window rule bottom", 900, 3, 540, 1238.5, C.paper));
  var row = rect(s5, "Home Depot row", 900, 96, 540, 528, C.orange);
  var rowK = [
    txt(s5, "#?", { font: F.mono, size: 34, color: C.ink, track: 100, x: 102, y: 528, align: "l" }),
    txt(s5, "HOME DEPOT", { font: F.anton, size: 56, color: C.ink, x: 228, y: 528, align: "l" }),
    txt(s5, "\u25b2 RISING", { font: F.mono, size: 22, color: C.ink, track: 140, x: 978, y: 528, align: "r" })
  ];
  parentTo(rowK, row);
  K(tp(row, "pos"), [[1.6, [540, 1288]], [1.9, [540, 1192]], [2.6, [540, 1192]], [4.0, [540, 528]]], "io");
  each([row].concat(rowK), function (l) { fadeIn(l, 1.6, 0.25); });
  fadeTo(rowK[0], 3.9, 0, 0.1);
  A = A.concat([row]).concat(rowK);
  each(A, function (l) { l.outPoint = 5.9; }); // host cut-back 35.6\u201336.9 covers the hand-off
  var B = rig(s5, "B rig (upward move)", 540, 960);
  var Bk = [];
  Bk.push(txt(s5, "HOME DEPOT", { font: F.anton, size: 120, color: C.paper, y: 355 }));
  var seal = shapeLayer(s5, "#1 seal"); tp(seal, "pos").setValue([540, 750]);
  var sv = seal.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group").property("ADBE Vectors Group");
  var star = sv.addProperty("ADBE Vector Shape - Star");
  star.property("ADBE Vector Star Type").setValue(1); star.property("ADBE Vector Star Points").setValue(36);
  star.property("ADBE Vector Star Inner Radius").setValue(252); star.property("ADBE Vector Star Outer Radius").setValue(278);
  addPaint(sv, C.orange);
  Bk.push(seal);
  var ring1 = ellipse(s5, "Seal ring", 428, 540, 750, null, C.ink, 6), ring2 = ellipse(s5, "Seal ring inner", 392, 540, 750, null, C.ink, 2);
  parentTo([ring1, ring2], seal);
  var one = txt(s5, "#1", { font: F.anton, size: 300, color: C.ink, y: 750 }); Bk.push(one);
  var tr = txt(s5, "TOTAL RETURN", { font: F.anton, size: 132, color: C.white, y: 1122 }); Bk.push(tr);
  var ipo = txt(s5, "SINCE ITS IPO", { font: F.mono, size: 56, color: C.orange, track: 140, y: 1226, name: "Support line (\u2248 half size)" }); Bk.push(ipo);
  parentTo(Bk, B);
  each(Bk.concat([ring1, ring2]), function (l) { l.inPoint = 5.9; });
  K(tp(B, "pos"), [[5.9, [540, 1660]], [6.32, [540, 960]]], "snap");
  K(tp(seal, "scale"), [[6.15, [30, 30]], [6.47, [106, 106]], [6.65, [100, 100]]], "out");
  K(tp(seal, "rot"), [[6.15, -90], [6.65, 0], [11, 40]], "out");
  slam(one, 6.3, 160, 0.25); fadeUp(tr, 6.6, 40); fadeUp(ipo, 7.0, 20);
  masthead(s5, "05 \u00b7 NUMBER ONE", false);

  // ===================================================== S6 \u00b7 PAYOFF 42\u201349
  var s6 = comp("S6_Payoff  00:42\u201300:49", 7);
  bgInk(s6);
  var g6 = img(s6, ART.s6_guilloche, 540, 900, "Certificate guilloche");
  tp(g6, "op").setValue(22);
  K(tp(g6, "rot"), [[0, 0], [7, 12]], "lin"); drift(g6, 0, 7, 112);
  var bo = rect(s6, "Certificate border", 960, 1390, 540, 865, null, C.orange, 3); tp(bo, "op").setValue(60);
  var bi = rect(s6, "Certificate border inner", 928, 1358, 540, 865, null, C.orange, 1); tp(bi, "op").setValue(35);
  var f1 = txt(s6, "INVESTED AT THE IPO", { font: F.mono, size: 30, color: C.paper, track: 140, y: 345 });
  var f2 = txt(s6, "$1,000 \u2192", { font: F.anton, size: 120, color: C.paper, y: 437 });
  colorWords(f2, 1, 2, C.orange);
  each([f1, f2], function (l) { fadeUp(l, 0.1, 30); fadeTo(l, 4.0, 35, 0.3); });
  var cnt = txt(s6, "$1,000", { font: F.anton, size: 178, color: C.white, y: 762, name: "Counter $1,000 \u2192 $17,000,000 (expression)" });
  cnt.property("ADBE Text Properties").property("ADBE Text Document").expression =
    "var p = Math.min(1, Math.max(0, (time - 0.5) / 3.45));\n" +
    "var v = Math.round(1000 * Math.pow(17000, Math.pow(p, 2.2)));\n" +
    "'$' + v.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');";
  fadeIn(cnt, 0.4, 0.2); cnt.outPoint = 4.0;
  var cb = cnt.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
  K(cb.property(1), [[3.6, 0], [3.95, 6]], "in");
  var dim = solid(s6, "Music-drop dim", [0, 0, 0]); K(tp(dim, "op"), [[3.6, 0], [3.9, 45]], "lin"); span(dim, 3.6, 4.0);
  var m17 = txt(s6, "$17", { font: F.anton, size: 540, color: C.orange, y: 787, name: "$17 \u2014 largest element" });
  var mil = txt(s6, "MILLION", { font: F.anton, size: 196, color: C.white, y: 1110 });
  each([m17, mil], function (l) { l.inPoint = 4.0; slam(l, 4.0, 135, 0.3); drift(l, 4.3, 7.0, 105); });
  var fl = solid(s6, "Bass-hit flash", C.orange); span(fl, 4.0, 4.5); K(tp(fl, "op"), [[4.0, 85], [4.45, 0]], "out");
  masthead(s6, "06 \u00b7 THE PAYOFF", false);

  // ===================================================== S7 \u00b7 STORY TEASE 49\u201358 (paper)
  var s7 = comp("S7_Story  00:49\u201300:58", 9);
  bgPaper(s7);
  // A \u00b7 founders (longest holds)
  var RA = rig(s7, "A rig (slow push)", 540, 960);
  var kick7 = txt(s7, "The unlikely story", { font: F.ital, size: 76, color: C.ink, y: 338 });
  fadeUp(kick7, 0.4, 20, 0.8);
  function photo(x, y, rot, name, t0) {
    var fr = rect(s7, "Photo frame \u00b7 " + name, 420, 560, x, y, C.photo); shadow(fr);
    var im = solid(s7, "PHOTO SLOT \u00b7 " + name + " (replace with archival still)", hex("#7D6A55"), 384, 472);
    ramp(im, [192, 165], hex("#B9A48A"), [192, 520], hex("#4B3F33"), true);
    tp(im, "pos").setValue([x, y - 26]);
    var sil = img(s7, ART.s7_founder_silhouette, x, y - 26, "Placeholder silhouette \u00b7 " + name);
    var nm = txt(s7, name.toUpperCase(), { font: F.mono, size: 20, color: C.ink, track: 140, x: x, y: y + 252 });
    parentTo([im, sil, nm], fr);
    tp(fr, "rot").setValue(rot);
    K(tp(fr, "pos"), [[t0, [x, y + 60]], [t0 + 1.0, [x, y]]], "soft");
    K(tp(fr, "rot"), [[t0, rot * 2], [t0 + 1.0, rot]], "soft");
    each([fr, im, sil, nm], function (l) { fadeIn(l, t0, 0.8); });
    return [fr, im, sil, nm];
  }
  var P1 = photo(306, 710, -3, "Bernie Marcus", 0.2), P2 = photo(774, 750, 3, "Arthur Blank", 0.7);
  parentTo([kick7, P1[0], P2[0]], RA);
  drift(RA, 0, 4.9, 107);
  each([kick7].concat(P1).concat(P2), function (l) { l.outPoint = 4.8; });
  // B \u00b7 termination letter + FIRED stamp
  var letter = rect(s7, "Letter", 780, 860, 540, 810, C.sheet); shadow(letter);
  var lk = [
    txt(s7, "PERSONNEL \u00b7 NOTICE", { font: F.mono, size: 22, color: C.ink, track: 140, x: 214, y: 455, align: "l" }),
    txt(s7, "Re: Your employment", { font: F.serif, size: 54, color: C.ink, x: 214, y: 525, align: "l" })
  ];
  var lw = [0.92, 0.86, 0.95, 0.6, 0.9, 0.82, 0.7];
  for (var q = 0; q < lw.length; q++) { var w7 = 652 * lw[q]; lk.push(rect(s7, "Typed line", w7, 14, 214 + w7 / 2, 590 + q * 36 + (q > 3 ? 28 : 0), C.rule)); }
  parentTo(lk, letter);
  K(tp(letter, "pos"), [[4.8, [540, 870]], [6.6, [540, 810]]], "soft");
  K(tp(letter, "rot"), [[4.8, 2], [6.6, -1.5]], "soft");
  var were = txt(s7, "They were", { font: F.ital, size: 120, color: C.ink, y: 700 });
  fadeUp(were, 5.3, 20);
  var fired = boxed(s7, "FIRED", { font: F.anton, size: 280, color: C.orange, y: 935, name: "FIRED stamp" }, C.orange, 40, 12, 12);
  var fbg = rect(s7, "FIRED stamp fill", 10, 10, 540, 935, C.paper); fbg.moveAfter(fired[0]);
  fbg.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property(1).property("ADBE Vector Rect Size").expression =
    "var b = thisComp.layer('" + fired[0].name + "').content(1).content(1).size; b;";
  tp(fbg, "op").setValue(85); fbg.parent = fired[0];
  K(tp(fired[0], "rot"), [[5.9, -14], [6.12, -6]], "snap"); slam(fired[0], 5.9, 220, 0.22); fadeIn(fbg, 5.9, 0.1); fadeIn(fired[1], 5.9, 0.1);
  each([letter, were, fired[0], fired[1], fbg].concat(lk), function (l) { span(l, 4.8, 6.6); });
  // C \u00b7 newspaper + notes
  var RC = rig(s7, "C rig", 540, 780);
  var paperL = rect(s7, "Newspaper (illustration)", 940, 960, 540, 780, C.news); shadow(paperL);
  var nk = [
    txt(s7, "The Business Page", { font: F.serif, size: 72, color: C.ink, y: 380 }),
    rect(s7, "Double rule", 844, 6, 540, 432, null, C.ink, 1.5),
    txt(s7, "ILLUSTRATION", { font: F.mono, size: 16, color: C.ink, track: 140, x: 118, y: 452, align: "l" }),
    txt(s7, "LATE 1970S", { font: F.mono, size: 16, color: C.ink, track: 140, x: 962, y: 452, align: "r" }),
    rect(s7, "Rule", 844, 1, 540, 470, C.ink),
    txt(s7, "Two fired executives\rbet on a warehouse", { font: F.serif, size: 92, color: C.ink, x: 118, y: 580, align: "l", leading: 94, name: "Headline" })
  ];
  for (var cc = 0; cc < 2; cc++) for (var rr = 0; rr < 6; rr++) {
    var ww = 408 * [1, 0.92, 0.97, 0.88, 0.95, 0.7][(rr + cc * 2) % 6];
    nk.push(rect(s7, "Column line", ww, 12, 118 + cc * 436 + ww / 2, 730 + rr * 26, hex("#C9C0B0")));
  }
  parentTo(nk, paperL); paperL.parent = RC;
  K(tp(RC, "scale"), [[6.6, [110, 110]], [9.0, [100, 100]]], "soft");
  K(tp(RC, "rot"), [[6.6, 2], [9.0, -1]], "soft");
  var n1 = boxed(s7, "LITTLE SAVINGS", { font: F.anton, size: 92, color: C.paper, y: 815 }, C.ink, 36, 10);
  var n2 = boxed(s7, "NO RETIREMENT FUND", { font: F.anton, size: 92, color: C.ink, y: 985 }, C.orange, 36, 10);
  slideX(n1[0], 6.7, -60); fadeIn(n1[1], 6.7, 0.24);
  slideX(n2[0], 7.8, 60); fadeIn(n2[1], 7.8, 0.24);
  each([RC, paperL, n1[0], n1[1], n2[0], n2[1]].concat(nk), function (l) { l.inPoint = 6.6; });
  masthead(s7, "07 \u00b7 THE STORY", true);

  // ===================================================== S8 \u00b7 BIG IDEA 58\u201364 (paper)
  var s8 = comp("S8_BigIdea  00:58\u201301:04", 6);
  bgPaper(s8);
  var aisle = img(s8, ART.s8_aisles, 540, 960, "Towering aisles");
  K(tp(aisle, "op"), [[3.6, 0], [4.0, 100]], "lin"); drift(aisle, 3.6, 6.0, 125);
  var kick8 = txt(s8, "Their \u201ccrazy\u201d idea", { font: F.ital, size: 104, color: C.ink, y: 352 });
  colorWords(kick8, 1, 2, C.orangePaper);
  fadeUp(kick8, 0.2, 20); fadeTo(kick8, 3.6, 0, 0.15);
  // camera: one null scaled around the small store; zoom-out reveals the warehouse
  var cam = rig(s8, "CAMERA (zoom-out)", 170, 1124);
  var wh = img(s8, ART.s8_warehouse, 540, 850, "Warehouse");
  var cells = [];
  for (var c8 = 0; c8 < 5; c8++) cells.push(rect(s8, "Store footprint " + (c8 + 1), 176, 190, 168 + c8 * 186, 905, C.orange));
  var sst = img(s8, ART.s8_small_store, 540, 850, "Typical hardware store");
  parentTo([wh, sst].concat(cells), cam);
  K(tp(cam, "scale"), [[0, [330, 330]], [1.4, [310, 310]], [2.6, [100, 100]]], "io");
  K(tp(cam, "pos"), [[0, [540, 824]], [1.4, [540, 824]], [2.6, [170, 1124]]], "io");
  K(tp(wh, "op"), [[1.5, 0], [2.0, 100], [3.6, 100], [3.8, 12]], "lin");
  K(tp(sst, "op"), [[3.6, 100], [3.8, 12]], "lin");
  for (c8 = 0; c8 < 5; c8++) K(tp(cells[c8], "op"), [[0, 0], [2.7 + c8 * 0.12, 0], [2.82 + c8 * 0.12, 85], [3.6, 85], [3.8, 10]], "lin");
  var five = txt(s8, "5\u00d7", { font: F.anton, size: 470, color: C.orangePaper, y: 667 });
  var bigger = txt(s8, "BIGGER", { font: F.anton, size: 236, color: C.ink, y: 985 });
  back(five, 3.7, 30, 0.3); fadeUp(bigger, 3.95, 60, 0.25);
  drift(five, 4.0, 6.0, 105); drift(bigger, 4.2, 6.0, 104);
  masthead(s8, "08 \u00b7 THE BIG IDEA", true);

  // ===================================================== S9 \u00b7 END CARD 64\u201367
  var s9 = comp("S9_EndCard  01:04\u201301:07", 3);
  var R9 = rig(s9, "Slide-up rig", 540, 960);
  var bg9 = solid(s9, "BG orange (or episode artwork)", C.orange); ramp(bg9, [540, 576], C.orangeHot, [540, 2000], C.orangeDeep, true);
  var stripes = shapeLayer(s9, "Stripes (keeps moving)");
  var stv = stripes.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group").property("ADBE Vectors Group");
  var srect = stv.addProperty("ADBE Vector Shape - Rect"); srect.property("ADBE Vector Rect Size").setValue([4200, 24]);
  addPaint(stv, C.ink);
  var rep = stv.addProperty("ADBE Vector Filter - Repeater");
  rep.property("ADBE Vector Repeater Copies").setValue(48);
  rep.property("ADBE Vector Repeater Offset").setValue(-24);
  rep.property("ADBE Vector Repeater Transform").property("ADBE Vector Repeater Position").setValue([0, 96]);
  tp(stripes, "rot").setValue(-35); tp(stripes, "op").setValue(16);
  K(tp(stripes, "pos"), [[0, [540, 960]], [3, [444, 823]]], "lin");
  var live = rect(s9, "FULL EPISODE LIVE box", 840, 400, 540, 580, C.ink);
  var l1 = txt(s9, "FULL EPISODE", { font: F.anton, size: 150, color: C.orange, y: 505 });
  var l2 = txt(s9, "LIVE", { font: F.anton, size: 190, color: C.white, y: 668 });
  parentTo([l1, l2], live);
  var t1 = txt(s9, "Acquired:", { font: F.serif, size: 120, color: C.ink, y: 840 });
  var t2 = txt(s9, "Home Depot", { font: F.ital, size: 120, color: C.white, y: 962 });
  var cta = boxed(s9, "ON YOUTUBE & ALL PODCAST APPS", { font: F.mono, size: 34, color: C.ink, track: 140, y: 1100 }, C.ink, 26, 18, 4);
  var lt = txt(s9, "ACQUIRED", { font: F.mono, size: 28, color: C.paper, track: 140, y: 1201, name: "LOGO SLOT wordmark (replace with approved Acquired logo)" });
  var ltw = lt.sourceRectAtTime(0, false).width, gw = 34 + 16 + ltw;
  tp(lt, "pos").setValue([540 - gw / 2 + 50 + ltw / 2, 1201]);
  var ringL = ellipse(s9, "LOGO SLOT mark", 34, 540 - gw / 2 + 17, 1201, null, C.orange, 4);
  var logoBox = rect(s9, "LOGO SLOT box", gw + 48, 62, 540, 1201, C.ink);
  logoBox.moveAfter(ringL);
  parentTo([lt, ringL], logoBox);
  var logo = [logoBox, lt];
  parentTo([bg9, stripes, live, t1, t2, cta[0], logo[0]], R9);
  K(tp(R9, "pos"), [[0, [540, 2880]], [0.4, [540, 960]]], "snap");
  slam(live, 0.3, 150, 0.22); fadeIn(l1, 0.3, 0.1); fadeIn(l2, 0.3, 0.1); // final impact on FULL EPISODE LIVE
  fadeUp(t1, 0.45, 30); fadeUp(t2, 0.5, 30); fadeUp(cta[0], 0.6, 30); fadeIn(cta[1], 0.6, 0.24);
  fadeIn(logo[0], 0.7, 0.3); fadeIn(ringL, 0.7, 0.3); fadeIn(lt, 0.7, 0.3);
  each([live, t1, t2], function (l) { K(tp(l, "scale"), [[0.7, [100, 100]], [3, [103, 103]]], "lin"); });

  // ===================================================== CAPTIONS
  var CAPS = [
    [0.15, 1.7, "So here\u2019s a fun stat."],
    [4.1, 6.4, "Home Depot went public in *1981*,"],
    [6.4, 9.9, "one year after *Apple* Computer."],
    [10.1, 12.2, "And astonishingly, if you put"],
    [12.2, 14.4, "$1,000 into Home Depot and *Apple*"],
    [14.4, 16.4, "at their IPOs and held them"],
    [16.4, 17.9, "until today, your investment"],
    [17.9, 19.4, "in Home Depot would beat"],
    [19.4, 21.0, "your investment in *Apple*."],
    [21.1, 23.2, "And if you reinvested the dividends"],
    [23.2, 25.0, "that it paid out,"],
    [25.0, 27.6, "it compounded at nearly *25%*"],
    [27.6, 31.0, "per year for 45 years."],
    [31.1, 33.0, "That makes it the *number one*"],
    [33.0, 35.0, "performing stock in the S&P 500"],
    [35.0, 37.4, "in total investment return"],
    [37.4, 39.6, "from the day it went public"],
    [39.6, 42.0, "to today."],
    [42.1, 43.5, "So that $1,000 invested"],
    [43.5, 45.6, "in the IPO would be worth"],
    [46.0, 49.0, "about *$17 million* today."],
    [49.1, 50.6, "Today, we will tell the story"],
    [50.6, 51.6, "of how it happened."],
    [51.6, 52.9, "It is the unlikely story"],
    [52.9, 54.0, "of two guys who got"],
    [54.0, 55.6, "unceremoniously *fired* from their old jobs,"],
    [55.6, 56.8, "with little savings"],
    [56.8, 58.0, "and no retirement funds\u2026"],
    [58.1, 59.3, "\u2026who then had a revolutionary idea"],
    [59.3, 60.6, "to build a home-improvement store"],
    [60.6, 61.7, "in giant warehouses \u2014"],
    [61.7, 63.0, "*five times* more square footage"],
    [63.0, 64.4, "than any other hardware store."]
  ];
  var capC = comp("CAPTIONS", DUR, fParts);
  capC.bgColor = [0, 0, 0];
  for (var n = 0; n < CAPS.length; n++) {
    var raw = CAPS[n][2], words = raw.split(" "), clean = [], e0 = -1, e1 = -1, inE = false;
    for (var w = 0; w < words.length; w++) {
      var wd = words[w];
      if (wd.charAt(0) == "*") { inE = true; e0 = w; wd = wd.substr(1); }
      if (inE && wd.indexOf("*") >= 0) { wd = wd.replace("*", ""); e1 = w + 1; inE = false; }
      clean.push(wd);
    }
    // wrap to \u2264 ~24 characters per line (bold, centred, 4\u20136 words per line)
    var lines = [], cur = "";
    for (w = 0; w < clean.length; w++) {
      if (cur.length && (cur + " " + clean[w]).length > 24) { lines.push(cur); cur = clean[w]; } else cur = cur.length ? cur + " " + clean[w] : clean[w];
    }
    lines.push(cur);
    var id = "CAP_" + (n < 9 ? "0" : "") + (n + 1);
    var ct = txt(capC, lines.join("\r"), { font: F.caps, size: 50, color: C.white, y: 1333 + (lines.length - 1) * 33, leading: 66, name: id });
    if (e0 >= 0) colorWords(ct, e0, e1, C.orange);
    var bx = shapeLayer(capC, id + " box");
    var bv = bx.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group").property("ADBE Vectors Group");
    var br = bv.addProperty("ADBE Vector Shape - Rect");
    addPaint(bv, C.ink);
    br.property("ADBE Vector Rect Size").expression = "var t = thisComp.layer('" + id + "'); var r = t.sourceRectAtTime(time, false); [r.width * t.transform.scale[0] / 100 + 32, r.height * t.transform.scale[1] / 100 + 10];";
    tp(bx, "pos").expression = "var t = thisComp.layer('" + id + "'); var r = t.sourceRectAtTime(time, false); t.toComp([r.left + r.width / 2, r.top + r.height / 2]);";
    tp(bx, "op").expression = "thisComp.layer('" + id + "').transform.opacity";
    bx.moveAfter(ct);
    span(ct, CAPS[n][0], CAPS[n][1]); span(bx, CAPS[n][0], CAPS[n][1]);
    K(tp(ct, "op"), [[CAPS[n][0], 0], [CAPS[n][0] + 0.14, 100]], "out");
    K(tp(ct, "scale"), [[CAPS[n][0], [96, 96]], [CAPS[n][0] + 0.14, [100, 100]]], "out");
  }

  // ===================================================== MAIN
  var main = comp("HD_Reel_MAIN  1080x1920 30fps", DUR, fRoot);
  if (MUSIC) { var ml = main.layers.add(MUSIC); ml.name = "MUSIC (temp score \u2014 replace)"; }
  if (SFX) { var sl = main.layers.add(SFX); sl.name = "SFX cue stem (temp \u2014 replace)"; }
  function hostAt(t0, t1, keys, ease) {
    var l = main.layers.add(host); l.startTime = 0; span(l, t0, t1);
    tp(l, "anchor").setValue([540, 806]); tp(l, "pos").setValue([540, 806]);
    K(tp(l, "scale"), keys, ease);
    return l;
  }
  var hs1 = hostAt(0, 4, [[0.05, [100, 100]], [0.33, [116, 116]]], "snap"); // fast punch-in on the first word
  var hsc = tp(hs1, "scale"); hsc.setValueAtTime(3.93, [122, 122]);
  hsc.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.LINEAR);
  hsc.setInterpolationTypeAtKey(3, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR);
  hs1.name = "HOST \u00b7 hook";
  var SHOTS = [[s1, 0], [s2, 4], [s3, 10], [s4, 21], [s5, 31], [s6, 42], [s7, 49], [s8, 58], [s9, 64]];
  for (var s = 0; s < SHOTS.length; s++) { var L2 = main.layers.add(SHOTS[s][0]); L2.startTime = SHOTS[s][1]; }
  hostAt(19.3, 20.3, [[19.3, [112, 112]], [20.3, [120, 120]]], "lin").name = "HOST \u00b7 reaction after reveal";
  hostAt(35.6, 36.9, [[35.6, [105, 105]], [36.9, [116, 116]]], "out").name = "HOST \u00b7 before #1";
  main.layers.add(capC).name = "CAPTIONS (burned in)";
  var vig = solid(main, "VIGNETTE", [0, 0, 0]);
  var vm = vig.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
  var ve = new Shape();
  ve.vertices = [[540, -100], [1240, 860], [540, 2020], [-160, 860]];
  ve.inTangents = [[-700 * k, 0], [0, -960 * k], [700 * k, 0], [0, 1160 * k]];
  ve.outTangents = [[700 * k, 0], [0, 1160 * k], [-700 * k, 0], [0, -960 * k]];
  ve.closed = true;
  vm.property("ADBE Mask Shape").setValue(ve); vm.inverted = true; vm.property("ADBE Mask Feather").setValue([520, 520]);
  tp(vig, "op").setValue(35);
  var grain = main.layers.addSolid([0.5, 0.5, 0.5], "GRAIN (adjustment)", W, H, 1);
  grain.adjustmentLayer = true;
  grain.property("ADBE Effect Parade").addProperty("ADBE Noise").property(1).setValue(7);

  // markers: shot boundaries + the script's sound-design cue sheet
  var MK = [
    [0, "1 HOOK"], [1.0, "SFX opening impact under hook text"], [4, "2 SETUP \u2014 split wipe < 12 frames"],
    [10, "3 COMPARISON \u2014 soft stock-ticker bed 00:10\u201300:21"], [18.2, "SFX whoosh + impact: Home Depot overtakes Apple"],
    [21, "4 COMPOUNDING \u2014 accelerating ticks"], [31, "5 NUMBER ONE"], [37.3, "SFX upward move into #1 badge"],
    [42, "6 PAYOFF"], [45.6, "MUSIC DROP (clean, no pop)"], [46, "SFX bass hit \u2014 $17 MILLION lands; hold \u2265 1.5 s"],
    [49, "7 STORY \u2014 emotional transition, slower cutting"], [54.9, "FIRED stamp"], [58, "8 BIG IDEA \u2014 inspirational rise"],
    [64, "9 END CARD \u2014 animates up from bottom"], [64.3, "SFX final impact on FULL EPISODE LIVE"]
  ];
  var mp = main.markerProperty;
  for (var m = 0; m < MK.length; m++) mp.setValueAtTime(MK[m][0], new MarkerValue(MK[m][1]));

  main.openInViewer();
  app.endUndoGroup();
  alert("Home Depot reel built.\n\nRender: HD_Reel_MAIN\nSwap host footage once inside HOST_PLATE.\nIf text looks wrong, install the fonts from assets/fonts and re-run.");
})();
