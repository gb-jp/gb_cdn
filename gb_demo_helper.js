/*!
 * gb専用：デモ用ヘルパー (JS版) v1.0.0 – 2025-06-25
 * - WordPress / プレーン HTML 両対応
 * - GET ?gbdemo=xxx を自動伝搬
 * - 依存ライブラリなし（ES5 相当で書いているので IE11 でも動作）
 */

(function () {
  // ─── 1) POST リクエストで配信されている場合は何もしない ───
  if (document.body && document.body.getAttribute('data-gbdemo-js-skip') === 'post') return;

  // ─── 2) リファラーから gbdemo の値を抽出 ───
  var ref = document.referrer || '';
  var refMatch = ref.match(/[?&]gbdemo=([^&#]+)/);
  if (!refMatch) return; // リファラーに gb パラメータなし

  var refCode = refMatch[1];

  // ─── 3) 現在の URL に同じ gb パラメータが既にあるなら終了 ───
  var curMatch = window.location.search.match(/[?&]gbdemo=([^&#]+)/);
  if (curMatch && curMatch[1] === refCode) return;

  // ─── 4) クエリストリングを組み直す ───
  var searchParams = (function () {
    var q = window.location.search.substring(1).split('&');
    var kv = {},
      i,
      p;
    for (i = 0; i < q.length; i++) {
      if (!q[i]) continue;
      p = q[i].split('=');
      kv[decodeURIComponent(p[0])] = p[1] ? decodeURIComponent(p[1]) : '';
    }
    return kv;
  })();

  searchParams.gbdemo = refCode; // 上書き／新規追加

  // オリジナルの順序は気にせずパラメータを組み立て
  var qs = [];
  for (var k in searchParams) {
    if (searchParams.hasOwnProperty(k)) {
      qs.push(encodeURIComponent(k) + '=' + encodeURIComponent(searchParams[k]));
    }
  }

  var newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    (qs.length ? '?' + qs.join('&') : '') +
    window.location.hash;

  // ─── 5) リダイレクト (replace なので履歴を汚さない) ───
  window.location.replace(newUrl);
})();
