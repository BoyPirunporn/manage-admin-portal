export const routes = {
  "/": { title: "Dashboard", parent: null },
  "/get-started": { title: "Get started", parent: null },
  "/settings/member": { title: "Member", parent: "/get-started" },
  "/settings": { title: "Settings", parent: null },
  "/settings/profile": { title: "Profile", parent: "/settings" },
  "/settings/change-password": { title: "Change Password", parent: "/settings" },
  "/settings/menu": { title: "Menu", parent: "/settings" },
  // เพิ่มเติมได้เรื่อย ๆ
};