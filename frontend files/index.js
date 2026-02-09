// JS: site interactions

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
				// for top anchors, scroll to top
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
