let products = [
    { id: '1', name: 'Tài liệu Kinh tế v1', price: 50000, category: 'Kinh tế', image: '', stock: 10, rating: 4.5, reviews: ['Good', 'Very informative'], description: 'Tài liệu Kinh tế cơ bản.', fileUrl: 'https://example.com/files/economics.pdf' },
    { id: '2', name: 'Lập trình JavaScript', price: 45000, category: 'Lập trình', image: '', stock: 500, rating: 4.8, reviews: ['Rất chi tiết', 'Hữu ích cho người mới'], description: 'Học JavaScript từ cơ bản đến nâng cao.', fileUrl: 'https://example.com/files/javascript.pdf' },
    { id: '3', name: 'Toán cao cấp', price: 60000, category: 'Toán học', image: '', stock: 100, rating: 4.0, reviews: [], description: 'Tài liệu ôn tập Toán cao cấp.', fileUrl: 'https://example.com/files/math.pdf' },
    { id: '4', name: 'Kỹ thuật cơ khí', price: 90000, category: 'Kỹ thuật', image: '', stock: 20, rating: 4.2, reviews: [], description: 'Kiến thức cơ bản về kỹ thuật cơ khí.', fileUrl: 'https://example.com/files/mechanical.pdf' },
    { id: '5', name: 'Khoa học dữ liệu', price: 85000, category: 'Khoa học dữ liệu', image: '', stock: 30, rating: 4.7, reviews: ['Tuyệt vời!'], description: 'Giới thiệu về khoa học dữ liệu.', fileUrl: 'https://example.com/files/datascience.pdf' },
    { id: '6', name: 'Vật lý đại cương', price: 55000, category: 'Vật lý', image: '', stock: 40, rating: 4.3, reviews: [], description: 'Tài liệu Vật lý cơ bản.', fileUrl: 'https://example.com/files/physics.pdf' },
    { id: '7', name: 'Thiết kế đồ họa', price: 70000, category: 'Thiết kế', image: '', stock: 25, rating: 4.6, reviews: [], description: 'Học thiết kế đồ họa với Photoshop.', fileUrl: 'https://example.com/files/design.pdf' },
    { id: '8', name: 'Hóa học cơ bản', price: 65000, category: 'Hóa học', image: '', stock: 50, rating: 4.4, reviews: [], description: 'Tài liệu Hóa học cơ bản.', fileUrl: 'https://example.com/files/chemistry.pdf' },
    { id: '9', name: 'Ngôn ngữ học nhập môn', price: 60000, category: 'Ngôn ngữ học', image: '', stock: 20, rating: 4.4, reviews: [], description: 'Giới thiệu cơ bản về ngôn ngữ học.', fileUrl: 'https://example.com/files/linguistics.pdf' },
    { id: '10', name: 'Quản trị chiến lược', price: 80000, category: 'Quản trị kinh doanh', image: '', stock: 15, rating: 4.6, reviews: [], description: 'Kiến thức về quản trị chiến lược doanh nghiệp.', fileUrl: 'https://example.com/files/strategy.pdf' }
];

let cart = safeGetStorage('cart') || [];
let wishlist = safeGetStorage('wishlist') || [];
let currentCategory = 'all';
let currentSort = 'default';
let currentPage = 1;
const productsPerPage = 8;
let uploadedDocuments = safeGetStorage('uploadedDocuments') || [];

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
        cartCount.textContent = cart.length;
        cartCount.classList.toggle('hidden', cart.length === 0);
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
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600 transition" data-action="show-login">Đăng nhập</a>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600 transition" data-action="show-register">Đăng ký</a>
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
        document.querySelectorAll('[data-action="show-login"]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('login-modal').showModal();
                accountDropdown.classList.add('hidden');
            });
        });
        document.querySelectorAll('[data-action="show-register"]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('register-modal').showModal();
                accountDropdown.classList.add('hidden');
            });
        });
    }
}

function addToCart(productId) {
    const user = safeGetStorage('user');
    if (!user) {
        showToast('Vui lòng đăng nhập để thêm vào giỏ hàng.', 'error');
        document.getElementById('login-modal').showModal();
        return;
    }
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) {
        showToast('Sản phẩm đã hết hàng.', 'error');
        return;
    }
    if (cart.includes(productId)) {
        showToast('Sản phẩm đã có trong giỏ hàng.', 'error');
        return;
    }
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Đã thêm vào giỏ hàng!');
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
                <div class="flex gap-2 mt-2">
                    <button class="view-details-btn btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full" data-product-id="${product.id}">Xem chi tiết</button>
                    <button class="add-to-cart-btn btn bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full" data-product-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>Thêm vào giỏ</button>
                </div>
            </div>
        </div>
    `;
}

function renderCartItem(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return '';
    return `
        <div class="cart-item bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 border" data-product-id="${product.id}">
            <img src="${product.image || 'https://via.placeholder.com/100'}" alt="${product.name}" class="w-24 h-24 object-cover rounded">
            <div class="flex-1">
                <h3 class="text-lg font-semibold">${product.name}</h3>
                <p class="text-sm text-gray-600">${product.category}</p>
                <p class="text-red-500 font-medium">${product.price.toLocaleString('vi-VN')} VNĐ</p>
                <p class="text-sm ${product.stock === 0 ? 'text-red-500' : 'text-gray-600'}">${product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}</p>
            </div>
            <div class="text-lg font-semibold">${product.price.toLocaleString('vi-VN')} VNĐ</div>
            <button class="remove-item btn bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700" data-product-id="${product.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartTotal = document.getElementById('cart-total');
    const userBalance = document.getElementById('user-balance');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (cartItemsContainer && cartEmpty && cartTotal && userBalance) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            cartEmpty.classList.remove('hidden');
            cartTotal.textContent = 'Tổng cộng: 0 VNĐ';
            checkoutBtn.disabled = true;
        } else {
            cartItemsContainer.innerHTML = cart.map(renderCartItem).join('');
            cartEmpty.classList.add('hidden');
            const total = cart.reduce((sum, productId) => {
                const product = products.find(p => p.id === productId);
                return sum + (product ? product.price : 0);
            }, 0);
            cartTotal.textContent = `Tổng cộng: ${total.toLocaleString('vi-VN')} VNĐ`;
            const user = safeGetStorage('user');
            userBalance.textContent = `Số dư tài khoản: ${(user ? user.balance || 0 : 0).toLocaleString('vi-VN')} VNĐ`;
            checkoutBtn.disabled = false;

            cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    const productId = btn.dataset.productId;
                    cart = cart.filter(id => id !== productId);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartCount();
                    renderCart();
                    showToast('Đã xóa sản phẩm khỏi giỏ hàng!');
                });
            });
        }
    }
}

function renderFeaturedProducts() {
    const featuredProductsList = document.getElementById('featured-products-list');
    if (featuredProductsList) {
        const featuredProducts = products.slice(0, 4);
        featuredProductsList.innerHTML = featuredProducts.length 
            ? featuredProducts.map(renderProductCard).join('') 
            : '<p class="text-gray-600 text-center">Không có sản phẩm nổi bật nào.</p>';
        featuredProductsList.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                renderProductDetailModal(btn.dataset.productId);
            });
        });
        featuredProductsList.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                addToCart(btn.dataset.productId);
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
            filteredProducts.sort((a, b) => b.price - b.price);
        } else if (currentSort === 'rating-desc') {
            filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const paginatedProducts = filteredProducts.slice(start, end);
        productsList.innerHTML = paginatedProducts.length ? paginatedProducts.map(renderProductCard).join('') : '<p class="text-gray-600 text-center">Không có sản phẩm nào.</p>';
        if (loadMore) {
            loadMore.classList.toggle('hidden', end >= filteredProducts.length);
        }
        productsList.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                renderProductDetailModal(btn.dataset.productId);
            });
        });
        productsList.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                addToCart(btn.dataset.productId);
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
                renderProductDetailModal(btn.dataset.productId);
            });
        });
        productsList.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                addToCart(btn.dataset.productId);
            });
        });
        document.getElementById('load-more')?.classList.add('hidden');
    }
}

function renderProductDetailModal(productId) {
    const product = products.find(p => p.id === productId);
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
                addToCart(productId);
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
                    document.getElementById('login-modal').showModal();
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
                user.purchases.push({ name: product.name, price: product.price, timestamp: new Date().toISOString(), productId: product.id });
                product.stock -= 1;
                const users = safeGetStorage('users').map(u => u.email === user.email ? user : u);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('users', JSON.stringify(users));
                showToast('Mua hàng thành công!');
                modal.close();
                renderProducts();
                renderProfile();
            };
            modal.showModal();
        }
    }
}

function renderProfile() {
    const user = safeGetStorage('user');
    if (!user) {
        showToast('Vui lòng đăng nhập để xem hồ sơ.', 'error');
        document.getElementById('login-modal').showModal();
        return;
    }
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileBalance = document.getElementById('profile-balance');
    const purchaseHistory = document.getElementById('purchase-history');
    if (profileName) profileName.textContent = user.name || 'Chưa cập nhật';
    if (profileEmail) profileEmail.textContent = user.email;
    if (profileBalance) profileBalance.textContent = `${(user.balance || 0).toLocaleString('vi-VN')} VNĐ`;
    if (purchaseHistory) {
        purchaseHistory.innerHTML = user.purchases && user.purchases.length
            ? user.purchases.map(p => {
                const product = products.find(prod => prod.id === p.productId);
                return `
                    <li class="bg-gray-50 p-3 rounded-lg">
                        <a href="/product-detail.html?id=${p.productId}" class="text-blue-600 hover:underline">
                            ${p.name} - ${p.price.toLocaleString('vi-VN')} VNĐ - ${new Date(p.timestamp).toLocaleString('vi-VN')}
                        </a>
                    </li>
                `;
            }).join('')
            : '<li class="text-gray-600">Chưa có giao dịch nào.</li>';
    }
}

function renderProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-image').src = product.image || 'https://via.placeholder.com/300';
        document.getElementById('product-price').textContent = `${product.price.toLocaleString('vi-VN')} VNĐ`;
        document.getElementById('product-category').textContent = `Danh mục: ${product.category}`;
        document.getElementById('product-rating').textContent = `${'★'.repeat(Math.floor(product.rating || 0))}${'☆'.repeat(5 - Math.floor(product.rating || 0))} (${product.rating || 0})`;
        document.getElementById('product-stock').textContent = product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng';
        document.getElementById('product-description').textContent = product.description || 'Không có mô tả.';
        const reviewList = document.getElementById('product-reviews');
        if (reviewList) {
            reviewList.innerHTML = product.reviews.length
                ? product.reviews.map(review => `<li>${review}</li>`).join('')
                : '<li>Chưa có đánh giá nào.</li>';
        }
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.href = product.fileUrl || '#';
            downloadBtn.download = `${product.name}.pdf`;
            downloadBtn.onclick = () => {
                if (!product.fileUrl) {
                    showToast('Tệp không khả dụng.', 'error');
                    return false;
                }
            };
        }
    } else {
        document.getElementById('product-detail-section').innerHTML = '<p class="text-gray-600 text-center">Không tìm thấy sản phẩm.</p>';
    }
}

function init() {
    updateCartCount();
    updateWishlistCount();
    updateUserMenu();
    renderFeaturedProducts();
    renderProducts();
    renderCart();

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

    const categoryFilter = document.getElementById('category-sidebar');
    if (categoryFilter) {
        categoryFilter.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                currentCategory = e.target.dataset.category;
                currentPage = 1;
                document.querySelectorAll('#category-sidebar .category-btn').forEach(btn => {
                    btn.classList.toggle('bg-blue-600', btn.dataset.category === currentCategory);
                    btn.classList.toggle('text-white', btn.dataset.category === currentCategory);
                    btn.classList.toggle('bg-gray-200', btn.dataset.category !== currentCategory);
                    btn.classList.toggle('text-gray-800', btn.dataset.category !== currentCategory);
                    btn.classList.toggle('active', btn.dataset.category === currentCategory);
                });
                renderProducts();
            }
        });
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            currentPage = 1;
            renderProducts();
        });
    }

    const loadMore = document.getElementById('load-more');
    if (loadMore) {
        loadMore.addEventListener('click', () => {
            currentPage++;
            renderProducts();
        });
    }

    const closeModalBtn = document.querySelector('[data-action="close-product-detail"]');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('product-detail-modal').close();
        });
    }

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const productId = document.getElementById('add-to-cart-btn').dataset.productId;
            const reviewText = document.getElementById('review-text').value.trim();
            const reviewError = document.getElementById('review-error-text');
            if (reviewText) {
                const product = products.find(p => p.id === productId);
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

    const topUpForm = document.getElementById('top-up-form') || document.getElementById('deposit-form');
    if (topUpForm) {
        topUpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseInt(document.getElementById('top-up-amount')?.value || document.getElementById('deposit-amount').value);
            const error = document.getElementById('top-up-error') || document.getElementById('deposit-error');
            if (amount >= 10000) {
                const user = safeGetStorage('user');
                if (!user) {
                    showToast('Vui lòng đăng nhập để nạp tiền.', 'error');
                    document.getElementById('login-modal').showModal();
                    return;
                }
                user.balance = (user.balance || 0) + amount;
                const users = safeGetStorage('users').map(u => u.email === user.email ? user : u);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('users', JSON.stringify(users));
                showToast(`Nạp ${amount.toLocaleString('vi-VN')} VNĐ thành công!`);
                topUpForm.reset();
                document.getElementById('top-up-modal')?.close();
                document.getElementById('deposit-modal')?.close();
                error.classList.add('hidden');
                renderCart();
                renderProfile();
            } else {
                error.textContent = 'Số tiền tối thiểu 10,000 VNĐ';
                error.classList.remove('hidden');
            }
        });
    }

    const closeTopUpBtn = document.querySelector('[data-action="close-top-up"]') || document.querySelector('[data-action="close-deposit"]');
    if (closeTopUpBtn) {
        closeTopUpBtn.addEventListener('click', () => {
            document.getElementById('top-up-modal')?.close();
            document.getElementById('deposit-modal')?.close();
        });
    }

    const depositBtn = document.getElementById('deposit-btn');
    if (depositBtn) {
        depositBtn.addEventListener('click', () => {
            document.getElementById('deposit-modal').showModal();
        });
    }

    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCart();
            showToast('Đã xóa toàn bộ giỏ hàng!');
        });
    }

    const paymentMethod = document.getElementById('payment-method');
    const bankInfo = document.getElementById('bank-info');
    if (paymentMethod && bankInfo) {
        paymentMethod.addEventListener('change', () => {
            bankInfo.classList.toggle('hidden', paymentMethod.value !== 'bank');
        });
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = safeGetStorage('user');
            if (!user) {
                showToast('Vui lòng đăng nhập để thanh toán.', 'error');
                document.getElementById('login-modal').showModal();
                return;
            }
            const total = cart.reduce((sum, productId) => {
                const product = products.find(p => p.id === productId);
                return sum + (product ? product.price : 0);
            }, 0);
            const paymentMethodValue = document.getElementById('payment-method').value;
            const orderId = `ORDER-${Date.now()}`;
            document.getElementById('order-id').textContent = orderId;

            if (paymentMethodValue === 'balance') {
                if ((user.balance || 0) < total) {
                    showToast('Số dư không đủ để thanh toán.', 'error');
                    return;
                }
                user.balance -= total;
                user.purchases = user.purchases || [];
                cart.forEach(productId => {
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        product.stock -= 1;
                        user.purchases.push({
                            name: product.name,
                            price: product.price,
                            timestamp: new Date().toISOString(),
                            productId: product.id
                        });
                    }
                });
                const users = safeGetStorage('users').map(u => u.email === user.email ? user : u);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('users', JSON.stringify(users));
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                showToast('Thanh toán thành công!');
                updateCartCount();
                renderCart();
                renderProfile();
            } else {
                showToast(`Vui lòng chuyển khoản với mã đơn hàng: ${orderId}`, 'success');
                bankInfo.classList.remove('hidden');
            }
        });
    }

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
                showToast('Tin nhắn của bạn đã được gửi!');
                contactForm.reset();
            }
        });
    }

    // Handle login form
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
                emailError.textContent = 'Vui lòng nhập email hợp lệ';
                emailError.classList.remove('hidden');
                isValid = false;
            } else {
                emailError.classList.add('hidden');
            }

            if (!password) {
                passwordError.textContent = 'Vui lòng nhập mật khẩu';
                passwordError.classList.remove('hidden');
                isValid = false;
            } else {
                passwordError.classList.add('hidden');
            }

            if (isValid) {
                const users = safeGetStorage('users') || [];
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                    updateUserMenu();
                    showToast('Đăng nhập thành công!');
                    document.getElementById('login-modal').close();
                    renderCart();
                    renderProfile();
                } else {
                    showToast('Email hoặc mật khẩu không đúng.', 'error');
                }
            }
        });

        const togglePassword = document.getElementById('toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const passwordInput = document.getElementById('login-password');
                const icon = togglePassword.querySelector('i');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        }
    }

    // Handle register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value.trim();
            const confirmPassword = document.getElementById('register-confirm-password').value.trim();
            const nameError = document.getElementById('register-name-error');
            const emailError = document.getElementById('register-email-error');
            const passwordError = document.getElementById('register-password-error');
            const confirmPasswordError = document.getElementById('register-confirm-password-error');
            let isValid = true;

            if (!name) {
                nameError.textContent = 'Vui lòng nhập họ và tên';
                nameError.classList.remove('hidden');
                isValid = false;
            } else {
                nameError.classList.add('hidden');
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emailError.textContent = 'Vui lòng nhập email hợp lệ';
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

            if (password !== confirmPassword) {
                confirmPasswordError.textContent = 'Mật khẩu không khớp';
                confirmPasswordError.classList.remove('hidden');
                isValid = false;
            } else {
                confirmPasswordError.classList.add('hidden');
            }

            if (isValid) {
                let users = safeGetStorage('users') || [];
                if (users.find(u => u.email === email)) {
                    showToast('Email đã được đăng ký.', 'error');
                    return;
                }
                const newUser = { email, name, password, balance: 0, purchases: [] };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('user', JSON.stringify(newUser));
                updateUserMenu();
                showToast('Đăng ký thành công!');
                document.getElementById('register-modal').close();
                renderCart();
                renderProfile();
            }
        });

        const toggleRegisterPassword = document.getElementById('toggle-register-password');
        if (toggleRegisterPassword) {
            toggleRegisterPassword.addEventListener('click', () => {
                const passwordInput = document.getElementById('register-password');
                const icon = toggleRegisterPassword.querySelector('i');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        }
    }

    // Handle modal navigation
    document.querySelectorAll('[data-action="show-login"]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('register-modal').close();
            document.getElementById('login-modal').showModal();
        });
    });

    document.querySelectorAll('[data-action="show-register"]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('login-modal').close();
            document.getElementById('register-modal').showModal();
        });
    });

    document.querySelectorAll('[data-action="close-login"]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('login-modal').close();
        });
    });

    document.querySelectorAll('[data-action="close-register"]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('register-modal').close();
        });
    });

    // Handle profile modal
    const profileModal = document.getElementById('profile-modal');
    if (profileModal) {
        document.querySelectorAll('[data-action="close-profile"]').forEach(btn => {
            btn.addEventListener('click', () => {
                profileModal.close();
            });
        });
    }

    // Render product detail page if on product-detail.html
    if (window.location.pathname.includes('product-detail.html')) {
        renderProductDetailPage();
    }

    renderProfile();
}

document.addEventListener('DOMContentLoaded', init);