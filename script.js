document.addEventListener('DOMContentLoaded', () => {
    if (window.emailjs) {
        emailjs.init("gs7FzZHndq0S7Rga4");
    }

    // 1. Navigation Slider Logic
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

    // 2. EmailJS Form Submission
    const contactForm = document.getElementById('inquiry-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('inquiry-submit');
            const originalText = btn.textContent;
            
            // Show loading state
            btn.disabled = true;
            btn.textContent = 'Sending...';
            
            emailjs.sendForm(
                "service_0ueeya9",
                "template_18tf0jm",
                this
            ).then(
                function() {
                btn.textContent = 'Success!';
                btn.style.background = '#10b981'; // Green success color
                
                // Reset form
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = 'var(--gradient-accent)';
                    btn.disabled = false;
                }, 3000);
                },
                function(error) {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    alert("Failed: " + JSON.stringify(error));
                }
            );
        });
    }
});
