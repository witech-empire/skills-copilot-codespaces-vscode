/**
 * @param {string} currentPath
 * @param {string} itemPath
 * @returns {boolean}
 */
export function isActivePath(currentPath, itemPath) {
  if (currentPath === itemPath) {
    return true;
  }

  if (!currentPath.startsWith(itemPath)) {
    return false;
  }

  return currentPath.charAt(itemPath.length) === "/";
}

/**
 * @param {{ path: string, children?: any[] }[]} items
 * @param {string} currentPath
 * @returns {boolean}
 */
function hasActiveDescendant(items, currentPath) {
  return items.some((item) => {
    if (isActivePath(currentPath, item.path)) {
      return true;
    }

    return item.children ? hasActiveDescendant(item.children, currentPath) : false;
  });
}

/**
 * @param {{ id: string, label: string, items: any[] }[]} sections
 * @param {string} role
 * @returns {any[]}
 */
export function filterNavByRole(sections, role) {
  const filterItems = (items) =>
    items
      .filter((item) => !item.roles || item.roles.includes(role))
      .map((item) => {
        const mapped = { ...item };
        if (item.children) {
          mapped.children = filterItems(item.children);
        }
        return mapped;
      })
      .filter((item) => !item.children || item.children.length > 0);

  return sections
    .map((section) => ({ ...section, items: filterItems(section.items) }))
    .filter((section) => section.items.length > 0);
}

/**
 * @param {{ id: string, path: string, children?: any[] }[]} items
 * @param {string} currentPath
 * @returns {Set<string>}
 */
export function getActiveIds(items, currentPath) {
  const activeIds = new Set();

  const walk = (nodes) => {
    for (const node of nodes) {
      const isActive = isActivePath(currentPath, node.path);
      if (isActive) {
        activeIds.add(node.id);
      }
      if (node.children) {
        walk(node.children);
        if (hasActiveDescendant(node.children, currentPath)) {
          activeIds.add(node.id);
        }
      }
    }
  };

  walk(items);
  return activeIds;
}
