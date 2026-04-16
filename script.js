document.addEventListener('DOMContentLoaded', () => {
    if (window.emailjs) {
        emailjs.init("gs7FzZHndq0S7Rga4");
    }

    function escapePdfText(text) {
        return String(text).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    }

    function buildBrochurePdf() {
        const lines = [
            'Quantum School of AI',
            'Free AI Workshop Brochure',
            '',
            'Hands-on learning with real-world AI projects.',
            'Industry-relevant curriculum and mentorship.',
            'Apply now to explore the free workshop.'
        ];

        const contentLines = [
            'BT',
            '/F1 24 Tf',
            '72 740 Td',
            `(${escapePdfText(lines[0])}) Tj`,
            '/F1 16 Tf',
            '0 -34 Td',
            `(${escapePdfText(lines[1])}) Tj`,
            '/F1 12 Tf',
            '0 -30 Td',
            `(${escapePdfText(lines[3])}) Tj`,
            '0 -20 Td',
            `(${escapePdfText(lines[4])}) Tj`,
            '0 -20 Td',
            `(${escapePdfText(lines[5])}) Tj`,
            'ET'
        ].join('\n');

        const encoder = new TextEncoder();
        const header = '%PDF-1.4\n';
        const objects = [
            '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
            '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
            '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
            `4 0 obj\n<< /Length ${encoder.encode(contentLines).length} >>\nstream\n${contentLines}\nendstream\nendobj\n`,
            '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
        ];

        let pdf = header;
        const offsets = [0];
        let currentOffset = encoder.encode(header).length;

        for (const object of objects) {
            offsets.push(currentOffset);
            pdf += object;
            currentOffset += encoder.encode(object).length;
        }

        const xrefOffset = currentOffset;
        const xrefLines = [
            'xref',
            '0 6',
            '0000000000 65535 f ',
            ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `),
            'trailer',
            '<< /Size 6 /Root 1 0 R >>',
            'startxref',
            String(xrefOffset),
            '%%EOF'
        ].join('\n');

        pdf += xrefLines;
        return pdf;
    }

    function downloadBrochure() {
        const pdf = buildBrochurePdf();
        const blob = new Blob([pdf], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Quantum-School-of-AI-Brochure.pdf';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
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

    const applyNowBtn = document.getElementById('apply-now-btn');
    if (applyNowBtn) {
        applyNowBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const target = document.getElementById('inquiry-form');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    const brochureBtn = document.getElementById('download-brochure-btn');
    if (brochureBtn) {
        brochureBtn.addEventListener('click', downloadBrochure);
    }

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
