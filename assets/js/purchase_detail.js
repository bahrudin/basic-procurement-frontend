requireAuth();

// =======================
// GET ID FROM URL
// =======================
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
    Swal.fire("Error", "Purchase ID not found", "error")
        .then(() => window.location.href = "purchase_list.html");
}

// =======================
// FETCH PURCHASE DETAIL
// =======================
apiRequest({
    url: `/purchases/${id}`
}).done(function (p) {

    $("#supplierName").text(p.supplier?.name || "-");
    $("#username").text(p.user?.username || "-");
    $("#purchaseDate").text(new Date(p.date).toLocaleString());
    $("#grandTotal").text(p.grand_total.toLocaleString());

    let rows = "";
    p.details.forEach(d => {
        rows += `
        <tr>
            <td>${d.item.name}</td>
            <td>${d.qty}</td>
            <td>${d.item.price.toLocaleString()}</td>
            <td>${d.sub_total.toLocaleString()}</td>
        </tr>`;
    });

    $("#detailTable").html(rows);
});
