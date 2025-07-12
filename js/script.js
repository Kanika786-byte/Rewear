
// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Featured Items Carousel
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.items-carousel');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    // Mock data - in a real app, this would come from an API
    const items = [
        {
            id: 1,
            title: 'Denim Jacket',
            category: 'Jackets',
            condition: 'Excellent',
            points: 150,
            image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea'
        },
        {
            id: 2,
            title: 'Black Dress',
            category: 'Dresses',
            condition: 'Good',
            points: 120,
            image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b'
        },
        {
            id: 3,
            title: 'White Sneakers',
            category: 'Shoes',
            condition: 'Like New',
            points: 200,
            image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28'
        },
        {
            id: 4,
            title: 'Striped T-Shirt',
            category: 'Tops',
            condition: 'Good',
            points: 80,
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27'
        }
    ];

    let currentIndex = 0;

    function renderCarouselItems() {
        carousel.innerHTML = '';
        
        // Create carousel items container
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'carousel-items';
        
        // Add items to the container
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = `carousel-item ${index === currentIndex ? 'active' : ''}`;
            itemElement.innerHTML = `
                <div class="item-card">
                    <div class="item-image" style="background-image: url('${item.image}')"></div>
                    <div class="item-details">
                        <h3>${item.title}</h3>
                        <p>${item.category} • ${item.condition} condition</p>
                        <p class="points">${item.points} points</p>
                        <a href="item-detail.html?id=${item.id}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            `;
            itemsContainer.appendChild(itemElement);
        });
        
        carousel.appendChild(itemsContainer);
        carousel.appendChild(document.querySelector('.carousel-controls'));
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        renderCarouselItems();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        renderCarouselItems();
    });

    // Initial render
    renderCarouselItems();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            this.classList.add('active');
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // Load user items (mock data)
    const itemsGrid = document.querySelector('.items-grid');
    const userItems = [
        {
            id: 1,
            title: 'Blue Jeans',
            category: 'Pants',
            condition: 'Good',
            points: 120,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
            status: 'Available'
        },
        {
            id: 2,
            title: 'Red Blouse',
            category: 'Tops',
            condition: 'Excellent',
            points: 100,
            image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10',
            status: 'Pending Swap'
        },
        {
            id: 3,
            title: 'Black Boots',
            category: 'Shoes',
            condition: 'Fair',
            points: 180,
            image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
            status: 'Available'
        }
    ];
    
    if (itemsGrid) {
        userItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item-card';
            itemElement.innerHTML = `
                <div class="item-image" style="background-image: url('${item.image}')"></div>
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p>${item.category} • ${item.condition} condition</p>
                    <p class="points">${item.points} points • ${item.status}</p>
                    <div class="item-actions">
                        <a href="item-detail.html?id=${item.id}" class="btn btn-outline">View</a>
                        <button class="btn btn-primary">Edit</button>
                    </div>
                </div>
            `;
            itemsGrid.appendChild(itemElement);
        });
    }
    
    // Load swap requests (mock data)
    const requestsList = document.querySelector('.requests-list');
    const requests = [
        {
            id: 1,
            item: 'Denim Jacket',
            requester: 'Alex Morgan',
            offer: 'Black Leather Bag (200 pts)',
            date: '2023-06-15',
            status: 'Pending'
        },
        {
            id: 2,
            item: 'Red Blouse',
            requester: 'Jamie Smith',
            offer: 'Direct Swap: White Blouse',
            date: '2023-06-10',
            status: 'Pending'
        }
    ];
    
    if (requestsList) {
        requests.forEach(request => {
            const requestElement = document.createElement('div');
            requestElement.className = 'request-card';
            requestElement.innerHTML = `
                <div class="request-header">
                    <h3>${request.item}</h3>
                    <span class="status ${request.status.toLowerCase()}">${request.status}</span>
                </div>
                <p><strong>From:</strong> ${request.requester}</p>
                <p><strong>Offer:</strong> ${request.offer}</p>
                <p><strong>Date:</strong> ${request.date}</p>
                <div class="request-actions">
                    <button class="btn btn-primary">Accept</button>
                    <button class="btn btn-outline">Decline</button>
                    <button class="btn">Message</button>
                </div>
            `;
            requestsList.appendChild(requestElement);
        });
    }
    
    // Load messages (mock data)
    const messagesList = document.querySelector('.messages-list');
    const messages = [
        {
            id: 1,
            sender: 'Alex Morgan',
            preview: 'Hi! I was wondering if we could meet up to exchange the items...',
            date: '2023-06-14',
            unread: true
        },
        {
            id: 2,
            sender: 'ReWear Support',
            preview: 'Your item "Blue Jeans" has been approved and is now live...',
            date: '2023-06-10',
            unread: false
        }
    ];
    
    if (messagesList) {
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `message-card ${message.unread ? 'unread' : ''}`;
            messageElement.innerHTML = `
                <div class="message-header">
                    <h3>${message.sender}</h3>
                    <span>${message.date}</span>
                </div>
                <p>${message.preview}</p>
            `;
            messagesList.appendChild(messageElement);
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Thumbnail image click handler
    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    const mainImage = document.querySelector('.main-image img');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Update main image
            mainImage.src = this.src;
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Load similar items (mock data)
    const similarItemsGrid = document.querySelector('.similar-items-grid');
    const similarItems = [
        {
            id: 5,
            title: 'Denim Shirt',
            category: 'Shirts',
            condition: 'Good',
            points: 100,
            image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9'
        },
        {
            id: 6,
            title: 'Blue Jacket',
            category: 'Jackets',
            condition: 'Excellent',
            points: 180,
            image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9'
        },
        {
            id: 7,
            title: 'Black Denim Jacket',
            category: 'Jackets',
            condition: 'Good',
            points: 160,
            image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea'
        },
        {
            id: 8,
            title: 'White Denim Jacket',
            category: 'Jackets',
            condition: 'Like New',
            points: 200,
            image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea'
        }
    ];
    
    if (similarItemsGrid) {
        similarItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item-card';
            itemElement.innerHTML = `
                <div class="item-image" style="background-image: url('${item.image}')"></div>
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p>${item.category} • ${item.condition} condition</p>
                    <p class="points">${item.points} points</p>
                    <a href="item-detail.html?id=${item.id}" class="btn btn-primary">View Details</a>
                </div>
            `;
            similarItemsGrid.appendChild(itemElement);
        });
    }
    
    // Swap request modal
    const requestSwapBtn = document.querySelector('.item-actions .btn-primary');
    if (requestSwapBtn) {
        requestSwapBtn.addEventListener('click', function() {
            // In a real app, this would show a modal
            alert('Swap request functionality would open a modal here to select items to offer in exchange.');
        });
    }
    
    // Redeem with points button
    const redeemBtn = document.querySelector('.item-actions .btn-secondary');
    if (redeemBtn) {
        redeemBtn.addEventListener('click', function() {
            // In a real app, this would show a confirmation
            alert('Redeem with points functionality would confirm the redemption here.');
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const uploadedImages = document.getElementById('uploadedImages');
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    // Handle clicked files
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    function handleFiles(files) {
        [...files].forEach(uploadFile);
    }
    
    function uploadFile(file) {
        if (!file.type.match('image.*')) {
            alert('Please upload only image files.');
            return;
        }
        
        // In a real app, you would upload to a server here
        // For demo, we'll just display a preview
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'uploaded-image';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', function() {
                imageContainer.remove();
            });
            
            imageContainer.appendChild(img);
            imageContainer.appendChild(removeBtn);
            uploadedImages.appendChild(imageContainer);
        };
        
        reader.readAsDataURL(file);
    }
    
    // Form submission
    const form = document.querySelector('.add-item-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const title = document.getElementById('title').value;
            const category = document.getElementById('category').value;
            const type = document.getElementById('type').value;
            const size = document.getElementById('size').value;
            const condition = document.getElementById('condition').value;
            const points = document.getElementById('points').value;
            const description = document.getElementById('description').value;
            
            if (!title || !category || !type || !size || !condition || !points || !description) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (uploadedImages.children.length === 0) {
                alert('Please upload at least one photo of your item.');
                return;
            }
            
            // In a real app, you would submit to a server here
            alert('Item successfully listed! It will be available after admin approval.');
            form.reset();
            uploadedImages.innerHTML = '';
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    // Cancel button
    const cancelBtn = document.querySelector('.form-actions .btn-outline');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                window.location.href = 'dashboard.html';
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active form
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabId}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Basic validation
            if (!email || !password) {
                alert('Please fill in all fields.');
                return;
            }
            
            // In a real app, you would authenticate with a server here
            console.log('Login attempt with:', { email, password });
            
            // For demo, just redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            const terms = document.getElementById('terms').checked;
            
            // Validation
            if (!name || !email || !password || !confirmPassword) {
                alert('Please fill in all fields.');
                return;
            }
            
            if (password.length < 8) {
                alert('Password must be at least 8 characters.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            
            if (!terms) {
                alert('You must agree to the terms and privacy policy.');
                return;
            }
            
            // In a real app, you would register with a server here
            console.log('Signup attempt with:', { name, email, password });
            
            // For demo, just redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    // Social login buttons
    const googleBtn = document.querySelector('.btn-social.google');
    const facebookBtn = document.querySelector('.btn-social.facebook');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            // In a real app, this would initiate Google OAuth flow
            alert('Google login would be implemented here.');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            // In a real app, this would initiate Facebook OAuth flow
            alert('Facebook login would be implemented here.');
        });
    }
    
    // Forgot password link
    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real app, this would show a password reset form
            alert('Password reset functionality would be implemented here.');
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.admin-tab');
    const sections = document.querySelectorAll('.admin-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === tabId) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Load pending items (mock data)
    const pendingList = document.querySelector('#pending .admin-items-list');
    const pendingItems = [
        {
            id: 101,
            title: 'Leather Jacket',
            category: 'Jackets',
            points: 250,
            condition: 'Good',
            uploader: 'user123',
            date: '2023-06-14',
            image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9'
        },
        {
            id: 102,
            title: 'Floral Dress',
            category: 'Dresses',
            points: 180,
            condition: 'Excellent',
            uploader: 'user456',
            date: '2023-06-13',
            image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b'
        }
    ];
    
    if (pendingList) {
        pendingItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'admin-item-card';
            itemElement.innerHTML = `
                <div class="admin-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="admin-item-details">
                    <h3>${item.title}</h3>
                    <div class="admin-item-meta">
                        <span>Category: ${item.category}</span>
                        <span>Condition: ${item.condition}</span>
                        <span>Points: ${item.points}</span>
                    </div>
                    <p>Uploaded by: ${item.uploader} on ${item.date}</p>
                    <div class="admin-item-actions">
                        <button class="btn btn-primary" data-action="approve" data-id="${item.id}">Approve</button>
                        <button class="btn btn-outline" data-action="reject" data-id="${item.id}">Reject</button>
                        <button class="btn" data-action="view" data-id="${item.id}">View Details</button>
                    </div>
                </div>
            `;
            pendingList.appendChild(itemElement);
        });
    }
    
    // Load reported items (mock data)
    const reportedList = document.querySelector('#reported .admin-items-list');
    const reportedItems = [
        {
            id: 201,
            title: 'Graphic T-Shirt',
            category: 'Tops',
            points: 80,
            condition: 'Good',
            uploader: 'user789',
            date: '2023-06-12',
            reports: 3,
            reason: 'Inappropriate content',
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27'
        }
    ];
    
    if (reportedList) {
        reportedItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'admin-item-card';
            itemElement.innerHTML = `
                <div class="admin-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="admin-item-details">
                    <h3>${item.title}</h3>
                    <div class="admin-item-meta">
                        <span>Category: ${item.category}</span>
                        <span>Condition: ${item.condition}</span>
                        <span>Points: ${item.points}</span>
                    </div>
                    <p>Uploaded by: ${item.uploader} on ${item.date}</p>
                    <p class="report-info"><strong>Reports:</strong> ${item.reports} (${item.reason})</p>
                    <div class="admin-item-actions">
                        <button class="btn btn-primary" data-action="keep" data-id="${item.id}">Keep</button>
                        <button class="btn btn-danger" data-action="remove" data-id="${item.id}">Remove</button>
                        <button class="btn" data-action="view" data-id="${item.id}">View Details</button>
                    </div>
                </div>
            `;
            reportedList.appendChild(itemElement);
        });
    }
    
    // Load users (mock data)
    const usersList = document.querySelector('#users .admin-users-list');
    const users = [
        {
            id: 301,
            name: 'Alex Johnson',
            email: 'alex@example.com',
            joinDate: '2023-05-15',
            items: 8,
            points: 450,
            status: 'active',
            image: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
            id: 302,
            name: 'Sarah Miller',
            email: 'sarah@example.com',
            joinDate: '2023-04-22',
            items: 12,
            points: 720,
            status: 'active',
            image: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
            id: 303,
            name: 'Jamie Smith',
            email: 'jamie@example.com',
            joinDate: '2023-06-01',
            items: 3,
            points: 150,
            status: 'suspended',
            image: 'https://randomuser.me/api/portraits/women/65.jpg'
        }
    ];
    
    if (usersList) {
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'admin-user-card';
            userElement.innerHTML = `
                <div class="admin-user-pic">
                    <img src="${user.image}" alt="${user.name}">
                </div>
                <div class="admin-user-details">
                    <h3>${user.name}</h3>
                    <div class="admin-user-meta">
                        <span>${user.email}</span>
                        <span>Joined: ${user.joinDate}</span>
                        <span>Items: ${user.items}</span>
                        <span>Points: ${user.points}</span>
                        <span class="status ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                    </div>
                </div>
                <div class="admin-user-actions">
                    <button class="btn" data-action="view" data-id="${user.id}">View</button>
                    ${user.status === 'active' ? 
                        `<button class="btn btn-danger" data-action="suspend" data-id="${user.id}">Suspend</button>` : 
                        `<button class="btn btn-primary" data-action="activate" data-id="${user.id}">Activate</button>`
                    }
                </div>
            `;
            usersList.appendChild(userElement);
        });
    }
    
    // Action buttons
    document.addEventListener('click', function(e) {
        if (e.target.hasAttribute('data-action')) {
            const action = e.target.getAttribute('data-action');
            const id = e.target.getAttribute('data-id');
            
            // In a real app, this would make an API call
            switch (action) {
                case 'approve':
                    alert(`Item ${id} approved.`);
                    e.target.closest('.admin-item-card').remove();
                    break;
                case 'reject':
                    alert(`Item ${id} rejected.`);
                    e.target.closest('.admin-item-card').remove();
                    break;
                case 'keep':
                    alert(`Item ${id} kept despite reports.`);
                    e.target.closest('.admin-item-card').remove();
                    break;
                case 'remove':
                    alert(`Item ${id} removed.`);
                    e.target.closest('.admin-item-card').remove();
                    break;
                case 'suspend':
                    alert(`User ${id} suspended.`);
                    // Update UI
                    const card = e.target.closest('.admin-user-card');
                    card.querySelector('.status').textContent = 'Suspended';
                    card.querySelector('.status').className = 'status suspended';
                    e.target.textContent = 'Activate';
                    e.target.className = 'btn btn-primary';
                    e.target.setAttribute('data-action', 'activate');
                    break;
                case 'activate':
                    alert(`User ${id} activated.`);
                    // Update UI
                    const userCard = e.target.closest('.admin-user-card');
                    userCard.querySelector('.status').textContent = 'Active';
                    userCard.querySelector('.status').className = 'status active';
                    e.target.textContent = 'Suspend';
                    e.target.className = 'btn btn-danger';
                    e.target.setAttribute('data-action', 'suspend');
                    break;
                case 'view':
                    alert(`View details for ${id}.`);
                    break;
            }
        }
    });
});
// Auth functions
function showForm(formType) {
  document.getElementById('loginForm').style.display = 
    formType === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = 
    formType === 'register' ? 'block' : 'none';
}

// Login handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('loginEmail').value,
      password: document.getElementById('loginPassword').value
    })
  });
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    window.location.href = 'dashboard.html';
  }
});

// Register handler (similar to login)
// Add to js/script.js
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById('registerName').value,
      email: document.getElementById('registerEmail').value,
      password: document.getElementById('registerPassword').value
    })
  });
  if (response.ok) {
    alert('Registration successful! Please login.');
    showForm('login');
  }
});
// Auth check for protected pages (dashboard.html, add-item.html, etc.)
if (window.location.pathname !== '/index.html' && 
    window.location.pathname !== '/auth.html') {
  if (!localStorage.getItem('token')) {
    window.location.href = 'auth.html';
  }
}
// Load user's items for swap dropdown
async function loadSwapItems() {
  const response = await fetch('http://localhost:5000/api/items/user', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const items = await response.json();
  const select = document.getElementById('swapItems');
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item._id;
    option.textContent = item.title;
    select.appendChild(option);
  });
}

// Swap form handler
document.getElementById('swapForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const itemId = new URLSearchParams(window.location.search).get('id');
  const response = await fetch('http://localhost:5000/api/swaps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      requestedItem: itemId,
      offeredItem: document.getElementById('swapItems').value,
      message: document.getElementById('swapMessage').value
    })
  });
  if (response.ok) {
    alert('Swap requested successfully!');
  }
});

// Call this when item-detail.html loads
if (window.location.pathname.includes('item-detail.html')) {
  loadSwapItems();
}
// Logout function
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

// Add logout button to dashboard/admin pages
if (window.location.pathname.includes('dashboard.html') || 
    window.location.pathname.includes('admin.html')) {
  const nav = document.querySelector('nav');
  nav.innerHTML += '<button onclick="logout()">Logout</button>';
}
// Example: Login call from auth.html
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: '123456' })
});
// Google Login Handler
document.getElementById('googleLogin').addEventListener('click', () => {
  window.location.href = 'http://localhost:5000/api/auth/google';
});

// Facebook Login Handler
document.getElementById('facebookLogin').addEventListener('click', () => {
  window.location.href = 'http://localhost:5000/api/auth/facebook';
});

// Token handling after redirect
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    localStorage.setItem('token', token);
    window.location.href = 'dashboard.html';
  }
});