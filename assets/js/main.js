/**
 * Header Fixed
 * Handle Mobile Menu
 * Footer
 * Handle Sidebar Filter
 * Counter
 * Video
 * Mouse Follow Title
 * Infinite Slide
 * Service Accordion
 * Init Awards According
 * Change Image By Accordion
 * Circles Progress Level
 * Parallax Image
 * Go Top
 * Preloader
 * Device Switch
 * Accordion Scroll Fix
 *
 **/

(function ($) {
    ("use strict");

    /* Header Fixed
    -------------------------------------------------------------------------*/
    var headerFixed = function () {

        if ($(".header-fixed").length) {
            const $header = $(".header-fixed");

            const hasTopbar = $(".top-bar").length > 0;
            const topbarHeight = hasTopbar ? $(".top-bar").outerHeight() : 0;

            $(window).on("scroll", function () {
                const scrollTop = $(this).scrollTop();

                if (hasTopbar) {
                    if (scrollTop >= topbarHeight) {
                        $header.addClass("is-fixed");
                    } else {
                        $header.removeClass("is-fixed");
                    }
                } else {
                    if (scrollTop > 0) {
                        $header.addClass("is-fixed");
                    } else {
                        $header.removeClass("is-fixed");
                    }
                }
            });
        }

        $(".inner-link").click(function () {
            $(this)
                .closest(".navigation")
                .find("li.inner-link")
                .removeClass("current-menu");
            $(this).addClass("current-menu");
        });

        window.addEventListener("scroll", function () {
            let current = "";
            const sections = document.querySelectorAll(".section-one-page");
            const navLinks = document.querySelectorAll(".inner-link ");

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 180) {
                    current = section.getAttribute("id");
                }
            });

            navLinks.forEach((link) => {
                link.classList.remove("current-menu");
                if (
                    link.querySelector("a").getAttribute("href") ===
                    `#${current}`
                ) {
                    link.classList.add("current-menu");
                }
            });
        });
    };

    /* Handle Mobile Menu
   -------------------------------------------------------------------------*/
    var handleMobileMenu = function () {
        const $desktopMenu = $(".box-nav-menu:not(.not-append)").clone();
        $desktopMenu.find(".list-ver, .list-hor,.mn-none").remove();

        const $mobileMenu = $('<ul class="nav-ul-mb"></ul>');

        $desktopMenu.find("> li.menu-item").each(function (i, menuItem) {
            const $item = $(menuItem);
            const iconArrow = "icon-chevron-down";
            const text = $item
                .find("> a.item-link")
                .clone()
                .children()
                .remove()
                .end()
                .text()
                .trim();
            const submenu = $item.find("> .sub-menu");
            const id = "dropdown-menu-" + i;
            const isActive = $item.find("> a.item-link").hasClass("active");

            const activeClass = isActive ? "active" : "";
            const showClass = isActive ? "show" : "";
            const expanded = isActive ? "true" : "false";

            if (submenu.length > 0) {
                const $li = $(`
                    <li class="nav-mb-item">
                        <a href="#${id}" 
                           class="collapsed mb-menu-link ${activeClass}" 
                           data-bs-toggle="collapse" 
                           aria-expanded="${expanded}" 
                           aria-controls="${id}">
                            <span>${text}</span>
                            <span class="icon ${iconArrow}"></span>
                        </a>
                        <div id="${id}" class="collapse ${showClass}"></div>
                    </li>
                `);

                const $subNav = $('<ul class="sub-nav-menu"></ul>');

                submenu.find(".mega-menu-item").each(function (j) {
                    const heading = $(this).find(".menu-heading").text().trim();
                    const subId = `${id}-group-${j}`;
                    const $group = $(`
                        <li>
                            <a href="#${subId}" class="collapsed sub-nav-link" 
                               data-bs-toggle="collapse" aria-expanded="false" 
                               aria-controls="${subId}">
                                <span>${heading}</span>
                                <span class="icon ${iconArrow}"></span>
                            </a>
                            <div id="${subId}" class="collapse">
                                <ul class="sub-nav-menu sub-menu-level-2"></ul>
                            </div>
                        </li>
                    `);

                    $(this)
                        .find(".sub-menu_list a")
                        .each(function () {
                            const $link = $(this);
                            const linkHref = $link.attr("href") || "#";
                            const title = (
                                $link.find(".mega-link-title").length
                                    ? $link.find(".mega-link-title").text()
                                    : $link.text()
                            ).trim();
                            const isActive = $link.hasClass("active");

                            if (title !== "") {
                                const activeClass = isActive ? "active" : "";
                                $group
                                    .find(".sub-menu-level-2")
                                    .append(
                                        `<li><a href="${linkHref}" class="sub-nav-link ${activeClass}">${title}</a></li>`
                                    );
                            }
                        });

                    $subNav.append($group);
                });

                if ($subNav.children().length === 0) {
                    submenu.find("a").each(function () {
                        const link = $(this).attr("href") || "#";
                        const title = $(this).text().trim();
                        const isActive = $(this).hasClass("active");
                        const activeClass = isActive ? "active" : "";

                        if (title !== "") {
                            $subNav.append(
                                `<li><a href="${link}" class="sub-nav-link ${activeClass}">${title}</a></li>`
                            );
                        }
                    });
                }

                $li.find(`#${id}`).append($subNav);
                $mobileMenu.append($li);
            } else {
                const activeClass = isActive ? "active" : "";
                $mobileMenu.append(
                    `<li class="nav-mb-item"><a href="${$item
                        .find("a")
                        .attr(
                            "href"
                        )}" class="mb-menu-link ${activeClass}"><span>${text}</span></a></li>`
                );
            }
        });

        $("#wrapper-menu-navigation").empty().append($mobileMenu.html());
    };

    /* Handle Footer
   -------------------------------------------------------------------------*/
    var handleFooter = function () {
        var footerAccordion = function () {
            var args = { duration: 250 };
            $(".title-mobile").on("click", function () {
                var $parent = $(this).parent(".footer-col-block");
                var $content = $(this).next();

                $parent.toggleClass("open");

                if (!$parent.hasClass("open")) {
                    $content.slideUp(args);
                } else {
                    $content.slideDown(args);
                }
            });
        };

        function handleAccordion() {
            if (window.matchMedia("only screen and (max-width: 575px)").matches) {
                if (!$(".title-mobile").data("accordion-initialized")) {
                    footerAccordion();
                    $(".title-mobile").data("accordion-initialized", true);
                }
            } else {
                $(".title-mobile")
                    .off("click")
                    .removeData("accordion-initialized")
                    .each(function () {
                        $(this).parent(".footer-col-block").removeClass("open").end().next().removeAttr("style");
                    });
            }
        }

        handleAccordion();
        $(window).on("resize", handleAccordion);
    };

    /* Handle Sidebar Filter
   -------------------------------------------------------------------------*/
    var handleSidebarFilter = function () {
        $("#filterShop,.sidebar-btn").on("click", function () {
            if ($(window).width() <= 1200) {
                $(".sidebar-filter,.overlay-filter").addClass("show");
            }
        });
        $(".close-filter,.overlay-filter").on("click", function () {
            $(".sidebar-filter,.overlay-filter").removeClass("show");
        });
    };

    /* Counter
   -------------------------------------------------------------------------*/
    var counter = function () {
        if ($(document.body).hasClass("counter-scroll")) {
            const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const element = $(entry.target);

                            if (!element.hasClass("odometer-activated")) {
                                const to = element.data("to");
                                element.addClass("odometer-activated");

                                element.html(to);
                            }

                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            $(".counter .number").each(function () {
                observer.observe(this);
            });
        }
    };

    /* Video
   -------------------------------------------------------------------------*/
    var video = function () {
        if (
            $("div").hasClass("wg-video") ||
            $("div").hasClass("post-format-video")
        ) {
            $(".popup-youtube, .wg-curve-text-video").magnificPopup({
                type: "iframe",
            });
        }
    };

    /* Mouse Follow Title
   -------------------------------------------------------------------------*/
    var mouseFollowTitle = function () {

        var blocks = document.querySelectorAll('.mouse-follow-title');
        if (!blocks.length) return;

        var isDesktop = function () {
            return window.innerWidth >= 768;
        };

        blocks.forEach(function (marquee) {

            var text = marquee.querySelector('.text-follow');
            if (!text) return;

            var targetX = 0;
            var currentX = 0;
            var ease = 0.08;
            var active = false;
            var enabled = false;

            var handleMouseMove = function (e) {
                if (!active || !enabled) return;

                var rect = marquee.getBoundingClientRect();
                var percent = (e.clientX - rect.left) / rect.width - 0.5;
                targetX = percent * 600;
            };

            var onEnter = function () {
                if (enabled) active = true;
            };

            var onLeave = function () {
                active = false;
                targetX = 0;
            };

            marquee.addEventListener("mouseenter", onEnter);
            marquee.addEventListener("mouseleave", onLeave);
            marquee.addEventListener("mousemove", handleMouseMove);

            var animate = function () {
                if (!enabled) targetX = 0;

                currentX += (targetX - currentX) * ease;
                text.style.transform = "translateX(" + currentX + "px)";

                requestAnimationFrame(animate);
            };

            var handleResize = function () {
                enabled = isDesktop();
                if (!enabled) {
                    active = false;
                    targetX = 0;
                }
            };

            window.addEventListener('resize', handleResize);
            handleResize();
            animate();

        });

    };

    /* Infinite Slide 
    -------------------------------------------------------------------------*/
    var infiniteSlide = function () {
        if ($(".infiniteSlide").length > 0) {
            $(".infiniteSlide").each(function () {
                var $this = $(this);
                var style = $this.data("style") || "left";
                var clone = $this.data("clone") || 2;
                var speed = $this.data("speed") || 50;
                var pauseonhover = $this.data("pause") || true;
                $this.infiniteslide({
                    speed: speed,
                    direction: style,
                    clone: clone,
                    pauseonhover: pauseonhover,
                });
            });
        }
    };

    /* Service Accordion
  -------------------------------------------------------------------------------------*/
    var serviceAccordion = function () {
        let currentIndex = 1;
        const items = $(".service-accordion-item");
        const tabs = $(".nav-item");
        const slides = $(".slider-wrap");
        var item_width = $(
            ".service-accordion-item:not( .is-active)"
        ).outerWidth();

        function updateElementWidth() {
            const elWidth = $(".service-accordion").outerWidth();
            $(".service-accordion").css("--main-width", elWidth + "px");
        }

        function showPanel(index) {
            items.removeClass("is-active").eq(index).addClass("is-active");
            tabs.removeClass("is-active").eq(index).addClass("is-active");
            let itemWidth = items.not(".is-active").outerWidth();
            let transformValue;
            const breakpoint = window.matchMedia("( max-width: 768px)");
            const breakpointChecker = function (index) {
                if (breakpoint.matches === true) {
                    transformValue =
                        "translateX(" + -item_width * index + "px)";
                } else if (breakpoint.matches === false) {
                    if (index === 0) {
                        transformValue = "translateX(0px)";
                    } else if (index === items.length - 1) {
                        transformValue =
                            "translateX(" + -item_width * (index - 3) + "px)";
                    } else if (index === items.length - 2) {
                        transformValue =
                            "translateX(" + -item_width * (index - 2) + "px)";
                    } else {
                        transformValue =
                            "translateX(" + -item_width * (index - 1) + "px)";
                    }
                }
                slides.css("transform", transformValue);
            };

            breakpoint.addListener(breakpointChecker);
            breakpointChecker(index);
        }

        $(window).on("resize", function () {
            updateElementWidth();
            showPanel(currentIndex);
        });

        tabs.on("click", function () {
            currentIndex = items.index($($(this).data("target")));
            showPanel(currentIndex);
        });

        items.on("click", function () {
            currentIndex = items.index($(this));
            showPanel(currentIndex);
        });

        $("#nextButton").on("click", function () {
            currentIndex = (currentIndex + 1) % items.length;
            showPanel(currentIndex);
        });

        $("#prevButton").on("click", function () {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            showPanel(currentIndex);
        });

        showPanel(currentIndex);
        updateElementWidth();
    };

    /* Init Awards According
  -------------------------------------------------------------------------------------*/
    var initAwardsAccording = function () {
        var items = document.querySelectorAll('.awards-according-list .awards-according');

        var setActive = function (element) {
            items.forEach(function (i) {
                i.classList.remove('active');
            });

            element.classList.add('active');
        };

        items.forEach(function (item) {
            item.addEventListener('click', function () {
                setActive(this);
            });
        });
    };

    /* Change Image By Accordion
  -------------------------------------------------------------------------------------*/
    var changeImageByAccordion = function () {

        var $wrap = $("#According2");
        var $main = $("#mainImage");
        var isAnimating = false;

        if (!$wrap.length || !$main.length) return;

        $wrap.find(".collapse").on("show.bs.collapse", function () {

            if (isAnimating) return;

            var $item = $(this).closest(".according-item");
            var newImage = $item.data("image");

            if (!newImage || $main.attr("src") === newImage) return;

            isAnimating = true;

            var $frame = $main.parent();

            var $temp = $("<img>", {
                class: "slide-temp",
                src: newImage
            });

            $frame.append($temp);

            requestAnimationFrame(function () {
                $main.css("transform", "translateX(100%)");
                $temp.css("transform", "translateX(0)");
            });

            setTimeout(function () {

                // tắt transition để tránh giật
                $main.css({
                    transition: "none",
                    transform: "translateX(0)"
                });

                $main.attr("src", newImage);

                // force render
                $main[0].offsetHeight;

                // bật lại transition
                $main.css("transition", "transform .4s ease");

                $temp.remove();

                isAnimating = false;

            }, 400);

        });

    };
    /* Circles Progress Level
     -------------------------------------------------------------------------------------*/
    var circlesProgressLevel = function () {
        var circles = document.querySelectorAll(".progress-circle-svg");
        var observer = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
                        var el = entry.target;
                        var progressValue = parseFloat(el.dataset.progress);

                        var textElement = el.querySelector(".progress-text");
                        var progressBar = el.querySelector(".progress-ring-bar");

                        var radius = parseFloat(progressBar.getAttribute("r"));
                        var circumference = 2 * Math.PI * radius;

                        progressBar.style.strokeDasharray = `${circumference} ${circumference}`;
                        progressBar.style.strokeDashoffset = circumference;

                        let currentProgress = 0;
                        let animationFrameId;

                        function animateCircle() {
                            if (currentProgress < progressValue) {
                                currentProgress += 1;
                                const offset = circumference - (currentProgress / 100) * circumference;
                                progressBar.style.strokeDashoffset = offset;
                                textElement.textContent = Math.round(currentProgress);
                                animationFrameId = requestAnimationFrame(animateCircle);
                            } else {
                                const finalOffset = circumference - (progressValue / 100) * circumference;
                                progressBar.style.strokeDashoffset = finalOffset;
                                textElement.textContent = Math.round(progressValue);
                                cancelAnimationFrame(animationFrameId);
                            }
                        }

                        animateCircle();
                        observer.unobserve(el);
                    }
                });
            },
            { threshold: 0.9 }
        );

        circles.forEach(function (circle) {
            observer.observe(circle);
        });
    };

    /* Progress Level
     -------------------------------------------------------------------------------------*/
    var progressLevel = function () {
        var bars = document.querySelectorAll(".progress-bars-line > div");

        var observer = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
                        var bar = entry.target;
                        var t1 = parseFloat(bar.dataset.progress);
                        var t2 = parseFloat(bar.dataset.max);
                        var targetWidth = (t1 / t2) * 100;
                        var currentWidth = 25;

                        function animate() {
                            if (currentWidth < targetWidth) {
                                currentWidth += 1;
                                bar.style.width = currentWidth + "%";
                                requestAnimationFrame(animate);
                            } else {
                                bar.style.width = targetWidth + "%";
                            }
                        }

                        animate();
                        observer.unobserve(bar);
                    }
                });
            },
            { threshold: 0.9 }
        );

        bars.forEach(function (bar) {
            bar.style.width = "0    %";
            observer.observe(bar);
        });
    };

    /* Parallax Image
       -------------------------------------------------------------------------------------*/
    var parallaxImage = function () {
        if ($(".parallax-img").length > 0) {
            $(".parallax-img").each(function () {
                new SimpleParallax(this, {
                    delay: 0.6,
                    orientation: "up",
                    scale: 1.3,
                    transition: "cubic-bezier(0,0,0,1)",
                    customContainer: "",
                    customWrapper: "",
                });
            });
        }
    };

    /* Go Top
      -------------------------------------------------------------------------------------*/
    var goTop = function () {
        if ($("div").hasClass("progress-wrap")) {
            var progressPath = document.querySelector(".progress-wrap path");
            var pathLength = progressPath.getTotalLength();
            progressPath.style.transition = progressPath.style.WebkitTransition =
                "none";
            progressPath.style.strokeDasharray = pathLength + " " + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition =
                "stroke-dashoffset 10ms linear";
            var updateprogress = function () {
                var scroll = $(window).scrollTop();
                var height = $(document).height() - $(window).height();
                var progress = pathLength - (scroll * pathLength) / height;
                progressPath.style.strokeDashoffset = progress;
            };
            updateprogress();
            $(window).scroll(updateprogress);
            var offset = 0;
            var duration = 0;
            jQuery(window).on("scroll", function () {
                if (jQuery(this).scrollTop() > offset) {
                    jQuery(".progress-wrap").addClass("active-progress");
                } else {
                    jQuery(".progress-wrap").removeClass("active-progress");
                }
            });
            jQuery(".progress-wrap").on("click", function (event) {
                event.preventDefault();
                jQuery("html, body").animate({ scrollTop: 0 }, duration);
                return false;
            });
            jQuery(".progress-wrap").on("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    jQuery("html, body").animate({ scrollTop: 0 }, duration);
                }
            });
        }
    };

    /* Preloader 
    ------------------------------------------------------------------------------------- */
    var preloader = function () {
        setTimeout(function () {
            $(".preload").fadeOut("slow", function () {
                $(this).remove();
            });
        }, 200);
    };


    // Dom Ready
    /* Device Switch
   -------------------------------------------------------------------------*/
    var deviceSwitch = function () {
        $(".device-switch").each(function () {
            var $switch = $(this);
            var $mockup = $switch.closest(".device-showcase").find(".device-mockup");

            $switch.on("click", ".device-switch-btn", function () {
                var $btn = $(this);
                if ($btn.hasClass("is-active")) {
                    return;
                }

                $switch.find(".device-switch-btn").removeClass("is-active").attr("aria-pressed", "false");
                $btn.addClass("is-active").attr("aria-pressed", "true");

                $mockup.toggleClass("is-mobile", $btn.data("view") === "mobile");
            });
        });
    };

    /* Accordion Scroll Fix
       Keeps the clicked accordion header in view after a sibling panel
       collapses above it and shifts the layout up.
   -------------------------------------------------------------------------*/
    var accordionScrollFix = function () {
        $(".according-item .collapse").on("shown.bs.collapse", function () {
            var $header = $(this).closest(".according-item").find(".header-according");
            if (!$header.length) return;

            var offset = $header.offset().top - 100;
            $("html, body").animate({ scrollTop: offset }, 300);
        });
    };

    $(function () {
        headerFixed();
        handleMobileMenu();
        handleFooter();
        handleSidebarFilter();
        counter();
        video();
        mouseFollowTitle();
        infiniteSlide();
        serviceAccordion();
        initAwardsAccording();
        changeImageByAccordion();
        circlesProgressLevel();
        progressLevel();
        parallaxImage();
        goTop();
        preloader();
        deviceSwitch();
        accordionScrollFix();

    });
})(jQuery);
