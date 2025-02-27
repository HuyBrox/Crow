// popup dang bai
function openPostPopup() {
    document.getElementById("postPopup").style.display = "flex";
}

function closePostPopup() {
    document.getElementById("postPopup").style.display = "none";
}

//menu sua xoa
function toggleOptionsMenu(button) {
    const menu = button.nextElementSibling;
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (event) {
    document.querySelectorAll(".options-dropdown").forEach(menu => {
        if (!menu.parentElement.contains(event.target)) {
            menu.style.display = "none";
        }
    });
});


// //pop up sua bai
// function openEditPopup(postId, caption, desc) {
//     document.getElementById("editPostId").value = postId;
//     document.getElementById("editCaption").value = caption;
//     document.getElementById("editDesc").value = desc;
//     document.getElementById("editPostForm").action = `/community/edit/${postId}`;
//     document.getElementById("editPostPopup").style.display = "flex";
//     popup.style.display = "flex";
// }

// function closeEditPopup() {
//     document.getElementById("editPostPopup").style.display = "none";
// }
