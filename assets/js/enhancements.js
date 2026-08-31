/**
 * Small on-brand interaction polish, kept separate from main.js.
 * - Subtle scroll parallax on the hero background blobs
 * Respects prefers-reduced-motion and no-ops safely if elements are absent.
 */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    /* Hero blob parallax
    -------------------------------------------------------------------------*/
    var hero = document.querySelector(".section-hero");
    if (hero) {
        var sharps = hero.querySelectorAll(".img-sharp");
        if (sharps.length) {
            var ticking = false;
            var updateParallax = function () {
                var rect = hero.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < window.innerHeight) {
                    sharps.forEach(function (el, i) {
                        var speed = i === 0 ? 0.12 : 0.2;
                        var offset = rect.top * speed;
                        el.style.transform = "translateY(" + offset.toFixed(1) + "px)";
                    });
                }
                ticking = false;
            };
            window.addEventListener(
                "scroll",
                function () {
                    if (!ticking) {
                        window.requestAnimationFrame(updateParallax);
                        ticking = true;
                    }
                },
                { passive: true }
            );
        }
    }
})();
