﻿Enumerable = function() { var a = function(a) { this.GetEnumerator = a }; a.Choice = function() { var c = arguments[0] instanceof Array ? arguments[0] : arguments; return new a(function() { return new f(b.Blank, function() { return this.Yield(c[Math.floor(Math.random() * c.length)]) }, b.Blank) }) }; a.Cycle = function() { var c = arguments[0] instanceof Array ? arguments[0] : arguments; return new a(function() { var a = 0; return new f(b.Blank, function() { if (a >= c.length) a = 0; return this.Yield(c[a++]) }, b.Blank) }) }; a.Empty = function() { return new a(function() { return new f(b.Blank, function() { return false }, b.Blank) }) }; a.From = function(e) { if (e == null) { return a.Empty() } if (e instanceof a) { return e } if (typeof e == c.Number || typeof e == c.Boolean) { return a.Repeat(e, 1) } if (typeof e == c.String) { return new a(function() { var a = 0; return new f(b.Blank, function() { return a < e.length ? this.Yield(e.charAt(a++)) : false }, b.Blank) }) } if (typeof e != c.Function) { if (typeof e.length == c.Number) { return new j(e) } if (!(e instanceof Object) && d.IsIEnumerable(e)) { return new a(function() { var a = true; var c; return new f(function() { c = new Enumerator(e) }, function() { if (a) a = false; else c.moveNext(); return c.atEnd() ? false : this.Yield(c.item()) }, b.Blank) }) } } return new a(function() { var a = []; var c = 0; return new f(function() { for (var b in e) { if (!(e[b] instanceof Function)) { a.push({ Key: b, Value: e[b] }) } } }, function() { return c < a.length ? this.Yield(a[c++]) : false }, b.Blank) }) }, a.Return = function(b) { return a.Repeat(b, 1) }; a.Matches = function(c, d, e) { if (e == null) e = ""; if (d instanceof RegExp) { e += d.ignoreCase ? "i" : ""; e += d.multiline ? "m" : ""; d = d.source } if (e.indexOf("g") === -1) e += "g"; return new a(function() { var a; return new f(function() { a = new RegExp(d, e) }, function() { var b = a.exec(c); return b ? this.Yield(b) : false }, b.Blank) }) }; a.Range = function(b, c, d) { if (d == null) d = 1; return a.ToInfinity(b, d).Take(c) }; a.RangeDown = function(b, c, d) { if (d == null) d = 1; return a.ToNegativeInfinity(b, d).Take(c) }; a.RangeTo = function(b, c, d) { if (d == null) d = 1; return b < c ? a.ToInfinity(b, d).TakeWhile(function(a) { return a <= c }) : a.ToNegativeInfinity(b, d).TakeWhile(function(a) { return a >= c }) }; a.Repeat = function(c, d) { if (d != null) return a.Repeat(c).Take(d); return new a(function() { return new f(b.Blank, function() { return this.Yield(c) }, b.Blank) }) }; a.RepeatWithFinalize = function(b, c) { b = d.CreateLambda(b); c = d.CreateLambda(c); return new a(function() { var a; return new f(function() { a = b() }, function() { return this.Yield(a) }, function() { if (a != null) { c(a); a = null } }) }) }; a.Generate = function(c, e) { if (e != null) return a.Generate(c).Take(e); c = d.CreateLambda(c); return new a(function() { return new f(b.Blank, function() { return this.Yield(c()) }, b.Blank) }) }; a.ToInfinity = function(c, d) { if (c == null) c = 0; if (d == null) d = 1; return new a(function() { var a; return new f(function() { a = c - d }, function() { return this.Yield(a += d) }, b.Blank) }) }; a.ToNegativeInfinity = function(c, d) { if (c == null) c = 0; if (d == null) d = 1; return new a(function() { var a; return new f(function() { a = c + d }, function() { return this.Yield(a -= d) }, b.Blank) }) }; a.Unfold = function(c, e) { e = d.CreateLambda(e); return new a(function() { var a = true; var d; return new f(b.Blank, function() { if (a) { a = false; d = c; return this.Yield(d) } d = e(d); return this.Yield(d) }, b.Blank) }) }; a.prototype = { CascadeBreadthFirst: function(b, c) { var e = this; b = d.CreateLambda(b); c = d.CreateLambda(c); return new a(function() { var g; var h = 0; var i = []; return new f(function() { g = e.GetEnumerator() }, function() { while (true) { if (g.MoveNext()) { i.push(g.Current()); return this.Yield(c(g.Current(), h)) } var e = a.From(i).SelectMany(function(a) { return b(a) }); if (!e.Any()) { return false } else { h++; i = []; d.Dispose(g); g = e.GetEnumerator() } } }, function() { d.Dispose(g) }) }) }, CascadeDepthFirst: function(b, c) { var e = this; b = d.CreateLambda(b); c = d.CreateLambda(c); return new a(function() { var g = []; var h; return new f(function() { h = e.GetEnumerator() }, function() { while (true) { if (h.MoveNext()) { var e = c(h.Current(), g.length); g.push(h); h = a.From(b(h.Current())).GetEnumerator(); return this.Yield(e) } if (g.length <= 0) return false; d.Dispose(h); h = g.pop() } }, function() { try { d.Dispose(h) } finally { a.From(g).ForEach(function(a) { a.Dispose() }) } }) }) }, Flatten: function() { var c = this; return new a(function() { var e; var g = null; return new f(function() { e = c.GetEnumerator() }, function() { while (true) { if (g != null) { if (g.MoveNext()) { return this.Yield(g.Current()) } else { g = null } } if (e.MoveNext()) { if (e.Current() instanceof Array) { d.Dispose(g); g = a.From(e.Current()).SelectMany(b.Identity).Flatten().GetEnumerator(); continue } else { return this.Yield(e.Current()) } } return false } }, function() { try { d.Dispose(e) } finally { d.Dispose(g) } }) }) }, Pairwise: function(b) { var c = this; b = d.CreateLambda(b); return new a(function() { var a; return new f(function() { a = c.GetEnumerator(); a.MoveNext() }, function() { var c = a.Current(); return a.MoveNext() ? this.Yield(b(c, a.Current())) : false }, function() { d.Dispose(a) }) }) }, Scan: function(b, c, e) { if (e != null) return this.Scan(b, c).Select(e); var g; if (c == null) { c = d.CreateLambda(b); g = false } else { c = d.CreateLambda(c); g = true } var h = this; return new a(function() { var a; var e; var i = true; return new f(function() { a = h.GetEnumerator() }, function() { if (i) { i = false; if (!g) { if (a.MoveNext()) { return this.Yield(e = a.Current()) } } else { return this.Yield(e = b) } } return a.MoveNext() ? this.Yield(e = c(e, a.Current())) : false }, function() { d.Dispose(a) }) }) }, Select: function(b) { var c = this; b = d.CreateLambda(b); return new a(function() { var a; var e = 0; return new f(function() { a = c.GetEnumerator() }, function() { return a.MoveNext() ? this.Yield(b(a.Current(), e++)) : false }, function() { d.Dispose(a) }) }) }, SelectMany: function(b, c) { var e = this; b = d.CreateLambda(b); if (c == null) c = function(a, b) { return b }; c = d.CreateLambda(c); return new a(function() { var g; var h = undefined; var i = 0; return new f(function() { g = e.GetEnumerator() }, function() { if (h === undefined) { if (!g.MoveNext()) return false } do { if (h == null) { var e = b(g.Current(), i++); h = a.From(e).GetEnumerator() } if (h.MoveNext()) { return this.Yield(c(g.Current(), h.Current())) } d.Dispose(h); h = null } while (g.MoveNext()); return false }, function() { try { d.Dispose(g) } finally { d.Dispose(h) } }) }) }, Where: function(b) { b = d.CreateLambda(b); var c = this; return new a(function() { var a; var e = 0; return new f(function() { a = c.GetEnumerator() }, function() { while (a.MoveNext()) { if (b(a.Current(), e++)) { return this.Yield(a.Current()) } } return false }, function() { d.Dispose(a) }) }) }, OfType: function(a) { var b; switch (a) { case Number: b = c.Number; break; case String: b = c.String; break; case Boolean: b = c.Boolean; break; case Function: b = c.Function; break; default: b = null; break } return b === null ? this.Where(function(b) { return b instanceof a }) : this.Where(function(a) { return typeof a === b }) }, Zip: function(b, c) { c = d.CreateLambda(c); var e = this; return new a(function() { var g; var h; var i = 0; return new f(function() { g = e.GetEnumerator(); h = a.From(b).GetEnumerator() }, function() { if (g.MoveNext() && h.MoveNext()) { return this.Yield(c(g.Current(), h.Current(), i++)) } return false }, function() { try { d.Dispose(g) } finally { d.Dispose(h) } }) }) }, Join: function(c, e, g, h, i) { e = d.CreateLambda(e); g = d.CreateLambda(g); h = d.CreateLambda(h); i = d.CreateLambda(i); var j = this; return new a(function() { var k; var l; var m = null; var n = 0; return new f(function() { k = j.GetEnumerator(); l = a.From(c).ToLookup(g, b.Identity, i) }, function() { while (true) { if (m != null) { var a = m[n++]; if (a !== undefined) { return this.Yield(h(k.Current(), a)) } a = null; n = 0 } if (k.MoveNext()) { var b = e(k.Current()); m = l.Get(b).ToArray() } else { return false } } }, function() { d.Dispose(k) }) }) }, GroupJoin: function(c, e, g, h, i) { e = d.CreateLambda(e); g = d.CreateLambda(g); h = d.CreateLambda(h); i = d.CreateLambda(i); var j = this; return new a(function() { var k = j.GetEnumerator(); var l = null; return new f(function() { k = j.GetEnumerator(); l = a.From(c).ToLookup(g, b.Identity, i) }, function() { if (k.MoveNext()) { var a = l.Get(e(k.Current())); return this.Yield(h(k.Current(), a)) } return false }, function() { d.Dispose(k) }) }) }, All: function(a) { a = d.CreateLambda(a); var b = true; this.ForEach(function(c) { if (!a(c)) { b = false; return false } }); return b }, Any: function(a) { a = d.CreateLambda(a); var b = this.GetEnumerator(); try { if (arguments.length == 0) return b.MoveNext(); while (b.MoveNext()) { if (a(b.Current())) return true } return false } finally { d.Dispose(b) } }, Concat: function(b) { var c = this; return new a(function() { var e; var g; return new f(function() { e = c.GetEnumerator() }, function() { if (g == null) { if (e.MoveNext()) return this.Yield(e.Current()); g = a.From(b).GetEnumerator() } if (g.MoveNext()) return this.Yield(g.Current()); return false }, function() { try { d.Dispose(e) } finally { d.Dispose(g) } }) }) }, Insert: function(b, c) { var e = this; return new a(function() { var g; var h; var i = 0; var j = false; return new f(function() { g = e.GetEnumerator(); h = a.From(c).GetEnumerator() }, function() { if (i == b && h.MoveNext()) { j = true; return this.Yield(h.Current()) } if (g.MoveNext()) { i++; return this.Yield(g.Current()) } if (!j && h.MoveNext()) { return this.Yield(h.Current()) } return false }, function() { try { d.Dispose(g) } finally { d.Dispose(h) } }) }) }, Alternate: function(b) { b = a.Return(b); return this.SelectMany(function(c) { return a.Return(c).Concat(b) }).TakeExceptLast() }, Contains: function(a, b) { b = d.CreateLambda(b); var c = this.GetEnumerator(); try { while (c.MoveNext()) { if (b(c.Current()) === a) return true } return false } finally { d.Dispose(c) } }, DefaultIfEmpty: function(b) { var c = this; return new a(function() { var a; var e = true; return new f(function() { a = c.GetEnumerator() }, function() { if (a.MoveNext()) { e = false; return this.Yield(a.Current()) } else if (e) { e = false; return this.Yield(b) } return false }, function() { d.Dispose(a) }) }) }, Distinct: function(b) { return this.Except(a.Empty(), b) }, Except: function(b, c) { c = d.CreateLambda(c); var e = this; return new a(function() { var g; var h; return new f(function() { g = e.GetEnumerator(); h = new k(c); a.From(b).ForEach(function(a) { h.Add(a) }) }, function() { while (g.MoveNext()) { var a = g.Current(); if (!h.Contains(a)) { h.Add(a); return this.Yield(a) } } return false }, function() { d.Dispose(g) }) }) }, Intersect: function(b, c) { c = d.CreateLambda(c); var e = this; return new a(function() { var g; var h; var i; return new f(function() { g = e.GetEnumerator(); h = new k(c); a.From(b).ForEach(function(a) { h.Add(a) }); i = new k(c) }, function() { while (g.MoveNext()) { var a = g.Current(); if (!i.Contains(a) && h.Contains(a)) { i.Add(a); return this.Yield(a) } } return false }, function() { d.Dispose(g) }) }) }, SequenceEqual: function(b, c) { c = d.CreateLambda(c); var e = this.GetEnumerator(); try { var f = a.From(b).GetEnumerator(); try { while (e.MoveNext()) { if (!f.MoveNext() || c(e.Current()) !== c(f.Current())) { return false } } if (f.MoveNext()) return false; return true } finally { d.Dispose(f) } } finally { d.Dispose(e) } }, Union: function(b, c) { c = d.CreateLambda(c); var e = this; return new a(function() { var g; var h; var i; return new f(function() { g = e.GetEnumerator(); i = new k(c) }, function() { var c; if (h === undefined) { while (g.MoveNext()) { c = g.Current(); if (!i.Contains(c)) { i.Add(c); return this.Yield(c) } } h = a.From(b).GetEnumerator() } while (h.MoveNext()) { c = h.Current(); if (!i.Contains(c)) { i.Add(c); return this.Yield(c) } } return false }, function() { try { d.Dispose(g) } finally { d.Dispose(h) } }) }) }, OrderBy: function(a) { return new h(this, a, false) }, OrderByDescending: function(a) { return new h(this, a, true) }, Reverse: function() { var c = this; return new a(function() { var a; var d; return new f(function() { a = c.ToArray(); d = a.length }, function() { return d > 0 ? this.Yield(a[--d]) : false }, b.Blank) }) }, Shuffle: function() { var c = this; return new a(function() { var a; return new f(function() { a = c.ToArray() }, function() { if (a.length > 0) { var b = Math.floor(Math.random() * a.length); return this.Yield(a.splice(b, 1)[0]) } return false }, b.Blank) }) }, GroupBy: function(b, c, e, g) { var h = this; b = d.CreateLambda(b); c = d.CreateLambda(c); if (e != null) e = d.CreateLambda(e); g = d.CreateLambda(g); return new a(function() { var a; return new f(function() { a = h.ToLookup(b, c, g).ToEnumerable().GetEnumerator() }, function() { while (a.MoveNext()) { return e == null ? this.Yield(a.Current()) : this.Yield(e(a.Current().Key(), a.Current())) } return false }, function() { d.Dispose(a) }) }) }, PartitionBy: function(b, c, e, g) { var h = this; b = d.CreateLambda(b); c = d.CreateLambda(c); g = d.CreateLambda(g); var i; if (e == null) { i = false; e = function(a, b) { return new m(a, b) } } else { i = true; e = d.CreateLambda(e) } return new a(function() { var j; var k; var l; var m = []; return new f(function() { j = h.GetEnumerator(); if (j.MoveNext()) { k = b(j.Current()); l = g(k); m.push(c(j.Current())) } }, function() { var d; while ((d = j.MoveNext()) == true) { if (l === g(b(j.Current()))) { m.push(c(j.Current())) } else break } if (m.length > 0) { var f = i ? e(k, a.From(m)) : e(k, m); if (d) { k = b(j.Current()); l = g(k); m = [c(j.Current())] } else m = []; return this.Yield(f) } return false }, function() { d.Dispose(j) }) }) }, BufferWithCount: function(b) { var c = this; return new a(function() { var a; return new f(function() { a = c.GetEnumerator() }, function() { var c = []; var d = 0; while (a.MoveNext()) { c.push(a.Current()); if (++d >= b) return this.Yield(c) } if (c.length > 0) return this.Yield(c); return false }, function() { d.Dispose(a) }) }) }, Aggregate: function(a, b, c) { return this.Scan(a, b, c).Last() }, Average: function(a) { a = d.CreateLambda(a); var b = 0; var c = 0; this.ForEach(function(d) { b += a(d); ++c }); return b / c }, Count: function(a) { a = a == null ? b.True : d.CreateLambda(a); var c = 0; this.ForEach(function(b, d) { if (a(b, d)) ++c }); return c }, Max: function(a) { if (a == null) a = b.Identity; return this.Select(a).Aggregate(function(a, b) { return a > b ? a : b }) }, Min: function(a) { if (a == null) a = b.Identity; return this.Select(a).Aggregate(function(a, b) { return a < b ? a : b }) }, MaxBy: function(a) { a = d.CreateLambda(a); return this.Aggregate(function(b, c) { return a(b) > a(c) ? b : c }) }, MinBy: function(a) { a = d.CreateLambda(a); return this.Aggregate(function(b, c) { return a(b) < a(c) ? b : c }) }, Sum: function(a) { if (a == null) a = b.Identity; return this.Select(a).Aggregate(0, function(a, b) { return a + b }) }, ElementAt: function(a) { var b; var c = false; this.ForEach(function(d, e) { if (e == a) { b = d; c = true; return false } }); if (!c) throw new Error("index is less than 0 or greater than or equal to the number of elements in source."); return b }, ElementAtOrDefault: function(a, b) { var c; var d = false; this.ForEach(function(b, e) { if (e == a) { c = b; d = true; return false } }); return !d ? b : c }, First: function(a) { if (a != null) return this.Where(a).First(); var b; var c = false; this.ForEach(function(a) { b = a; c = true; return false }); if (!c) throw new Error("First:No element satisfies the condition."); return b }, FirstOrDefault: function(a, b) { if (b != null) return this.Where(b).FirstOrDefault(a); var c; var d = false; this.ForEach(function(a) { c = a; d = true; return false }); return !d ? a : c }, Last: function(a) { if (a != null) return this.Where(a).Last(); var b; var c = false; this.ForEach(function(a) { c = true; b = a }); if (!c) throw new Error("Last:No element satisfies the condition."); return b }, LastOrDefault: function(a, b) { if (b != null) return this.Where(b).LastOrDefault(a); var c; var d = false; this.ForEach(function(a) { d = true; c = a }); return !d ? a : c }, Single: function(a) { if (a != null) return this.Where(a).Single(); var b; var c = false; this.ForEach(function(a) { if (!c) { c = true; b = a } else throw new Error("Single:sequence contains more than one element.") }); if (!c) throw new Error("Single:No element satisfies the condition."); return b }, SingleOrDefault: function(a, b) { if (b != null) return this.Where(b).SingleOrDefault(a); var c; var d = false; this.ForEach(function(a) { if (!d) { d = true; c = a } else throw new Error("Single:sequence contains more than one element.") }); return !d ? a : c }, Skip: function(b) { var c = this; return new a(function() { var a; var e = 0; return new f(function() { a = c.GetEnumerator(); while (e++ < b && a.MoveNext()) { } }, function() { return a.MoveNext() ? this.Yield(a.Current()) : false }, function() { d.Dispose(a) }) }) }, SkipWhile: function(b) { b = d.CreateLambda(b); var c = this; return new a(function() { var a; var e = 0; var g = false; return new f(function() { a = c.GetEnumerator() }, function() { while (!g) { if (a.MoveNext()) { if (!b(a.Current(), e++)) { g = true; return this.Yield(a.Current()) } continue } else return false } return a.MoveNext() ? this.Yield(a.Current()) : false }, function() { d.Dispose(a) }) }) }, Take: function(b) { var c = this; return new a(function() { var a; var e = 0; return new f(function() { a = c.GetEnumerator() }, function() { return e++ < b && a.MoveNext() ? this.Yield(a.Current()) : false }, function() { d.Dispose(a) }) }) }, TakeWhile: function(b) { b = d.CreateLambda(b); var c = this; return new a(function() { var a; var e = 0; return new f(function() { a = c.GetEnumerator() }, function() { return a.MoveNext() && b(a.Current(), e++) ? this.Yield(a.Current()) : false }, function() { d.Dispose(a) }) }) }, TakeExceptLast: function(b) { if (b == null) b = 1; var c = this; return new a(function() { if (b <= 0) return c.GetEnumerator(); var a; var e = []; return new f(function() { a = c.GetEnumerator() }, function() { while (a.MoveNext()) { if (e.length == b) { e.push(a.Current()); return this.Yield(e.shift()) } e.push(a.Current()) } return false }, function() { d.Dispose(a) }) }) }, TakeFromLast: function(b) { if (b <= 0 || b == null) return a.Empty(); var c = this; return new a(function() { var e; var g; var h = []; return new f(function() { e = c.GetEnumerator() }, function() { while (e.MoveNext()) { if (h.length == b) h.shift(); h.push(e.Current()) } if (g == null) { g = a.From(h).GetEnumerator() } return g.MoveNext() ? this.Yield(g.Current()) : false }, function() { d.Dispose(g) }) }) }, IndexOf: function(a) { var b = null; this.ForEach(function(c, d) { if (c === a) { b = d; return true } }); return b !== null ? b : -1 }, LastIndexOf: function(a) { var b = -1; this.ForEach(function(c, d) { if (c === a) b = d }); return b }, ToArray: function() { var a = []; this.ForEach(function(b) { a.push(b) }); return a }, ToLookup: function(a, b, c) { a = d.CreateLambda(a); b = d.CreateLambda(b); c = d.CreateLambda(c); var e = new k(c); this.ForEach(function(c) { var d = a(c); var f = b(c); var g = e.Get(d); if (g !== undefined) g.push(f); else e.Add(d, [f]) }); return new l(e) }, ToObject: function(a, b) { a = d.CreateLambda(a); b = d.CreateLambda(b); var c = {}; this.ForEach(function(d) { c[a(d)] = b(d) }); return c }, ToDictionary: function(a, b, c) { a = d.CreateLambda(a); b = d.CreateLambda(b); c = d.CreateLambda(c); var e = new k(c); this.ForEach(function(c) { e.Add(a(c), b(c)) }); return e }, ToJSON: function(a, b) { return JSON.stringify(this.ToArray(), a, b) }, ToString: function(a, c) { if (a == null) a = ""; if (c == null) c = b.Identity; return this.Select(c).ToArray().join(a) }, Do: function(b) { var c = this; b = d.CreateLambda(b); return new a(function() { var a; var e = 0; return new f(function() { a = c.GetEnumerator() }, function() { if (a.MoveNext()) { b(a.Current(), e++); return this.Yield(a.Current()) } return false }, function() { d.Dispose(a) }) }) }, ForEach: function(a) { a = d.CreateLambda(a); var b = 0; var c = this.GetEnumerator(); try { while (c.MoveNext()) { if (a(c.Current(), b++) === false) break } } finally { d.Dispose(c) } }, Write: function(a, b) { if (a == null) a = ""; b = d.CreateLambda(b); var c = true; this.ForEach(function(d) { if (c) c = false; else document.write(a); document.write(b(d)) }) }, WriteLine: function(a) { a = d.CreateLambda(a); this.ForEach(function(b) { document.write(a(b)); document.write("<br />") }) }, Force: function() { var a = this.GetEnumerator(); try { while (a.MoveNext()) { } } finally { d.Dispose(a) } }, Let: function(b) { b = d.CreateLambda(b); var c = this; return new a(function() { var e; return new f(function() { e = a.From(b(c)).GetEnumerator() }, function() { return e.MoveNext() ? this.Yield(e.Current()) : false }, function() { d.Dispose(e) }) }) }, Share: function() { var c = this; var d; return new a(function() { return new f(function() { if (d == null) { d = c.GetEnumerator() } }, function() { return d.MoveNext() ? this.Yield(d.Current()) : false }, b.Blank) }) }, MemoizeAll: function() { var c = this; var d; var e; return new a(function() { var a = -1; return new f(function() { if (e == null) { e = c.GetEnumerator(); d = [] } }, function() { a++; if (d.length <= a) { return e.MoveNext() ? this.Yield(d[a] = e.Current()) : false } return this.Yield(d[a]) }, b.Blank) }) }, Catch: function(b) { b = d.CreateLambda(b); var c = this; return new a(function() { var a; return new f(function() { a = c.GetEnumerator() }, function() { try { return a.MoveNext() ? this.Yield(a.Current()) : false } catch (c) { b(c); return false } }, function() { d.Dispose(a) }) }) }, Finally: function(b) { b = d.CreateLambda(b); var c = this; return new a(function() { var a; return new f(function() { a = c.GetEnumerator() }, function() { return a.MoveNext() ? this.Yield(a.Current()) : false }, function() { try { d.Dispose(a) } finally { b() } }) }) }, Trace: function(a, b) { if (a == null) a = "Trace"; b = d.CreateLambda(b); return this.Do(function(c) { console.log(a, ":", b(c)) }) } }; var b = { Identity: function(a) { return a }, True: function() { return true }, Blank: function() { } }; var c = { Boolean: typeof true, Number: typeof 0, String: typeof "", Object: typeof {}, Undefined: typeof undefined, Function: typeof function() { } }; var d = { CreateLambda: function(a) { if (a == null) return b.Identity; if (typeof a == c.String) { if (a == "") { return b.Identity } else if (a.indexOf("=>") == -1) { return new Function("$,$$,$$$,$$$$", "return " + a) } else { var d = a.match(/^[(\s]*([^()]*?)[)\s]*=>(.*)/); return new Function(d[1], "return " + d[2]) } } return a }, IsIEnumerable: function(a) { if (typeof Enumerator != c.Undefined) { try { new Enumerator(a); return true } catch (b) { } } return false }, Compare: function(a, b) { return a === b ? 0 : a > b ? 1 : -1 }, Dispose: function(a) { if (a != null) a.Dispose() } }; var e = { Before: 0, Running: 1, After: 2 }; var f = function(a, b, c) { var d = new g; var f = e.Before; this.Current = d.Current; this.MoveNext = function() { try { switch (f) { case e.Before: f = e.Running; a(); case e.Running: if (b.apply(d)) { return true } else { this.Dispose(); return false }; case e.After: return false } } catch (c) { this.Dispose(); throw c } }; this.Dispose = function() { if (f != e.Running) return; try { c() } finally { f = e.After } } }; var g = function() { var a = null; this.Current = function() { return a }; this.Yield = function(b) { a = b; return true } }; var h = function(a, b, c, e) { this.source = a; this.keySelector = d.CreateLambda(b); this.descending = c; this.parent = e }; h.prototype = new a; h.prototype.CreateOrderedEnumerable = function(a, b) { return new h(this.source, a, b, this) }; h.prototype.ThenBy = function(a) { return this.CreateOrderedEnumerable(a, false) }; h.prototype.ThenByDescending = function(a) { return this.CreateOrderedEnumerable(a, true) }; h.prototype.GetEnumerator = function() { var a = this; var c; var d; var e = 0; return new f(function() { c = []; d = []; a.source.ForEach(function(a, b) { c.push(a); d.push(b) }); var b = i.Create(a, null); b.GenerateKeys(c); d.sort(function(a, c) { return b.Compare(a, c) }) }, function() { return e < d.length ? this.Yield(c[d[e++]]) : false }, b.Blank) }; var i = function(a, b, c) { this.keySelector = a; this.descending = b; this.child = c; this.keys = null }; i.Create = function(a, b) { var c = new i(a.keySelector, a.descending, b); if (a.parent != null) return i.Create(a.parent, c); return c }; i.prototype.GenerateKeys = function(a) { var b = a.length; var c = this.keySelector; var d = new Array(b); for (var e = 0; e < b; e++) d[e] = c(a[e]); this.keys = d; if (this.child != null) this.child.GenerateKeys(a) }; i.prototype.Compare = function(a, b) { var c = d.Compare(this.keys[a], this.keys[b]); if (c == 0) { if (this.child != null) return this.child.Compare(a, b); c = d.Compare(a, b) } return this.descending ? -c : c }; var j = function(a) { this.source = a }; j.prototype = new a; j.prototype.Any = function(b) { return b == null ? this.source.length > 0 : a.prototype.Any.apply(this, arguments) }; j.prototype.Count = function(b) { return b == null ? this.source.length : a.prototype.Count.apply(this, arguments) }; j.prototype.ElementAt = function(b) { return 0 <= b && b < this.source.length ? this.source[b] : a.prototype.ElementAt.apply(this, arguments) }; j.prototype.ElementAtOrDefault = function(a, b) { return 0 <= a && a < this.source.length ? this.source[a] : b }; j.prototype.First = function(b) { return b == null && this.source.length > 0 ? this.source[0] : a.prototype.First.apply(this, arguments) }; j.prototype.FirstOrDefault = function(b, c) { if (c != null) { return a.prototype.FirstOrDefault.apply(this, arguments) } return this.source.length > 0 ? this.source[0] : b }; j.prototype.Last = function(b) { return b == null && this.source.length > 0 ? this.source[this.source.length - 1] : a.prototype.Last.apply(this, arguments) }; j.prototype.LastOrDefault = function(b, c) { if (c != null) { return a.prototype.LastOrDefault.apply(this, arguments) } return this.source.length > 0 ? this.source[this.source.length - 1] : b }; j.prototype.Skip = function(c) { var d = this.source; return new a(function() { var a; return new f(function() { a = c < 0 ? 0 : c }, function() { return a < d.length ? this.Yield(d[a++]) : false }, b.Blank) }) }; j.prototype.TakeExceptLast = function(a) { if (a == null) a = 1; return this.Take(this.source.length - a) }; j.prototype.TakeFromLast = function(a) { return this.Skip(this.source.length - a) }; j.prototype.Reverse = function() { var c = this.source; return new a(function() { var a; return new f(function() { a = c.length }, function() { return a > 0 ? this.Yield(c[--a]) : false }, b.Blank) }) }; j.prototype.SequenceEqual = function(b, c) { if ((b instanceof j || b instanceof Array) && c == null && a.From(b).Count() != this.Count()) { return false } return a.prototype.SequenceEqual.apply(this, arguments) }; j.prototype.ToString = function(b, c) { if (c != null || !(this.source instanceof Array)) { return a.prototype.ToString.apply(this, arguments) } if (b == null) b = ""; return this.source.join(b) }; j.prototype.GetEnumerator = function() { var a = this.source; var c = 0; return new f(b.Blank, function() { return c < a.length ? this.Yield(a[c++]) : false }, b.Blank) }; var k = function() { var d = function(a, b) { return Object.prototype.hasOwnProperty.call(a, b) }; var e = function(a) { if (a === null) return "null"; if (a === undefined) return "undefined"; return typeof a.toString === c.Function ? a.toString() : Object.prototype.toString.call(a) }; var g = function(a, b) { this.Key = a; this.Value = b; this.Prev = null; this.Next = null }; var h = function() { this.First = null; this.Last = null }; h.prototype = { AddLast: function(a) { if (this.Last != null) { this.Last.Next = a; a.Prev = this.Last; this.Last = a } else this.First = this.Last = a }, Replace: function(a, b) { if (a.Prev != null) { a.Prev.Next = b; b.Prev = a.Prev } else this.First = b; if (a.Next != null) { a.Next.Prev = b; b.Next = a.Next } else this.Last = b }, Remove: function(a) { if (a.Prev != null) a.Prev.Next = a.Next; else this.First = a.Next; if (a.Next != null) a.Next.Prev = a.Prev; else this.Last = a.Prev } }; var i = function(a) { this.count = 0; this.entryList = new h; this.buckets = {}; this.compareSelector = a == null ? b.Identity : a }; i.prototype = { Add: function(a, b) { var c = this.compareSelector(a); var f = e(c); var h = new g(a, b); if (d(this.buckets, f)) { var i = this.buckets[f]; for (var j = 0; j < i.length; j++) { if (this.compareSelector(i[j].Key) === c) { this.entryList.Replace(i[j], h); i[j] = h; return } } i.push(h) } else { this.buckets[f] = [h] } this.count++; this.entryList.AddLast(h) }, Get: function(a) { var b = this.compareSelector(a); var c = e(b); if (!d(this.buckets, c)) return undefined; var f = this.buckets[c]; for (var g = 0; g < f.length; g++) { var h = f[g]; if (this.compareSelector(h.Key) === b) return h.Value } return undefined }, Set: function(a, b) { var c = this.compareSelector(a); var f = e(c); if (d(this.buckets, f)) { var h = this.buckets[f]; for (var i = 0; i < h.length; i++) { if (this.compareSelector(h[i].Key) === c) { var j = new g(a, b); this.entryList.Replace(h[i], j); h[i] = j; return true } } } return false }, Contains: function(a) { var b = this.compareSelector(a); var c = e(b); if (!d(this.buckets, c)) return false; var f = this.buckets[c]; for (var g = 0; g < f.length; g++) { if (this.compareSelector(f[g].Key) === b) return true } return false }, Clear: function() { this.count = 0; this.buckets = {}; this.entryList = new h }, Remove: function(a) { var b = this.compareSelector(a); var c = e(b); if (!d(this.buckets, c)) return; var f = this.buckets[c]; for (var g = 0; g < f.length; g++) { if (this.compareSelector(f[g].Key) === b) { this.entryList.Remove(f[g]); f.splice(g, 1); if (f.length == 0) delete this.buckets[c]; this.count--; return } } }, Count: function() { return this.count }, ToEnumerable: function() { var c = this; return new a(function() { var a; return new f(function() { a = c.entryList.First }, function() { if (a != null) { var b = { Key: a.Key, Value: a.Value }; a = a.Next; return this.Yield(b) } return false }, b.Blank) }) } }; return i } (); var l = function(b) { this.Count = function() { return b.Count() }; this.Get = function(c) { return a.From(b.Get(c)) }; this.Contains = function(a) { return b.Contains(a) }; this.ToEnumerable = function() { return b.ToEnumerable().Select(function(a) { return new m(a.Key, a.Value) }) } }; var m = function(a, b) { this.Key = function() { return a }; j.call(this, b) }; m.prototype = new j; return a } ()