/**
 * ============================================================================
 * BloodBridge - Frontend Client Controller
 * Focus: Clean, modular UI interactions, responsive menu, and client-side validation
 * Note: No backend/API integrations or fake data generation.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initSearchForm();
    initModalHandlers();
    initDonorRegistrationForm();
    initBloodRequestForm();
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
 * 3. Search Form Frontend Validation & Feedback (Homepage)
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
        const summaryMsg = `Search parameters captured: [${bloodGroup} | ${bloodComponent} | Urgency: ${urgencyLevel} | Location: ${locationInput}]. In Day 4 prototype mode, queries are validated locally. Full Spring Boot matching will be connected in Week 3.`;
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
                title: 'User Registration Portal',
                description: 'General account registration with role selection (Donor, Requester, Blood Bank) will be available when backend authentication endpoints are active.'
            },
            'blood-bank': {
                title: 'Blood Bank Facility Portal',
                description: 'Licensed blood banks will manage real-time component inventories and emergency requests through their verified portal in Week 3.'
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

/**
 * ----------------------------------------------------------------------------
 * 5. Feature 1: Donor Registration Form Validation & Submission
 * ----------------------------------------------------------------------------
 */
function initDonorRegistrationForm() {
    const donorForm = document.getElementById('donorRegistrationForm');
    const donorFormCard = document.getElementById('donorFormCard');
    const donorSuccessCard = document.getElementById('donorSuccessCard');
    const donorSummaryGrid = document.getElementById('donorSummaryGrid');
    const btnReset = document.getElementById('btnResetDonorForm');

    if (!donorForm) return;

    // Email & Phone Regex Patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[0-9\s\-]{10,15}$/;

    donorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        let firstInvalidField = null;

        // Helper to set field error state
        function validateField(inputEl, errorEl, condition) {
            if (!condition) {
                inputEl.classList.add('is-invalid');
                inputEl.classList.remove('is-valid');
                if (errorEl) errorEl.classList.add('visible');
                if (!firstInvalidField) firstInvalidField = inputEl;
                isValid = false;
            } else {
                inputEl.classList.remove('is-invalid');
                inputEl.classList.add('is-valid');
                if (errorEl) errorEl.classList.remove('visible');
            }
        }

        // 1. Full Name Validation
        const fullName = document.getElementById('donorFullName');
        const fullNameError = document.getElementById('donorFullNameError');
        validateField(fullName, fullNameError, fullName.value.trim().length >= 2);

        // 2. Email Validation
        const email = document.getElementById('donorEmail');
        const emailError = document.getElementById('donorEmailError');
        validateField(email, emailError, emailPattern.test(email.value.trim()));

        // 3. Phone Number Validation
        const phone = document.getElementById('donorPhone');
        const phoneError = document.getElementById('donorPhoneError');
        const cleanPhone = phone.value.replace(/[\s\-]/g, '');
        validateField(phone, phoneError, cleanPhone.length >= 10 && phonePattern.test(phone.value.trim()));

        // 4. Date of Birth Validation (Must be >= 18 years old and reasonable)
        const dob = document.getElementById('donorDob');
        const dobError = document.getElementById('donorDobError');
        let isAgeValid = false;
        if (dob.value) {
            const dobDate = new Date(dob.value);
            const today = new Date();
            const ageDiffMs = today - dobDate;
            const ageDate = new Date(ageDiffMs);
            const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
            isAgeValid = !isNaN(dobDate.getTime()) && calculatedAge >= 18 && calculatedAge <= 100;
        }
        validateField(dob, dobError, isAgeValid);

        // 5. Blood Group Validation
        const bloodGroup = document.getElementById('donorBloodGroup');
        const bloodGroupError = document.getElementById('donorBloodGroupError');
        validateField(bloodGroup, bloodGroupError, bloodGroup.value !== '');

        // 6. Last Donation Date Validation (Optional, but cannot be in future if filled)
        const lastDonation = document.getElementById('donorLastDonationDate');
        const lastDonationError = document.getElementById('donorLastDonationDateError');
        let isLastDonationValid = true;
        if (lastDonation.value) {
            const donationDate = new Date(lastDonation.value);
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            isLastDonationValid = donationDate <= today;
        }
        validateField(lastDonation, lastDonationError, isLastDonationValid);

        // 7. City Validation
        const city = document.getElementById('donorCity');
        const cityError = document.getElementById('donorCityError');
        validateField(city, cityError, city.value.trim().length >= 2);

        // 8. Consent 1: Medical Disclaimer (Required Checkbox)
        const consentMedical = document.getElementById('consentMedical');
        const consentMedicalError = document.getElementById('consentMedicalError');
        if (!consentMedical.checked) {
            if (consentMedicalError) consentMedicalError.classList.add('visible');
            if (!firstInvalidField) firstInvalidField = consentMedical;
            isValid = false;
        } else {
            if (consentMedicalError) consentMedicalError.classList.remove('visible');
        }

        // 9. Consent 2: Contact Consent (Required Checkbox)
        const consentContact = document.getElementById('consentContact');
        const consentContactError = document.getElementById('consentContactError');
        if (!consentContact.checked) {
            if (consentContactError) consentContactError.classList.add('visible');
            if (!firstInvalidField) firstInvalidField = consentContact;
            isValid = false;
        } else {
            if (consentContactError) consentContactError.classList.remove('visible');
        }

        // Focus first invalid field for accessibility
        if (!isValid) {
            if (firstInvalidField) firstInvalidField.focus();
            return;
        }

        // Render Summary Preview Card (Frontend display only, no sensitive storage)
        const availability = document.getElementById('donorAvailability').value;
        const radius = document.getElementById('donorRadius').value;
        const contactMethod = document.getElementById('donorContactMethod').value;
        const lastDonationDisplay = lastDonation.value ? lastDonation.value : 'First-time Donor';

        donorSummaryGrid.innerHTML = `
            <div class="summary-item">
                <span class="summary-item-label">Full Name</span>
                <span class="summary-item-value">${escapeHtml(fullName.value.trim())}</span>
            </div>
            <div class="summary-item">
                <span class="summary-item-label">Blood Group</span>
                <span class="summary-item-value" style="color: var(--primary); font-weight:800;">${escapeHtml(bloodGroup.value)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-item-label">Contact Details</span>
                <span class="summary-item-value">${escapeHtml(phone.value.trim())} • ${escapeHtml(email.value.trim())}</span>
            </div>
            <div class="summary-item">
                <span class="summary-item-label">Location / City</span>
                <span class="summary-item-value">${escapeHtml(city.value.trim())}</span>
            </div>
            <div class="summary-item">
                <span class="summary-item-label">Status & Search Radius</span>
                <span class="summary-item-value">${escapeHtml(availability)} (${escapeHtml(radius)} radius)</span>
            </div>
            <div class="summary-item">
                <span class="summary-item-label">Last Donation Date</span>
                <span class="summary-item-value">${escapeHtml(lastDonationDisplay)}</span>
            </div>
        `;

        // Switch to Confirmation view
        donorFormCard.style.display = 'none';
        donorSuccessCard.classList.add('active');
        donorSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            donorForm.reset();
            // Clear all validation classes
            const inputs = donorForm.querySelectorAll('.form-control');
            inputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));
            const errorMsgs = donorForm.querySelectorAll('.field-error-msg');
            errorMsgs.forEach(msg => msg.classList.remove('visible'));

            donorSuccessCard.classList.remove('active');
            donorFormCard.style.display = 'block';
            donorFormCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}

/**
 * ----------------------------------------------------------------------------
 * 6. Feature 2: Blood Request Form Validation & Submission
 * ----------------------------------------------------------------------------
 */
function initBloodRequestForm() {
    const requestForm = document.getElementById('bloodRequestForm');
    const requestFormCard = document.getElementById('requestFormCard');
    const requestSuccessCard = document.getElementById('requestSuccessCard');
    const requestSummaryGrid = document.getElementById('requestSummaryGrid');
    const btnReset = document.getElementById('btnResetRequestForm');

    if (!requestForm) return;

    // Phone & Email Patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[0-9\s\-]{10,15}$/;

    // Set minimum date to today for requiredDate
    const requiredDateInput = document.getElementById('requiredDate');
    if (requiredDateInput) {
        const todayStr = new Date().toISOString().split('T')[0];
        requiredDateInput.setAttribute('min', todayStr);
    }

    requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        let firstInvalidField = null;

        function validateField(inputEl, errorEl, condition) {
            if (!condition) {
                inputEl.classList.add('is-invalid');
                inputEl.classList.remove('is-valid');
                if (errorEl) errorEl.classList.add('visible');
                if (!firstInvalidField) firstInvalidField = inputEl;
                isValid = false;
            } else {
                inputEl.classList.remove('is-invalid');
                inputEl.classList.add('is-valid');
                if (errorEl) errorEl.classList.remove('visible');
            }
        }

        // 1. Requester Name
        const name = document.getElementById('requesterName');
        const nameError = document.getElementById('requesterNameError');
        validateField(name, nameError, name.value.trim().length >= 2);

        // 2. Contact Phone
        const phone = document.getElementById('requesterPhone');
        const phoneError = document.getElementById('requesterPhoneError');
        const cleanPhone = phone.value.replace(/[\s\-]/g, '');
        validateField(phone, phoneError, cleanPhone.length >= 10 && phonePattern.test(phone.value.trim()));

        // 3. Contact Email
        const email = document.getElementById('requesterEmail');
        const emailError = document.getElementById('requesterEmailError');
        validateField(email, emailError, emailPattern.test(email.value.trim()));

        // 4. Blood Group Required
        const bloodGroup = document.getElementById('requestBloodGroup');
        const bloodGroupError = document.getElementById('requestBloodGroupError');
        validateField(bloodGroup, bloodGroupError, bloodGroup.value !== '');

        // 5. Blood Component
        const component = document.getElementById('requestComponent');
        const componentError = document.getElementById('requestComponentError');
        validateField(component, componentError, component.value !== '');

        // 6. Units Required (Must be >= 1)
        const units = document.getElementById('requestUnits');
        const unitsError = document.getElementById('requestUnitsError');
        const unitsVal = parseInt(units.value, 10);
        validateField(units, unitsError, !isNaN(unitsVal) && unitsVal >= 1 && unitsVal <= 50);

        // 7. Urgency Level
        const urgency = document.getElementById('requestUrgency');
        const urgencyError = document.getElementById('requestUrgencyError');
        validateField(urgency, urgencyError, urgency.value !== '');

        // 8. Hospital / Care Facility
        const hospital = document.getElementById('hospitalName');
        const hospitalError = document.getElementById('hospitalNameError');
        validateField(hospital, hospitalError, hospital.value.trim().length >= 2);

        // 9. City / Location
        const city = document.getElementById('requestCity');
        const cityError = document.getElementById('requestCityError');
        validateField(city, cityError, city.value.trim().length >= 2);

        // 10. Required Date (Cannot be past date)
        const reqDate = document.getElementById('requiredDate');
        const reqDateError = document.getElementById('requiredDateError');
        let isDateValid = false;
        if (reqDate.value) {
            const selectedDate = new Date(reqDate.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            isDateValid = !isNaN(selectedDate.getTime()) && selectedDate >= today;
        }
        validateField(reqDate, reqDateError, isDateValid);

        // Focus first invalid element for accessibility
        if (!isValid) {
            if (firstInvalidField) firstInvalidField.focus();
            return;
        }

        // Render Summary Preview
        requestSummaryGrid.innerHTML = `
            <div class="summary-item">
                <span class="summary-item-label">Requester</span>
                <span class="summary-item-value">${escapeHtml(name.value.trim())} (${escapeHtml(phone.value.trim())})</span>
            </div>
            <div class="summary-item">
                <span class="summary-item-label">Requirement</span>
                <span class="summary-item-value" style="color: var(--primary); font-weight:800;">${escapeHtml(bloodGroup.value)} • ${escapeHtml(component.value)} (${escapeHtml(units.value)} Units)</span>
            </div>
            <div class="summary-item">
                <span class="summary-item-label">Hospital Location</span>
                <span class="summary-item-value">${escapeHtml(hospital.value.trim())}, ${escapeHtml(city.value.trim())}</span>
            </div>
            <div class="summary-item">
                <span class="summary-item-label">Urgency & Required Date</span>
                <span class="summary-item-value">${escapeHtml(urgency.value)} (By ${escapeHtml(reqDate.value)})</span>
            </div>
        `;

        // Switch to Confirmation view
        requestFormCard.style.display = 'none';
        requestSuccessCard.classList.add('active');
        requestSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            requestForm.reset();
            const inputs = requestForm.querySelectorAll('.form-control');
            inputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));
            const errorMsgs = requestForm.querySelectorAll('.field-error-msg');
            errorMsgs.forEach(msg => msg.classList.remove('visible'));

            requestSuccessCard.classList.remove('active');
            requestFormCard.style.display = 'block';
            requestFormCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}

/**
 * Utility: HTML Sanitizer for safe client rendering
 */
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
