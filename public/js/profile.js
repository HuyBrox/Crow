
document.addEventListener('DOMContentLoaded', function() {
    const user = document.getElementById('user');
    const imgQuocKy = document.getElementById('quocKy');
    switch (user.nationality) {
        case 'Vietnam':
            imgQuocKy.src = 'https://tienichhay.net/uploads/flags/shiny/48x48/vn.png';
            break;
        case 'Japan':
            imgQuocKy.src = 'https://tienichhay.net/uploads/flags/shiny/48x48/jp.png';
            break;
        case 'China':
            imgQuocKy.src = 'https://tienichhay.net/uploads/flags/shiny/48x48/cn.png';
            break;
        case 'USA':
            imgQuocKy.src = 'https://tienichhay.net/uploads/flags/shiny/48x48/us.png';
            break;
        case 'England':
            imgQuocKy.src = 'https://tienichhay.net/uploads/flags/shiny/48x48/gb.png';
            break;
        case 'Korea':
            imgQuocKy.src = 'https://tienichhay.net/uploads/flags/shiny/48x48/kr.png';
            break;
        default:
            imgQuocKy.src = 'https://tienichhay.net/uploads/flags/shiny/48x48/vn.png';
            break;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('profile.js loaded');

    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileSection = document.querySelector('.edit-profile');
    const overlay = document.querySelector('.overlay');
    const editProfileForm = document.getElementById('editProfileForm');
    const saveButton = document.getElementById('saveProfile');         
    const cancelButton = document.getElementById('cancelProfile');

    if (editProfileBtn) {
        console.log('Edit button found');
        editProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Edit button clicked');
            if (editProfileSection && overlay) {
                editProfileSection.classList.add('active');
                overlay.classList.add('active');
            } else {
                console.log('Popup or overlay not found:', { editProfileSection, overlay });
            }
        });
    } else {
        console.log('Edit button not found');
    }

    if (saveButton) {
        saveButton.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Save button clicked');

            const formData = new FormData(editProfileForm);
            const userInput = document.getElementById('user');
            let userId = null
            if (userInput) {
                const user = JSON.parse(userInput.value);
                userId = user._id;
            }

            try {
                const response = await fetch(`/profile/edit/${userId}`, {
                    method: 'PATCH',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Cập nhật profile thành công!');
                    window.location.reload();
                } else {
                    const error = await response.json();
                    alert(`Lỗi: ${error.message}`);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert('Có lỗi xảy ra, vui lòng thử lại!');
            }
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Cancel button clicked');
            if (editProfileSection && overlay) {
                editProfileSection.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    // Đóng popup khi click ngoài (vào overlay)
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                editProfileSection.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }
});
