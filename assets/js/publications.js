(function () {
  function isImageBlock(element) {
    return Boolean(element && element.querySelector("img"));
  }

  function stripLabel(element, label) {
    if (!element) return;

    var prefix = label + ":";
    var text = element.textContent.trim();
    if (!text.toLowerCase().startsWith(prefix.toLowerCase())) return;

    var firstTextNode = Array.prototype.find.call(element.childNodes, function (node) {
      return node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0;
    });

    if (firstTextNode) {
      firstTextNode.textContent = firstTextNode.textContent.replace(new RegExp("^\\s*" + label + ":\\s*", "i"), "");
    }
  }

  function makeTitle(element) {
    stripLabel(element, "Title");

    if (/^h[1-6]$/i.test(element.tagName)) {
      return element;
    }

    var title = document.createElement("h3");
    while (element.firstChild) {
      title.appendChild(element.firstChild);
    }
    return title;
  }

  function makeLinks(elements) {
    var links = document.createElement("div");
    links.className = "publication-links";

    elements.forEach(function (element) {
      stripLabel(element, "Links");

      Array.prototype.forEach.call(element.querySelectorAll("a"), function (anchor) {
        anchor.classList.add("button-link");
      });

      while (element.firstChild) {
        links.appendChild(element.firstChild);
      }
    });

    return links;
  }

  function buildPublication(parts) {
    var publication = document.createElement("div");
    var imageBlock = parts[0];
    var image = imageBlock.querySelector("img");
    var content = document.createElement("div");

    publication.className = "publication";
    content.className = "publication-content";

    image.classList.add("publication-image");
    publication.appendChild(image);

    if (parts[1]) content.appendChild(makeTitle(parts[1]));

    if (parts[2]) {
      stripLabel(parts[2], "Authors");
      content.appendChild(parts[2]);
    }

    if (parts[3]) {
      stripLabel(parts[3], "Venue");
      parts[3].classList.add("publication-venue");
      content.appendChild(parts[3]);
    }

    if (parts.length > 4) {
      content.appendChild(makeLinks(parts.slice(4)));
    }

    publication.appendChild(content);
    return publication;
  }

  function formatPublications() {
    var source = document.querySelector("[data-publications]");
    if (!source) return;

    var list = document.createElement("div");
    var entries = [];
    var current = [];

    list.className = "publication-list";

    Array.prototype.forEach.call(source.children, function (element) {
      if (isImageBlock(element)) {
        if (current.length) entries.push(current);
        current = [element];
      } else if (current.length) {
        current.push(element);
      }
    });

    if (current.length) entries.push(current);

    entries.forEach(function (parts) {
      if (parts.length >= 4) {
        list.appendChild(buildPublication(parts));
      }
    });

    source.replaceWith(list);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", formatPublications);
  } else {
    formatPublications();
  }
})();
