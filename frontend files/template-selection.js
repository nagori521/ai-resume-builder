/* ==================== Template Selection Logic ==================== */

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

function initNav() {
    if (window.innerWidth <= 860) {
        if (mainNav && !mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
        }
    }
}

if (navToggle) {
    navToggle.addEventListener('click', (e) => {
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
window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && mainNav) {
        mainNav.classList.remove('active');
    }
    initNav();
});

/* ==================== Get Template from URL ==================== */
function getTemplateFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('template') || 'modern';
}

/* ==================== Select Template Function ==================== */
// function selectTemplate(template) {
//     localStorage.setItem("selectedTemplate", template);
//     window.location.href = "resume-editor.html";
// }

function selectTemplate(template) {

    localStorage.setItem("selectedTemplate", template);

    window.location.href = `resume-editor.html?template=${template}&mode=build`;

}

/* ==================== Set Template Data ==================== */
const selectedTemplate = getTemplateFromURL();

const buildBtn = document.getElementById('buildBtn');
const reshapeBtn = document.getElementById('reshapeBtn');

if (buildBtn) {
    buildBtn.setAttribute('data-template', selectedTemplate);
    buildBtn.addEventListener('click', () => {
        const template = buildBtn.getAttribute('data-template');
        selectTemplate(template);
    });
}

if (reshapeBtn) {
    reshapeBtn.setAttribute('data-template', selectedTemplate);
    reshapeBtn.addEventListener('click', () => {
        const template = reshapeBtn.getAttribute('data-template');
        selectTemplate(template);
    });
}

/* ==================== Smooth Scroll for Links ==================== */
const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
