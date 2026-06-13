(function () {
  var SELECTOR = "[data-count-stat]";
  var DURATION = 1200;
  var seen = typeof WeakSet === "function" ? new WeakSet() : null;

  function format(value, suffix) {
    return String(Math.round(value)) + (suffix || "");
  }

  function easeOutCubic(progress) {
    return 1 - Math.pow(1 - progress, 3);
  }

  function hasSeen(element) {
    if (seen) {
      return seen.has(element);
    }

    return element.getAttribute("data-count-animated") === "true";
  }

  function markSeen(element) {
    if (seen) {
      seen.add(element);
    }

    element.setAttribute("data-count-animated", "true");
  }

  function animateWithTimer(element, end, suffix) {
    var start = Date.now();
    var timer = window.setInterval(function () {
      var elapsed = Date.now() - start;
      var progress = Math.min(elapsed / DURATION, 1);

      element.textContent = format(end * easeOutCubic(progress), suffix);

      if (progress >= 1) {
        window.clearInterval(timer);
        element.textContent = format(end, suffix);
      }
    }, 16);
  }

  function animateWithFrame(element, end, suffix) {
    var startTime = 0;

    function tick(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }

      var progress = Math.min((timestamp - startTime) / DURATION, 1);
      element.textContent = format(end * easeOutCubic(progress), suffix);

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        element.textContent = format(end, suffix);
      }
    }

    window.requestAnimationFrame(tick);
  }

  function run(element) {
    if (hasSeen(element)) {
      return;
    }

    var end = Number(element.getAttribute("data-count-stat"));
    var suffix = element.getAttribute("data-count-suffix") || "";

    if (!Number.isFinite(end)) {
      return;
    }

    markSeen(element);
    element.textContent = format(0, suffix);

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = format(end, suffix);
      return;
    }

    if (typeof window.requestAnimationFrame === "function") {
      animateWithFrame(element, end, suffix);
      return;
    }

    animateWithTimer(element, end, suffix);
  }

  function setup(root) {
    var elements = (root || document).querySelectorAll(SELECTOR);

    if (!elements.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      elements.forEach(run);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          run(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 },
    );

    elements.forEach(function (element) {
      if (!hasSeen(element)) {
        observer.observe(element);
      }
    });
  }

  function scanVisible(root) {
    var elements = (root || document).querySelectorAll(SELECTOR);
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    elements.forEach(function (element) {
      if (hasSeen(element)) {
        return;
      }

      var rect = element.getBoundingClientRect();

      if (rect.top < viewportHeight * 0.85 && rect.bottom > 0) {
        run(element);
      }
    });
  }

  function refresh(root) {
    setup(root || document);
    scanVisible(root || document);
  }

  function start() {
    refresh(document);
    window.__bstelStartCounters = function () {
      refresh(document);
    };

    if ("MutationObserver" in window) {
      new MutationObserver(function (records) {
        records.forEach(function (record) {
          record.addedNodes.forEach(function (node) {
            if (node.nodeType === 1) {
              refresh(node);
            }
          });
        });
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  window.addEventListener("load", function () {
    window.setTimeout(function () {
      refresh(document);
    }, 250);
  });

  window.addEventListener("pageshow", function () {
    window.setTimeout(function () {
      refresh(document);
    }, 250);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
