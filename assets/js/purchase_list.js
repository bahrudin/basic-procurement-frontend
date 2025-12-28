requireAuth();

$(function () {
    loadPurchases();
});

// ======================
// LOAD PURCHASES
// ======================
function loadPurchases() {
    apiRequest({ url: "/purchases" })
        .done(function (data) {

            let rows = "";

            data.forEach((p, i) => {
                rows += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${formatDate(p.date)}</td>
                    <td>${p.supplier?.name || "-"}</td>
                    <td>${p.user?.username || "-"}</td>
                    <td>Rp ${formatNumber(p.grand_total)}</td>
                    <td>
                        <a href="purchase_detail.html?id=${p.id}"
                           class="btn btn-primary btn-sm">
                           Detail
                        </a>
                    </td>
                </tr>
                `;
            });

            $("#purchaseTable").html(rows);
        });
}

// ======================
// FORMAT UTIL
// ======================
function formatNumber(num) {
    return Number(num).toLocaleString("id-ID");
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("id-ID");
}
