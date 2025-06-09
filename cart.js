document.addEventListener('DOMContentLoaded', () => {
    // Shared product data (assumed available or imported)
    const products = [
        { id: 1, name: 'Báo cáo Quản trị kinh doanh', price: 50000, category: 'Kinh tế', description: 'Báo cáo chi tiết về chiến lược quản trị doanh nghiệp.', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f', rating: 4.5, stock: 20, reviews: [] },
        { id: 2, name: 'Đồ án Kỹ thuật phần mềm', price: 100000, category: 'Lập trình', description: 'Hướng dẫn thiết kế và triển khai dự án phần mềm.', image: 'https://images.unsplash.com/photo-1516320997487-a0d7fb19713f', rating: 4.8, stock: 15, reviews: [] },
        { id: 3, name: 'Tài liệu Toán cao cấp', price: 30000, category: 'Toán học', description: 'Giải tích và đại số nâng cao.', image: 'https://images.unsplash.com/photo-1501504901894-7c7963c77783', rating: 4.2, stock: 25, reviews: [] },
        { id: 4, name: 'Đồ án Cơ khí', price: 150000, category: 'Kỹ thuật', description: 'Tài liệu thiết kế và phân tích cơ khí.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee69e', rating: 4.7, stock: 10, reviews: [] },
        { id: 5, name: 'Học máy cơ bản', price: 80000, category: 'Khoa học dữ liệu', description: 'Giới thiệu các thuật toán học máy.', image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc', rating: 4.9, stock: 18, reviews: [] },
        { id: 6, name: 'Kinh tế vi mô', price: 60000, category: 'Kinh tế', description: 'Phân tích cung cầu và thị trường.', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f', rating: 4.4, stock: 22, reviews: [] },
        { id: 7, name: 'Lập trình Python nâng cao', price: 90000, category: 'Lập trình', description: 'Lập trình hướng đối tượng với Python.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', rating: 4.6, stock: 12, reviews: [] },
        { id: 8, name: 'Vật lý đại cương', price: 40000, category: 'Vật lý', description: 'Cơ học và nhiệt động lực học.', image: 'https://images.unsplash.com/photo-1636466497217-26a8d1593a0a', rating: 4.3, stock: 30, reviews: [] },
        { id: 9, name: 'Thiết kế đồ họa cơ bản', price: 70000, category: 'Thiết kế', description: 'Hướng dẫn Photoshop và Illustrator.', image: 'https://images.unsplash.com/photo-1598791318878-10e3d3a7505d', rating: 4.5, stock: 16, reviews: [] },
        { id: 10, name: 'Hóa học hữu cơ', price: 55000, category: 'Hóa học', description: 'Lý thuyết và bài tập hóa hữu cơ.', image: 'https://images.unsplash.com/photo-1532187863607-9592f1c90527', rating: 4.4, stock: 20, reviews: [] },
        { id: 11, name: 'Xác suất thống kê', price: 45000, category: 'Toán học', description: 'Xác suất và thống kê ứng dụng.', image: 'https://images.unsplash.com/photo-1501504901894-7c7963c77783', rating: 4.3, stock: 28, reviews: [] },
        { id: 12, name: 'Lập trình Java cơ bản', price: 85000, category: 'Lập trình', description: 'Giới thiệu lập trình Java.', image: 'https://images.unsplash.com/photo-1516320997487-a0d7fb19713f', rating: 4.7, stock: 14, reviews: [] },
        { id: 13, name: 'Kinh tế vĩ mô', price: 65000, category: 'Kinh tế', description: 'Phân tích kinh tế ở cấp độ quốc gia.', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f', rating: 4.6, stock: 20, reviews: [] },
        { id: 14, name: 'Lập trình C++ nâng cao', price: 95000, category: 'Lập trình', description: 'Kỹ thuật lập trình C++ chuyên sâu.', image: 'https://images.unsplash.com/photo-1516320997487-a0d7fb19713f', rating: 4.8, stock: 10, reviews: [] },
        { id: 15, name: 'Hóa học vô cơ', price: 52000, category: 'Hóa học', description: 'Cơ sở lý thuyết hóa học vô cơ.', image: 'https://images.unsplash.com/photo-1532187863607-9592f1c90527', rating: 4.3, stock: 25, reviews: [] }
    ];

    // Cart State
    let cart = safeGetStorage('cart') || [];

    // Cart Management
    function updateCartCount() {
        const cartCountEls = document.querySelectorAll('#cart-count');
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEls.forEach(el => {
            el.textContent = total;
            el.classList.toggle('hidden', total === 0);
        });
    }

    function addToCart(id) {
        const product = products.find(p => p.id === id);
        if (!product || product.stock === 0) {
            showToast(`${sanitizeInput(product?.name || 'Sản phẩm')} đã hết hàng!`, 'bg-red-600');
            return;
        }
        const existingItem = cart.find(item => item.id === id);
        if (existingItem && existingItem.quantity >= product.stock) {
            showToast(`Không thể thêm ${sanitizeInput(product.name)}, đã đạt giới hạn tồn kho!`, 'bg-red-600');
            return;
        }
        if (existingItem) existingItem.quantity += 1;
        else cart.push({ id, name: product.name, price: product.price, quantity: 1, image: product.image });
        product.stock -= 1;
        safeSetStorage('cart', cart);
        updateCartCount();
        showToast(`${sanitizeInput(product.name)} đã được thêm vào giỏ hàng!`);
        renderCart();
    }

    function updateCartItemQuantity(id, quantity) {
        const product = products.find(p => p.id === id);
        const cartItem = cart.find(item => item.id === id);
        if (!cartItem || !product) return;
        quantity = Math.max(1, Math.min(quantity, product.stock));
        const stockUsed = cartItem.quantity - quantity;
        product.stock += stockUsed;
        cartItem.quantity = quantity;
        safeSetStorage('cart', cart);
        updateCartCount();
        renderCart();
    }

    function removeCartItem(id) {
        const cartItem = cart.find(item => item.id === id);
        const product = products.find(p => p.id === id);
        if (cartItem && product) {
            product.stock += cartItem.quantity;
            cart = cart.filter(item => item.id !== id);
            safeSetStorage('cart', cart);
            updateCartCount();
            renderCart();
            showToast(`${sanitizeInput(cartItem.name)} đã được xóa khỏi giỏ hàng!`);
        }
    }

    function renderCart() {
        const cartList = document.getElementById('cart-list');
        if (!cartList) return;

        if (cart.length === 0) {
            cartList.innerHTML = '<p class="text-center text-gray-600 col-span-full">Giỏ hàng của bạn đang trống.</p>';
            return;
        }

        cartList.innerHTML = cart.map(item => {
            const product = products.find(p => p.id === item.id);
            return `
                <div class="cart-item flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow">
                    <img src="${item.image}" alt="${sanitizeInput(item.name)}" class="w-16 h-16 object-cover rounded">
                    <div class="flex-1">
                        <h3 class="text-lg font-bold">${sanitizeInput(item.name)}</h3>
                        <p class="text-gray-600">${formatPrice(item.price)}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="decrease-quantity btn bg-gray-300 text-black px-2 py-1" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input w-12 text-center border rounded px-2 py-1" value="${item.quantity}" min="1" max="${product ? product.stock + item.quantity : item.quantity}" data-id="${item.id}">
                        <button class="increase-quantity btn bg-gray-300 text-black px-2 py-1" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item btn bg-red-600 text-white px-2 py-1" data-id="${item.id}">Xóa</button>
                </div>
            `;
        }).join('');

        updateCartSummary();
    }

    function updateCartSummary() {
        const summaryEl = document.getElementById('cart-summary');
        if (!summaryEl) return;

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        summaryEl.innerHTML = `
            <p class="text-lg font-bold">Tổng cộng: ${formatPrice(total)}</p>
            <button id="checkout-btn" class="btn bg-blue-600 text-white mt-4 w-full" ${cart.length === 0 ? 'disabled' : ''}>Thanh toán</button>
        `;
    }

    // Event Listeners
    function initEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart')) {
                addToCart(parseInt(e.target.dataset.productId));
            } else if (e.target.matches('.decrease-quantity')) {
                const id = parseInt(e.target.dataset.id);
                const cartItem = cart.find(item => item.id === id);
                if (cartItem) updateCartItemQuantity(id, cartItem.quantity - 1);
            } else if (e.target.matches('.increase-quantity')) {
                const id = parseInt(e.target.dataset.id);
                const cartItem = cart.find(item => item.id === id);
                if (cartItem) updateCartItemQuantity(id, cartItem.quantity + 1);
            } else if (e.target.matches('.remove-item')) {
                removeCartItem(parseInt(e.target.dataset.id));
            } else if (e.target.matches('#checkout-btn')) {
                showToast('Chức năng thanh toán đang được phát triển!', 'bg-yellow-600');
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.matches('.quantity-input')) {
                const id = parseInt(e.target.dataset.id);
                const quantity = parseInt(e.target.value);
                if (!isNaN(quantity)) updateCartItemQuantity(id, quantity);
            }
        });
    }

    // Initialize
    function init() {
        updateCartCount();
        renderCart();
        initEventListeners();
    }

    init();
});