// About Us Page - JS: site interactions

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

// Smooth scroll for CTA buttons
document.querySelectorAll('.btn').forEach(btn=>{
	btn.addEventListener('click', (e)=>{
		const href = btn.getAttribute('href');
		if(href && href.startsWith('#')){
			e.preventDefault();
			const target = document.querySelector(href);
			if(target){
				target.scrollIntoView({behavior:'smooth',block:'start'});
			} else {
				if(href === '#') window.scrollTo({top:0,behavior:'smooth'});
			}
		}
	})
});

// Accessibility: hide nav on resize if moving to desktop
window.addEventListener('resize', ()=>{
	if(window.innerWidth > 860 && mainNav){
		mainNav.style.display = 'flex';
	}
});

// Scroll animations for elements
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

// Observe feature cards for animations
document.querySelectorAll('.feature-card, .team-member, .faq-item, .stat').forEach(element => {
	element.style.opacity = '0';
	element.style.transform = 'translateY(20px)';
	element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
	observer.observe(element);
});

// Newsletter form submission
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

// FAQ item interaction - optional expand/collapse
document.querySelectorAll('.faq-item').forEach(item => {
	item.addEventListener('click', function(){
		this.style.backgroundColor = this.style.backgroundColor === 'rgb(248, 251, 255)' ? 'rgba(47, 128, 237, 0.05)' : 'rgb(248, 251, 255)';
	});
});

// Page load animation
window.addEventListener('load', () => {
	document.body.style.animation = 'fadeIn 0.6s ease-in';
});

// Add fade in animation
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
