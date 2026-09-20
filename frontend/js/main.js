/**
 * ============================================================================
 * BloodBridge - Frontend Client Scripts (Day 3 Foundation)
 * Focus: Clean, vanilla, modular UI interactions & accessible controls
 * Note: No backend/API integrations or fake data generation.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initSearchForm();
    initModalHandlers();
});

/**
 * ----------------------------------------------------------------------------
 * 1. Responsive Navigation & Mobile Menu Handler
 * ----------------------------------------------------------------------------
 */
function initNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a navigation link or action button is clicked
    const navItems = navMenu.querySelectorAll('.nav-link, .btn');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

/**
 * ----------------------------------------------------------------------------
 * 2. Header Scroll & Shadow Effects
 * ----------------------------------------------------------------------------
 */
function initScrollEffects() {
    const siteHeader = document.getElementById('siteHeader');
    if (!siteHeader) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    }, { passive: true });
}

/**
 * ----------------------------------------------------------------------------
 * 3. Search Form Frontend Validation & Feedback
 * ----------------------------------------------------------------------------
 */
function initSearchForm() {
    const searchForm = document.getElementById('bloodSearchForm');
    const feedbackBanner = document.getElementById('searchFeedback');

    if (!searchForm || !feedbackBanner) return;

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const bloodGroup = document.getElementById('bloodGroup').value;
        const bloodComponent = document.getElementById('bloodComponent').value;
        const locationInput = document.getElementById('locationInput').value.trim();
        const urgencyLevel = document.getElementById('urgencyLevel').value;

        // Basic Frontend Validation
        if (!bloodGroup || !bloodComponent || !locationInput || !urgencyLevel) {
            showFeedback(
                'Please select blood group, component, urgency level, and enter your city/location.',
                'error'
            );
            return;
        }

        // Informative UI feedback (Acknowledging frontend-only mode)
        const summaryMsg = `Search parameters captured: [${bloodGroup} | ${bloodComponent} | Urgency: ${urgencyLevel} | Location: ${locationInput}]. In Day 3 frontend mode, queries are validated locally. Full Spring Boot matching will be connected in Week 3.`;
        showFeedback(summaryMsg, 'info');
    });

    function showFeedback(message, type) {
        feedbackBanner.className = `feedback-banner ${type}`;
        feedbackBanner.innerHTML = `
            <span>${message}</span>
            <button type="button" class="btn-banner-close" aria-label="Dismiss message" style="background:none;border:none;cursor:pointer;font-weight:700;">&times;</button>
        `;

        const closeBtn = feedbackBanner.querySelector('.btn-banner-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                feedbackBanner.className = 'feedback-banner';
                feedbackBanner.style.display = 'none';
            });
        }
    }
}

/**
 * ----------------------------------------------------------------------------
 * 4. Interactive Placeholder Modal Handlers
 * ----------------------------------------------------------------------------
 */
function initModalHandlers() {
    const modalOverlay = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');

    if (!modalOverlay) return;

    // Attach listeners to all placeholder action buttons
    const placeholderButtons = document.querySelectorAll('[data-action-placeholder]');
    placeholderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const actionType = button.getAttribute('data-action-placeholder');
            openPlaceholderModal(actionType);
        });
    });

    function openPlaceholderModal(actionType) {
        const modalContentMap = {
            'login': {
                title: 'User Login Portal',
                description: 'Authentication module will be connected during Day 8 (Spring Security + JWT token auth). This is a frontend placeholder.'
            },
            'register': {
                title: 'User Registration',
                description: 'Account registration with role selection (Donor, Requester, Blood Bank) will be available when backend authentication endpoints are active.'
            },
            'donor': {
                title: 'Donor Onboarding',
                description: 'Donor registration will collect blood group, donation cooldown intervals, and availability preferences during Week 2.'
            },
            'requester': {
                title: 'Blood Request Portal',
                description: 'Requesters will be able to create structured blood and component requests for hospital attenders once the Spring Boot API is online.'
            },
            'blood-bank': {
                title: 'Blood Bank Facility Portal',
                description: 'Licensed blood banks will manage real-time component inventories and emergency requests through their verified portal.'
            }
        };

        const config = modalContentMap[actionType] || {
            title: 'Feature Notice',
            description: 'This feature is part of our upcoming development sprints.'
        };

        modalTitle.textContent = config.title;
        modalDescription.textContent = config.description;
        modalOverlay.classList.add('active');
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}
