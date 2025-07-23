// src/router.js
import { createRouter, createWebHistory } from "vue-router";

// Impor komponen Halaman
import Dashboard from "./pages/Dashboard.vue";
import { useAuthStore } from "./features/auth/presentation/stores/authStore";
import LoginPage from "./features/auth/presentation/pages/LoginPage.vue";
import Forbidden from "./partials/Forbidden.vue";

const placeholderPage = Dashboard; // Placeholder untuk halaman lain

const routes = [
  // Halaman publik yang tidak butuh otentikasi
  { path: "/login", name: "Login", component: LoginPage },
  { path: "/utility/403", name: "Forbidden", component: Forbidden },

  // Redirect dari root ke dashboard
  { path: "/", redirect: "/dashboard" },

  // --- Group Utama ---
  {
    path: "/dashboard",
    component: placeholderPage,
    meta: { roles: ["superadmin", "admin"] },
  },
  {
    path: "/products",
    component: placeholderPage,
    meta: { roles: ["superadmin", "admin"] },
  },
  { path: "/orders", component: placeholderPage, meta: { roles: ["admin"] } },
  { path: "/finance", component: placeholderPage, meta: { roles: ["admin"] } },
  // ... (semua route lain yang memerlukan role)
  {
    path: "/product-types",
    component: placeholderPage,
    meta: { roles: ["superadmin"] },
  },
  {
    path: "/store-management",
    component: placeholderPage,
    meta: { roles: ["superadmin"] },
  },
  {
    path: "/cashier-management",
    component: placeholderPage,
    meta: { roles: ["superadmin"] },
  },
  {
    path: "/customer-reviews",
    component: placeholderPage,
    meta: { roles: ["superadmin"] },
  },
  {
    path: "/banners",
    component: placeholderPage,
    meta: { roles: ["superadmin"] },
  },
  {
    path: "/events",
    component: placeholderPage,
    meta: { roles: ["superadmin"] },
  },
  {
    path: "/vouchers",
    component: placeholderPage,
    meta: { roles: ["superadmin"] },
  },
  {
    path: "/transaction-reports",
    component: placeholderPage,
    meta: { roles: ["superadmin"] },
  },
  {
    path: "/financial-reports",
    component: placeholderPage,
    meta: { roles: ["superadmin"] },
  },
  {
    path: "/settings",
    component: placeholderPage,
    meta: { roles: ["superadmin", "admin"] },
  },
  {
    path: "/logout",
    component: placeholderPage,
    meta: { roles: ["superadmin", "admin"] },
  },

  // Route Catch-all (404 Not Found)
  { path: "/:pathMatch(.*)*", name: "NotFound", component: Forbidden },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard baru
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiredRoles = to.meta.roles;

  // Jika route memerlukan role (halaman terproteksi)
  if (requiredRoles) {
    // Cukup periksa isAuthenticated. Flag ini sekarang sudah akurat.
    if (authStore.isAuthenticated) {
      const userRole = authStore.user.role;
      if (requiredRoles.includes(userRole)) {
        next(); // Role sesuai, izinkan akses
      } else {
        next({ name: "Forbidden" }); // Role tidak sesuai
      }
    } else {
      next({ name: "Login" }); // Belum login
    }
  } else {
    // Untuk halaman publik (seperti /login)
    if (to.name === "Login" && authStore.isAuthenticated) {
      next({ path: "/dashboard" }); // Jika sudah login, jangan biarkan ke halaman login lagi
    } else {
      next(); // Izinkan akses
    }
  }
});

export default router;
