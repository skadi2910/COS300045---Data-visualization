// Test if JavaScript is loading
// console.log('scripts.js loaded successfully');

function showPage(pageId) {
    // console.log('showPage function called with:', pageId);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    // console.log('Found pages:', pages.length);
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.navbar a');
    // console.log('Found nav links:', navLinks.length);
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    // console.log('Target page element:', targetPage);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Add active class to corresponding nav link
    const targetNav = document.getElementById('nav-' + pageId);
    // console.log('Target nav element:', targetNav);
    if (targetNav) {
        targetNav.classList.add('active');
    }
    
    // Update page title
    const titles = {
        'home': 'PowerTech - Home',
        'televisions': 'PowerTech - Televisions',
        'about': 'PowerTech - About Us'
    };
    document.title = titles[pageId];
    
    // console.log('Page switch completed for:', pageId);
}

// Initialize with home page active and set up event listeners
document.addEventListener('DOMContentLoaded', function() {
    // console.log('DOM loaded, setting up event listeners');
    
    // Set up navigation click events
    document.getElementById('home-btn').addEventListener('click', function(e) {
      e.preventDefault();
      // console.log('Home link clicked');
      showPage('home');
    });
    document.getElementById('nav-home').addEventListener('click', function(e) {
        e.preventDefault();
        // console.log('Home link clicked');
        showPage('home');
    });
    
    document.getElementById('nav-televisions').addEventListener('click', function(e) {
        e.preventDefault();
        // console.log('Televisions link clicked');
        showPage('televisions');
    });
    
    document.getElementById('nav-about').addEventListener('click', function(e) {
        e.preventDefault();
        // console.log('About link clicked');
        showPage('about');
    });
    
    // Set up logo click event
    document.getElementById('logo-link').addEventListener('click', function(e) {
        e.preventDefault();
        // console.log('Logo clicked');
        showPage('home');
    });
    
    // Initialize home page
    // console.log('Initializing home page');
    showPage('home');
});