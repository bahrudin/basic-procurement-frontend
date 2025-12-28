$(document).ready(function () {
    // =====================
    // REGISTER
    // =====================
    $("#registerForm").submit(function (e) {
        e.preventDefault();

        const username = $("#username").val().trim();
        const password = $("#password").val();
        const passwordConfirm = $("#passwordConfirm").val();

        if (password !== passwordConfirm) {
            Swal.fire("Error", "Password confirmation does not match", "error");
            return;
        }

        apiRequest({
            url: "/auth/register",
            method: "POST",
            data: {username, password}
        }).done(function (res) {
            Swal.fire("Success", res.message || "Register success", "success")
                .then(() => window.location.href = "login.html");
        });
    });


    // =====================
    // LOGIN
    // =====================
    $("#loginForm").submit(function (e) {
        e.preventDefault();

        apiRequest({
            url: "/auth/login",
            method: "POST",
            data: {
                username: $("#username").val(),
                password: $("#password").val()
            }
        }).done(function (res) {

            localStorage.setItem("token", res.token);

            Swal.fire("Success", "Login berhasil", "success")
                .then(() => window.location.href = "dashboard.html");
        });
    });


    // =====================
    // LOGOUT BUTTON HANDLER
    // =====================
    $(document).on("click", "#btnLogout", function () {

        Swal.fire({
            title: "Logout?",
            text: "Anda akan keluar dari sistem",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Logout",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
            }
        });
    });

});


// =====================
// LOGOUT
// =====================
function logout() {

    apiRequest({
        url: "/auth/logout",
        method: "POST"
    }).always(function () {
        // Selalu bersihkan client-side
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    });
}



