/* -------------------------------------------------------------
   Rohit Rathod - Portfolio Interaction Script
   Contains: Particle Net, Typing Effect, 3D Skills Sphere,
             3D Card Tilt, Count-Up Stats, Mini-Dashboard Logic, Nav
------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Navigation & Scroll Effects
    // ==========================================
    const header = document.querySelector('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    // Header background change on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        highlightNavLink();
    });
    
    // Toggle mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileNavOverlay.classList.toggle('open');
            mobileMenuToggle.innerHTML = isOpen 
                ? '<i class="fa-solid fa-xmark"></i>' 
                : '<i class="fa-solid fa-bars-staggered"></i>';
        });
    }
    
    // Close mobile nav when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('open');
            if (mobileMenuToggle) {
                mobileMenuToggle.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
            }
        });
    });
    
    // Scroll link highlighter
    function highlightNavLink() {
        const sections = document.querySelectorAll('section');
        let scrollPos = window.scrollY + 120;
        
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                const id = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Scroll to sandbox link handler
    const scrollToSandbox = document.querySelector('.scroll-to-sandbox');
    if (scrollToSandbox) {
        scrollToSandbox.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#sandbox').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ==========================================
    // 2. Typing Effect (Text Rotator)
    // ==========================================
    const rotator = document.querySelector('.text-rotator');
    if (rotator) {
        const words = JSON.parse(rotator.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;
        
        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                rotator.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40; // delete faster
            } else {
                rotator.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80; // typing speed
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // pause at the end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // pause before typing next word
            }
            
            setTimeout(type, typeSpeed);
        }
        
        setTimeout(type, 1000);
    }

    // ==========================================
    // 3. Hero Particle Canvas
    // ==========================================
    const particleCanvas = document.getElementById('hero-particles');
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        let numParticles = window.innerWidth < 768 ? 40 : 100;
        
        // Resize canvas
        function resizeCanvas() {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
            numParticles = window.innerWidth < 768 ? 40 : 100;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2 + 1;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                // Boundary collision
                if (this.x < 0 || this.x > particleCanvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > particleCanvas.height) this.vy = -this.vy;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 242, 254, 0.15)';
                ctx.fill();
            }
        }
        
        // Initialize particles
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
        
        // Animation Loop
        function animateParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            // Draw connecting lines
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 242, 254, 0.03)';
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                    if (dist < 120) {
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                    }
                }
            }
            ctx.stroke();
            
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
    }

    // ==========================================
    // 4. Sandbox Threshold Slider Interaction
    // ==========================================
    const thresholdSlider = document.getElementById('churn-threshold-slider');
    const thresholdVal = document.getElementById('threshold-val');
    const thresholdLine = document.getElementById('threshold-line');
    const thresholdText = document.getElementById('threshold-text');
    const activeCustKpi = document.getElementById('kpi-active-cust');
    const churnRateKpi = document.getElementById('kpi-churn-rate');
    const activeCustIndicator = document.getElementById('kpi-active-indicator');
    const churnRateIndicator = document.getElementById('kpi-churn-indicator');

    if (thresholdSlider) {
        thresholdSlider.addEventListener('input', () => {
            const threshold = parseFloat(thresholdSlider.value);
            
            // Update threshold number text label
            thresholdVal.textContent = threshold.toFixed(2);
            
            // Update threshold line in SVG (X range: 60 to 460)
            const xPos = 60 + threshold * 400;
            if (thresholdLine) {
                thresholdLine.setAttribute('x1', xPos);
                thresholdLine.setAttribute('x2', xPos);
            }
            if (thresholdText) {
                thresholdText.setAttribute('x', xPos + 10);
                thresholdText.textContent = `Threshold (${threshold.toFixed(2)})`;
                
                // Adjust label side if getting too close to the right edge
                if (xPos > 380) {
                    thresholdText.setAttribute('x', xPos - 95);
                }
            }
            
            // Calculate dynamic Churn Rate: at 0.50 it is 18.2%
            // Formula: churnRate = (0.95 - threshold) * 0.3 + 0.047
            const churnRate = (0.95 - threshold) * 0.3 + 0.047;
            const churnPercentage = (churnRate * 100).toFixed(1);
            if (churnRateKpi) {
                churnRateKpi.textContent = `${churnPercentage}%`;
            }
            
            // Calculate dynamic Active Customers: at 0.50 it is 12,450
            const totalCustomers = 15220;
            const activeCust = Math.round(totalCustomers * (1 - churnRate));
            if (activeCustKpi) {
                activeCustKpi.textContent = activeCust.toLocaleString();
            }

            // Update Churn Indicator styling and text
            if (churnRateIndicator) {
                if (churnRate > 0.20) {
                    churnRateIndicator.className = 'kpi-indicator negative';
                    churnRateIndicator.innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> High Churn`;
                } else if (churnRate < 0.12) {
                    churnRateIndicator.className = 'kpi-indicator positive';
                    churnRateIndicator.innerHTML = `<i class="fa-solid fa-arrow-trend-down"></i> Low Churn`;
                } else {
                    churnRateIndicator.className = 'kpi-indicator neutral';
                    churnRateIndicator.innerHTML = `<i class="fa-solid fa-equals"></i> Steady`;
                }
            }

            // Update Active Customers MoM growth indicator dynamically
            if (activeCustIndicator) {
                const growthRate = ((activeCust - 11830) / 11830 * 100).toFixed(1);
                if (growthRate > 0) {
                    activeCustIndicator.className = 'kpi-indicator positive';
                    activeCustIndicator.innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> +${growthRate}% MoM`;
                } else {
                    activeCustIndicator.className = 'kpi-indicator negative';
                    activeCustIndicator.innerHTML = `<i class="fa-solid fa-arrow-trend-down"></i> ${growthRate}% MoM`;
                }
            }
        });
    }

    // ==========================================
    // 5. 3D Project Card Tilt Effect
    // ==========================================
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardInner = card.querySelector('.project-card-inner');
            const rect = card.getBoundingClientRect();
            
            // Calculate offsets
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate percentages (-1 to 1)
            const xPercent = (x - rect.width / 2) / (rect.width / 2);
            const yPercent = (y - rect.height / 2) / (rect.height / 2);
            
            // Rotate card: Y-axis rotation maps to horizontal mouse pos, X-axis to vertical
            card.style.transform = `rotateX(${-yPercent * 10}deg) rotateY(${xPercent * 10}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // ==========================================
    // 6. Interactive Sandbox Dashboard Toggle
    // ==========================================
    const tabBtns = document.querySelectorAll('.db-tab-btn');
    const views = document.querySelectorAll('.dashboard-view');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const dbType = btn.getAttribute('data-dashboard');
            
            // Switch active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Switch views
            views.forEach(view => {
                view.classList.remove('active');
                if (view.getAttribute('id') === `${dbType}-view`) {
                    view.classList.add('active');
                    
                    // Trigger animations again on charts inside the active view
                    const rects = view.querySelectorAll('.chart-bar-rect');
                    rects.forEach(rect => {
                        rect.style.animation = 'none';
                        rect.offsetHeight; /* Trigger reflow to restart animation */
                        rect.style.animation = null;
                    });
                    
                    const paths = view.querySelectorAll('.anim-path');
                    paths.forEach(path => {
                        path.style.animation = 'none';
                        path.offsetHeight;
                        path.style.animation = null;
                    });

                    const points = view.querySelectorAll('.chart-point');
                    points.forEach(pt => {
                        pt.style.animation = 'none';
                        pt.offsetHeight;
                        pt.style.animation = null;
                    });
                    
                    const rectsH = view.querySelectorAll('.anim-bar-h');
                    rectsH.forEach(r => {
                        r.style.animation = 'none';
                        r.offsetHeight;
                        r.style.animation = null;
                    });
                }
            });
        });
    });

    // ==========================================
    // 7. Count-Up Stats Animation
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isFloat = target % 1 !== 0;
            let current = 0;
            const duration = 1500; // ms
            const stepTime = 16; // ~60fps
            const steps = duration / stepTime;
            const increment = target / steps;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (isFloat) {
                    stat.textContent = current.toFixed(2);
                } else {
                    stat.textContent = Math.round(current);
                }
            }, stepTime);
        });
        animated = true;
    }
    
    // Intersection Observer to trigger stats animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateStats();
            }
        });
    }, { threshold: 0.1 });
    
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});
