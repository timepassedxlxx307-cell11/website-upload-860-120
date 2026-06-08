(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  ready(function () {
    var params = new URLSearchParams(window.location.search);
    var keyword = params.get('q') || '';
    var input = document.querySelector('[data-search-page-input]');
    var list = document.querySelector('[data-search-results]');
    var items = window.SearchItems || [];

    if (input) {
      input.value = keyword;
      input.focus();
    }

    function render(value) {
      var query = String(value || '').toLowerCase().trim();
      if (!list) {
        return;
      }
      if (!query) {
        list.innerHTML = '';
        return;
      }
      var results = items.filter(function (item) {
        var text = [item.title, item.category, item.genre, item.tags, item.region, item.type, item.year, item.desc].join(' ').toLowerCase();
        return text.indexOf(query) !== -1;
      }).slice(0, 80);

      if (!results.length) {
        list.innerHTML = '<div class="empty-state">没有找到匹配内容，可以换一个片名、类型或地区继续搜索。</div>';
        return;
      }

      list.innerHTML = results.map(function (item) {
        return '<article class="search-result">' +
          '<a href="' + escapeHtml(item.url) + '"><img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy"></a>' +
          '<div>' +
          '<h3><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>' +
          '<p class="card-desc">' + escapeHtml(item.desc) + '</p>' +
          '<div class="tag-list"><span class="tag">' + escapeHtml(item.category) + '</span><span class="tag">' + escapeHtml(item.type) + '</span><span class="tag">' + escapeHtml(item.year) + '</span><span class="tag">' + escapeHtml(item.region) + '</span></div>' +
          '<div class="result-actions"><a class="btn-soft" href="' + escapeHtml(item.url) + '">查看详情</a></div>' +
          '</div>' +
          '</article>';
      }).join('');
    }

    if (input) {
      input.addEventListener('input', function () {
        render(input.value);
      });
    }
    render(keyword);
  });
})();
