"use strict";
DomUtils.documentReady(function() {
  if (MainPort.safePost({ handler: "reg", visible: true })) {
    return;
  }
  var ELs = Settings.ELs;
  addEventListener("hashchange", Settings.checkIfEnabled);
  ELs.onWndFocus = MainPort.safePost.bind(MainPort, {
    handler: "frameFocused"
  }, function() {
    setTimeout(function() {
      if (MainPort && !MainPort.port) {
        Settings.ELs.destroy();
      }
    }, 50);
  });
});

if (chrome.runtime.onMessageExternal) {
  VimiumInjector.alive = 1;
} else {
  VimiumInjector.alive = 0.5;
  console.log("%cVimium++%c: injected %cpartly%c into %c" + chrome.runtime.id
    , "color: red;", "color: auto;"
    , "color: red;", "color: auto;", "color: blue;");
}

Settings.onDestroy = function() {
  removeEventListener("hashchange", Settings.checkIfEnabled);
  if (MainPort.port) {
    try {
      MainPort.port.disconnect();
    } catch (e) {}
  }
  if (EventTarget.removeClickListener) {
    EventTarget.removeClickListener();
    delete EventTarget.removeClickListener;
  }
  var injector = VimiumInjector;
  injector.alive = 0;
  injector.destroy = null;
  [].forEach.call(document.querySelectorAll(
  'script[src^="chrome-extension://hfjbmagddngcpeloejdejnfgbamkjaeg/"]'
  ), function(node) { node.remove(); });
};

VimiumInjector.destroy = function() { Settings.ELs.destroy(); };
