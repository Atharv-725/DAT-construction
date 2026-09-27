// ============================================================
// DAT CONSTRUCTION — OFFICIAL CORPORATE PORTAL SCRIPT
// Verified Contact Settings & Multi-Page Portal Logic
// ============================================================

const COMPANY = {
  phoneDisplay: "+91 99999 99999",
  phoneDial: "+919999999999",
  email: "info@datconstruction.in"
};

// Populate Official Contact Details & Active Nav Link across the DOM
document.addEventListener("DOMContentLoaded", () => {
  // Highlight active page link based on URL
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // Top bar phone
  const topPhoneText = document.getElementById("topPhoneText");
  const topPhone = document.getElementById("topPhone");
  if (topPhoneText && topPhone) {
    topPhoneText.textContent = COMPANY.phoneDisplay;
    topPhone.href = "tel:" + COMPANY.phoneDial;
  }

  // Contact section phone & email
  const phoneText = document.getElementById("phoneText");
  const phoneLink = document.getElementById("phoneLink");
  if (phoneText && phoneLink) {
    phoneText.textContent = COMPANY.phoneDisplay;
    phoneLink.href = "tel:" + COMPANY.phoneDial;
  }

  const emailText = document.getElementById("emailText");
  const emailLink = document.getElementById("emailLink");
  if (emailText && emailLink) {
    emailText.textContent = COMPANY.email;
    emailLink.href = "mailto:" + COMPANY.email;
  }

  // Footer Year
  const yearElem = document.getElementById("year");
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // Navbar Sticky Shadow
  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 10);
    }
  });

  // Mobile Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // Close Mobile Menu on Nav Link Click
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      if (nav) nav.classList.remove("open");
    });
  });

  // Project Category Tab Filtering (for projects.html or project sections)
  const tabBtns = document.querySelectorAll(".tab-btn");
  const projectCards = document.querySelectorAll(".project-card");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach(card => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // RFP Form Submission Handler
  const quoteForm = document.getElementById("quoteForm");
  const formStatus = document.getElementById("formStatus");

  if (quoteForm) {
    quoteForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = new FormData(quoteForm);
      const org = form.get("orgName") || "N/A";
      const name = form.get("name");
      const phone = form.get("phone");
      const email = form.get("email");
      const scope = form.get("scope");
      const message = form.get("message");

      if (!name || !phone || !email || !message) {
        if (formStatus) {
          formStatus.style.color = "#DC2626";
          formStatus.textContent = "Please fill in all required fields marked with *.";
        }
        return;
      }

      const subject = encodeURIComponent(`Formal RFP / Tender Enquiry — DAT Construction (${org})`);
      const body = encodeURIComponent(
`DAT CONSTRUCTION - OFFICIAL FORMAL TENDER / RFP ENQUIRY
========================================================

Organization Name: ${org}
Contact Person: ${name}
Phone Number: ${phone}
Official Email: ${email}
Primary Scope of Work: ${scope}

PROJECT DETAILS / TECHNICAL SPECIFICATIONS:
-------------------------------------------
${message}

Sent via DAT Construction Official Enterprise Portal.`
      );

      window.location.href = `mailto:${COMPANY.email}?subject=${subject}&body=${body}`;

      if (formStatus) {
        formStatus.style.color = "#15803D";
        formStatus.textContent = "Formal RFP mail payload generated! Please press 'Send' in your mail application.";
      }
    });
  }
});
