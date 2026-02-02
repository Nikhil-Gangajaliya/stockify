function requireAuth(role = null) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    window.location.href = "/frontend/pages/auth/login.html";
  }

  if (role && role !== userRole) {
    alert("Access Denied");
    logout();
  }
}
