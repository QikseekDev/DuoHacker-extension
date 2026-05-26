(async () => {

(() => {

  const prefix = 'usc:Duolingo_DuoHacker:';

  const listeners = new Map();

  let listenerSeq = 0;

  function read(name, fallback) {

    const raw = localStorage.getItem(prefix + name);

    if (raw === null) return fallback;

    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  function write(name, value) {

    const oldValue = read(name);

    localStorage.setItem(
      prefix + name,
      JSON.stringify(value)
    );

    for (const listener of listeners.values()) {

      if (listener.name === name) {

        listener.callback(
          name,
          oldValue,
          value,
          false
        );
      }
    }
  }

  function GM_xmlhttpRequest(details) {

    const controller = new AbortController();

    const promise = fetch(details.url, {

      method: details.method || 'GET',

      headers: details.headers,

      body: details.data,

      signal: controller.signal,

      credentials:
        details.anonymous
          ? 'omit'
          : 'include'

    })

    .then(async response => {

      const responseText =

        details.responseType === 'blob' ||
        details.responseType === 'arraybuffer'

          ? ''

          : await response.clone().text();

      const body =

        details.responseType === 'blob'

          ? await response.blob()

          : details.responseType === 'arraybuffer'

          ? await response.arrayBuffer()

          : details.responseType === 'json'

          ? JSON.parse(responseText || 'null')

          : responseText;

      const xhr = {

        response: body,

        responseText,

        status: response.status,

        statusText: response.statusText,

        finalUrl: response.url

      };

      details.onload?.(xhr);

      return xhr;

    })

    .catch(error => {

      details.onerror?.(error);

      throw error;

    });

    return {

      abort: () => controller.abort(),

      then: promise.then.bind(promise),

      catch: promise.catch.bind(promise),

      finally: promise.finally.bind(promise)

    };
  }

  function GM_addStyle(css) {

    const style = document.createElement('style');

    style.textContent = css;

    document.head.appendChild(style);

    return style;
  }

  const GM_info = {

    script: {

      name: 'Duolingo DuoHacker',

      description:
        'The #1 Duolingo hack',

      version: '2026.05.25'

    },

    scriptHandler:
      'Chrome Extension Harness',

    version: '3.0'

  };

  const GM = {

    info: GM_info,

    getValue: (name, fallback) =>
      Promise.resolve(read(name, fallback)),

    setValue: (name, value) =>
      Promise.resolve(write(name, value)),

    deleteValue: name =>
      Promise.resolve(
        localStorage.removeItem(prefix + name)
      ),

    listValues: () =>
      Promise.resolve(
        Object.keys(localStorage)

          .filter(key =>
            key.startsWith(prefix)
          )

          .map(key =>
            key.slice(prefix.length)
          )
      ),

    addValueChangeListener:
      (name, callback) => {

        const id = ++listenerSeq;

        listeners.set(id, {
          name,
          callback
        });

        return id;
      },

    removeValueChangeListener:
      id => listeners.delete(id),

    addStyle: GM_addStyle,

    xmlHttpRequest: details =>
      Promise.resolve(
        GM_xmlhttpRequest(details)
      ),

    xmlhttpRequest: details =>
      Promise.resolve(
        GM_xmlhttpRequest(details)
      ),

    registerMenuCommand:
      () => undefined,

    setClipboard: text =>
      navigator.clipboard.writeText(
        String(text || '')
      )
  };

  Object.assign(window, {

    GM,

    GM_info,

    GM_getValue: read,

    GM_setValue: write,

    GM_deleteValue: name =>
      localStorage.removeItem(prefix + name),

    GM_listValues: () =>

      Object.keys(localStorage)

        .filter(key =>
          key.startsWith(prefix)
        )

        .map(key =>
          key.slice(prefix.length)
        ),

    GM_addValueChangeListener:
      GM.addValueChangeListener,

    GM_removeValueChangeListener:
      GM.removeValueChangeListener,

    GM_addStyle,

    GM_xmlhttpRequest,

    GM_registerMenuCommand:
      () => undefined,

    unsafeWindow: window

  });

})();

try {

  const res = await fetch(
    'https://raw.githubusercontent.com/not2pixel/DuoHacker/main/v2/duohacker-v2.user.js'
  );

  const code = await res.text();

  eval(code);

  console.log(
    '[DuoHacker] injected successfully'
  );

} catch (err) {

  console.error(
    '[DuoHacker] injection failed:',
    err
  );
}

})();