let products = [
    { id: 1, name: 'Tài liệu Kinh tế v1', price: 50000, category: 'Kinh tế', image: '', stock: 10, rating: 4.5, reviews: ['Good', 'Very informative'], description: 'Tài liệu Kinh tế cơ bản.' },
    { id: 2, name: 'Lập trình JavaScript', price: 75000, category: 'Lập trình', image: '', stock: 50, rating: 4.8, reviews: [], description: 'Học JavaScript từ cơ bản đến nâng cao.' },
    { id: 3, name: 'Toán cao cấp', price: 60000, category: 'Toán học', image: '', stock: 100, rating: 4.0, reviews: [], description: 'Tài liệu ôn tập Toán cao cấp.' },
    { id: 4, name: 'Kỹ thuật cơ khí', price: 90000, category: 'Kỹ thuật', image: '', stock: 20, rating: 4.2, reviews: [], description: 'Kiến thức cơ bản về kỹ thuật cơ khí.' },
    { id: 5, name: 'Khoa học dữ liệu', price: 85000, category: 'Khoa học dữ liệu', image: '', stock: 30, rating: 4.7, reviews: [], description: 'Giới thiệu về khoa học dữ liệu.' },
    { id: 6, name: 'Vật lý đại cương', price: 55000, category: 'Vật lý', image: '', stock: 40, rating: 4.3, reviews: [], description: 'Tài liệu Vật lý cơ bản.' },
    { id: 7, name: 'Thiết kế đồ họa', price: 70000, category: 'Thiết kế', image: '', stock: 25, rating: 4.6, reviews: [], description: 'Học thiết kế đồ họa với Photoshop.' },
    { id: 8, name: 'Hóa học cơ bản', price: 65000, category: 'Hóa học', image: '', stock: 15, rating: 4.4, reviews: [], description: 'Tài liệu Hóa học cơ bản.' },
    { id: 9, name: 'Ngôn ngữ học nhập môn', price: 60000, category: 'Ngôn ngữ học', image: '', stock: 20, rating: 4.4, reviews: [], description: 'Giới thiệu cơ bản về ngôn ngữ học.' },
    { id: 10, name: 'Quản trị chiến lược', price: 80000, category: 'Quản trị kinh doanh', image: '', stock: 15, rating: 4.6, reviews: [], description: 'Kiến thức về quản trị chiến lược doanh nghiệp.' }
];

let cart = safeGetStorage('cart') || [];
let wishlist = safeGetStorage('wishlist') || [];
let uploadedDocuments = safeGetStorage('uploadedDocuments') || [];
let currentCategory = 'all';
let currentSort = 'default';
let currentPage = 1;
const productsPerPage = 8;
let recentlyViewed = safeGetStorage('recentlyViewed') || [];

function safeGetStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (e) {
        return null;
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = `fixed bottom-6 right-6 p-4 rounded-lg shadow-lg text-white ${type === 'success' ? 'bg-green-600 slide-in' : 'bg-red-500 slide-in'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('slide-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
        cartCount.classList.toggle('hidden', totalItems === 0);
    }
}

function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.classList.toggle('hidden', wishlist.length === 0);
    }
}

function updateUserMenu() {
    const userGreeting = document.getElementById('user-greeting');
    const accountDropdown = document.getElementById('account-dropdown');
    const user = safeGetStorage('user');
    if (userGreeting && accountDropdown) {
        userGreeting.textContent = user ? `Xin chào, ${user.name}` : 'Tài khoản';
        accountDropdown.innerHTML = user
            ? `
                <a href="/profile.html" class="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600 transition">Hồ sơ</a>
                <button id="logout-btn" class="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600 transition w-full text-left">Đăng xuất</button>
            `
            : `
                <a href="/login.html" class="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600 transition">Đăng nhập</a>
                <a href="/register.html" class="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600 transition">Đăng ký</a>
            `;
        accountDropdown.classList.add('hidden');
        userGreeting.addEventListener('click', (e) => {
            e.preventDefault();
            accountDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!userGreeting.contains(e.target) && !accountDropdown.contains(e.target)) {
                accountDropdown.classList.add('hidden');
            }
        });
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('user');
                updateUserMenu();
                showToast('Đăng xuất thành công!');
                window.location.href = '/index.html';
            });
        }
    }
}

function renderProductCard(product) {
    return `
        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden transition transform hover:-translate-y-2 hover:shadow-lg">
            <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}" class="w-full h-40 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold truncate">${product.name}</h3>
                <p class="text-red-500 font-medium">${product.price.toLocaleString('vi-VN')} VNĐ</p>
                <p class="text-sm text-gray-600">${product.category}</p>
                <p class="text-sm text-yellow-500"><span>${'★'.repeat(Math.floor(product.rating || 0))}${'☆'.repeat(5 - Math.floor(product.rating || 0))}</span></p>
                <p class="text-sm ${product.stock === 0 ? 'text-red-500' : 'text-gray-600'}">${product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}</p>
                <button class="view-details-btn btn bg-blue-600 text-white w-full py-2 mt-2 rounded-lg hover:bg-blue-700" data-product-id="${product.id}">Xem chi tiết</button>
            </div>
        </div>
    `;
}

function addToRecentlyViewed(productId) {
    if (!recentlyViewed.includes(productId)) {
        recentlyViewed.unshift(productId);
        recentlyViewed = recentlyViewed.slice(0, 4);
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
        renderRecentlyViewed();
    }
}

function renderRecentlyViewed() {
    const recentlyViewedList = document.getElementById('recently-viewed-list');
    if (recentlyViewedList) {
        const viewedProducts = recentlyViewed.map(id => products.find(p => p.id === parseInt(id))).filter(p => p);
        recentlyViewedList.innerHTML = viewedProducts.length ? viewedProducts.map(renderProductCard).join('') : '<p class="text-gray-600 text-center">Chưa có tài liệu nào được xem gần đây.</p>';
        recentlyViewedList.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                addToRecentlyViewed(btn.dataset.productId);
                renderProductDetailModal(btn.dataset.productId);
            });
        });
    }
}

function renderProducts() {
    const productsList = document.getElementById('products-list');
    const loadMore = document.getElementById('load-more');
    if (productsList) {
        let filteredProducts = products.filter(p => currentCategory === 'all' || p.category === currentCategory);
        if (currentSort === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (currentSort === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (currentSort === 'rating-desc') {
            filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const paginatedProducts = filteredProducts.slice(0, end);
        productsList.innerHTML = paginatedProducts.length ? paginatedProducts.map(renderProductCard).join('') : '<p class="text-gray-600 text-center">Không có sản phẩm nào.</p>';
        if (loadMore) {
            loadMore.classList.toggle('hidden', end >= filteredProducts.length);
        }
        productsList.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                addToRecentlyViewed(btn.dataset.productId);
                renderProductDetailModal(btn.dataset.productId);
            });
        });
    }
}

function performSearch(query) {
    const productsList = document.getElementById('products-list');
    if (productsList) {
        const results = products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) || 
            (p.description || '').toLowerCase().includes(query.toLowerCase())
        );
        productsList.innerHTML = results.length ? results.map(renderProductCard).join('') : '<p class="text-gray-600 text-center">Không tìm thấy sản phẩm nào.</p>';
        productsList.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                addToRecentlyViewed(btn.dataset.productId);
                renderProductDetailModal(btn.dataset.productId);
            });
        });
        document.getElementById('load-more')?.classList.add('hidden');
    }
}

function renderProductDetailModal(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
        const modal = document.getElementById('product-detail-modal');
        if (modal) {
            document.getElementById('product-detail-image').src = product.image || 'https://via.placeholder.com/300';
            document.getElementById('product-detail-title').textContent = product.name;
            document.getElementById('product-detail-price').textContent = `${product.price.toLocaleString('vi-VN')} VNĐ`;
            document.getElementById('product-detail-category').textContent = `Danh mục: ${product.category}`;
            document.getElementById('product-detail-rating').textContent = `${'★'.repeat(Math.floor(product.rating || 0))}${'☆'.repeat(5 - Math.floor(product.rating || 0))} (${product.rating || 0})`;
            document.getElementById('product-detail-stock').textContent = product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng';
            document.getElementById('description-text').textContent = product.description || 'Không có mô tả.';
            const reviewList = document.getElementById('product-detail-reviews');
            if (reviewList) {
                reviewList.innerHTML = product.reviews.length
                    ? product.reviews.map(review => `<li>${review}</li>`).join('')
                    : '<li>Chưa có đánh giá nào.</li>';
            }
            const addToCartBtn = document.getElementById('add-to-cart-btn');
            const addToWishlistBtn = document.getElementById('add-to-wishlist-btn');
            const buyNowBtn = document.getElementById('buy-now-btn');
            addToCartBtn.dataset.productId = productId;
            addToWishlistBtn.dataset.productId = productId;
            buyNowBtn.dataset.productId = productId;
            addToCartBtn.disabled = product.stock === 0;
            buyNowBtn.disabled = product.stock === 0;
            addToCartBtn.onclick = () => {
                const user = safeGetStorage('user');
                if (!user) {
                    showToast('Vui lòng đăng nhập để thêm vào giỏ hàng.', 'error');
                    window.location.href = '/login.html';
                    return;
                }
                const item = cart.find(i => i.id === productId);
                if (item) {
                    if ((item.quantity || 1) + 1 <= product.stock) {
                        item.quantity = (item.quantity || 1) + 1;
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCartCount();
                        showToast('Đã thêm vào giỏ hàng!');
                    } else {
                        showToast('Số lượng vượt quá trong kho.', 'error');
                    }
                } else {
                    cart.push({ id: productId, quantity: 1 });
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartCount();
                    showToast('Đã thêm vào giỏ hàng!');
                }
            };
            addToWishlistBtn.onclick = () => {
                if (!wishlist.includes(productId)) {
                    wishlist.push(productId);
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                    updateWishlistCount();
                    showToast('Đã thêm vào danh sách yêu thích!');
                } else {
                    showToast('Sản phẩm đã có trong danh sách yêu thích.', 'error');
                }
            };
            buyNowBtn.onclick = () => {
                const user = safeGetStorage('user');
                if (!user) {
                    showToast('Vui lòng đăng nhập để mua hàng.', 'error');
                    window.location.href = '/login.html';
                    return;
                }
                if (product.stock === 0) {
                    showToast('Sản phẩm đã hết hàng.', 'error');
                    return;
                }
                if ((user.balance || 0) < product.price) {
                    showToast('Số dư không đủ để mua sản phẩm.', 'error');
                    return;
                }
                user.balance -= product.price;
                user.purchases = user.purchases || [];
                user.purchases.push({ name: product.name, price: product.price, timestamp: new Date().toISOString() });
                product.stock -= 1;
                const users = safeGetStorage('users').map(u => u.email === user.email ? user : u);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('users', JSON.stringify(users));
                showToast('Mua hàng thành công!');
                modal.close();
                renderProducts();
            };
            modal.showModal();
        }
    }
}

function init() {
    updateCartCount();
    updateWishlistCount();
    updateUserMenu();
    renderProducts();
    renderRecentlyViewed();

    // Discount banner
    const discountBanner = document.getElementById('discount-banner');
    if (discountBanner && !sessionStorage.getItem('discountBannerDismissed') && window.location.pathname.includes('products.html')) {
        discountBanner.classList.remove('hidden');
        const closeBannerBtn = document.querySelector('[data-action="close-banner"]');
        if (closeBannerBtn) {
            closeBannerBtn.addEventListener('click', () => {
                discountBanner.classList.add('slide-out-banner');
                setTimeout(() => {
                    discountBanner.classList.add('hidden');
                    sessionStorage.setItem('discountBannerDismissed', 'true');
                }, 500);
            });
        }
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value.trim();
            const usernameError = document.getElementById('register-username-error');
            const emailError = document.getElementById('register-email-error');
            const passwordError = document.getElementById('register-password-error');
            let isValid = true;

            if (!username || username.length < 3) {
                usernameError.textContent = 'Tên người dùng phải có ít nhất 3 ký tự';
                usernameError.classList.remove('hidden');
                isValid = false;
            } else {
                usernameError.classList.add('hidden');
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emailError.textContent = 'Email không hợp lệ';
                emailError.classList.remove('hidden');
                isValid = false;
            } else {
                emailError.classList.add('hidden');
            }

            if (!password || password.length < 6) {
                passwordError.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
                passwordError.classList.remove('hidden');
                isValid = false;
            } else {
                passwordError.classList.add('hidden');
            }

            if (isValid) {
                const users = safeGetStorage('users') || [];
                if (users.find(u => u.email === email)) {
                    emailError.textContent = 'Email đã được đăng ký';
                    emailError.classList.remove('hidden');
                    showToast('Email đã được đăng ký!', 'error');
                    return;
                }
                users.push({
                    name: username,
                    email: email,
                    password: password,
                    balance: 0,
                    purchases: [],
                    createdAt: new Date().toISOString()
                });
                localStorage.setItem('users', JSON.stringify(users));
                showToast('Đăng ký thành công! Vui lòng đăng nhập.');
                setTimeout(() => window.location.href = '/login.html', 1000);
            }
        });
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();
            const emailError = document.getElementById('login-email-error');
            const passwordError = document.getElementById('login-password-error');
            let isValid = true;

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emailError.textContent = 'Email không hợp lệ';
                emailError.classList.remove('hidden');
                isValid = false;
            } else {
                emailError.classList.add('hidden');
            }

            if (!password || password.length < 6) {
                passwordError.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
                passwordError.classList.remove('hidden');
                isValid = false;
            } else {
                passwordError.classList.add('hidden');
            }

            if (isValid) {
                const users = safeGetStorage('users') || [];
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    user.lastLogin = new Date().toISOString();
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('users', JSON.stringify(users));
                    showToast('Đăng nhập thành công!');
                    setTimeout(() => window.location.href = '/index.html', 1000);
                } else {
                    showToast('Email hoặc mật khẩu không đúng!', 'error');
                    emailError.textContent = 'Email hoặc mật khẩu không đúng';
                    emailError.classList.remove('hidden');
                }
            }
        });
    }

    // Forgot password link
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Liên kết khôi phục mật khẩu đã được gửi!');
        });
    }

    // Search
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            if (searchInput.value.trim()) {
                performSearch(searchInput.value.trim());
            } else {
                showToast('Vui lòng nhập từ khóa tìm kiếm!', 'error');
            }
        });
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim()) {
                performSearch(searchInput.value.trim());
            } else if (e.key === 'Enter') {
                showToast('Vui lòng nhập từ khóa tìm kiếm!', 'error');
            }
        });
    }

    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                currentCategory = e.target.dataset.category;
                currentPage = 1;
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.toggle('bg-blue-900', btn.dataset.category === currentCategory);
                    btn.classList.toggle('text-white', btn.dataset.category === currentCategory);
                    btn.classList.toggle('bg-gray-200', btn.dataset.category !== currentCategory);
                    btn.classList.toggle('text-gray-800', btn.dataset.category !== currentCategory);
                    btn.classList.toggle('active', btn.dataset.category === currentCategory);
                });
                renderProducts();
            }
        });
    }

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            currentPage = 1;
            renderProducts();
        });
    }

    // Load more
    const loadMore = document.getElementById('load-more');
    if (loadMore) {
        loadMore.addEventListener('click', () => {
            currentPage++;
            renderProducts();
        });
    }

    // Product detail modal
    const closeModalBtn = document.querySelector('[data-action="close-product-detail"]');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('product-detail-modal').close();
        });
    }

    // Review form
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const productId = document.getElementById('add-to-cart-btn').dataset.productId;
            const reviewText = document.getElementById('review-text').value.trim();
            const reviewError = document.getElementById('review-error-text');
            if (reviewText) {
                const product = products.find(p => p.id === parseInt(productId));
                if (product) {
                    product.reviews.push(reviewText);
                    renderProductDetailModal(productId);
                    reviewForm.reset();
                    showToast('Đánh giá đã được gửi!');
                    reviewError.classList.add('hidden');
                }
            } else {
                reviewError.textContent = 'Vui lòng nhập nội dung đánh giá';
                reviewError.classList.remove('hidden');
            }
        });
    }

    // Top-up form
    const topUpForm = document.getElementById('top-up-form');
    if (topUpForm) {
        topUpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseInt(document.getElementById('top-up-amount').value);
            const error = document.getElementById('top-up-error');
            if (amount >= 10000) {
                const user = safeGetStorage('user');
                if (!user) {
                    showToast('Vui lòng đăng nhập để nạp tiền.', 'error');
                    window.location.href = '/login.html';
                    return;
                }
                user.balance = (user.balance || 0) + amount;
                const users = safeGetStorage('users').map(u => u.email === user.email ? user : u);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('users', JSON.stringify(users));
                showToast(`Nạp ${amount.toLocaleString('vi-VN')} VNĐ thành công!`);
                topUpForm.reset();
                document.getElementById('top-up-modal').close();
                error.classList.add('hidden');
            } else {
                error.textContent = 'Số tiền tối thiểu 10,000 VNĐ';
                error.classList.remove('hidden');
            }
        });
    }

    const closeTopUpBtn = document.querySelector('[data-action="close-top-up"]');
    if (closeTopUpBtn) {
        closeTopUpBtn.addEventListener('click', () => {
            document.getElementById('top-up-modal').close();
        });
    }

    // Upload form
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = safeGetStorage('user');
            if (!user) {
                showToast('Vui lòng đăng nhập để tải lên tài liệu.', 'error');
                window.location.href = '/login.html';
                return;
            }
            const title = document.getElementById('upload-title').value.trim();
            const category = document.getElementById('upload-category').value;
            const price = parseInt(document.getElementById('upload-price').value);
            const description = document.getElementById('upload-description').value.trim();
            const file = document.getElementById('upload-file').files[0];
            const titleError = document.getElementById('upload-title-error');
            const categoryError = document.getElementById('upload-category-error');
            const priceError = document.getElementById('upload-price-error');
            const descriptionError = document.getElementById('upload-description-error');
            const fileError = document.getElementById('upload-file-error');
            let isValid = true;

            if (!title) {
                titleError.classList.remove('hidden');
                isValid = false;
            } else {
                titleError.classList.add('hidden');
            }

            if (!category) {
                categoryError.classList.remove('hidden');
                isValid = false;
            } else {
                categoryError.classList.add('hidden');
            }

            if (!price || price < 0) {
                priceError.classList.remove('hidden');
                isValid = false;
            } else {
                priceError.classList.add('hidden');
            }

            if (!description) {
                descriptionError.classList.remove('hidden');
                isValid = false;
            } else {
                descriptionError.classList.add('hidden');
            }

            if (!file) {
                fileError.classList.remove('hidden');
                isValid = false;
            } else {
                fileError.classList.add('hidden');
            }

            if (isValid) {
                uploadedDocuments.push({
                    title,
                    category,
                    price,
                    description,
                    fileName: file.name,
                    uploader: user.email,
                    uploadDate: new Date().toISOString()
                });
                localStorage.setItem('uploadedDocuments', JSON.stringify(uploadedDocuments));
                showToast('Tài liệu đã được tải lên thành công!');
                uploadForm.reset();
            }
        });
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            const nameError = document.getElementById('contact-name-error');
            const emailError = document.getElementById('contact-email-error');
            const messageError = document.getElementById('contact-message-error');
            let isValid = true;

            if (!name) {
                nameError.classList.remove('hidden');
                isValid = false;
            } else {
                nameError.classList.add('hidden');
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emailError.textContent = 'Email không hợp lệ';
                emailError.classList.remove('hidden');
                isValid = false;
            } else {
                emailError.classList.add('hidden');
            }

            if (!message) {
                messageError.classList.remove('hidden');
                isValid = false;
            } else {
                messageError.classList.add('hidden');
            }

            if (isValid) {
                showToast('Tin nhắn đã được gửi thành công!');
                contactForm.reset();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', init);