/* ==================== Resume Editor - Main Script ==================== */

// ==================== Global Variables ====================
let resumeData = {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    professionalTitle: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: []
};

let selectedTemplate = 'modern';
let selectedMode = 'build';

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeEditor();
    loadFromLocalStorage();
    updateLivePreview();
});

function initializeEditor() {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    selectedTemplate = params.get('template') || 'modern';
    selectedMode = params.get('mode') || 'build';

    // Update header info
    document.getElementById('modeInfo').textContent = selectedMode === 'build' ? 'Build New Resume' : 'Reshape Existing Resume';
    document.getElementById('templateInfo').textContent = formatTemplateName(selectedTemplate) + ' Template';
    document.querySelector('.preview-template').textContent = formatTemplateName(selectedTemplate);

    // Show/hide import section based on mode
    const importSection = document.getElementById('importSection');
    if (selectedMode === 'reshape') {
        importSection.style.display = 'block';
    }

    // Setup event listeners
    setupFormListeners();
    setupDynamicListeners();
    setupActionButtons();
}

function formatTemplateName(template) {
    return template.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// ==================== Form Listeners ====================
function setupFormListeners() {
    const formInputs = document.querySelectorAll(
        '#fullName, #email, #phone, #location, #website, #professionalTitle, #summary'
    );

    formInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const field = e.target.id;
            resumeData[field] = e.target.value;
            updateLivePreview();
            autoSaveData();
        });

        input.addEventListener('blur', autoSaveData);
    });
}

function setupDynamicListeners() {
    document.getElementById('addExperienceBtn').addEventListener('click', () => addExperience());
    document.getElementById('addEducationBtn').addEventListener('click', () => addEducation());
    document.getElementById('addSkillBtn').addEventListener('click', () => addSkill());
    document.getElementById('addCertificationBtn').addEventListener('click', () => addCertification());
}

function setupActionButtons() {
    document.getElementById('saveBtn').addEventListener('click', saveResume);
    document.getElementById('downloadBtn').addEventListener('click', downloadResumePDF);
    document.getElementById('finalSaveBtn').addEventListener('click', saveResume);
    
    if (selectedMode === 'reshape') {
        document.getElementById('importBtn').addEventListener('click', importContent);
    }
}

// ==================== Dynamic List Management ====================
function addExperience() {
    const newExperience = {
        id: Date.now(),
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        description: ''
    };
    resumeData.experience.push(newExperience);
    renderExperienceList();
    updateLivePreview();
}

function addEducation() {
    const newEducation = {
        id: Date.now(),
        degree: '',
        institution: '',
        graduationYear: '',
        details: ''
    };
    resumeData.education.push(newEducation);
    renderEducationList();
    updateLivePreview();
}

function addSkill() {
    const newSkill = {
        id: Date.now(),
        skillName: ''
    };
    resumeData.skills.push(newSkill);
    renderSkillsList();
    updateLivePreview();
}

function addCertification() {
    const newCertification = {
        id: Date.now(),
        certName: '',
        issuer: '',
        year: ''
    };
    resumeData.certifications.push(newCertification);
    renderCertificationList();
    updateLivePreview();
}

function removeExperience(id) {
    resumeData.experience = resumeData.experience.filter(exp => exp.id !== id);
    renderExperienceList();
    updateLivePreview();
    autoSaveData();
}

function removeEducation(id) {
    resumeData.education = resumeData.education.filter(edu => edu.id !== id);
    renderEducationList();
    updateLivePreview();
    autoSaveData();
}

function removeSkill(id) {
    resumeData.skills = resumeData.skills.filter(skill => skill.id !== id);
    renderSkillsList();
    updateLivePreview();
    autoSaveData();
}

function removeCertification(id) {
    resumeData.certifications = resumeData.certifications.filter(cert => cert.id !== id);
    renderCertificationList();
    updateLivePreview();
    autoSaveData();
}

function updateExperience(id, field, value) {
    const experience = resumeData.experience.find(exp => exp.id === id);
    if (experience) {
        experience[field] = value;
        updateLivePreview();
        autoSaveData();
    }
}

function updateEducation(id, field, value) {
    const education = resumeData.education.find(edu => edu.id === id);
    if (education) {
        education[field] = value;
        updateLivePreview();
        autoSaveData();
    }
}

function updateSkill(id, field, value) {
    const skill = resumeData.skills.find(s => s.id === id);
    if (skill) {
        skill[field] = value;
        updateLivePreview();
        autoSaveData();
    }
}

function updateCertification(id, field, value) {
    const cert = resumeData.certifications.find(c => c.id === id);
    if (cert) {
        cert[field] = value;
        updateLivePreview();
        autoSaveData();
    }
}

// ==================== Render Functions ====================
function renderExperienceList() {
    const list = document.getElementById('experienceList');
    list.innerHTML = '';

    resumeData.experience.forEach(exp => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-header">
                <div>
                    <div class="list-item-title">${exp.jobTitle || 'Job Title'}</div>
                    <div class="list-item-subtitle">${exp.company || 'Company'}</div>
                </div>
                <button type="button" class="btn-remove" onclick="removeExperience(${exp.id})">×</button>
            </div>
            <div class="list-item-form">
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" value="${exp.jobTitle}" onchange="updateExperience(${exp.id}, 'jobTitle', this.value)" onblur="autoSaveData()">
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" value="${exp.company}" onchange="updateExperience(${exp.id}, 'company', this.value)" onblur="autoSaveData()">
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="month" value="${exp.startDate}" onchange="updateExperience(${exp.id}, 'startDate', this.value)" onblur="autoSaveData()">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="month" value="${exp.endDate}" onchange="updateExperience(${exp.id}, 'endDate', this.value)" onblur="autoSaveData()">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea onchange="updateExperience(${exp.id}, 'description', this.value)" onblur="autoSaveData()">${exp.description}</textarea>
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

function renderEducationList() {
    const list = document.getElementById('educationList');
    list.innerHTML = '';

    resumeData.education.forEach(edu => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-header">
                <div>
                    <div class="list-item-title">${edu.degree || 'Degree'}</div>
                    <div class="list-item-subtitle">${edu.institution || 'Institution'}</div>
                </div>
                <button type="button" class="btn-remove" onclick="removeEducation(${edu.id})">×</button>
            </div>
            <div class="list-item-form">
                <div class="form-group">
                    <label>Degree</label>
                    <input type="text" value="${edu.degree}" onchange="updateEducation(${edu.id}, 'degree', this.value)" onblur="autoSaveData()">
                </div>
                <div class="form-group">
                    <label>Institution</label>
                    <input type="text" value="${edu.institution}" onchange="updateEducation(${edu.id}, 'institution', this.value)" onblur="autoSaveData()">
                </div>
                <div class="form-group">
                    <label>Graduation Year</label>
                    <input type="text" value="${edu.graduationYear}" onchange="updateEducation(${edu.id}, 'graduationYear', this.value)" onblur="autoSaveData()">
                </div>
                <div class="form-group">
                    <label>Details</label>
                    <textarea onchange="updateEducation(${edu.id}, 'details', this.value)" onblur="autoSaveData()">${edu.details}</textarea>
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

function renderSkillsList() {
    const list = document.getElementById('skillsList');
    list.innerHTML = '';

    resumeData.skills.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-header">
                <div class="list-item-title">${skill.skillName || 'Add Skill'}</div>
                <button type="button" class="btn-remove" onclick="removeSkill(${skill.id})">×</button>
            </div>
            <div class="form-group">
                <input type="text" value="${skill.skillName}" onchange="updateSkill(${skill.id}, 'skillName', this.value)" onblur="autoSaveData()" placeholder="e.g., JavaScript, Project Management">
            </div>
        `;
        list.appendChild(item);
    });
}

function renderCertificationList() {
    const list = document.getElementById('certificationList');
    list.innerHTML = '';

    resumeData.certifications.forEach(cert => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-header">
                <div>
                    <div class="list-item-title">${cert.certName || 'Certification'}</div>
                    <div class="list-item-subtitle">${cert.issuer || 'Issuer'}</div>
                </div>
                <button type="button" class="btn-remove" onclick="removeCertification(${cert.id})">×</button>
            </div>
            <div class="list-item-form">
                <div class="form-group">
                    <label>Certification Name</label>
                    <input type="text" value="${cert.certName}" onchange="updateCertification(${cert.id}, 'certName', this.value)" onblur="autoSaveData()">
                </div>
                <div class="form-group">
                    <label>Issuing Organization</label>
                    <input type="text" value="${cert.issuer}" onchange="updateCertification(${cert.id}, 'issuer', this.value)" onblur="autoSaveData()">
                </div>
                <div class="form-group">
                    <label>Year</label>
                    <input type="text" value="${cert.year}" onchange="updateCertification(${cert.id}, 'year', this.value)" onblur="autoSaveData()">
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

// ==================== Live Preview ====================
function updateLivePreview() {
    const preview = document.getElementById('resumePreview');
    const contactInfo = [];

    if (resumeData.email) contactInfo.push(resumeData.email);
    if (resumeData.phone) contactInfo.push(resumeData.phone);
    if (resumeData.location) contactInfo.push(resumeData.location);
    if (resumeData.website) contactInfo.push(`<a href="${resumeData.website}" target="_blank">${resumeData.website}</a>`);

    let html = `
        <div class="resume-content">
            <h1>${resumeData.fullName || 'Your Name'}</h1>
            ${resumeData.professionalTitle ? `<div style="font-size: 13px; font-weight: 600; color: #2f80ed; margin-bottom: 8px;">${resumeData.professionalTitle}</div>` : ''}
            ${contactInfo.length > 0 ? `<div class="contact-info"><span>${contactInfo.join('</span><span>')}</span></div>` : ''}
    `;

    if (resumeData.summary) {
        html += `
            <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="summary">${escapeHtml(resumeData.summary)}</div>
            </div>
        `;
    }

    if (resumeData.experience.length > 0) {
        html += `<div class="section"><div class="section-title">Experience</div>`;
        resumeData.experience.forEach(exp => {
            if (exp.jobTitle || exp.company) {
                html += `
                    <div class="entry">
                        <div class="entry-title">${exp.jobTitle || ''}</div>
                        <div class="entry-subtitle">${exp.company || ''} ${exp.startDate || exp.endDate ? `(${exp.startDate || ''} - ${exp.endDate || 'Present'})` : ''}</div>
                        ${exp.description ? `<div class="entry-description">${escapeHtml(exp.description)}</div>` : ''}
                    </div>
                `;
            }
        });
        html += `</div>`;
    }

    if (resumeData.education.length > 0) {
        html += `<div class="section"><div class="section-title">Education</div>`;
        resumeData.education.forEach(edu => {
            if (edu.degree || edu.institution) {
                html += `
                    <div class="entry">
                        <div class="entry-title">${edu.degree || ''}</div>
                        <div class="entry-subtitle">${edu.institution || ''} ${edu.graduationYear ? `(${edu.graduationYear})` : ''}</div>
                        ${edu.details ? `<div class="entry-description">${escapeHtml(edu.details)}</div>` : ''}
                    </div>
                `;
            }
        });
        html += `</div>`;
    }

    if (resumeData.skills.length > 0) {
        html += `<div class="section"><div class="section-title">Skills</div><div class="skills-list">`;
        resumeData.skills.forEach(skill => {
            if (skill.skillName) {
                html += `<div class="skill-tag">${escapeHtml(skill.skillName)}</div>`;
            }
        });
        html += `</div></div>`;
    }

    if (resumeData.certifications.length > 0) {
        html += `<div class="section"><div class="section-title">Certifications</div>`;
        resumeData.certifications.forEach(cert => {
            if (cert.certName || cert.issuer) {
                html += `
                    <div class="entry">
                        <div class="entry-title">${cert.certName || ''}</div>
                        <div class="entry-subtitle">${cert.issuer || ''} ${cert.year ? `(${cert.year})` : ''}</div>
                    </div>
                `;
            }
        });
        html += `</div>`;
    }

    html += `</div>`;
    preview.innerHTML = html;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ==================== Local Storage ====================
function autoSaveData() {
    saveToLocalStorage();
}

function saveResume() {
    if (!resumeData.fullName || !resumeData.email) {
        alert('Please fill in at least Name and Email fields');
        return;
    }
    saveToLocalStorage();
    showSuccessMessage('Resume saved successfully! You can now download it as PDF.');
}

function saveToLocalStorage() {
    const storageKey = `resume_${selectedTemplate}_${selectedMode}`;
    localStorage.setItem(storageKey, JSON.stringify(resumeData));
    localStorage.setItem('currentTemplate', selectedTemplate);
    localStorage.setItem('currentMode', selectedMode);
}

function loadFromLocalStorage() {
    const storageKey = `resume_${selectedTemplate}_${selectedMode}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
        try {
            resumeData = JSON.parse(saved);
            populateFormFields();
            renderExperienceList();
            renderEducationList();
            renderSkillsList();
            renderCertificationList();
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

function populateFormFields() {
    document.getElementById('fullName').value = resumeData.fullName || '';
    document.getElementById('email').value = resumeData.email || '';
    document.getElementById('phone').value = resumeData.phone || '';
    document.getElementById('location').value = resumeData.location || '';
    document.getElementById('website').value = resumeData.website || '';
    document.getElementById('professionalTitle').value = resumeData.professionalTitle || '';
    document.getElementById('summary').value = resumeData.summary || '';
}

// ==================== Import Content (Reshape Mode) ====================
function importContent() {
    const pasteContent = document.getElementById('pasteContent').value.trim();
    
    if (!pasteContent) {
        alert('Please paste your resume content or select a file');
        return;
    }

    // Simple parsing - extract likely sections
    const sections = pasteContent.split(/\n\n+/);
    
    // Try to extract key information
    const firstLine = sections[0];
    if (firstLine) {
        const nameParts = firstLine.split('\n');
        resumeData.fullName = nameParts[0].trim();
    }

    // Look for email
    const emailMatch = pasteContent.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
        resumeData.email = emailMatch[0];
    }

    // Look for phone
    const phoneMatch = pasteContent.match(/[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}/);
    if (phoneMatch) {
        resumeData.phone = phoneMatch[0];
    }

    // Add content to summary for user to refine
    resumeData.summary = pasteContent.substring(0, 500);

    populateFormFields();
    updateLivePreview();
    saveToLocalStorage();
    showSuccessMessage('Content imported! Please review and refine your information.');
    
    // Scroll to top
    document.querySelector('.form-container').scrollTop = 0;
}

// ==================== PDF Download ====================
async function downloadResumePDF() {
    if (!resumeData.fullName || !resumeData.email) {
        alert('Please fill in at least Name and Email fields before downloading');
        return;
    }

    try {
        // Show loading state
        const downloadBtn = document.getElementById('downloadBtn');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Generating...';
        downloadBtn.disabled = true;

        // Capture resume preview
        const resumeElement = document.getElementById('resumePreview');
        const canvas = await html2canvas(resumeElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
        });

        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        // Download
        pdf.save(`${resumeData.fullName.replace(/\s+/g, '_')}_Resume_${selectedTemplate}.pdf`);

        showSuccessMessage('Resume downloaded successfully as PDF!');
        
        // Restore button
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.innerHTML = 'Download PDF';
        downloadBtn.disabled = false;
    }
}

// ==================== Visual Feedback ====================
function showSuccessMessage(message) {
    const successMsg = document.getElementById('successMsg');
    const successText = document.getElementById('successText');
    successText.textContent = message;
    successMsg.style.display = 'block';

    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 4000);
}

/* ==================== Add spin animation for loading ==================== */
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
