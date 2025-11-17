// ============================================
// Navigation
// ============================================

const navbar = document.querySelector('.navbar');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Handle scroll for navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Scroll Animations
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for scroll animations
const animateElements = document.querySelectorAll(
    '.about-content, .skill-category, .project-card, .timeline-item, .contact-content'
);

animateElements.forEach(element => {
    observer.observe(element);
});

// ============================================
// Skill Progress Bars
// ============================================

const skillBars = document.querySelectorAll('.skill-progress');

function animateSkillBars() {
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (width) {
            bar.style.width = `${width}%`;
        }
    });
}

const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillsObserver.observe(skillsSection);
}

// ============================================
// Counter Animation for Stats
// ============================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

const statNumbers = document.querySelectorAll('.stat-number');

if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    if (target) {
                        animateCounter(stat, target);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        statsObserver.observe(aboutSection);
    }
}

// ============================================
// Form Validation & Handling
// ============================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Form validation functions
    function validateName(name) {
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        return nameRegex.test(name.trim());
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    function validateSubject(subject) {
        return subject.trim().length >= 3 && subject.trim().length <= 100;
    }

    function validateMessage(message) {
        return message.trim().length >= 10 && message.trim().length <= 1000;
    }

    function showError(input, message) {
        input.classList.add('error');
        let errorMsg = input.parentElement.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            input.parentElement.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }

    function clearError(input) {
        input.classList.remove('error');
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    function validateField(input) {
        const value = input.value.trim();
        const name = input.name;

        switch (name) {
            case 'name':
                if (!value) {
                    showError(input, 'Name is required');
                } else if (!validateName(value)) {
                    showError(input, 'Name must be 2-50 characters and contain only letters');
                } else {
                    clearError(input);
                }
                break;

            case 'email':
                if (!value) {
                    showError(input, 'Email is required');
                } else if (!validateEmail(value)) {
                    showError(input, 'Please enter a valid email address');
                } else {
                    clearError(input);
                }
                break;

            case 'subject':
                if (!value) {
                    showError(input, 'Subject is required');
                } else if (!validateSubject(value)) {
                    showError(input, 'Subject must be 3-100 characters');
                } else {
                    clearError(input);
                }
                break;

            case 'message':
                if (!value) {
                    showError(input, 'Message is required');
                } else if (!validateMessage(value)) {
                    showError(input, 'Message must be 10-1000 characters');
                } else {
                    clearError(input);
                }
                break;
        }
    }

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Clear previous errors
        formInputs.forEach(input => clearError(input));

        // Validate all fields
        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const subjectInput = contactForm.querySelector('#subject');
        const messageInput = contactForm.querySelector('#message');

        let isValid = true;

        if (!validateName(nameInput.value)) {
            showError(nameInput, 'Name must be 2-50 characters and contain only letters');
            isValid = false;
        }

        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        if (!validateSubject(subjectInput.value)) {
            showError(subjectInput, 'Subject must be 3-100 characters');
            isValid = false;
        }

        if (!validateMessage(messageInput.value)) {
            showError(messageInput, 'Message must be 10-1000 characters');
            isValid = false;
        }

        if (!isValid) {
            // Scroll to first error
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        const button = contactForm.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'Message Sent! ✓';
        button.style.backgroundColor = '#10b981';
        button.disabled = true;
        
        // Reset form
        contactForm.reset();
        formInputs.forEach(input => clearError(input));
        
        // Reset button after 3 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.disabled = false;
        }, 3000);
    });
}

// ============================================
// Project Card Hover Effects
// ============================================

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// ============================================
// Scroll to Top Functionality
// ============================================

let scrollToTopButton = null;

function createScrollToTopButton() {
    scrollToTopButton = document.createElement('button');
    scrollToTopButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
    scrollToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #6366f1;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
    `;
    
    document.body.appendChild(scrollToTopButton);
    
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollToTopButton.addEventListener('mouseenter', () => {
        scrollToTopButton.style.transform = 'translateY(-3px)';
        scrollToTopButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
    });
    
    scrollToTopButton.addEventListener('mouseleave', () => {
        scrollToTopButton.style.transform = 'translateY(0)';
        scrollToTopButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
        }
    });
}

// Initialize scroll to top button
createScrollToTopButton();

// ============================================
// Parallax Effect for Hero Background
// ============================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroPattern = document.querySelector('.hero-pattern');
    
    if (heroPattern && scrolled < window.innerHeight) {
        const speed = scrolled * 0.5;
        heroPattern.style.transform = `translateY(${speed}px)`;
    }
});

// ============================================
// Page Load Animation
// ============================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements on load
    const heroElements = document.querySelectorAll('.hero-greeting, .hero-name, .hero-title, .hero-tagline, .hero-description');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 150);
    });
});

// ============================================
// Utility: Debounce Function
// ============================================

function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimize scroll listeners with debounce
const optimizedScroll = debounce(() => {
    highlightNavigation();
}, 10);

window.addEventListener('scroll', optimizedScroll);

// ============================================
// Handle Resize Events
// ============================================

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize if window is larger
        if (window.innerWidth > 768) {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        }
    }, 250);
});
