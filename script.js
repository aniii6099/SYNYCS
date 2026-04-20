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

    // Hero video — set src then play() triggers load + playback in one shot
    const heroVid = document.getElementById('hero-vid');
    if (heroVid) {
        heroVid.muted = true;
        heroVid.volume = 0;
        heroVid.src = 'InShot_20260415_152107217.mp4';
        heroVid.play().catch(() => {});
    }

    // AI Programme phase tabs
    const phaseData = [
        {
            kicker: 'Phase 1',
            title: 'Strong Foundations',
            time: 'Month 1',
            summary: 'We build your core from the ground up so students begin with solid engineering thinking and technical confidence.',
            points: [
                'Python mastery and computational thinking',
                'Mathematics for AI, including statistics and probability basics',
                'AI fundamentals and model understanding',
                'Modern development workflows with Git and AI coding tools'
            ],
            outcome: 'Outcome: You think like an engineer, not a beginner.'
        },
        {
            kicker: 'Phase 2',
            title: 'Core AI Engineering',
            time: 'Month 1–4',
            summary: 'This phase takes students into the core systems behind modern AI model building and training.',
            points: [
                'Machine Learning and Deep Learning',
                'Transformers and Large Language Models',
                'Generative AI systems',
                'Data handling and feature engineering'
            ],
            outcome: 'Outcome: You can build and train real AI models.'
        },
        {
            kicker: 'Phase 3',
            title: 'Real-World AI Systems',
            time: 'Month 4–6',
            summary: 'Students move from models to applied systems that solve real business and product problems.',
            points: [
                'Solve real business problems using AI',
                'Build end-to-end AI applications',
                'Work on industry-level projects and simulations',
                'Learn system design and deployment thinking'
            ],
            outcome: 'Outcome: You build production-ready AI systems.'
        },
        {
            kicker: 'Phase 4',
            title: 'Placement & Career Launch',
            time: 'Month 6',
            summary: 'Students package what they have built into a profile that is ready for interviews and hiring conversations.',
            points: [
                'Portfolio-ready GitHub projects',
                'Resume and interview preparation',
                'Dedicated placement support',
                'Access to hiring network'
            ],
            outcome: 'Outcome: Step into roles such as AI Engineer, GenAI Developer, and Data Scientist.'
        },
        {
            kicker: 'Phase 5',
            title: 'Career Growth',
            time: '6–12 Months',
            summary: 'The roadmap continues after placement with advanced modules, mentorship, and guided growth.',
            points: [
                'Advanced AI modules',
                'Mentorship from industry experts',
                'Performance and promotion guidance'
            ],
            outcome: 'Outcome: Faster career growth and higher salary potential.'
        },
        {
            kicker: 'Phase 6',
            title: 'AI Scientist Track',
            time: '12–24 Months',
            summary: 'For learners who want to move beyond jobs and grow toward advanced research and innovation roles.',
            points: [
                'Advanced LLMs and multi-agent systems',
                'Scalable AI architecture',
                'Research methodologies',
                'Paper writing and innovation projects'
            ],
            outcome: 'Outcome: Transition into AI Research Scientist roles.'
        }
    ];

    const aiTabs = document.querySelectorAll('.ai-tab');
    if (aiTabs.length) {
        function updatePhaseDetail(index) {
            const p = phaseData[index];
            document.getElementById('phase-kicker').textContent = p.kicker;
            document.getElementById('phase-title').textContent = p.title;
            document.getElementById('phase-time').textContent = p.time;
            document.getElementById('phase-summary').textContent = p.summary;
            document.getElementById('phase-outcome').textContent = p.outcome;
            const pointsList = document.getElementById('phase-points');
            pointsList.innerHTML = p.points.map(pt => `<li>${pt}</li>`).join('');
        }

        aiTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                aiTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                updatePhaseDetail(parseInt(tab.dataset.phase, 10));
            });
        });
    }

    // About section carousel
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (track && dotsContainer && prevBtn && nextBtn) {
        const slides = track.querySelectorAll('.carousel-slide');
        let current = 0;
        let autoPlayTimer;

        // Build dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        function updateDots() {
            dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        }

        function goTo(index) {
            current = (index + slides.length) % slides.length;
            track.style.transform = `translateX(-${current * 100}%)`;
            updateDots();
        }

        function startAutoPlay() {
            autoPlayTimer = setInterval(() => goTo(current + 1), 4000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayTimer);
        }

        prevBtn.addEventListener('click', () => { stopAutoPlay(); goTo(current - 1); startAutoPlay(); });
        nextBtn.addEventListener('click', () => { stopAutoPlay(); goTo(current + 1); startAutoPlay(); });

        startAutoPlay();
    }
});
