import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./features/auth/presentation/stores/authStore";

// Impor Layout
import DashboardLayout from "./layouts/DashboardLayout.vue";

// Impor Halaman
import LoginPage from "./features/auth/presentation/pages/LoginPage.vue";
import Dashboard from "./pages/Dashboard.vue";
import SettingsPage from "./features/settings/presentation/pages/SettingsPage.vue";
import Forbidden from "./partials/Forbidden.vue";

const routes = [
  // Halaman publik yang tidak menggunakan layout utama
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/utility/403",
    name: "Forbidden",
    component: Forbidden,
  },

  // Halaman terproteksi yang menggunakan DashboardLayout
  {
    path: "/",
    component: DashboardLayout,
    children: [
      { path: "", redirect: "/dashboard" },
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { roles: ["superadmin", "admin"] },
      },
      // --- Group Utama ---
      {
        path: "product-types",
        component: Dashboard, // Placeholder
        meta: { roles: ["superadmin"] },
      },
      {
        path: "products",
        component: Dashboard, // Placeholder
        meta: { roles: ["superadmin", "admin"] },
      },
      {
        path: "store-management",
        component: Dashboard, // Placeholder
        meta: { roles: ["superadmin"] },
      },
      {
        path: "cashier-management",
        component: Dashboard, // Placeholder
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
        component: Dashboard, // Placeholder
        meta: { roles: ["superadmin"] },
      },
      {
        path: "events",
        component: Dashboard, // Placeholder
        meta: { roles: ["superadmin"] },
      },
      {
        path: "vouchers",
        component: Dashboard, // Placeholder
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
        component: SettingsPage,
        meta: { roles: ["superadmin", "admin"] },
      },
    ],
  },

  // Route Catch-all untuk halaman tidak ditemukan (404)
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: Forbidden,
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
      next({ path: "/dashboard" });
    } else {
      next();
    }
  }
});

export default router;
