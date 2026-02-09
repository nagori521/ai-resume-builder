// ===== Indian Standard Time (IST) Helper Start =====
// All times on this page use IST (UTC +5:30)
function getISTTime(){
  const istTime = new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'});
  return istTime;
}

// Display current IST time in console (for reference)
console.log('Current IST Time:', getISTTime());
// ===== Indian Standard Time (IST) Helper End =====

// ===== Mobile Navigation Toggle Start =====
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
// ===== Mobile Navigation Toggle End ======

// Accessibility: hide nav on resize if moving to desktop
window.addEventListener('resize', ()=>{
  if(window.innerWidth > 860 && mainNav){
    mainNav.style.display = 'flex';
  }
});
// ===== Mobile Navigation Toggle End =====

// ===== Form Validation Start =====
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const categoryInput = document.getElementById('category');
const messageInput = document.getElementById('message');
const successMsg = document.getElementById('successMsg');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation functions
function validateName(name){
  return name.trim().length >= 2;
}

function validateEmail(email){
  return emailRegex.test(email.trim());
}

function validateSubject(subject){
  return subject.trim().length >= 3;
}

function validateCategory(category){
  return category.trim() !== '';
}

function validateMessage(message){
  return message.trim().length >= 10;
}

// Show error on field
function showError(field, message){
  const errorId = field.id + 'Error';
  const errorEl = document.getElementById(errorId);
  const formGroup = field.closest('.form-group');
  
  if(errorEl){
    errorEl.textContent = message;
  }
  if(formGroup){
    formGroup.classList.add('show-error');
    field.classList.add('error');
  }
}

// Clear error on field
function clearError(field){
  const errorId = field.id + 'Error';
  const errorEl = document.getElementById(errorId);
  const formGroup = field.closest('.form-group');
  
  if(errorEl){
    errorEl.textContent = '';
  }
  if(formGroup){
    formGroup.classList.remove('show-error');
    field.classList.remove('error');
  }
}

// Real-time validation listeners
nameInput.addEventListener('blur', ()=>{
  if(!validateName(nameInput.value)){
    showError(nameInput, 'Name must be at least 2 characters');
  } else {
    clearError(nameInput);
  }
});

emailInput.addEventListener('blur', ()=>{
  if(!validateEmail(emailInput.value)){
    showError(emailInput, 'Please enter a valid email address');
  } else {
    clearError(emailInput);
  }
});

subjectInput.addEventListener('blur', ()=>{
  if(!validateSubject(subjectInput.value)){
    showError(subjectInput, 'Subject must be at least 3 characters');
  } else {
    clearError(subjectInput);
  }
});

categoryInput.addEventListener('change', ()=>{
  if(!validateCategory(categoryInput.value)){
    showError(categoryInput, 'Please select a category');
  } else {
    clearError(categoryInput);
  }
});

messageInput.addEventListener('blur', ()=>{
  if(!validateMessage(messageInput.value)){
    showError(messageInput, 'Message must be at least 10 characters');
  } else {
    clearError(messageInput);
  }
});

// ===== Form Validation End =====

// ===== Form Submission Start =====
contactForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  
  // Hide previous success message
  successMsg.classList.remove('show');
  
  // Validate all fields
  const isNameValid = validateName(nameInput.value);
  const isEmailValid = validateEmail(emailInput.value);
  const isSubjectValid = validateSubject(subjectInput.value);
  const isCategoryValid = validateCategory(categoryInput.value);
  const isMessageValid = validateMessage(messageInput.value);
  
  // Show errors if invalid
  if(!isNameValid) showError(nameInput, 'Name must be at least 2 characters');
  else clearError(nameInput);
  
  if(!isEmailValid) showError(emailInput, 'Please enter a valid email address');
  else clearError(emailInput);
  
  if(!isSubjectValid) showError(subjectInput, 'Subject must be at least 3 characters');
  else clearError(subjectInput);
  
  if(!isCategoryValid) showError(categoryInput, 'Please select a category');
  else clearError(categoryInput);
  
  if(!isMessageValid) showError(messageInput, 'Message must be at least 10 characters');
  else clearError(messageInput);
  
  // If all valid, submit
  if(isNameValid && isEmailValid && isSubjectValid && isCategoryValid && isMessageValid){
    // Prepare form data
    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput.value.trim(),
      category: categoryInput.value,
      message: messageInput.value.trim(),
      subscribe: document.getElementById('subscribe').checked,
      timestamp: new Date().toISOString()
    };
    
    // Log form data (in real app, send to server)
    console.log('Form submitted:', formData);
    
    // Show success message
    successMsg.classList.add('show');
    
    // Reset form
    contactForm.reset();
    
    // Scroll to success message
    successMsg.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    
    // Hide success message after 5 seconds
    setTimeout(()=>{
      successMsg.classList.remove('show');
    }, 5000);
  } else {
    // Scroll to first error
    const firstErrorField = nameInput.classList.contains('error') ? nameInput :
                            emailInput.classList.contains('error') ? emailInput :
                            subjectInput.classList.contains('error') ? subjectInput :
                            categoryInput.classList.contains('error') ? categoryInput :
                            messageInput;
    
    if(firstErrorField){
      firstErrorField.scrollIntoView({behavior: 'smooth', block: 'center'});
      firstErrorField.focus();
    }
  }
});
// ===== Form Submission End =====

// ===== Form Reset Start =====
const resetBtn = document.querySelector('.contact-form button[type="reset"]');
if(resetBtn){
  resetBtn.addEventListener('click', ()=>{
    // Clear all error messages
    [nameInput, emailInput, subjectInput, categoryInput, messageInput].forEach(field=>{
      clearError(field);
    });
    successMsg.classList.remove('show');
  });
}
// ===== Form Reset End =====

// ===== Clearing Errors on Input Start =====
[nameInput, emailInput, subjectInput, categoryInput, messageInput].forEach(field=>{
  field.addEventListener('input', ()=>{
    if(field.classList.contains('error')){
      clearError(field);
    }
  });
});
// ===== Clearing Errors on Input End =====
