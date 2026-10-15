(function (root, factory) {
  const reading = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = reading;
  } else if (root) {
    if (root.document.readyState === "loading") {
      root.document.addEventListener("DOMContentLoaded", () => reading.init(root.document, root), { once: true });
    } else {
      reading.init(root.document, root);
    }
  }
})(typeof window === "undefined" ? null : window, function () {
  function selectActiveHeading(positions, readingLine, atDocumentEnd = false) {
    if (!positions.length) return -1;
    if (atDocumentEnd) return positions.length - 1;
    let active = 0;
    positions.forEach((top, index) => {
      if (top <= readingLine) active = index;
    });
    return active;
  }

  function readingLinePosition(headerBottom, anchorOffset) {
    // Track a short reading window below the navbar, including anchor clearance and subpixel rounding.
    return Math.max(headerBottom + 48, anchorOffset) + 2;
  }

  function isSpacerContent(text, childTags) {
    return text.trim() === "" && childTags.length > 0 && childTags.every((tag) => tag === "BR");
  }

  function tocScrollTarget(viewport, item, current, maximum) {
    let target = current;
    if (item.top < viewport.top + 12) target += item.top - viewport.top - 12;
    else if (item.bottom > viewport.bottom - 12) target += item.bottom - viewport.bottom + 12;
    return Math.max(0, Math.min(maximum, target));
  }

  function scrollRegionAttributes(tagName, existing) {
    const added = {};
    if (existing.tabindex == null) added.tabindex = "0";
    // A table must retain its native row/cell semantics; math may already have a role.
    if (tagName !== "TABLE" && existing.role == null) added.role = "region";
    if (existing["aria-label"] == null && existing["aria-labelledby"] == null) {
      added["aria-label"] = tagName === "MJX-CONTAINER" ? "Scrollable equation" : tagName === "PRE" ? "Scrollable code" : "Scrollable table";
    }
    return added;
  }

  function needsInlineScroll(naturalWidth, availableWidth) {
    return availableWidth > 0 && naturalWidth > availableWidth + 1;
  }

  function init(doc, win) {
    const content = doc.querySelector(".post-reading #markdown-content");
    if (!content) return;

    // Only presentation-only spacer paragraphs are collapsed; prose and media remain intact.
    Array.from(content.children).forEach((element) => {
      if (element.tagName === "P" && isSpacerContent(element.textContent, Array.from(element.children, (child) => child.tagName))) {
        element.classList.add("post-spacer");
      }
    });

    const nav = doc.getElementById("toc-sidebar");
    const headings = Array.from(content.querySelectorAll("h2[id], h3[id]"));
    const mobile = doc.querySelector(".post-toc-mobile");
    const desktopLinks = [];
    const mobileLinks = mobile ? Array.from(mobile.querySelectorAll('a[href^="#"]')) : [];

    if (nav) {
      const list = doc.createElement("ul");
      list.className = "post-toc-list";
      headings.forEach((heading) => {
        const item = doc.createElement("li");
        if (heading.tagName === "H3") item.className = "post-toc-list__subitem";
        const link = doc.createElement("a");
        link.className = "nav-link";
        link.href = "#" + encodeURIComponent(heading.id);
        // This runs before MathJax, so heading math is typeset in both places normally.
        link.textContent = heading.textContent.trim();
        item.append(link);
        list.append(item);
        desktopLinks.push(link);
      });
      nav.replaceChildren(list);
    }

    let activeIndex = -1;
    let framePending = false;
    let overflowPending = true;
    let pointerInside = false;
    const overflowAttributes = new WeakMap();

    function revealCurrent() {
      if (!nav || !nav.clientHeight || pointerInside || activeIndex < 0) return;
      if (nav.contains(doc.activeElement) && doc.activeElement.matches(":focus-visible")) return;
      const target = tocScrollTarget(
        nav.getBoundingClientRect(),
        desktopLinks[activeIndex].getBoundingClientRect(),
        nav.scrollTop,
        nav.scrollHeight - nav.clientHeight,
      );
      if (Math.abs(target - nav.scrollTop) > 1) nav.scrollTop = target;
    }

    function enhanceOverflow() {
      content.querySelectorAll('mjx-container[jax="CHTML"]:not([display="true"])').forEach((element) => {
        // Tables already own their horizontal scroll area. Measure against the local
        // paragraph/list width, not the full article, so indented equations fit too.
        if (element.closest("table")) return;
        const math = element.querySelector("mjx-math");
        if (!math) return;
        const block = element.closest("p, li, blockquote, h1, h2, h3, h4, h5, h6") || content;
        const style = win.getComputedStyle(block);
        const available = block.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
        element.classList.toggle("reading-math-overflow", needsInlineScroll(math.getBoundingClientRect().width, available));
      });
      const regions = content.querySelectorAll('mjx-container[display="true"], mjx-container.reading-math-overflow, mjx-container[data-reading-overflow], .fixed-table-body, .table-responsive, pre, table');
      regions.forEach((element) => {
        const overflowing = element.scrollWidth > element.clientWidth + 1;
        if (overflowing && !overflowAttributes.has(element)) {
          const existing = Object.fromEntries(["tabindex", "role", "aria-label", "aria-labelledby"].map((name) => [name, element.getAttribute(name)]));
          const added = scrollRegionAttributes(element.tagName, existing);
          Object.entries(added).forEach(([name, value]) => element.setAttribute(name, value));
          overflowAttributes.set(element, added);
          element.dataset.readingOverflow = "true";
        } else if (!overflowing && overflowAttributes.has(element)) {
          // Remove only attributes we own, not names/roles supplied by the author or MathJax.
          Object.entries(overflowAttributes.get(element)).forEach(([name, value]) => {
            if (element.getAttribute(name) === value) element.removeAttribute(name);
          });
          overflowAttributes.delete(element);
          delete element.dataset.readingOverflow;
        }
      });
    }

    function update() {
      framePending = false;
      if (overflowPending) {
        overflowPending = false;
        enhanceOverflow();
      }
      if (!nav || !headings.length) return;
      const navbar = doc.getElementById("navbar");
      const anchorOffset = parseFloat(win.getComputedStyle(headings[0]).scrollMarginTop) || 0;
      const readingLine = readingLinePosition(navbar ? navbar.getBoundingClientRect().bottom : 68, anchorOffset);
      // Read live positions, not offsets cached before MathJax, fonts, or lazy images.
      const atDocumentEnd = win.scrollY > 0 && win.scrollY + win.innerHeight >= doc.documentElement.scrollHeight - 2;
      const next = selectActiveHeading(headings.map((heading) => heading.getBoundingClientRect().top), readingLine, atDocumentEnd);
      if (next === activeIndex) return;
      activeIndex = next;
      let parent = next;
      while (parent > 0 && headings[parent].tagName !== "H2") parent -= 1;
      desktopLinks.forEach((link, index) => {
        link.classList.toggle("active", index === next);
        link.classList.toggle("is-active-parent", index === parent && parent !== next);
        if (index === next) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      mobileLinks.forEach((link) => {
        let target = link.hash.slice(1);
        try { target = decodeURIComponent(target); } catch { /* Keep literal IDs containing an unmatched percent sign. */ }
        const selected = target === headings[next].id;
        if (selected) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      revealCurrent();
    }

    function schedule() {
      if (framePending) return;
      framePending = true;
      win.requestAnimationFrame(update);
    }

    function scheduleLayout() {
      overflowPending = true;
      schedule();
    }

    if (nav) {
      nav.addEventListener("pointerenter", () => { pointerInside = true; });
      nav.addEventListener("pointerleave", () => { pointerInside = false; revealCurrent(); });
      nav.addEventListener("focusout", () => {
        win.requestAnimationFrame(revealCurrent);
      });
    }
    if (mobile) {
      mobile.addEventListener("click", (event) => {
        if (event.target.closest('a[href^="#"]')) mobile.open = false;
      });
    }
    win.addEventListener("scroll", schedule, { passive: true });
    win.addEventListener("resize", scheduleLayout, { passive: true });
    win.addEventListener("hashchange", schedule);
    win.addEventListener("load", scheduleLayout, { once: true });
    if (win.ResizeObserver) new win.ResizeObserver(scheduleLayout).observe(content);
    if (doc.fonts) doc.fonts.ready.then(scheduleLayout);
    schedule();
  }

  return { selectActiveHeading, readingLinePosition, isSpacerContent, tocScrollTarget, scrollRegionAttributes, needsInlineScroll, init };
});
