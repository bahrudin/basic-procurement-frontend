// ===============================
// AUTH
// ===============================
requireAuth();

// ===============================
// STATE
// ===============================
let cart = [];
let items = [];

// ===============================
// HELPERS
// ===============================
function rupiah(num) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(num);
}

// ===============================
// LOAD DATA
// ===============================

// Load suppliers
apiRequest({ url: "/suppliers" }).done(function (res) {
    const suppliers = res.data ?? res;
    let options = '<option value="">-- Select Supplier --</option>';
    suppliers.forEach(s => {
        options += `<option value="${s.id}">${s.name}</option>`;
    });
    $("#supplierSelect").html(options);
});

// Load items
apiRequest({ url: "/items" }).done(function (res) {
    items = res.data ?? res;
    let options = '<option value="">-- Select Item --</option>';
    items.forEach(i => {
        options += `<option value="${i.id}">${i.name}</option>`;
    });
    $("#itemSelect").html(options);
});

// ===============================
// ADD ITEM TO CART
// ===============================
$("#addItem").click(function () {
    const itemId = +$("#itemSelect").val();
    const qty = +$("#qty").val();

    if (!itemId) {
        Swal.fire("Warning", "Please select item", "warning");
        return;
    }

    if (!qty || qty <= 0) {
        Swal.fire("Warning", "Qty must be greater than 0", "warning");
        return;
    }

    const item = items.find(i => i.id === itemId);
    if (!item) {
        Swal.fire("Error", "Item not found", "error");
        return;
    }

    // Merge item if already exists
    const existing = cart.find(c => c.item_id === itemId);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            item_id: itemId,
            name: item.name,
            price: item.price,
            qty: qty
        });
    }

    $("#qty").val('');
    renderCart();
});

// ===============================
// RENDER CART
// ===============================
function renderCart() {
    let total = 0;
    let rows = '';

    cart.forEach((c, index) => {
        const subtotal = c.qty * c.price;
        total += subtotal;

        rows += `
        <tr>
            <td>${c.name}</td>
            <td>${c.qty}</td>
            <td>${rupiah(subtotal)}</td>
            <td>
                <button
                    class="btn btn-danger btn-sm btn-remove"
                    data-index="${index}">
                    X
                </button>
            </td>
        </tr>`;
    });

    $("#cartTable").html(rows);
    $("#total").text(rupiah(total));

    // Disable submit if cart empty
    $("#submit").prop("disabled", cart.length === 0);
}

// ===============================
// REMOVE ITEM
// ===============================
$(document).on("click", ".btn-remove", function () {
    const index = $(this).data("index");
    cart.splice(index, 1);
    renderCart();
});

// ===============================
// SUBMIT PURCHASE
// ===============================
$("#submit").click(function () {
    const supplierId = +$("#supplierSelect").val();

    if (!supplierId) {
        Swal.fire("Warning", "Please select supplier", "warning");
        return;
    }

    if (cart.length === 0) {
        Swal.fire("Warning", "Cart is empty", "warning");
        return;
    }

    apiRequest({
        url: "/purchases",
        method: "POST",
        data: {
            supplier_id: supplierId,
            items: cart.map(c => ({
                item_id: c.item_id,
                qty: c.qty
            }))
        }
    }).done(function () {
        Swal.fire("Success", "Purchase created successfully", "success");
        cart = [];
        renderCart();
    });
});

// ===============================
// INIT
// ===============================
renderCart();
