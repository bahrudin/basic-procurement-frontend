requireAuth();
const itemModal = new bootstrap.Modal(document.getElementById('itemModal'));

function loadItems() {
    apiRequest({ url: "/items" }).done(function(res){
        const items = res.data ? res.data : res;
        let rows = '';
        items.forEach(i => {
            rows += `
            <tr>
                <td>${i.name}</td>
                <td>${i.stock}</td>
                <td>${i.price}</td>
                <td>
                    <button class="btn btn-sm btn-warning btn-edit" data-id="${i.id}">Edit</button>
                    <button class="btn btn-sm btn-danger btn-delete" data-id="${i.id}">Delete</button>
                </td>
            </tr>`;
        });
        $("#itemTable").html(rows);
    });
}

loadItems();

$("#btnAddItem").click(function(){
    $("#itemModalTitle").text("Add Item");
    $("#itemForm")[0].reset();
    $("#itemId").val('');
    itemModal.show();
});

$("#itemForm").submit(function(e){
    e.preventDefault();
    const id = $("#itemId").val();
    const data = {
        name: $("#itemName").val(),
        stock: parseInt($("#itemStock").val()),
        price: parseFloat($("#itemPrice").val())
    };
    const method = id ? "PUT" : "POST";
    const url = id ? `/items/${id}` : "/items";

    apiRequest({ url, method, data }).done(function(res){
        Swal.fire("Success", "Item saved", "success");
        itemModal.hide();
        loadItems();
    });
});

$(document).on("click", ".btn-edit", function(){
    const id = $(this).data("id");
    apiRequest({ url: `/items/${id}` }).done(function(i){
        $("#itemModalTitle").text("Edit Item");
        $("#itemId").val(i.id);
        $("#itemName").val(i.name);
        $("#itemStock").val(i.stock);
        $("#itemPrice").val(i.price);
        itemModal.show();
    });
});

$(document).on("click", ".btn-delete", function(){
    const id = $(this).data("id");
    Swal.fire({
        title: "Are you sure?",
        text: "Item will be deleted",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then((result)=>{
        if(result.isConfirmed){
            apiRequest({ url: `/items/${id}`, method: "DELETE" }).done(function(res){
                Swal.fire("Deleted!", "Item has been deleted.", "success");
                loadItems();
            });
        }
    });
});
