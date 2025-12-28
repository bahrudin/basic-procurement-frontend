requireAuth();

apiRequest({
    url: "/items"
}).done(function (res) {

    const items = res.data ? res.data : res;

    if (!Array.isArray(items)) {
        Swal.fire("Error", "Format data item tidak valid", "error");
        return;
    }

    let rows = "";
    items.forEach(item => {
        rows += `
        <tr>
            <td>${item.name}</td>
            <td>${item.stock}</td>
            <td>${item.price}</td>
        </tr>`;
    });

    $("#itemTable").html(rows);
});
