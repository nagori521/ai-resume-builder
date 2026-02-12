// Templates Page - JavaScript

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

function initNav() {
	if (window.innerWidth <= 860) {
		if (mainNav && !mainNav.classList.contains('active')) {
			mainNav.classList.remove('active');
		}
	}
}

if(navToggle){
	navToggle.addEventListener('click', (e)=>{
		e.stopPropagation();
		if (window.innerWidth <= 860) {
			mainNav.classList.toggle('active');
		}
	});
}

// Close nav on link click (mobile)
if(mainNav){
	document.querySelectorAll('.main-nav a').forEach(a=>{
		a.addEventListener('click', ()=>{
			if(window.innerWidth <= 860){
				mainNav.classList.remove('active');
			}
		})
	});
}

// Close nav when clicking outside (mobile)
document.addEventListener('click', (e)=>{
	if(mainNav && window.innerWidth <= 860){
		if(!mainNav.contains(e.target) && !navToggle.contains(e.target)){
			mainNav.classList.remove('active');
		}
	}
});

// Initialize on load and handle window resize
window.addEventListener('load', initNav);
window.addEventListener('resize', ()=>{
	if(window.innerWidth > 860 && mainNav){
		mainNav.classList.remove('active');
	}
	initNav();
});

// ===== Carousel Functionality =====
const carousel = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');

let currentSlide = 0;

function showSlide(index) {
	if (index >= slides.length) {
		currentSlide = 0;
	} else if (index < 0) {
		currentSlide = slides.length - 1;
	}

	const offset = currentSlide * -100;
	carousel.style.transform = `translateX(${offset}%)`;

	// Update dots
	dots.forEach(dot => dot.classList.remove('active'));
	dots[currentSlide].classList.add('active');
}

// Carousel navigation
prevBtn.addEventListener('click', () => {
	currentSlide--;
	showSlide(currentSlide);
});

nextBtn.addEventListener('click', () => {
	currentSlide++;
	showSlide(currentSlide);
});

// Dot navigation
dots.forEach((dot, index) => {
	dot.addEventListener('click', () => {
		currentSlide = index;
		showSlide(currentSlide);
	});
});

// Auto-advance carousel every 8 seconds
setInterval(() => {
	currentSlide++;
	showSlide(currentSlide);
}, 8000);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
	if (e.key === 'ArrowLeft') {
		currentSlide--;
		showSlide(currentSlide);
	} else if (e.key === 'ArrowRight') {
		currentSlide++;
		showSlide(currentSlide);
	}
});

// ===== Template Selection Functionality =====
const templateBtns = document.querySelectorAll('.template-btn');

// Navigate to template selection when button is clicked
templateBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		// Get template ID from closest template-card parent
		const templateCard = btn.closest('.template-card');
		const templateId = templateCard.getAttribute('data-template-id');
		
		// Format template ID for URL (e.g., 'modern', 'creative-plus', etc.)
		const templateName = templateId.toLowerCase();
		
		// Redirect to template selection page with template parameter
		window.location.href = `template-selection.html?template=${templateName}`;
	});
});

// ===== Newsletter Form =====
const newsletterForms = document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(form => {
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const input = form.querySelector('input[type="email"]');
		if(input.value){
			alert('Thank you for subscribing! Check your email for confirmation.');
			input.value = '';
		}
	});
});

// ===== Smooth Scroll for CTA buttons =====
document.querySelectorAll('.btn').forEach(btn => {
	btn.addEventListener('click', (e) => {
		const href = btn.getAttribute('href');
		if(href && href.startsWith('#')){
			e.preventDefault();
			const target = document.querySelector(href);
			if(target){
				target.scrollIntoView({behavior:'smooth',block:'start'});
			}
		}
	})
});

// ===== Accessibility: hide nav on resize =====
window.addEventListener('resize', () => {
	if(window.innerWidth > 860 && mainNav){
		mainNav.style.display = 'flex';
	}
});

// ===== Animation on scroll =====
const observerOptions = {
	threshold: 0.1,
	rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if(entry.isIntersecting){
			entry.target.style.opacity = '1';
			entry.target.style.transform = 'translateY(0)';
		}
	});
}, observerOptions);

// Observe template cards for animations
document.querySelectorAll('.template-card').forEach(card => {
	card.style.opacity = '0';
	card.style.transform = 'translateY(20px)';
	card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
	observer.observe(card);
});

// Page load animation
window.addEventListener('load', () => {
	document.body.style.animation = 'fadeIn 0.6s ease-in';
});

// Add fade in animation if not already present
const style = document.createElement('style');
style.textContent = `
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`;
document.head.appendChild(style);

// ===== Template Card Click Animation =====
document.querySelectorAll('.template-card').forEach(card => {
	card.addEventListener('mouseenter', function() {
		this.style.transition = 'all 0.3s ease';
	});
});

// ===== Template Filter and Search Functionality =====
const templateSearch = document.getElementById('templateSearch');
const filterBtns = document.querySelectorAll('.filter-btn');
const templateCards = document.querySelectorAll('.template-card');

let currentCategory = 'all';
let currentSearchTerm = '';

function filterTemplates() {
	templateCards.forEach(card => {
		const cardCategory = card.getAttribute('data-category');
		const cardTitle = card.querySelector('h3').textContent.toLowerCase();
		const cardDesc = card.querySelector('p').textContent.toLowerCase();
		const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();
		
		const searchText = cardTitle + ' ' + cardDesc + ' ' + cardKeywords;
		const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
		const matchesSearch = searchText.includes(currentSearchTerm);
		
		if (matchesCategory && matchesSearch) {
			card.classList.remove('hidden');
		} else {
			card.classList.add('hidden');
		}
	});
}

// Search functionality
if (templateSearch) {
	templateSearch.addEventListener('input', (e) => {
		currentSearchTerm = e.target.value.toLowerCase().trim();
		filterTemplates();
	});
}

// Filter button functionality
filterBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		// Update active state
		filterBtns.forEach(b => {
			b.classList.remove('active');
			b.setAttribute('aria-pressed', 'false');
		});
		btn.classList.add('active');
		btn.setAttribute('aria-pressed', 'true');
		
		// Update filter
		currentCategory = btn.getAttribute('data-filter');
		filterTemplates();
	});
});
// ===== End Template Filter Functionality =====

// ===== Template Card Click Animation =====
document.querySelectorAll('.template-card').forEach(card => {
	card.addEventListener('mouseenter', function() {
		this.style.transition = 'all 0.3s ease';
	});
});

// ===== Carousel Touch Support =====
let touchStartX = 0;
let touchEndX = 0;

const carouselContainer = document.querySelector('.carousel-container');

carouselContainer.addEventListener('touchstart', (e) => {
	touchStartX = e.changedTouches[0].screenX;
}, false);

carouselContainer.addEventListener('touchend', (e) => {
	touchEndX = e.changedTouches[0].screenX;
	handleSwipe();
}, false);

function handleSwipe() {
	if (touchEndX < touchStartX - 50) {
		// Swiped left - next slide
		currentSlide++;
		showSlide(currentSlide);
	}
	if (touchEndX > touchStartX + 50) {
		// Swiped right - previous slide
		currentSlide--;
		showSlide(currentSlide);
	}
}

// ==================== Save Resume ====================
// async function saveResume(){
// 	const resumeData = JSON.parse(localStorage.getItem("resumeData"));

// 	const response = await fetch("http://127.0.0.1:5000/save-resume", {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json"
// 		},
// 		body: JSON.stringify(resumeData)
// 	});

// 	alert("Resume Saved Successfully");
// }

// console.log('Templates page loaded successfully');


async function saveResume(){

	const resumeData = JSON.parse(localStorage.getItem("resumeData"));

	const user_id = localStorage.getItem("user_id");

	const response = await fetch("http://127.0.0.1:5000/save-resume", {

		method: "POST",

		headers: {
			"Content-Type": "application/json"
		},

		body: JSON.stringify({
			user_id: user_id,
			...resumeData
		})
	});

	alert("Resume Saved Successfully");

}
