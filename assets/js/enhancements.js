/**
 * Small on-brand interaction polish, kept separate from main.js.
 * - Staggered scroll-reveal for [data-reveal] elements
 * - Count-up animation for [data-count-to] numbers
 * - Rotating word swap for [data-rotate-words] (hero headline)
 * Respects prefers-reduced-motion and no-ops safely if elements are absent.
 */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Scroll reveal (stagger via data-reveal-delay, ms)
    -------------------------------------------------------------------------*/
    var revealEls = document.querySelectorAll("[data-reveal]");
    if (revealEls.length) {
        if (reduceMotion || typeof IntersectionObserver === "undefined") {
            revealEls.forEach(function (el) {
                el.classList.add("is-revealed");
            });
        } else {
            var revealObserver = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (!entry.isIntersecting) return;
                        var el = entry.target;
                        var delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
                        window.setTimeout(function () {
                            el.classList.add("is-revealed");
                        }, delay);
                        revealObserver.unobserve(el);
                    });
                },
                { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
            );
            revealEls.forEach(function (el) {
                revealObserver.observe(el);
            });
        }
    }

    /* Count-up numbers
    -------------------------------------------------------------------------*/
    var countEls = document.querySelectorAll("[data-count-to]");
    if (countEls.length) {
        var formatNumber = function (n) {
            return n.toLocaleString("sv-SE");
        };
        var runCount = function (el) {
            var target = parseInt(el.getAttribute("data-count-to"), 10);
            if (isNaN(target)) return;
            if (reduceMotion) {
                el.textContent = formatNumber(target);
                return;
            }
            var duration = 1400;
            var start = null;
            var step = function (ts) {
                if (start === null) start = ts;
                var progress = Math.min((ts - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = formatNumber(Math.floor(eased * target));
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.textContent = formatNumber(target);
                }
            };
            window.requestAnimationFrame(step);
        };
        if (typeof IntersectionObserver === "undefined") {
            countEls.forEach(runCount);
        } else {
            var countObserver = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (!entry.isIntersecting) return;
                        runCount(entry.target);
                        countObserver.unobserve(entry.target);
                    });
                },
                { threshold: 0.4 }
            );
            countEls.forEach(function (el) {
                countObserver.observe(el);
            });
        }
    }

    /* Rotating headline word
    -------------------------------------------------------------------------*/
    var rotateEl = document.querySelector("[data-rotate-words]");
    if (rotateEl && !reduceMotion) {
        var rotateWords = rotateEl.getAttribute("data-rotate-words").split(",");
        var rotateIndex = 0;
        if (rotateWords.length > 1) {
            window.setInterval(function () {
                rotateIndex = (rotateIndex + 1) % rotateWords.length;
                rotateEl.classList.add("is-swapping");
                window.setTimeout(function () {
                    rotateEl.textContent = rotateWords[rotateIndex];
                    rotateEl.classList.remove("is-swapping");
                }, 350);
            }, 2600);
        }
    }

})();
