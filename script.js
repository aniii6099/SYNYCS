document.addEventListener('DOMContentLoaded', () => {
    // 1. Pill Navigation Slider Logic
    const navItems = document.querySelectorAll('.nav-item');
    const navSlider = document.getElementById('nav-slider');
    
    function updateSlider(element) {
        const rect = element.getBoundingClientRect();
        const navRect = element.parentElement.getBoundingClientRect();
        
        navSlider.style.width = `${rect.width}px`;
        navSlider.style.transform = `translateX(${rect.left - navRect.left}px)`;
    }
    
    // Initialize slider position
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        // slight timeout to ensure fonts are loaded and widths are correct
        setTimeout(() => updateSlider(activeItem), 50);
        window.addEventListener('resize', () => updateSlider(document.querySelector('.nav-item.active')));
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            updateSlider(item);
            
            // Allow smooth scrolling if it is an internal link
            if(item.getAttribute('href').startsWith('#')){
                e.preventDefault();
                const target = document.querySelector(item.getAttribute('href'));
                if(target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // 2. Form Submission Mock
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            const text = btn.querySelector('.btn-text');
            const loader = btn.querySelector('.btn-loader');
            
            // Show loading state
            text.style.display = 'none';
            // ensure flex layout overrides the display block default
            loader.style.display = 'block'; 
            
            // Mock API Call
            setTimeout(() => {
                loader.style.display = 'none';
                text.style.display = 'block';
                text.textContent = 'Success!';
                btn.style.background = '#10b981'; // Green success color
                
                // Reset form
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    text.textContent = 'Send Message';
                    btn.style.background = 'var(--gradient-accent)';
                }, 3000);
            }, 1500);
        });
    }
});
