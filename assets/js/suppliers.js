requireAuth();

const supplierModal = new bootstrap.Modal(document.getElementById('supplierModal'));

// Load Supplier List
function loadSuppliers() {
    apiRequest({ url: "/suppliers" }).done(function(res){
        const suppliers = res.data ? res.data : res;
        let rows = '';
        suppliers.forEach(s => {
            rows += `
            <tr>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.address}</td>
                <td>
                    <button class="btn btn-sm btn-warning btn-edit" data-id="${s.id}">Edit</button>
                    <button class="btn btn-sm btn-danger btn-delete" data-id="${s.id}">Delete</button>
                </td>
            </tr>`;
        });
        $("#supplierTable").html(rows);
    });
}

loadSuppliers();

// Add Supplier
$("#btnAddSupplier").click(function() {
    $("#modalTitle").text("Add Supplier");
    $("#supplierForm")[0].reset();
    $("#supplierId").val('');
    supplierModal.show();
});

// Save Supplier (Create / Update)
$("#supplierForm").submit(function(e){
    e.preventDefault();
    const id = $("#supplierId").val();
    const data = {
        name: $("#name").val(),
        email: $("#email").val(),
        address: $("#address").val()
    };

    let method = id ? "PUT" : "POST";
    let url = id ? `/suppliers/${id}` : "/suppliers";

    apiRequest({ url, method, data }).done(function(res){
        Swal.fire("Success", "Supplier saved", "success");
        supplierModal.hide();
        loadSuppliers();
    });
});

// Edit Supplier
$(document).on("click", ".btn-edit", function(){
    const id = $(this).data("id");
    apiRequest({ url: `/suppliers/${id}` }).done(function(s){
        $("#modalTitle").text("Edit Supplier");
        $("#supplierId").val(s.id);
        $("#name").val(s.name);
        $("#email").val(s.email);
        $("#address").val(s.address);
        supplierModal.show();
    });
});

// Delete Supplier
$(document).on("click", ".btn-delete", function(){
    const id = $(this).data("id");
    Swal.fire({
        title: "Are you sure?",
        text: "Supplier will be deleted",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then((result)=>{
        if(result.isConfirmed){
            apiRequest({ url: `/suppliers/${id}`, method: "DELETE" }).done(function(res){
                Swal.fire("Deleted!", "Supplier has been deleted.", "success");
                loadSuppliers();
            });
        }
    });
});

// Logout Button
$(document).on("click", "#btnLogout", logout);
