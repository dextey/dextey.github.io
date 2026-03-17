const sections = ["/sections/main.html", "/sections/forge.html"];

const gridPattern = document.querySelector(".grid-pattern");

const fetches = sections.map((src) => fetch(src).then((r) => r.text()));

Promise.all(fetches).then(([mainHTML, forgeHTML]) => {
  gridPattern.insertAdjacentHTML("beforeend", mainHTML);
  gridPattern.insertAdjacentHTML("beforeend", forgeHTML);

  import("/static/js/app.js");
  import("/static/js/log.js");
});
