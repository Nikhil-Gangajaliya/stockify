function loadUserSidebar() {
  fetch("../../components/sidebar-user.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("sidebar").innerHTML = html;
    })
    .catch(err => console.error("Sidebar load failed", err));
}
