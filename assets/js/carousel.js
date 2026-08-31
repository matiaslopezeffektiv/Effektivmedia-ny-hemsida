$(window).on("load", function () {
    $(".tf-swiper").each(function (index, element) {
        const $this = $(element);

        const laptop = $this.data("laptop") ?? 1;
        const desktop = $this.data("preview") ?? 1;
        const tablet = $this.data("tablet") ?? 1;
        const mobile = $this.data("mobile") ?? 1;
        const mobileSm = $this.data("mobile-sm") ?? mobile;

        let spacing = $this.data("space") ?? 0;
        let spacingMd = $this.data("space-md") ?? spacing;
        let spacingLg = $this.data("space-lg") ?? spacingMd;
        let spacingXxl = $this.data("space-xxl") ?? spacingLg;

        const perGroup = $this.data("group") ?? 1;
        const perGroupSm = $this.data("group-sm") ?? 1;
        const perGroupMd = $this.data("group-md") ?? 1;
        const perGroupLg = $this.data("group-lg") ?? 1;

        const gridRows = $this.data("grid") ?? 1;
        const cursorType = $this.data("cursor") ?? false;
        const loop = $this.data("loop") ?? false;
        const effect = $this.data("effect") ?? "slide";
        const autoplayEnabled = $this.data("auto") ?? false;
        const speed = $this.data("speed") ?? 800;
        const delay = $this.data("delay") ?? 3000;
        const directionDesktop = $this.data("direction") ?? "horizontal";
        const centered = $this.data("center") ?? false;
        const init = $this.data("init") ?? 0;
        const typePag = $this.data("type-pagination") ?? "bullets";

        const paginationEl =
            $this.find(".tf-sw-pagination")[0] ||
            $this.closest(".tf-pag-swiper").find(".tf-sw-pagination")[0];

        const swiperT = new Swiper($this[0], {
            direction: "horizontal",
            speed: speed,
            centeredSlides: centered,
            slidesPerView: mobile,
            spaceBetween: spacing,
            slidesPerGroup: perGroup,
            grabCursor: cursorType,
            loop: loop,
            effect: effect,
            initialSlide: init,
            observer: true,
            observeParents: true,

            autoplay: autoplayEnabled
                ? {
                    delay: delay,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }
                : false,

            grid: {
                rows: gridRows > 1 ? gridRows : 1,
                fill: "row",
            },

            pagination: {
                el: paginationEl,
                clickable: true,
                type: typePag,
            },

            navigation: {
                nextEl: [
                    $this.closest(".tf-btn-swiper-main").find(".nav-next-swiper")[0],
                    $this.closest(".container").find(".swiper-action-group .nav-next-swiper")[0],
                ],
                prevEl: [
                    $this.closest(".tf-btn-swiper-main").find(".nav-prev-swiper")[0],
                    $this.closest(".container").find(".swiper-action-group .nav-prev-swiper")[0],
                ],
            },

            breakpoints: {
                1600: {
                    direction: directionDesktop,
                    slidesPerView: laptop,
                    spaceBetween: spacingXxl,
                    slidesPerGroup: perGroupLg,
                },
                1200: {
                    direction: directionDesktop,
                    slidesPerView: desktop,
                    spaceBetween: spacingLg,
                    slidesPerGroup: perGroupLg,
                },
                768: {
                    direction: "horizontal",
                    slidesPerView: tablet,
                    spaceBetween: spacingMd,
                    slidesPerGroup: perGroupMd,
                },
                575: {
                    direction: "horizontal",
                    slidesPerView: mobileSm,
                    spaceBetween: spacing,
                    slidesPerGroup: perGroupSm,
                },
            },
        });

        const $wrap = $this.closest(".swiper-action-wrap");

        $wrap.find(".swiper-button").on("mousemove", function () {
            const slideIndex = $(this).data("slide");
            if (slideIndex !== undefined) {
                swiperT.slideTo(slideIndex, 500);
            }
        });

        if ($this.hasClass("swiper-scroll")) {
            let scrolling = false;

            $(window).on("wheel", function (e) {
                if (scrolling) return;
                if (!isInViewport($this[0])) return;

                scrolling = true;

                if (e.originalEvent.deltaY > 0) {
                    swiperT.slideNext();
                } else {
                    swiperT.slidePrev();
                }

                setTimeout(() => {
                    scrolling = false;
                }, 400);
            });

            function isInViewport(el) {
                const rect = el.getBoundingClientRect();
                return (
                    rect.top < window.innerHeight * 0.8 &&
                    rect.bottom > window.innerHeight * 0.2
                );
            }
        }
    });
});

if ($(".tf-sw-slideshow").length > 0) {
    var tfSwSlideshow = $(".tf-sw-slideshow");
    var preview = tfSwSlideshow.data("preview");
    var tablet = tfSwSlideshow.data("tablet");
    var mobile = tfSwSlideshow.data("mobile");
    var spacing = tfSwSlideshow.data("space");
    var spacingMb = tfSwSlideshow.data("space-mb");
    var loop = tfSwSlideshow.data("loop");
    var play = tfSwSlideshow.data("auto-play");
    var centered = tfSwSlideshow.data("centered");
    var effect = tfSwSlideshow.data("effect");
    var speed =
        tfSwSlideshow.data("speed") !== undefined
            ? tfSwSlideshow.data("speed")
            : 1000;
    var swiperSlider = {
        autoplay: play
            ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }
            : false,
        slidesPerView: mobile,
        loop: loop,
        spaceBetween: spacingMb,
        speed: speed,
        observer: true,
        observeParents: true,
        pagination: {
            el: ".sw-pagination-slider",
            clickable: true,
        },
        navigation: {
            clickable: true,
            nextEl: ".navigation-next-slider",
            prevEl: ".navigation-prev-slider",
        },
        centeredSlides: false,
        breakpoints: {
            768: {
                slidesPerView: tablet,
                spaceBetween: spacing,
                centeredSlides: false,
            },
            1200: {
                slidesPerView: preview,
                spaceBetween: spacing,
                centeredSlides: centered,
            },
        },
    };
    if (effect === "fade") {
        swiperSlider.effect = "fade";
        swiperSlider.fadeEffect = {
            crossFade: true,
        };
    }
    var swiper = new Swiper(".tf-sw-slideshow", swiperSlider);
}

if ($(".tf-sw-thumbs").length > 0) {
    var thumbSwiper = new Swiper(".sw-thumb", {
        slidesPerView: 1,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        speed: 800,
        spaceBetween: 15,
        centeredSlides: true,
    });

    var mainSwiper = new Swiper(".sw-main-thumb", {
        grabCursor: true,
        spaceBetween: 15,
        speed: 800,
        navigation: {
            nextEl: ".tf-sw-thumbs .nav-next-swiper",
            prevEl: ".tf-sw-thumbs .nav-prev-swiper",
        },
        pagination: {
            el: ".sw-pg-thumb",
            clickable: true,
        },
    });
    thumbSwiper.controller.control = mainSwiper;
    mainSwiper.controller.control = thumbSwiper;
}



