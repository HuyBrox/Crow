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


