import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../features/auth/presentation/stores/authStore";
import { ROUTE_PATHS } from "./path";
// Impor Layout
import DashboardLayout from "@/layouts/DashboardLayout.vue";

// Impor Halaman
import Dashboard from "@/pages/Dashboard.vue";

const routes = [
  // Halaman publik yang tidak menggunakan layout utama
  {
    path: ROUTE_PATHS.LOGIN,
    name: "Login",
    component: () => import("@/features/auth/presentation/pages/LoginPage.vue"),
  },
  {
    path: ROUTE_PATHS.FORBIDDEN,
    name: "Forbidden",
    component: () => import("@/partials/Forbidden.vue"),
  },

  // Halaman terproteksi yang menggunakan DashboardLayout
  {
    path: ROUTE_PATHS.HOME,
    component: DashboardLayout,
    children: [
      { path: "", redirect: ROUTE_PATHS.DASHBOARD },
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { roles: ["superadmin", "admin"] },
      },
      // --- Group Utama ---
      {
        path: "product-types",
        component: () =>
          import(
            "@/features/type-product/presentation/pages/TypeProductPage.vue"
          ),
        meta: { roles: ["superadmin"] },
      },
      {
        path: "products",
        component: () =>
          import("@/features/product/presentation/pages/ProductPage.vue"),
        meta: { roles: ["superadmin", "admin"] },
      },
      {
        path: "store-management",
        component: () =>
          import("@/features/shop/presentation/pages/StorePage.vue"),
        meta: { roles: ["superadmin"] },
      },
      {
        path: "cashier-management",
        component: () =>
          import("@/features/cashier/presentation/pages/CashierPage.vue"),
        meta: { roles: ["superadmin"] },
      },
      {
        path: "customer-reviews",
        component: Dashboard, // Placeholder
        meta: { roles: ["superadmin"] },
      },
      {
        path: "orders",
        component: Dashboard, // Placeholder
        meta: { roles: ["admin"] },
      },
      {
        path: "finance",
        component: Dashboard, // Placeholder
        meta: { roles: ["admin"] },
      },
      // --- Group Promosi ---
      {
        path: "banners",
        component: () =>
          import("@/features/banner/presentation/pages/BannerPage.vue"), // Placeholder
        meta: { roles: ["superadmin"] },
      },
      {
        path: "events",
        component: () =>
          import("@/features/event/presentation/pages/EventPage.vue"), // Placeholder
        meta: { roles: ["superadmin"] },
      },
      {
        path: "vouchers",
        component: () =>
          import("@/features/voucher/presentation/pages/VoucherPage.vue"), // Placeholder
        meta: { roles: ["superadmin"] },
      },
      // --- Group Laporan ---
      {
        path: "transaction-reports",
        component: Dashboard, // Placeholder
        meta: { roles: ["superadmin"] },
      },
      {
        path: "financial-reports",
        component: Dashboard, // Placeholder
        meta: { roles: ["superadmin"] },
      },
      // --- Group Lainnya ---
      {
        path: "settings",
        name: "Settings",
        component: () =>
          import("@/features/settings/presentation/pages/SettingsPage.vue"),
        meta: { roles: ["superadmin", "admin"] },
      },
    ],
  },

  // Route Catch-all untuk halaman tidak ditemukan (404)
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/partials/Forbidden.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard Anda sudah benar dan tidak perlu diubah
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiredRoles = to.meta.roles;

  if (requiredRoles) {
    if (authStore.isAuthenticated) {
      const userRole = authStore.user.role;
      if (requiredRoles.includes(userRole)) {
        next();
      } else {
        next({ name: "Forbidden" });
      }
    } else {
      next({ name: "Login" });
    }
  } else {
    if (to.name === "Login" && authStore.isAuthenticated) {
      next({ path: ROUTE_PATHS.DASHBOARD });
    } else {
      next();
    }
  }
});

export default router;
