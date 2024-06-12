// Корзина
let cart = [];
let products = [];

function loadProducts() {
  fetch('foo.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      products = data; // Присваиваем загруженные данные переменной products
      displayProducts(); // Вызываем функцию отображения товаров
    })
    .catch(error => {
      console.error('Ошибка при загрузке данных:', error);
    });
}


// Функция для отображения товаров
function displayProducts() {
  const productsContainer = document.getElementById('products');
  productsContainer.innerHTML = '';
  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'grid place-content-center bg-white rounded overflow-hidden shadow-lg p-2';
    productElement.innerHTML = `
      <img class="h-72 w-72 p-3" src="${product.image1}" alt="${product.name}">
      <div class="px-6 py-4 grid grid-cols-1">
        <div class="font-bold text-xl mb-2">${product.name}</div>
        <p class="text-gray-700 text-base">Цена: ${product.price} руб.</p>
        <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onclick="showProductDetails(${product.id})">Подробнее</button>
        <button id='mAddBtn(${product.id})' class="max-w-2 mt-4 px-4 py-2 max-w-8 bg-green-500 text-white rounded hover:bg-green-700" onclick="addToCartFromMain(${product.id})">Добавить в корзину</button>
      </div>
    `;
    productsContainer.appendChild(productElement);
  });
}

// Показать детали товара
function showProductDetails(productId) {
  const product = products.find(p => p.id === productId);
  const productDetails = document.getElementById('productDetails');
  productDetails.innerHTML = `
    <img class="grid min-h-[140px] max-h-[210px] w-full place-items-center overflow-x-scroll rounded-lg p-6" src="${product.image1}" alt="${product.name}">
    <h3 class="text-lg font-semibold">${product.name}</h3>
    <p class="text-gray-700">Цена: ${product.price} руб.</p>
    <p class="mt-4">${product.description}</p>
    <button class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700" onclick="addToCart(${product.id})">Добавить в корзину</button>
  `;
  document.getElementById('productModal').classList.remove('hidden');
  document.body.classList.add('overflow-hidden'); // Фиксируем фон
}

// Закрытие модального окна
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('productModal').classList.add('hidden');
  document.body.classList.remove('overflow-hidden'); // Снимаем фиксацию фона
});

// Добавление в корзину
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  const productDetails = document.getElementById('productDetails');
  productDetails.innerHTML = `
   <img class="grid min-h-[140px] max-h-[210px] w-full place-items-center overflow-x-scroll rounded-lg p-6" src="${product.image1}" alt="${product.name}">
   <h3 class="text-lg font-semibold">${product.name}</h3>
   <p class="text-gray-700">Цена: ${product.price} руб.</p>
   <p class="mt-4">${product.description}</p>
   <button class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700" onclick="addToCart(${product.id})">Товар успешно добавлен</button>
  `;
  updateCart();
  saveCart();
}

function addToCartFromMain(productId){
  const product = products.find(p => p.id === productId);
  cart.push(product);
  document.getElementById(`mAddBtn(${product.id})`).textContent = "Товар добавлен";
  updateCart();
  saveCart();
}

// Обновляем функцию updateCart для более детального представления товаров
function updateCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  cartItemsContainer.innerHTML = ''; // Очищаем содержимое корзины
  cart.forEach((product, index) => {
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'flex justify-between items-center mt-4 bg-white p-4 rounded shadow';
    cartItemElement.innerHTML = `
      <div>
        <h4 class="font-bold">${product.name}</h4>
        <p>Цена: ${product.price} руб.</p>
      </div>
      <div>
        <button onclick="removeFromCart(${index})" class="text-red-500">Удалить</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItemElement);
  });
  const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);
  document.getElementById('totalPrice').textContent = totalPrice + ' руб.';
}

// Удаление из корзины
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
  saveCart();
}

// Сохранение корзины в localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Загрузка корзины из localStorage
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts(); // Загрузка товаров при инициализации
  loadCart();
});

document.getElementById('toggleCart').addEventListener('click', () => {
  const cartModal = document.getElementById('cart');
  if (cartModal.classList.contains('hidden')) {
    cartModal.classList.remove('hidden');
    updateCart();
  } else {
    cartModal.classList.add('hidden');
  }
  document.body.classList.add('overflow-hidden');
});

// Скрытие корзины при начальной загрузке страницы
document.getElementById('cart').classList.add('hidden');

document.getElementById('closeCart').addEventListener('click', () => {
  document.getElementById('cart').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
});

document.getElementById('closeModalCart').addEventListener('click', () => {
  document.getElementById('cart').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
});

// tg_script //
const tg = window.Telegram.WebApp;

document.getElementById('BtnPurchase').addEventListener('click', () => {
  tg.sendData(JSON.stringify(cart));
});

document.getElementById('togglePayment').addEventListener('click', () =>{
  tg.sendData(JSON.stringify(cart));
});
