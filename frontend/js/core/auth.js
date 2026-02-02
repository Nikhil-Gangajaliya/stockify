async function login(email, password) {
  const res = await apiRequest("/users/login", "POST", {
    email,
    password
  }, false);

  localStorage.setItem("token", res.data.accessToken);
  localStorage.setItem("role", res.data.user.role);

  return res.data.user.role;
}

function logout() {
  localStorage.clear();
  window.location.href = "/pages/user/dashboard.html";
}
