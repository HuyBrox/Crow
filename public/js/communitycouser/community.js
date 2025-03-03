// popup dang bai
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

document.addEventListener("click", (event) => {
    document.querySelectorAll(".options-dropdown").forEach(menu => {
        if (!menu.parentElement.contains(event.target)) {
            menu.style.display = "none";
        }
    });
});

// Delete post
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
                    // Xóa bài viết khỏi giao diện
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


// like bai viet
document.addEventListener("DOMContentLoaded", () => {
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
                    // Cập nhật số lượt like
                    const likesCount = button.nextElementSibling;
                    likesCount.textContent = data.likesCount;

                    // Cập nhật trạng thái nút
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


function editPost(postId) {
    fetch(`/community/get-post/${postId}`)
        .then(response => response.json())
        .then(post => {
            if (post.success) {
                document.getElementById("editCaption").value = post.data.caption;
                document.getElementById("editDesc").value = post.data.desc;
                document.getElementById("editPostId").value = postId;
                document.getElementById("editPostPopup").style.display = "flex";
            } else {
                alert("Không tìm thấy bài viết");
            }
        })
        .catch(error => {
            console.error("Lỗi khi tải bài viết:", error);
            alert("Có lỗi xảy ra");
        });
}

function closeEditPostPopup() {
    document.getElementById("editPostPopup").style.display = "none";
}
