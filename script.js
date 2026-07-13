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
    // 4. Interactive 3D Skills Sphere (Tag Cloud)
    // ==========================================
    const skillsCanvas = document.getElementById('skills-cloud-canvas');
    if (skillsCanvas) {
        const sCtx = skillsCanvas.getContext('2d');
        const skillList = [
            'SQL', 'Python', 'Power BI', 'DAX', 'Pandas', 'NumPy',
            'MySQL', 'PostgreSQL', 'Scikit-learn', 'Excel', 'Docker',
            'Git', 'GitHub', 'AWS', 'Azure', 'Bash', 'EDA', 'NLP',
            'Regression', 'Clustering', 'Classification', 'ETL'
        ];
        
        let tags = [];
        const radius = 150;
        let angleX = 0.003;
        let angleY = 0.003;
        let isDragging = false;
        let lastMouseX = 0;
        let lastMouseY = 0;
        
        // Define tag object structure
        class Tag {
            constructor(text, x, y, z) {
                this.text = text;
                this.x = x;
                this.y = y;
                this.z = z;
                this.color = 'hsla(' + (180 + Math.random() * 40) + ', 100%, 75%, 1)'; // glow cyans
            }
            
            rotate(ax, ay) {
                // Rotate around X-axis
                let cosX = Math.cos(ax);
                let sinX = Math.sin(ax);
                let y1 = this.y * cosX - this.z * sinX;
                let z1 = this.z * cosX + this.y * sinX;
                
                // Rotate around Y-axis
                let cosY = Math.cos(ay);
                let sinY = Math.sin(ay);
                let x2 = this.x * cosY - z1 * sinY;
                let z2 = z1 * cosY + this.x * sinY;
                
                this.x = x2;
                this.y = y1;
                this.z = z2;
            }
            
            draw(width, height) {
                // 3D Perspective Projection
                const focus = 300;
                const scale = focus / (focus + this.z);
                const x2d = this.x * scale + width / 2;
                const y2d = this.y * scale + height / 2;
                
                // Opacity based on depth
                const opacity = (focus - this.z) / (focus + radius);
                if (opacity < 0.15) return; // don't draw far items
                
                sCtx.save();
                sCtx.font = `bold ${Math.round(scale * 15 + 8)}px 'Outfit', sans-serif`;
                sCtx.fillStyle = this.color;
                sCtx.globalAlpha = opacity;
                sCtx.textAlign = 'center';
                sCtx.textBaseline = 'middle';
                
                // Render shadow for glow effect
                sCtx.shadowBlur = 10;
                sCtx.shadowColor = 'rgba(0, 242, 254, 0.4)';
                
                sCtx.fillText(this.text, x2d, y2d);
                sCtx.restore();
            }
        }
        
        // Initialize coordinates evenly distributed on a sphere (Fibonacci lattice)
        const numTags = skillList.length;
        for (let i = 0; i < numTags; i++) {
            const phi = Math.acos(-1 + (2 * i) / numTags);
            const theta = Math.sqrt(numTags * Math.PI) * phi;
            
            const tx = radius * Math.sin(phi) * Math.cos(theta);
            const ty = radius * Math.sin(phi) * Math.sin(theta);
            const tz = radius * Math.cos(phi);
            
            tags.push(new Tag(skillList[i], tx, ty, tz));
        }
        
        // Control rotation based on mouse coordinates relative to center
        skillsCanvas.addEventListener('mousemove', (e) => {
            if (isDragging) return;
            const rect = skillsCanvas.getBoundingClientRect();
            const mx = e.clientX - rect.left - rect.width / 2;
            const my = e.clientY - rect.top - rect.height / 2;
            
            // Adjust speed dynamically
            angleY = mx * 0.00003;
            angleX = -my * 0.00003;
        });
        
        // Click-Drag controls
        skillsCanvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });
        
        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - lastMouseX;
            const dy = e.clientY - lastMouseY;
            
            angleY = dx * 0.005;
            angleX = -dy * 0.005;
            
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });
        
        // Touch supports
        skillsCanvas.addEventListener('touchstart', (e) => {
            isDragging = true;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
        });
        
        skillsCanvas.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        skillsCanvas.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const dx = e.touches[0].clientX - lastMouseX;
            const dy = e.touches[0].clientY - lastMouseY;
            
            angleY = dx * 0.008;
            angleX = -dy * 0.008;
            
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
        });
        
        // Main Loop
        function drawSphere() {
            sCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);
            
            // Rotate tags
            tags.forEach(tag => {
                tag.rotate(angleX, angleY);
                tag.draw(skillsCanvas.width, skillsCanvas.height);
            });
            
            // Decelerate drag rotation back to smooth drift speed
            if (!isDragging) {
                angleX += (0.001 - angleX) * 0.05;
                angleY += (0.001 - angleY) * 0.05;
            }
            
            requestAnimationFrame(drawSphere);
        }
        
        drawSphere();
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
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});
