(function ($) {
    "use strict";

    /* Range Two Price
  -------------------------------------------------------------------------------------*/
    var rangeTwoPrice = function () {
        if ($("#price-value-range").length > 0) {
            var skipSlider = document.getElementById("price-value-range");
            var skipValues = [document.getElementById("price-min-value"), document.getElementById("price-max-value")];

            var min = parseInt(skipSlider.getAttribute("data-min"), 10) || 0;
            var max = parseInt(skipSlider.getAttribute("data-max"), 10) || 500;

            noUiSlider.create(skipSlider, {
                start: [min, max],
                connect: true,
                step: 1,
                range: {
                    min: min,
                    max: max,
                },
                format: {
                    from: function (value) {
                        return parseInt(value, 10);
                    },
                    to: function (value) {
                        return parseInt(value, 10);
                    },
                },
            });

            skipSlider.noUiSlider.on("update", function (val, e) {
                skipValues[e].innerText = val[e];
            });
        }
    };

    /* Filter Products
  -------------------------------------------------------------------------------------*/
    var filterProducts = function () {
        const priceSlider = document.getElementById("price-value-range");

        const minPrice = parseInt(priceSlider.dataset.min, 10) || 0;
        const maxPrice = parseInt(priceSlider.dataset.max, 10) || 500;

        const filters = {
            minPrice: minPrice,
            maxPrice: maxPrice,
            colors: null,
            categories: null,
            availability: null,
            brands: [],
            sizes: null,
            skins: [],
        };

        priceSlider.noUiSlider.on("update", function (values) {
            filters.minPrice = parseInt(values[0], 10);
            filters.maxPrice = parseInt(values[1], 10);

            $("#price-min-value").text(filters.minPrice);
            $("#price-max-value").text(filters.maxPrice);

            applyFilters();
            updateMetaFilter();
            updatePagination();
            // scrollToFilterTop();
        });

        $('input[name="color"]').on("change", function () {
            const colorId = $(this).attr("id");
            const label = $(`label[for="${colorId}"]`);
            filters.colors = label.find(".color-text").text().trim();
            applyFilters();
            updateMetaFilter();
            updatePagination();
            scrollToFilterTop();
        });

        $('input[name="brand"]').change(function () {
            const brandId = $(this).attr("id");
            const brandLabel = $(`label[for="${brandId}"]`);
            let brandText = brandLabel.find(".brand-text").text().trim();
            if ($(this).is(":checked")) {
                filters.brands.push({ id: brandId, label: brandText });
            } else {
                filters.brands = filters.brands.filter((brand) => brand.id !== brandId);
            }
            applyFilters();
            updateMetaFilter();
            updatePagination();
            scrollToFilterTop();
        });
        $('input[name="availability"]').on("change", function () {
            filters.availability = $(this).attr("id") === "inStock" ? "In stock" : "Out of stock";
            applyFilters();
            updateMetaFilter();
            updatePagination();
            scrollToFilterTop();
        });
        $('input[name="type"]').on("change", function () {
            const typeId = $(this).attr("id");
            const label = $(`label[for="${typeId}"]`);

            if (typeId === "all-type") {
                filters.categories = null;
            } else {
                filters.categories = label.find(".type-text").text().trim();
            }

            applyFilters();
            updateMetaFilter();
            updatePagination();
            scrollToFilterTop();
        });
        $('input[name="size"]').on("change", function () {
            const sizeId = $(this).attr("id");
            const label = $(`label[for="${sizeId}"]`);
            filters.sizes = label.find(".size-text").text().trim();
            applyFilters();
            updateMetaFilter();
            updatePagination();
            scrollToFilterTop();
        });
        $('input[name="skin"]').change(function () {
            const skinId = $(this).attr("id");
            const skinLabel = $(`label[for="${skinId}"]`);
            const skinText = skinLabel.find(".skin-text").text().trim();

            if ($(this).is(":checked")) {
                filters.skins.push({ label: skinText });
            } else {
                filters.skins = filters.skins.filter((skin) => skin.label !== skinText);
            }

            applyFilters();
            updateMetaFilter();
            updatePagination();
            scrollToFilterTop();
        });

        function updatePagination() {
            if ($(".meta-filter-shop").hasClass("active") == true) {
                $("#listLayout .wg-pagination").css("display", "none");
                $("#gridLayout .wg-pagination").css("display", "none");
            }
        }
        function updateMetaFilter() {
            const appliedFilters = $("#applied-filters");
            const metaFilterShop = $(".meta-filter-shop");
            appliedFilters.empty();

            if (filters.availability) {
                appliedFilters.append(
                    `<span class="filter-tag remove-tag" data-filter="availability"><span class="icon icon-close"></span> Availability: ${filters.availability} </span>`
                );
            }

            if (filters.brands.length > 0) {
                filters.brands.forEach((brand) => {
                    appliedFilters.append(
                        `<span class="filter-tag remove-tag" data-filter="brand" data-value="${brand.id}"><span class="icon icon-close"></span> ${brand.label}</span>`
                    );
                });
            }
            if (filters.minPrice > minPrice || filters.maxPrice < maxPrice) {
                appliedFilters.append(
                    `<span class="filter-tag remove-tag" data-filter="price"><span class="icon icon-close"></span>Price: $${filters.minPrice} - $${filters.maxPrice}</span>`
                );
            }

            if (filters.colors) {
                appliedFilters.append(
                    `<span class="filter-tag remove-tag " data-filter="color"><span class="icon icon-close"></span>Color: ${filters.colors}</span>`
                );
            }
            if (filters.categories) {
                appliedFilters.append(
                    `<span class="filter-tag remove-tag " data-filter="type"><span class="icon icon-close"></span>Category: ${filters.categories}</span>`
                );
            }

            if (filters.skins.length > 0) {
                filters.skins.forEach((skin) => {
                    appliedFilters.append(
                        `<span class="filter-tag remove-tag" data-filter="skin" data-value="${skin.label}"><span class="icon icon-close"></span> ${skin.label}</span>`
                    );
                });
            }
            if (filters.sizes) {
                appliedFilters.append(
                    `<span class="filter-tag remove-tag " data-filter="size"><span class="icon icon-close"></span>Size: ${filters.sizes}</span>`
                );
            }
            const hasFiltersApplied = appliedFilters.children().length > 0;
            metaFilterShop.toggleClass("active", hasFiltersApplied);
            $("#remove-all").toggle(hasFiltersApplied);
            if ($(".meta-filter-shop").hasClass("active") == false) {
                limitLayout();
            }
        }

        $("#applied-filters").on("click", ".remove-tag", function () {
            const filterType = $(this).data("filter");
            const filterValue = $(this).data("value");

            if (filterType === "color") {
                filters.colors = null;
                $('input[name="color"]').prop("checked", false);
            }
            if (filterType === "brand") {
                filters.brands = filters.brands.filter((brand) => brand.id !== filterValue);
                $(`input[name="brand"][id="${filterValue}"]`).prop("checked", false);
            }
            if (filterType === "price") {
                filters.minPrice = minPrice;
                filters.maxPrice = maxPrice;
                priceSlider.noUiSlider.set([minPrice, maxPrice]);
            }
            if (filterType === "availability") {
                filters.availability = null;
                $('input[name="availability"]').prop("checked", false);
            }
            if (filterType === "type") {
                filters.categories = null;
                $('input[name="type"]').prop("checked", false);
                $("#all-type").prop("checked", true);
            }
            if (filterType === "size") {
                filters.sizes = null;
                $('input[name="size"]').prop("checked", false);
            }
            if (filterType === "skin") {
                filters.skins = filters.skins.filter((skin) => skin.label !== filterValue);
                $('input[name="skin"]').each(function () {
                    const labelText = $(`label[for="${$(this).attr("id")}"]`)
                        .find(".skin-text")
                        .text()
                        .trim();
                    if (labelText === filterValue) {
                        $(this).prop("checked", false);
                    }
                });
            }

            applyFilters();
            updateMetaFilter();
        });

        function resetAllFilters() {
            filters.colors = null;
            filters.brands = [];
            filters.minPrice = minPrice;
            filters.maxPrice = maxPrice;
            filters.availability = null;
            filters.categories = null;
            filters.sizes = null;
            filters.skins = [];
            $('input[name="brand"]').prop("checked", false);
            $('input[name="color"]').prop("checked", false);
            $('input[name="type"]').prop("checked", false);
            $('input[name="availability"]').prop("checked", false);
            $('input[name="size"]').prop("checked", false);
            $('input[name="skin"]').prop("checked", false);

            priceSlider.noUiSlider.set([minPrice, maxPrice]);
            applyFilters();
            updateMetaFilter();

            $("#all-type").prop("checked", true);
        }

        $("#remove-all,#reset-filter,.remove-all-filters").on("click", function () {
            resetAllFilters();
            limitLayout();
        });

        $(".reset-price").on("click", function () {
            filters.minPrice = minPrice;
            filters.maxPrice = maxPrice;
            priceSlider.noUiSlider.set([minPrice, maxPrice]);
            applyFilters();
            updateMetaFilter();
        });

        function applyFilters() {
            let visibleProductCountGrid = 0;
            let visibleProductCountList = 0;

            $(".wrapper-shop .card-product").each(function () {
                const product = $(this);
                let showProduct = true;

                const priceText = product.find(".price-new").text().replace("$", "");
                const price = parseFloat(priceText);
                if (price < filters.minPrice || price > filters.maxPrice) {
                    showProduct = false;
                }

                if (filters.colors && !product.find(`.color-swatch:contains('${filters.colors}')`).length) {
                    showProduct = false;
                }

                if (filters.availability) {
                    const availabilityStatus = product.data("availability");
                    if (filters.availability !== availabilityStatus) {
                        showProduct = false;
                    }
                }
                if (filters.sales) {
                    const brandId = product.attr("data-sale");
                    if (filters.sales !== brandId) {
                        showProduct = false;
                    }
                }
                if (filters.brands.length > 0) {
                    const brandId = product.attr("data-brand");
                    if (!filters.brands.some((brand) => brand.id === brandId)) {
                        showProduct = false;
                    }
                }

                if (filters.categories) {
                    const selectedCate = filters.categories.trim().toLowerCase();
                    const hasCategory =
                        product.find(".product__cate").filter(function () {
                            return $(this).text().trim().toLowerCase() === selectedCate;
                        }).length > 0;

                    if (!hasCategory) showProduct = false;
                }

                if (filters.skins.length > 0) {
                    const productSkin = (product.attr("data-skin") || "").trim().toLowerCase();
                    const hasSkin = filters.skins.some((skin) => skin.label.trim().toLowerCase() === productSkin);
                    if (!hasSkin) {
                        showProduct = false;
                    }
                }

                if (filters.sizes) {
                    const selectedCate = filters.sizes.trim().toLowerCase();
                    const hasCategory =
                        product.find(".product__size").filter(function () {
                            return $(this).text().trim().toLowerCase() === selectedCate;
                        }).length > 0;

                    if (!hasCategory) showProduct = false;
                }
                product.toggle(showProduct);

                if (showProduct) {
                    if (product.hasClass("grid")) {
                        visibleProductCountGrid++;
                    } else if (product.hasClass("product-style_list")) {
                        visibleProductCountList++;
                    }
                }
            });

            $("#product-count-grid").html(
                `<span class="count">${visibleProductCountGrid}</span> ${visibleProductCountGrid === 1 ? "Product" : "Products"} found`
            );

            $("#product-count-list").html(
                `<span class="count">${visibleProductCountList}</span> ${visibleProductCountList === 1 ? "Product" : "Products"} found`
            );
        }
        function scrollToFilterTop() {
            const section = $(".section-main-shop-filter");
            if (section.length) {
                $("html, body").animate(
                    {
                        scrollTop: section.offset().top - 50,
                    },
                    100
                );
            }
        }
    };

    /* Filter Sort
  -------------------------------------------------------------------------------------*/
    var filterSort = function () {
        let isListActive = $(".sw-layout-list").hasClass("active");
        let originalProductsList = $("#listLayout .card-product").clone();
        let originalProductsGrid = $("#gridLayout .card-product").clone();
        let paginationList = $("#listLayout .wg-pagination").clone();
        let paginationGrid = $("#gridLayout .wg-pagination").clone();

        $(".select-item").on("click", function () {
            const sortValue = $(this).data("sort-value");
            $(".select-item").removeClass("active");
            $(this).addClass("active");
            $(".text-sort-value").text($(this).find(".text-value-item").text());

            applyFilter(sortValue, isListActive);

            if ($(".meta-filter-shop").hasClass("active")) {
                $("#listLayout").append(paginationList.clone().css("display", "none"));
                $("#gridLayout").append(paginationGrid.clone().css("display", "none"));
            } else {
                $("#listLayout").append(paginationList.clone().css("display", "flex"));
                $("#gridLayout").append(paginationGrid.clone().css("display", "flex"));
            }
        });

        $(".tf-view-layout-switch").on("click", function () {
            const layout = $(this).data("value-layout");

            if (layout === "list") {
                isListActive = true;
                $("#gridLayout").hide();
                $("#listLayout").show();
            } else {
                isListActive = false;
                $("#listLayout").hide();
                setGridLayout(layout);
            }
        });

        function applyFilter(sortValue, isListActive) {
            let products;

            if (isListActive) {
                products = $("#listLayout .card-product");
            } else {
                products = $("#gridLayout .card-product");
            }

            if (sortValue === "best-selling") {
                if (isListActive) {
                    $("#listLayout").empty().append(originalProductsList.clone());
                } else {
                    $("#gridLayout").empty().append(originalProductsGrid.clone());
                }
                bindProductEvents();
                limitLayout();
                return;
            }

            if (sortValue === "price-low-high") {
                products.sort(
                    (a, b) =>
                        parseFloat($(a).find(".price-new").text().replace("$", "")) - parseFloat($(b).find(".price-new").text().replace("$", ""))
                );
            } else if (sortValue === "price-high-low") {
                products.sort(
                    (a, b) =>
                        parseFloat($(b).find(".price-new").text().replace("$", "")) - parseFloat($(a).find(".price-new").text().replace("$", ""))
                );
            } else if (sortValue === "a-z") {
                products.sort((a, b) => $(a).find(".product__name").text().localeCompare($(b).find(".product__name").text()));
            } else if (sortValue === "z-a") {
                products.sort((a, b) => $(b).find(".product__name").text().localeCompare($(a).find(".product__name").text()));
            }

            if (isListActive) {
                $("#listLayout").empty().append(products);
            } else {
                $("#gridLayout").empty().append(products);
            }

            bindProductEvents();
        }

        function setGridLayout(layoutClass) {
            $("#gridLayout").show().removeClass().addClass(`wrapper-shop tf-grid-layout ${layoutClass}`);
            $(".tf-view-layout-switch").removeClass("active");
            $(`.tf-view-layout-switch[data-value-layout="${layoutClass}"]`).addClass("active");
        }
        function bindProductEvents() {
            if ($(".card-product").length > 0) {
                $(".color-swatch").on("click, mouseover", function () {
                    var swatchColor = $(this).find("img").attr("src");
                    var imgProduct = $(this).closest(".card-product").find(".img-product");
                    imgProduct.attr("src", swatchColor);
                    $(this).closest(".card-product").find(".color-swatch.active").removeClass("active");
                    $(this).addClass("active");
                });
            }
            $(".size-box").on("click", ".size-item", function () {
                $(this).closest(".size-box").find(".size-item").removeClass("active");
                $(this).addClass("active");
            });
        }
        bindProductEvents();
    };

    /* Switch Layout 
  -------------------------------------------------------------------------------------*/
    var swLayoutShop = function () {
        let isListActive = $(".sw-layout-list").hasClass("active");
        let userSelectedLayout = null;

        function hasValidLayout() {
            return (
                $("#gridLayout").hasClass("tf-col-2") ||
                $("#gridLayout").hasClass("tf-col-3") ||
                $("#gridLayout").hasClass("tf-col-4") ||
                $("#gridLayout").hasClass("tf-col-5") ||
                $("#gridLayout").hasClass("tf-col-6") ||
                $("#gridLayout").hasClass("tf-col-7")
            );
        }

        function updateLayoutDisplay() {
            const windowWidth = $(window).width();
            const currentLayout = $("#gridLayout").attr("class");

            if (!hasValidLayout()) {
                console.warn("Page does not contain a valid layout (2-7 columns), skipping layout adjustments.");
                return;
            }

            if (isListActive) {
                $("#gridLayout").hide();
                $("#listLayout").show();
                $(".wrapper-control-shop").addClass("listLayout-wrapper").removeClass("gridLayout-wrapper");
                return;
            }

            if (userSelectedLayout) {
                if (windowWidth <= 767) {
                    setGridLayout("tf-col-2");
                } else if (windowWidth <= 1200 && userSelectedLayout !== "tf-col-2") {
                    setGridLayout("tf-col-3");
                } else if (
                    windowWidth <= 1400 &&
                    (userSelectedLayout === "tf-col-5" || userSelectedLayout === "tf-col-6" || userSelectedLayout === "tf-col-7")
                ) {
                    setGridLayout("tf-col-4");
                } else {
                    setGridLayout(userSelectedLayout);
                }
                return;
            }

            if (windowWidth <= 767) {
                if (!currentLayout.includes("tf-col-2")) {
                    setGridLayout("tf-col-2");
                }
            } else if (windowWidth <= 1200) {
                if (!currentLayout.includes("tf-col-3")) {
                    setGridLayout("tf-col-3");
                }
            } else if (windowWidth <= 1401) {
                if (currentLayout.includes("tf-col-5") || currentLayout.includes("tf-col-6") || currentLayout.includes("tf-col-7")) {
                    setGridLayout("tf-col-4");
                }
            } else {
                $("#listLayout").hide();
                $("#gridLayout").show();
                $(".wrapper-control-shop").addClass("gridLayout-wrapper").removeClass("listLayout-wrapper");
            }
        }

        function setGridLayout(layoutClass) {
            $("#listLayout").hide();
            $("#gridLayout").show().removeClass().addClass(`wrapper-shop tf-grid-layout ${layoutClass}`);
            $(".tf-view-layout-switch").removeClass("active");
            $(`.tf-view-layout-switch[data-value-layout="${layoutClass}"]`).addClass("active");
            $(".wrapper-control-shop").addClass("gridLayout-wrapper").removeClass("listLayout-wrapper");
            isListActive = false;
        }

        $(document).ready(function () {
            if (isListActive) {
                $("#gridLayout").hide();
                $("#listLayout").show();
                $(".wrapper-control-shop").addClass("listLayout-wrapper").removeClass("gridLayout-wrapper");
            } else {
                $("#listLayout").hide();
                $("#gridLayout").show();
                updateLayoutDisplay();
            }
        });

        $(window).on("resize", () => {
            updateLayoutDisplay();

            if ($(".meta-filter-shop").hasClass("active") == false) {
                limitLayout();
            }
        });

        $(".tf-view-layout-switch").on("click", function () {
            const layout = $(this).data("value-layout");
            $(".tf-view-layout-switch").removeClass("active");
            $(this).addClass("active");
            $(".wrapper-control-shop").addClass("loading-shop");
            setTimeout(() => {
                $(".wrapper-control-shop").removeClass("loading-shop");
                if (isListActive) {
                    $("#gridLayout").css("display", "none");
                    $("#listLayout").css("display", "");
                } else {
                    $("#listLayout").css("display", "none");
                    $("#gridLayout").css("display", "");
                    if ($(".meta-filter-shop").hasClass("active") == false) {
                        limitLayout();
                    }
                }
            }, 500);

            if (layout === "list") {
                isListActive = true;
                userSelectedLayout = null;
                $("#gridLayout").hide();
                $("#listLayout").show();
                $(".wrapper-control-shop").addClass("listLayout-wrapper").removeClass("gridLayout-wrapper");
            } else {
                userSelectedLayout = layout;
                setGridLayout(layout);
            }
        });
    };

    /* Loading product 
  -------------------------------------------------------------------------------------*/
    var loadProduct = function () {
        const gridInitialItems = 8;
        const listInitialItems = 4;
        const gridItemsPerPage = 4;
        const listItemsPerPage = 2;

        let listItemsDisplayed = listInitialItems;
        let gridItemsDisplayed = gridInitialItems;
        let scrollTimeout;

        function hideExtraItems(layout, itemsDisplayed) {
            layout.find(".loadItem").each(function (index) {
                if (index >= itemsDisplayed) {
                    $(this).addClass("hidden");
                }
            });
            if (layout.is("#listLayout")) updateLastVisible(layout);
        }

        function showMoreItems(layout, itemsPerPage, itemsDisplayed) {
            const hiddenItems = layout.find(".loadItem.hidden");

            setTimeout(function () {
                hiddenItems.slice(0, itemsPerPage).removeClass("hidden");
                if (layout.is("#listLayout")) updateLastVisible(layout);
                checkLoadMoreButton(layout);
            }, 600);

            return itemsDisplayed + itemsPerPage;
        }

        function updateLastVisible(layout) {
            layout.find(".loadItem").removeClass("last-visible");
            layout.find(".loadItem").not(".hidden").last().addClass("last-visible");
        }
        function checkLoadMoreButton(layout) {
            if (layout.find(".loadItem.hidden").length === 0) {
                if (layout.is("#listLayout")) {
                    $("#loadMoreListBtn").hide();
                    $("#infiniteScrollList").hide();
                } else if (layout.is("#gridLayout")) {
                    $("#loadMoreGridBtn").hide();
                    $("#infiniteScrollGrid").hide();
                }
            }
        }

        hideExtraItems($("#listLayout"), listItemsDisplayed);
        hideExtraItems($("#gridLayout"), gridItemsDisplayed);

        $("#loadMoreListBtn").on("click", function () {
            listItemsDisplayed = showMoreItems($("#listLayout"), listItemsPerPage, listItemsDisplayed);
        });

        $("#loadMoreGridBtn").on("click", function () {
            gridItemsDisplayed = showMoreItems($("#gridLayout"), gridItemsPerPage, gridItemsDisplayed);
        });

        function onScroll() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function () {
                const infiniteScrollList = $("#infiniteScrollList");
                const infiniteScrollGrid = $("#infiniteScrollGrid");

                if (infiniteScrollList.is(":visible") && isElementInViewport(infiniteScrollList)) {
                    listItemsDisplayed = showMoreItems($("#listLayout"), listItemsPerPage, listItemsDisplayed);
                }

                if (infiniteScrollGrid.is(":visible") && isElementInViewport(infiniteScrollGrid)) {
                    gridItemsDisplayed = showMoreItems($("#gridLayout"), gridItemsPerPage, gridItemsDisplayed);
                }
            }, 300);
        }
        function isElementInViewport(el) {
            const rect = el[0].getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        $(window).on("scroll", onScroll);
    };

    /* Handle Dropdown Filter 
  -------------------------------------------------------------------------------------*/
    var handleDropdownFilter = function () {
        if (".wrapper-filter-dropdown".length > 0) {
            $(".btn-filterDropdown").click(function (event) {
                event.stopPropagation();
                $(".filter-drawer-wrap").toggleClass("show");
                $(this).toggleClass("active");
                var icon = $(this).find(".icon");
                if ($(this).hasClass("active")) {
                    icon.removeClass("icon-filter").addClass("icon-close");
                } else {
                    icon.removeClass("icon-close").addClass("icon-filter");
                }
                if ($(window).width() <= 1199) {
                    $(".overlay-filter").addClass("show");
                }
            });
            $(document).click(function (event) {
                if (!$(event.target).closest(".wrapper-filter-dropdown").length) {
                    $(".filter-drawer-wrap").removeClass("show");
                    $(".btn-filterDropdown").removeClass("active");
                    $(".btn-filterDropdown .icon").removeClass("icon-close").addClass("icon-filter");
                }
            });
            $(".close-filter ,.overlay-filter").click(function () {
                $(".filter-drawer-wrap").removeClass("show");
                $(".btn-filterDropdown").removeClass("active");
                $(".btn-filterDropdown .icon").removeClass("icon-close").addClass("icon-filter");
                $(".overlay-filter").removeClass("show");
            });
        }
    };

    /* Limit Layout
    -------------------------------------------------------------------------------------*/
    var limitLayout = function () {
        const gridItems = $("#gridLayout .card-product");
        const layoutClassGrid = $("#gridLayout").attr("class");
        const listItems = $("#listLayout .card-product");
        let maxItems = 0;
        let maxItemList = 5;

        if (layoutClassGrid.includes("tf-col-2")) {
            maxItems = 6;
        } else if (layoutClassGrid.includes("tf-col-3")) {
            maxItems = 15;
        } else if (layoutClassGrid.includes("tf-col-4")) {
            maxItems = 20;
        } else if (layoutClassGrid.includes("tf-col-5")) {
            maxItems = 25;
        } else if (layoutClassGrid.includes("tf-col-6")) {
            maxItems = 30;
        } else if (layoutClassGrid.includes("tf-col-7")) {
            maxItems = 35;
        }

        gridItems.each(function (index) {
            if (index < maxItems) {
                $(this).css("display", "flex");
            } else {
                $(this).hide();
            }
        });

        listItems.each(function (index) {
            if (index < maxItemList) {
                $(this).css("display", "flex");
            } else {
                $(this).hide();
            }
        });

        if (gridItems.length <= maxItems - 1) {
            $(".wg-pagination").hide();
        } else {
            $(".wg-pagination").css("display", "flex");
        }
    };

    $(function () {
        rangeTwoPrice();
        filterProducts();
        filterSort();
        swLayoutShop();
        loadProduct();
        handleDropdownFilter();
        limitLayout();
    });
})(jQuery);
