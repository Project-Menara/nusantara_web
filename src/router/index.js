// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../features/auth/presentation/stores/authStore";
import { ROUTE_PATHS } from "./path";
// Impor Layout
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useShopContextStore } from '@/features/shop-context/presentation/stores/useShopContextStore';

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
  {
    path: ROUTE_PATHS.UNASSIGNED_SHOP,
    name: "UnassignedShop",
    component: () => import("@/partials/UnassignedShopPage.vue"),
    meta: { roles: ["admin"] },
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
        component: Dashboard,
        meta: { roles: ["superadmin"] },
      },
      {
        path: "orders",
        component: Dashboard,
        meta: { roles: ["admin"] },
      },
      {
        path: "finance",
        component: Dashboard,
        meta: { roles: ["admin"] },
      },
      // --- Group Promosi ---
      {
        path: "banners",
        component: () =>
          import("@/features/banner/presentation/pages/BannerPage.vue"),
        meta: { roles: ["superadmin"] },
      },
      {
        path: "events",
        component: () =>
          import("@/features/event/presentation/pages/EventPage.vue"),
        meta: { roles: ["superadmin"] },
      },
      {
        path: "vouchers",
        component: () =>
          import("@/features/voucher/presentation/pages/VoucherPage.vue"),
        meta: { roles: ["superadmin"] },
      },
      // --- Group Laporan ---
      {
        path: "transaction-reports",
        component: Dashboard,
        meta: { roles: ["superadmin"] },
      },
      {
        path: "financial-reports",
        component: Dashboard,
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
      {
        path: "shop-profile", 
        name: "ShopProfile",
        component: () => import("@/features/shop-profile/presentation/pages/ShopProfilePage.vue"),
        meta: { roles: ["admin"] },
      },
      {
        path: "shop-products",
        name: "ShopProducts",
        component: () => 
          import("@/features/shop-products/presentation/pages/ShopProductsPage.vue"),
        meta: { roles: ["admin"] },
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiredRoles = to.meta.roles;

  // Pastikan auth diinisialisasi jika memuat ulang halaman
  if (authStore.token && !authStore.isAuthenticated) {
    await authStore.initializeAuth();
  }

  if (requiredRoles) {
    if (authStore.isAuthenticated) {
      const userRole = authStore.user.role;

      if (requiredRoles.includes(userRole)) {
        // --- ✅ LOGIKA BARU UNTUK KONTEKS TOKO ADMIN ---
        if (userRole === "admin") {
          const shopContextStore = useShopContextStore();

          // 1. Pastikan konteks sudah dimuat
          if (!shopContextStore.isContextLoaded) {
            // initializeAuth() di atas sudah memanggil ini,
            // tapi ini sebagai pengaman jika user bernavigasi secara internal
            await shopContextStore.initializeShopContext();
          }

          // 2. Cek status penugasan toko
          if (!shopContextStore.hasAssignedShops) {
            // JIKA KASIR TIDAK PUNYA TOKO:
            if (to.name !== "UnassignedShop") {
              // Paksa ke halaman 'UnassignedShop'
              return next({ name: "UnassignedShop" });
            }
          } else {
            // JIKA KASIR PUNYA TOKO:
            if (to.name === "UnassignedShop") {
              // Jangan biarkan dia ke halaman 'UnassignedShop', lempar ke Dashboard
              return next({ name: "Dashboard" });
            }
          }
        }
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
