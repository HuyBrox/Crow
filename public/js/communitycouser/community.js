export { openPostPopup, closePostPopup, toggleOptionsMenu, deletePost, editPost };
// Popup đăng bài
function openPostPopup() {
    document.getElementById("postPopup").style.display = "flex";
}

function closePostPopup() {
    document.getElementById("postPopup").style.display = "none";
}

// Menu tùy chọn
function toggleOptionsMenu(button) {
    const menu = button.nextElementSibling;
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Xóa bài viết
function deletePost(postId) {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
        fetch(`/community/delete/${postId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
                if (postElement) {
                    postElement.remove();
                }
            } else {
                alert(data.message || "Có lỗi khi xóa bài viết");
            }
        })
        .catch(error => {
            console.error("Lỗi khi xóa bài viết:", error);
            alert("Không thể thực hiện hành động này");
        });
    }
}

// Chỉnh sửa bài viết (chưa hoàn thiện)
function editPost(postId) {
    console.log(`Chỉnh sửa bài viết ${postId}`);
}

// Khởi tạo sự kiện khi DOM loaded
document.addEventListener("DOMContentLoaded", () => {
    // Mở popup
    document.getElementById("postInput").addEventListener("click", openPostPopup);
    
    // Đóng popup
    document.querySelectorAll(".cancel-btn").forEach(btn => {
        btn.addEventListener("click", closePostPopup);
    });

    // Toggle menu tùy chọn
    document.querySelectorAll(".options-btn").forEach(btn => {
        btn.addEventListener("click", () => toggleOptionsMenu(btn));
    });

    // Đóng menu khi click ngoài
    document.addEventListener("click", (event) => {
        document.querySelectorAll(".options-dropdown").forEach(menu => {
            if (!menu.parentElement.contains(event.target)) {
                menu.style.display = "none";
            }
        });
    });

    // Xóa bài viết
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => deletePost(btn.dataset.postId));
    });

    // Like bài viết
    document.querySelectorAll(".like-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const postId = button.getAttribute("data-post-id");
            try {
                const response = await fetch(`/community/like/${postId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                if (data.success) {
                    const likesCount = button.nextElementSibling;
                    likesCount.textContent = data.likesCount;
                    if (data.hasLiked) {
                        button.classList.add("liked");
                    } else {
                        button.classList.remove("liked");
                    }
                } else {
                    alert(data.message || "Có lỗi xảy ra khi thích bài viết");
                }
            } catch (error) {
                console.error("Lỗi khi gửi yêu cầu Like:", error);
                alert("Không thể thực hiện hành động này");
            }
        });
    });
});

