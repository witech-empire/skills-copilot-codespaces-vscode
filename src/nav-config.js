/**
 * @typedef {"admin" | "analyst" | "support"} Role
 */

/**
 * @typedef {Object} NavItem
 * @property {string} id
 * @property {string} label
 * @property {string} path
 * @property {string} icon
 * @property {Role[]=} roles
 * @property {number=} badge
 * @property {NavItem[]=} children
 */

/**
 * @typedef {Object} NavSection
 * @property {string} id
 * @property {string} label
 * @property {NavItem[]} items
 */

/** @type {NavSection[]} */
export const NAV_SECTIONS = [
  {
    id: "overview",
    label: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", path: "#/overview", icon: "🏠" }]
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        id: "payments",
        label: "Payments",
        path: "#/operations/payments",
        icon: "💳",
        children: [
          {
            id: "reviews",
            label: "Reviews",
            path: "#/operations/payments/reviews",
            icon: "📝",
            roles: ["admin", "analyst"],
            badge: 7
          },
          {
            id: "alerts",
            label: "Alerts",
            path: "#/operations/payments/alerts",
            icon: "🚨",
            roles: ["admin", "support"],
            badge: 3
          }
        ]
      },
      {
        id: "transfers",
        label: "Transfers",
        path: "#/operations/transfers",
        icon: "🔁",
        roles: ["admin", "analyst", "support"]
      }
    ]
  },
  {
    id: "compliance",
    label: "Compliance",
    items: [
      { id: "kyc", label: "KYC", path: "#/compliance/kyc", icon: "🛡️", roles: ["admin", "analyst"] },
      { id: "audit", label: "Audit Log", path: "#/compliance/audit", icon: "📚", roles: ["admin"] }
    ]
  },
  {
    id: "reporting",
    label: "Reporting",
    items: [{ id: "reports", label: "Reports", path: "#/reporting", icon: "📊", roles: ["admin", "analyst"] }]
  },
  {
    id: "settings",
    label: "Settings",
    items: [{ id: "team", label: "Team", path: "#/settings/team", icon: "👥", roles: ["admin"] }]
  }
];
