function createDownloadButton(url) {
  if (url.includes(".md.")) {
    url = url.replaceAll(".md.", ".")
  }

  const btn = document.createElement('button');
  btn.className = 'dwn-media-download-btn';
  btn.title = 'Скачать';

  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('icons/download.svg');
  icon.style.width = '20px';
  icon.style.height = '20px';
  icon.style.filter = 'invert(1)';
  btn.appendChild(icon);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    chrome.runtime.sendMessage({ action: 'download', url });
  });

  return btn;
}

function wrapElement(el) {
  if (el.closest('.dwn-media-wrapper')) return; // уже обёрнут
  if (el.offsetWidth < 64 && el.offsetHeight < 64) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'dwn-media-wrapper';
  wrapper.style.position = 'relative';
  wrapper.style.display = 'inline-block';

  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);

  wrapper.addEventListener('mouseenter', () => {
    if (wrapper.querySelector('.dwn-media-download-btn')) return;

    const src = el.currentSrc || el.src;
    if (!src) return;

    const btn = createDownloadButton(src);
    btn.style.position = 'absolute';
    btn.style.top = '8px';
    btn.style.right = '8px';
    btn.style.background = 'rgba(0, 0, 0, 0.6)';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.padding = '5px';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = '1000';

    wrapper.appendChild(btn);
  });

  wrapper.addEventListener('mouseleave', () => {
    const btn = wrapper.querySelector('.dwn-media-download-btn');
    if (btn) {
      wrapper.removeChild(btn);
    }
  });
}

function processMedia() {
  document.querySelectorAll('img').forEach(el => {
    if (!el.dataset.downloadWrapped) {
      wrapElement(el);
      el.dataset.downloadWrapped = 'true';
    }
  });
}

// Обновление при добавлении новых элементов
const observer = new MutationObserver(() => {
  processMedia();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

processMedia(); // начальная инициализация
