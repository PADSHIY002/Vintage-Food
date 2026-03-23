// Данные меню
const menuData = {
    burgers: {
        name: 'Бургеры',
        items: [
            { id: 1, name: 'Классический бургер', price: 299, description: 'Сочная котлета, сыр, овощи' },
            { id: 2, name: 'Чизбургер', price: 349, description: 'С двойным сыром и соусом' },
            { id: 3, name: 'Бургер с беконом', price: 399, description: 'Хрустящий бекон и лук' },
            { id: 4, name: 'Двойной бургер', price: 449, description: 'Две котлеты для настоящих' }
        ]
    },
    chicken: {
        name: 'Блюда из курицы',
        items: [
            { id: 5, name: 'Куриные крылья', price: 279, description: 'Острые, в медово-горчичном соусе' },
            { id: 6, name: 'Наггетсы (6 шт)', price: 199, description: 'Хрустящие кусочки курицы' },
            { id: 7, name: 'Куриное филе', price: 329, description: 'На пару с овощами' },
            { id: 8, name: 'Стрипсы', price: 259, description: 'Нежное куриное мясо' }
        ]
    },
    hot: {
        name: 'Горячие блюда',
        items: [
            { id: 9, name: 'Стейк', price: 599, description: 'Сочный говяжий стейк' },
            { id: 10, name: 'Паста Карбонара', price: 379, description: 'Итальянская классика' },
            { id: 11, name: 'Картофель фри', price: 149, description: 'Золотистый и хрустящий' },
            { id: 12, name: 'Луковые кольца', price: 179, description: 'В хрустящей панировке' }
        ]
    },
    snacks: {
        name: 'Закуски',
        items: [
            { id: 13, name: 'Сырные палочки', price: 189, description: 'Моцарелла в панировке' },
            { id: 14, name: 'Моцарелла', price: 219, description: 'С томатным соусом' },
            { id: 15, name: 'Оливки', price: 129, description: 'Маринованные оливки' },
            { id: 16, name: 'Мясная тарелка', price: 449, description: 'Ассорти мясных деликатесов' }
        ]
    },
    salads: {
        name: 'Салаты',
        items: [
            { id: 17, name: 'Цезарь', price: 299, description: 'Курица, пармезан, соус' },
            { id: 18, name: 'Греческий', price: 279, description: 'Фета, оливки, овощи' },
            { id: 19, name: 'Оливье', price: 249, description: 'Классический русский салат' },
            { id: 20, name: 'Винегрет', price: 199, description: 'Свеклы, морковь, огурцы' }
        ]
    },
    desserts: {
        name: 'Десерты',
        items: [
            { id: 21, name: 'Тирамису', price: 289, description: 'Итальянский десерт' },
            { id: 22, name: 'Чизкейк', price: 269, description: 'Нью-Йорк стайл' },
            { id: 23, name: 'Брауни', price: 199, description: 'Шоколадный пирог' },
            { id: 24, name: 'Мороженое', price: 149, description: 'Три шарика на выбор' }
        ]
    }
};

// Состояние корзины
let cart = [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка корзины из localStorage
    const savedCart = localStorage.getItem('vintageCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartBadge();
    }

    // Обработчики для модальных окон
    document.getElementById('cartBtn').addEventListener('click', openCart);
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('closeOrder').addEventListener('click', closeOrderModal);
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    
    // Закрытие по клику вне модального окна
    document.getElementById('cartModal').addEventListener('click', function(e) {
        if (e.target === this) closeCart();
    });
    document.getElementById('orderModal').addEventListener('click', function(e) {
        if (e.target === this) closeOrderModal();
    });

    // Добавляем эффекты наведения для категорий
    document.querySelectorAll('.catalog_item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Анимация появления категорий при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.catalog_item').forEach(item => {
        observer.observe(item);
    });
});

// Функции навигации
function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(e, sectionId) {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Функции корзины
function openCart() {
    document.getElementById('cartModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartItems();
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
    document.body.style.overflow = '';
}

function openOrderModal() {
    document.getElementById('orderModal').classList.add('active');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
    document.body.style.overflow = '';
}

function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart_empty">Корзина пуста</p>';
        cartTotal.textContent = '0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        html += `
            <div class="cart_item">
                <div class="cart_item_info">
                    <h4 class="cart_item_name">${item.name}</h4>
                    <p class="cart_item_desc">${item.description}</p>
                    <p class="cart_item_price">${item.price} ₽</p>
                </div>
                <div class="cart_item_controls">
                    <button class="qty_btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span class="qty_value">${item.quantity}</span>
                    <button class="qty_btn" onclick="changeQuantity(${index}, 1)">+</button>
                    <button class="remove_btn" onclick="removeFromCart(${index})">🗑</button>
                </div>
            </div>
        `;
    });

    cartItems.innerHTML = html;
    cartTotal.textContent = total;
}

function addToCart(item) {
    const existingItem = cart.find(c => c.id === item.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({...item, quantity: 1});
    }

    saveCart();
    updateCartBadge();
    showNotification();
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartBadge();
    renderCartItems();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartBadge();
    renderCartItems();
}

function saveCart() {
    localStorage.setItem('vintageCart', JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    // Очищаем корзину
    cart = [];
    saveCart();
    updateCartBadge();
    closeCart();
    
    // Показываем сообщение об успехе
    setTimeout(() => {
        openOrderModal();
    }, 300);
}

function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Функции для категорий меню
function openCategory(category) {
    const categoryData = menuData[category];
    if (!categoryData) return;

    // Прокрутка к секции меню
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });

    // Показываем сообщение о категории
    alert(`${categoryData.name}\n\n${categoryData.items.map(item => 
        `• ${item.name} - ${item.price} ₽\n  ${item.description}`
    ).join('\n\n')}\n\nНажмите ОК, чтобы добавить все товары в корзину!`);

    // Добавляем все товары категории в корзину
    categoryData.items.forEach(item => addToCart(item));
}

// Функции для футера
function showInfo(e, type) {
    e.preventDefault();
    const info = {
        loyalty: '🎁 Программа лояльности Vintage Food\n\nНакопите 500 бонусов и получите скидку 10%!\nНакопите 1000 бонусов и получите скидку 20%!\nБонусные баллы начисляются за каждый заказ.',
        privacy: '🔒 Политика конфиденциальности\n\nМы уважаем вашу приватность.\nВаши персональные данные защищены.\nМы не передаём данные третьим лицам.',
        offer: '📄 Договор оферты\n\nОформляя заказ, вы соглашаетесь с условиями.\nДоставка осуществляется в течение 30-60 минут.\nМинимальная сумма заказа: 500 ₽'
    };
    alert(info[type] || 'Информация');
}

// Функции для социальных сетей
function openSocial(e, type) {
    // Ссылки уже ведут на внешние сайты через target="_blank"
    // Можно добавить аналитику или дополнительную логику
    console.log(`Открытие ${type}`);
}
