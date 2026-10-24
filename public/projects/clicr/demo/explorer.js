// File tree for the CliCR demo: builds the folder tree from chunk paths and renders an
// ARIA tree (roving tabindex, arrow keys) with per-file hit badges.

const byName = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

/**
 * One root node {name: include, path: null, children}. Folders carry `children` and their folder
 * path; files have no `children`. Folders first, then files, each in code-unit order.
 */
export function buildTree(paths, include) {
  const prefix = include && include !== "." ? include.replace(/\/+$/, "") + "/" : "";
  const root = { name: include, path: null, children: [] };
  for (const full of paths) {
    const rel = prefix && full.startsWith(prefix) ? full.slice(prefix.length) : full;
    const parts = rel.split("/");
    let node = root;
    parts.forEach((part, k) => {
      const last = k === parts.length - 1;
      let next = node.children.find((c) => c.name === part && Boolean(c.children) === !last);
      if (!next) {
        next = last
          ? { name: part, path: full }
          : { name: part, path: prefix + parts.slice(0, k + 1).join("/"), children: [] };
        node.children.push(next);
      }
      node = next;
    });
  }
  const sort = (n) => {
    if (!n.children) return;
    n.children.sort((a, b) => Boolean(b.children) - Boolean(a.children) || byName(a, b));
    n.children.forEach(sort);
  };
  sort(root);
  return root;
}

export function createExplorer(treeEl, tree, { onOpen }) {
  const badges = new Map(); // file path -> badge element
  const items = new Map(); // file path -> treeitem element

  function build(node, level) {
    const li = document.createElement("li");
    li.setAttribute("role", "treeitem");
    li.setAttribute("aria-level", String(level));
    li.tabIndex = -1;
    const row = document.createElement("div");
    row.className = "ti-row";
    row.style.paddingLeft = `${8 + (level - 1) * 12}px`;
    const label = document.createElement("span");
    label.className = "ti-name";
    label.textContent = node.name;
    if (node.children) {
      li.setAttribute("aria-expanded", "true");
      li.classList.add("folder");
      const twisty = document.createElement("span");
      twisty.className = "twisty";
      twisty.setAttribute("aria-hidden", "true");
      row.append(twisty, label);
      li.append(row);
      const group = document.createElement("ul");
      group.setAttribute("role", "group");
      for (const child of node.children) group.append(build(child, level + 1));
      li.append(group);
    } else {
      li.dataset.path = node.path;
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.hidden = true;
      row.append(label, badge);
      li.append(row);
      badges.set(node.path, badge);
      items.set(node.path, li);
    }
    return li;
  }

  const rootItem = build(tree, 1);
  treeEl.replaceChildren(rootItem);
  rootItem.tabIndex = 0;

  const visible = () =>
    [...treeEl.querySelectorAll('[role="treeitem"]')].filter((li) => !li.parentElement.closest('[aria-expanded="false"]'));
  function focusItem(li) {
    if (!li) return;
    for (const x of treeEl.querySelectorAll('[role="treeitem"][tabindex="0"]')) x.tabIndex = -1;
    li.tabIndex = 0;
    li.focus();
  }
  function setOpen(li, open) {
    li.setAttribute("aria-expanded", String(open));
  }
  function activate(li) {
    if (li.hasAttribute("aria-expanded")) setOpen(li, li.getAttribute("aria-expanded") !== "true");
    else onOpen(li.dataset.path);
  }

  treeEl.addEventListener("click", (e) => {
    const li = e.target.closest('[role="treeitem"]');
    if (!li) return;
    // a click on a nested group reaches its own li first; ignore the ancestors it bubbles to
    if (e.target.closest(".ti-row")?.parentElement !== li) return;
    focusItem(li);
    activate(li);
  });

  treeEl.addEventListener("keydown", (e) => {
    const li = e.target;
    if (li.getAttribute?.("role") !== "treeitem") return;
    const list = visible();
    const at = list.indexOf(li);
    const folder = li.hasAttribute("aria-expanded");
    const open = li.getAttribute("aria-expanded") === "true";
    let handled = true;
    switch (e.key) {
      case "ArrowDown":
        focusItem(list[Math.min(at + 1, list.length - 1)]);
        break;
      case "ArrowUp":
        focusItem(list[Math.max(at - 1, 0)]);
        break;
      case "Home":
        focusItem(list[0]);
        break;
      case "End":
        focusItem(list[list.length - 1]);
        break;
      case "ArrowRight":
        if (folder && !open) setOpen(li, true);
        else if (folder) focusItem(list[at + 1]);
        break;
      case "ArrowLeft":
        if (folder && open) setOpen(li, false);
        else focusItem(li.parentElement.closest('[role="treeitem"]'));
        break;
      case "Enter":
      case " ":
        activate(li);
        break;
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  });

  return {
    setBadges(counts) {
      for (const [path, badge] of badges) {
        const n = counts.get(path) ?? 0;
        badge.hidden = n === 0;
        badge.replaceChildren();
        if (n) {
          badge.append(String(n));
          const sr = document.createElement("span");
          sr.className = "sr";
          sr.textContent = n === 1 ? " match" : " matches";
          badge.append(sr);
        }
      }
    },
    setActive(path) {
      for (const [p, li] of items) {
        const on = p === path;
        li.classList.toggle("active", on);
        if (on) li.setAttribute("aria-selected", "true");
        else li.removeAttribute("aria-selected");
      }
      items.get(path)?.scrollIntoView?.({ block: "nearest" });
    },
  };
}
