// ============================================================
// DAT CONSTRUCTION — ENQUIRY FORM & VALIDATION MODULE
// Provider-agnostic form submission with honeypot, time-to-submit,
// strict WCAG aria validation, and fallback handling.
// ============================================================

export interface FormConfig {
  endpoint?: string;
  accessKey?: string;
  phoneFallback?: string;
  whatsappFallback?: string;
}

export function initEnquiryForm(config: FormConfig = {}) {
  const form = document.getElementById('enquiryForm') as HTMLFormElement | null;
  if (!form) return;

  const pageLoadTime = Date.now();
  const endpoint = config.endpoint || import.meta.env.PUBLIC_FORM_ENDPOINT || '/api/quote';
  const accessKey = config.accessKey || import.meta.env.PUBLIC_FORM_KEY || '';

  const nameInput = document.getElementById('name') as HTMLInputElement | null;
  const phoneInput = document.getElementById('phone') as HTMLInputElement | null;
  const emailInput = document.getElementById('email') as HTMLInputElement | null;
  const messageInput = document.getElementById('message') as HTMLTextAreaElement | null;
  const hpInput = document.getElementById('website_hp') as HTMLInputElement | null;
  const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement | null;
  const formStatus = document.getElementById('formStatus') as HTMLElement | null;

  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // Clear all error states
  function clearErrors() {
    [nameInput, phoneInput, emailInput, messageInput].forEach(input => {
      if (input) {
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
      }
    });

    [nameError, phoneError, emailError, messageError].forEach(err => {
      if (err) err.textContent = '';
    });

    if (formStatus) {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }
  }

  // Show error for a specific field
  function setError(input: HTMLElement | null, errorElem: HTMLElement | null, message: string) {
    if (input) {
      input.setAttribute('aria-invalid', 'true');
      if (errorElem) {
        input.setAttribute('aria-describedby', errorElem.id);
      }
    }
    if (errorElem) {
      errorElem.textContent = message;
    }
  }

  // Validation RegExes
  const indianPhoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    // 1. Honeypot Bot Check
    if (hpInput && hpInput.value.trim() !== '') {
      if (formStatus) {
        formStatus.style.color = '#DC2626';
        formStatus.textContent = 'Submission rejected. Anti-spam triggered.';
      }
      return;
    }

    // 2. Minimum Time-to-Submit Check (3 seconds)
    const timeElapsed = (Date.now() - pageLoadTime) / 1000;
    if (timeElapsed < 3) {
      if (formStatus) {
        formStatus.style.color = '#DC2626';
        formStatus.textContent = 'Form submitted too quickly. Please try again.';
      }
      return;
    }

    // 3. Field Validation
    let isValid = true;

    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal || nameVal.length < 2) {
      setError(nameInput, nameError, 'Please enter your full name (at least 2 characters).');
      isValid = false;
    }

    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    if (!phoneVal || !indianPhoneRegex.test(phoneVal.replace(/\s+/g, ''))) {
      setError(phoneInput, phoneError, 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      isValid = false;
    }

    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (!emailVal || !emailRegex.test(emailVal)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      isValid = false;
    }

    const messageVal = messageInput ? messageInput.value.trim() : '';
    if (!messageVal || messageVal.length < 10) {
      setError(messageInput, messageError, 'Please enter your project details (at least 10 characters).');
      isValid = false;
    }

    if (!isValid) return;

    // 4. Loading State
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting Quote Request...';
    }
    if (formStatus) {
      formStatus.style.color = 'var(--text-muted)';
      formStatus.textContent = 'Sending your request...';
    }

    // 5. Submit Payload
    const formData = new FormData(form);
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (key !== 'website_hp') {
        payload[key] = value.toString();
      }
    });

    if (accessKey) {
      payload['access_key'] = accessKey;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json().catch(() => ({}));

      if (response.ok && resData.success !== false) {
        if (formStatus) {
          formStatus.style.color = '#15803D';
          formStatus.textContent = resData.message || 'Thank you! Your quote request has been submitted successfully.';
        }
        form.reset();
      } else {
        throw new Error(resData.error || `Server returned status ${response.status}`);
      }
    } catch (err: any) {
      if (formStatus) {
        formStatus.style.color = '#DC2626';
        formStatus.textContent = err.message || 'Unable to send message via the form at this time.';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Quote Request';
      }
    }
  });
}
