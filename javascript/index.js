"use strict";

// ── Initialise EmailJS ──────────────────────────
(function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init("7VrEpQR2MPSnskGUl");
  }
})();

// ── DOM Ready ───────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  /* ── Set current year in footer ── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 
     NAVIGATION
   */
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const navAnchors = document.querySelectorAll(".nav-link");

  // Scroll: add .scrolled class to navbar
  function onNavScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onNavScroll, { passive: true });
  onNavScroll(); // run once on load

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close mobile nav when a link is clicked
    navAnchors.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    // Close if clicking outside the nav
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  // Active nav link on scroll (IntersectionObserver)
  const sections = document.querySelectorAll("section[id]");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navAnchors.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`,
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  sections.forEach((s) => sectionObserver.observe(s));

  /* 
     SMOOTH SCROLL
 */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 70;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* 
     BACK TO TOP
  */
  const backToTopBtn = document.getElementById("backToTop");

  if (backToTopBtn) {
    window.addEventListener(
      "scroll",
      () => {
        backToTopBtn.classList.toggle("show", window.pageYOffset > 400);
      },
      { passive: true },
    );

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /*
     SCROLL REVEAL ANIMATIONS
   */
  const revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    revealEls.forEach((el, i) => {
      // Stagger siblings by small delay
      el.style.transitionDelay = `${(i % 6) * 0.08}s`;
      revealObserver.observe(el);
    });
  }

  /* 
     CONTACT FORM (EmailJS)
  */
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Field validation
      const nameField = contactForm.querySelector("#name");
      const emailField = contactForm.querySelector("#email");
      const messageField = contactForm.querySelector("#message");

      const name = nameField ? nameField.value.trim() : "";
      const email = emailField ? emailField.value.trim() : "";
      const message = messageField ? messageField.value.trim() : "";

      // Check all required fields are filled
      if (!name || !email || !message) {
        showFormMessage(
          contactForm,
          "error",
          "Please fill in all required fields.",
        );
        return;
      }

      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showFormMessage(
          contactForm,
          "error",
          "Please enter a valid email address.",
        );
        return;
      }
      //

      if (typeof emailjs === "undefined") {
        showFormMessage(
          contactForm,
          "error",
          "Email service is not available. Please email me directly at chidoziev742@gmail.com",
        );
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;

      // Loading state
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending…';
      submitBtn.disabled = true;

      emailjs
        .sendForm("service_69o4g2j", "template_u7lfacl", contactForm)
        .then(() => {
          showFormMessage(
            contactForm,
            "success",
            "✓ Message sent! I'll get back to you soon.",
          );
          contactForm.reset();
        })
        .catch((err) => {
          console.error("EmailJS error:", err);
          showFormMessage(
            contactForm,
            "error",
            "✗ Something went wrong. Please try again or email me directly.",
          );
        })
        .finally(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
        });
    });
  }

  function showFormMessage(form, type, message) {
    // Remove any existing message
    const existing = form.querySelector(".form-message");
    if (existing) existing.remove();

    const msg = document.createElement("p");
    msg.className = `form-message form-message--${type}`;
    msg.textContent = message;
    msg.style.cssText = `
      margin-top: 14px;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: var(--font-heading);
      font-weight: 500;
      background: ${type === "success" ? "rgba(124,255,107,0.1)" : "rgba(255,100,100,0.1)"};
      color: ${type === "success" ? "#7CFF6B" : "#ff8080"};
      border: 1px solid ${type === "success" ? "rgba(124,255,107,0.3)" : "rgba(255,100,100,0.3)"};
    `;
    form.appendChild(msg);

    setTimeout(() => msg.remove(), 6000);
  }
});
