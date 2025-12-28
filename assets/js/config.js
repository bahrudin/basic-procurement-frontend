const API_BASE_URL = "http://127.0.0.1:3000";

// ========================
// AJAX WRAPPER (GLOBAL)
// ========================
function apiRequest(options) {
    const token = localStorage.getItem("token");

    return $.ajax({
        url: API_BASE_URL + options.url,
        method: options.method || "GET",
        data: options.data ? JSON.stringify(options.data) : null,
        contentType: "application/json",
        headers: token ? { Authorization: "Bearer " + token } : {},
    }).fail(function (xhr) {

        // ===== AUTO LOGOUT JIKA TOKEN INVALID =====
        if (xhr.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            Swal.fire("Session Expired", "Silakan login kembali", "warning")
                .then(() => window.location.href = "login.html");
            return;
        }

        // ===== ERROR UMUM =====
        let msg = "Server error";
        if (xhr.responseJSON?.error) {
            msg = xhr.responseJSON.error;
        }

        Swal.fire("Error", msg, "error");
    });
}

// ========================
// AUTH GUARD
// ========================
function requireAuth() {
    if (!localStorage.getItem("token")) {
        window.location.href = "login.html";
    }
}