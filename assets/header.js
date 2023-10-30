class Header extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    (this.container = this.querySelector(".header--container")),
      (this.current_width = window.innerWidth),
      (this.fixed_enabled = "true" === this.getAttribute("data-fixed-enabled")),
      (this.header_group = this.closest(".layout--header-group"));
    var e = this.querySelector(".y-menu"),
      t = document.querySelector(".mobile-nav--menu"),
      i = this.querySelector(".header--localization-for-drawer > *"),
      s = document.querySelector(".mobile-nav--localization"),
      r = document.querySelector(".mobile-nav--login"),
      h = this.querySelector(".mobile-nav--login--for-drawer > *"),
      o = document.querySelector(".mobile-nav--search");
    (this.mobile_nav_search_icon = this.querySelector(
      ".mobile-nav--search--for-drawer > *"
    )),
      (this.element_pairs = [
        { parent: t, child: e },
        { parent: r, child: h },
        { parent: o, child: this.mobile_nav_search_icon },
        { parent: s, child: i },
      ]),
      this.load(),
      this.trigger("loaded");
  }
  load() {
    this.element_pairs.forEach((e) => this.moveElement(e.parent, e.child)),
      Shopify.designMode && (this.sectionListeners(), this.inspectListeners()),
      this.fixed_enabled &&
        ((this.header_fill = this.previousElementSibling),
        (this.clone = this.cloneNode(!0)),
        this.initFixed(),
        window.on("theme:XMenu:loaded", () => this.initFixed()));
  }
  moveElement(e, t) {
    e && (e.innerHTML = ""), e && t && e.appendChild(t);
  }
  sectionListeners() {
    [...this.header_group.children].forEach((e) => {
      var t = e.querySelector("[data-section-id]");
      t && t.on("theme:section:reorder", () => this.initFixed());
    }),
      this.on("theme:section:load", () => {
        window.trigger("theme:modal:close"), theme.drawer.loadTriggers();
      });
  }
  inspectListeners() {
    this.fixed_enabled &&
      (document.addEventListener("shopify:inspector:activate", () => {
        this.setAttribute("data-fixed", !1);
      }),
      document.addEventListener("shopify:inspector:deactivate", () => {
        setTimeout(() => this.detectAndFixHeader(), 0);
      }));
  }
  initFixed() {
    const announcement = document.querySelector(".announcement--root");
    const announcementHeight = announcement.getBoundingClientRect().height;
    (this.offset = this.header_fill.offset().top),
      (this.style.top = this.offset + "px"),
      (this.heights = {
        fixed: this.getHeaderHeight(!0),
        unfixed: this.getHeaderHeight(!1),
      }),
      (this.header_fill.style.height = this.heights.unfixed + "px"),
      document.documentElement.style.setProperty(
        "--sticky-offset",
        this.heights.fixed + "px"
      ),
      this.setThresholdValues(),
      this.createObserver();
  }
  getHeaderHeight(e) {
    this.clone.setAttribute("data-fixed", e);
    var t = theme.utils.getHiddenDimensions(this.clone, [
      "header-root",
      "x-menu-root",
    ])["height"];
    return t;
  }
  setThresholdValues() {
    (this.pixel_threshold = this.heights.unfixed - this.heights.fixed),
      (this.observer_threshold = +(
        1 -
        this.pixel_threshold / this.heights.unfixed
      ).toFixed(4)),
      1 < this.observer_threshold && (this.observer_threshold = 1);
  }
  createObserver() {
    this.observer && this.observer.unobserve(this.header_fill),
      (this.observer = new IntersectionObserver(
        () => this.detectAndFixHeader(),
        { threshold: this.observer_threshold }
      )),
      this.observer.observe(this.header_fill);
  }
  detectAndFixHeader() {
    Shopify.inspectMode ||
      this.setAttribute(
        "data-fixed",
        window.pageYOffset >= this.pixel_threshold + this.offset
      );
  }
}
customElements.define("header-root", Header);
