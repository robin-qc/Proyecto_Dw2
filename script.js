document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la aplicación
    initApp();
    
    // Variables globales
    let currentUser = null;
    let cartItems = [];
    let wishlistItems = [];
    
    function initApp() {
        // Ocultar loader después de 3 segundos
        setTimeout(() => {
            document.getElementById('welcomeLoader').style.opacity = '0';
            document.getElementById('welcomeLoader').style.visibility = 'hidden';
            
            // Inicializar componentes
            initNavigation();
            initAuthSystem();
            initProducts();
            initOffersTimer();
            initEventListeners();
            updateUI();
        }, 3000);
    }
    
    // Sistema de navegación
    function initNavigation() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelectorAll('.nav-link');
        const userBtn = document.getElementById('userBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        // Menú hamburguesa
        menuToggle.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // Dropdown de usuario
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.style.opacity = userDropdown.style.opacity === '1' ? '0' : '1';
            userDropdown.style.visibility = userDropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
            userDropdown.style.transform = userDropdown.style.transform === 'translateY(0px)' ? 'translateY(-10px)' : 'translateY(0px)';
        });
        
        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.style.opacity = '0';
                userDropdown.style.visibility = 'hidden';
                userDropdown.style.transform = 'translateY(-10px)';
            }
        });
        
        // Navegación suave
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Actualizar enlace activo
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Cerrar menú en móvil
                if (window.innerWidth <= 1024) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
                
                // Scroll suave
                const targetId = link.getAttribute('href');
                if (targetId !== '#') {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Cambiar estilo del navbar al hacer scroll
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('mainNav');
            if (window.scrollY > 100) {
                navbar.style.boxShadow = '0 8px 32px rgba(255, 107, 139, 0.1)';
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                navbar.style.background = 'white';
                navbar.style.backdropFilter = 'none';
            }
        });
        
        // Botones de exploración
        const exploreBtn = document.getElementById('exploreBtn');
        const videoBtn = document.getElementById('videoBtn');
        
        exploreBtn.addEventListener('click', () => {
            document.querySelector('#categorias').scrollIntoView({ behavior: 'smooth' });
        });
        
        videoBtn.addEventListener('click', () => {
            showNotification('🎬 Video de presentación próximamente', 'info');
        });
    }
    
    // Sistema de autenticación
    function initAuthSystem() {
        const authModal = document.getElementById('authModal');
        const closeModal = document.getElementById('closeModal');
        const tabBtns = document.querySelectorAll('.tab-btn');
        const loginLink = document.getElementById('loginLink');
        const registerLink = document.getElementById('registerLink');
        const logoutLink = document.getElementById('logoutLink');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const togglePasswordBtns = document.querySelectorAll('.toggle-password');
        
        // Abrir modal desde diferentes lugares
        const openModalButtons = [loginLink, registerLink, document.getElementById('userBtn')];
        
        openModalButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (!currentUser) {
                        authModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                });
            }
        });
        
        // Cerrar modal
        closeModal.addEventListener('click', () => {
            authModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Cerrar modal al hacer clic fuera
        authModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                authModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Sistema de tabs
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                // Actualizar tabs activos
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Mostrar contenido correspondiente
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tab}Tab`).classList.add('active');
            });
        });
        
        // Mostrar/ocultar contraseña
        togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const input = document.getElementById(targetId);
                const icon = btn.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
        
        // Login form
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Simular autenticación
            const user = {
                name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                email: email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=FF6B8B&color=fff`
            };
            
            // Guardar en localStorage
            if (rememberMe) {
                localStorage.setItem('bellastep_user', JSON.stringify(user));
            } else {
                sessionStorage.setItem('bellastep_user', JSON.stringify(user));
            }
            
            // Actualizar estado
            currentUser = user;
            
            // Cerrar modal
            authModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Mostrar notificación
            showNotification(`¡Bienvenida de nuevo, ${user.name}! 👋`, 'success');
            
            // Actualizar UI
            updateUI();
        });
        
        // Register form
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirm').value;
            
            if (password !== confirmPassword) {
                showNotification('Las contraseñas no coinciden', 'error');
                return;
            }
            
            // Simular registro
            const user = {
                name: name,
                email: email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6B8B&color=fff`
            };
            
            // Guardar en localStorage
            localStorage.setItem('bellastep_user', JSON.stringify(user));
            
            // Actualizar estado
            currentUser = user;
            
            // Cerrar modal
            authModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Mostrar notificación
            showNotification(`¡Cuenta creada exitosamente, ${name}! 🎉`, 'success');
            
            // Actualizar UI
            updateUI();
        });
        
        // Logout
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Eliminar datos de sesión
            localStorage.removeItem('bellastep_user');
            sessionStorage.removeItem('bellastep_user');
            
            // Actualizar estado
            currentUser = null;
            
            // Mostrar notificación
            showNotification('Sesión cerrada exitosamente', 'info');
            
            // Actualizar UI
            updateUI();
        });
        
        // Verificar usuario al cargar
        checkLoggedInUser();
    }
    
    // Verificar usuario logueado
    function checkLoggedInUser() {
        const localUser = localStorage.getItem('bellastep_user');
        const sessionUser = sessionStorage.getItem('bellastep_user');
        
        if (localUser) {
            currentUser = JSON.parse(localUser);
        } else if (sessionUser) {
            currentUser = JSON.parse(sessionUser);
        }
    }
    
    // Actualizar UI según estado
    function updateUI() {
        const userGreeting = document.getElementById('userGreeting');
        const loginText = document.querySelector('.login-text');
        const userInfo = document.getElementById('userInfo');
        const loginLink = document.getElementById('loginLink');
        const registerLink = document.getElementById('registerLink');
        const myAccountLink = document.getElementById('myAccountLink');
        const myOrdersLink = document.getElementById('myOrdersLink');
        const logoutLink = document.getElementById('logoutLink');
        
        if (currentUser) {
            // Usuario logueado
            userGreeting.textContent = `Hola, ${currentUser.name}`;
            loginText.textContent = 'Mi cuenta';
            
            // Mostrar info del usuario
            document.getElementById('displayName').textContent = currentUser.name;
            document.getElementById('displayEmail').textContent = currentUser.email;
            userInfo.style.display = 'flex';
            
            // Mostrar/ocultar enlaces
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            myAccountLink.style.display = 'block';
            myOrdersLink.style.display = 'block';
            logoutLink.style.display = 'block';
        } else {
            // Usuario no logueado
            userGreeting.textContent = 'Mi cuenta';
            loginText.textContent = 'Hola, inicia sesión';
            userInfo.style.display = 'none';
            
            // Mostrar/ocultar enlaces
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';
            myAccountLink.style.display = 'none';
            myOrdersLink.style.display = 'none';
            logoutLink.style.display = 'none';
        }
    }
    
    // Inicializar productos
    function initProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        const products = [
            {
                id: 1,
                name: 'Floral Sneakers',
                description: 'Zapatillas deportivas con estampado floral para un look fresco y femenino',
                price: 79.99,
                rating: 4.5,
                icon: '👟',
                badge: 'NUEVO',
                color: '#FF6B8B'
            },
            {
                id: 2,
                name: 'Elegant Pumps',
                description: 'Tacones clásicos en cuero suave con detalle dorado para eventos especiales',
                price: 129.99,
                rating: 4.8,
                icon: '👠',
                badge: 'TOP',
                color: '#9D4EDD'
            },
            {
                id: 3,
                name: 'Comfy Boots',
                description: 'Botas de invierno con forro polar y suela antideslizante para máxima comodidad',
                price: 149.99,
                rating: 4.7,
                icon: '🥾',
                badge: 'INVIERNO',
                color: '#118AB2'
            },
            {
                id: 4,
                name: 'Summer Sandals',
                description: 'Sandalias tejidas con tiras coloridas y suela de corcho para días de playa',
                price: 59.99,
                rating: 4.3,
                icon: '👡',
                badge: 'VERANO',
                color: '#FFD166'
            },
            {
                id: 5,
                name: 'Office Flats',
                description: 'Bailarinas elegantes en tonos neutros para looks profesionales cómodos',
                price: 89.99,
                rating: 4.6,
                icon: '🥿',
                badge: 'OFICINA',
                color: '#4ECDC4'
            },
            {
                id: 6,
                name: 'Kids Sparkle',
                description: 'Zapatillas infantiles con luces LED y detalles brillantes para las más pequeñas',
                price: 49.99,
                rating: 4.9,
                icon: '👧',
                badge: 'NIÑAS',
                color: '#FF8FAB'
            }
        ];
        
        let displayedProducts = 0;
        
        function displayProducts(count) {
            for (let i = displayedProducts; i < displayedProducts + count && i < products.length; i++) {
                const product = products[i];
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            }
            displayedProducts += count;
            
            // Ocultar botón si ya mostramos todos
            if (displayedProducts >= products.length) {
                loadMoreBtn.style.display = 'none';
            }
        }
        
        // Mostrar primeros 3 productos
        displayProducts(3);
        
        // Cargar más productos
        loadMoreBtn.addEventListener('click', () => {
            displayProducts(3);
        });
    }
    
    // Crear tarjeta de producto
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image" style="background: linear-gradient(135deg, ${product.color}20, white)">
                ${product.icon}
                <div class="product-badge" style="background: ${product.color}">${product.badge}</div>
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-rating">
                        ${getStarRating(product.rating)}
                        <span>(${product.rating})</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-bag"></i>
                        <span>Añadir al carrito</span>
                    </button>
                    <button class="btn-wishlist" data-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Agregar eventos
        const addToCartBtn = card.querySelector('.btn-cart');
        const wishlistBtn = card.querySelector('.btn-wishlist');
        
        addToCartBtn.addEventListener('click', () => addToCart(product));
        wishlistBtn.addEventListener('click', () => toggleWishlist(product));
        
        return card;
    }
    
    // Generar estrellas de rating
    function getStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }
    
    // Carrito de compras
    function addToCart(product) {
        if (!currentUser) {
            showNotification('Por favor, inicia sesión para añadir productos al carrito', 'error');
            return;
        }
        
        cartItems.push(product);
        updateCartCount();
        showNotification(`¡${product.name} añadido al carrito! 🛍️`, 'success');
    }
    
    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        cartCount.textContent = cartItems.length;
    }
    
    // Lista de deseos
    function toggleWishlist(product) {
        if (!currentUser) {
            showNotification('Por favor, inicia sesión para añadir a tu lista de deseos', 'error');
            return;
        }
        
        const index = wishlistItems.findIndex(item => item.id === product.id);
        
        if (index === -1) {
            wishlistItems.push(product);
            showNotification(`¡${product.name} añadido a tu lista de deseos! 💖`, 'success');
        } else {
            wishlistItems.splice(index, 1);
            showNotification(`${product.name} removido de tu lista de deseos`, 'info');
        }
        
        updateWishlistCount();
    }
    
    function updateWishlistCount() {
        const wishlistCount = document.getElementById('wishlistCount');
        wishlistCount.textContent = wishlistItems.length;
    }
    
    // Temporizador de ofertas
    function initOffersTimer() {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        // Establecer fecha de finalización (3 días desde ahora)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 3);
        
        function updateTimer() {
            const now = new Date();
            const diff = endDate - now;
            
            if (diff <= 0) {
                clearInterval(timerInterval);
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            daysEl.textContent = days.toString().padStart(2, '0');
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
        }
        
        // Actualizar cada segundo
        const timerInterval = setInterval(updateTimer, 1000);
        updateTimer(); // Llamar inmediatamente
    }
    
    // Event listeners generales
    function initEventListeners() {
        // Botones de categorías
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const categoryCard = this.closest('.category-card');
                const categoryName = categoryCard.querySelector('h3').textContent;
                showNotification(`Explorando categoría: ${categoryName} 👠`, 'info');
            });
        });
        
        // Botones de colecciones
        document.querySelectorAll('.btn-collection').forEach(btn => {
            btn.addEventListener('click', function() {
                const collectionCard = this.closest('.collection-card');
                const collectionName = collectionCard.querySelector('h3').textContent;
                showNotification(`Explorando colección: ${collectionName} 🌟`, 'info');
            });
        });
        
        // Botón de oferta especial
        document.querySelector('.btn-offer').addEventListener('click', () => {
            showNotification('🎉 ¡Redirigiendo a las ofertas especiales!', 'success');
        });
        
        // Botones de redes sociales
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const platform = this.classList.contains('fb-btn') ? 'Facebook' : 'Google';
                showNotification(`Inicio de sesión con ${platform} próximamente`, 'info');
            });
        });
        
        // Botón de wishlist en navbar
        document.getElementById('wishlistBtn').addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Por favor, inicia sesión para ver tu lista de deseos', 'error');
                return;
            }
            showNotification(`Tienes ${wishlistItems.length} items en tu lista de deseos 💝`, 'info');
        });
        
        // Botón de carrito en navbar
        document.getElementById('cartBtn').addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Por favor, inicia sesión para ver tu carrito', 'error');
                return;
            }
            showNotification(`Tienes ${cartItems.length} items en tu carrito 🛍️`, 'info');
        });
    }
    
    // Sistema de notificaciones
    function showNotification(message, type = 'info') {
        const notificationsContainer = document.getElementById('notificationsContainer');
        
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Estilos dinámicos
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Botón para cerrar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
        
        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                removeNotification(notification);
            }
        }, 5000);
        
        // Agregar al contenedor
        notificationsContainer.appendChild(notification);
        
        // Limitar a 3 notificaciones
        if (notificationsContainer.children.length > 3) {
            notificationsContainer.removeChild(notificationsContainer.children[0]);
        }
    }
    
    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            default: return 'info-circle';
        }
    }
    
    function removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Efectos de hover para tarjetas
    document.addEventListener('DOMContentLoaded', function() {
        const cards = document.querySelectorAll('.category-card, .product-card, .offer-small');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.style.setProperty('--mouse-x', `${x}px`);
                this.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    });
});
// ===============================
// NAVEGACIÓN A CATÁLOGOS
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".btn-view").forEach(btn => {
        btn.addEventListener("click", () => {

            const card = btn.closest(".category-card");
            if (!card) return;

            const categoria = card.querySelector("h3")
                .innerText
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            window.location.href = `catalogo.html?cat=${categoria}`;
        });
    });

});