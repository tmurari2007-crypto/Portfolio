document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // If the link has been dynamically updated to an external URL, or is just '#', don't intercept
            if (!targetId.startsWith('#') || targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Load Portfolio Data
    fetch('./data/portfolioData.json')
        .then(response => response.json())
        .then(data => {
            populatePortfolio(data);
        })
        .catch(error => console.error('Error loading portfolio data:', error));
});

function populatePortfolio(data) {
    // Personal Info
    if (data.personal) {
        document.getElementById('hero-name-target').textContent = data.personal.name;
        document.getElementById('hero-title-target').textContent = data.personal.headline;
        
        document.getElementById('about-text-target').innerHTML = `
            <p>${data.personal.about}</p>
            <p><strong>Interests:</strong> ${data.personal.interests.join(', ')}</p>
        `;
    }

    // Education
    if (data.education && data.education.length > 0) {
        const eduHTML = data.education.map(edu => `
            <div class="edu-card">
                <h3>${edu.degree}</h3>
                <p>${edu.institution}</p>
                ${edu.duration ? `<p><small>${edu.duration}</small></p>` : ''}
            </div>
        `).join('');
        document.getElementById('education-target').innerHTML = eduHTML;
    }

    // Skills
    if (data.skills) {
        const skillsContainer = document.getElementById('skills-target');
        let skillsHTML = '';
        
        for (const [category, skillsList] of Object.entries(data.skills)) {
            skillsHTML += `
                <div class="skill-category">
                    <h3>${category}</h3>
                    <div class="skill-tags">
                        ${skillsList.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            `;
        }
        skillsContainer.innerHTML = skillsHTML;
    }

    // Links & Contacts
    if (data.profiles) {
        if(data.profiles.github && data.profiles.github !== '#') {
            document.getElementById('hero-github-btn').href = data.profiles.github;
        }
        
        const footerSocial = document.getElementById('footer-social-target');
        let socialHTML = '';
        if(data.profiles.github && data.profiles.github !== '#') socialHTML += `<a href="${data.profiles.github}" target="_blank"><i class="fa-brands fa-github"></i> GitHub</a>`;
        if(data.profiles.linkedin && data.profiles.linkedin !== '#') socialHTML += `<a href="${data.profiles.linkedin}" target="_blank"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>`;
        if(data.contact && data.contact.email) socialHTML += `<a href="mailto:${data.contact.email}"><i class="fa-solid fa-envelope"></i> Email</a>`;
        footerSocial.innerHTML = socialHTML;
        
        if (data.contact && data.contact.email) {
            document.getElementById('contact-email-btn').href = `mailto:${data.contact.email}`;
        }
    }

    if (data.resume && data.resume.link) {
        const heroResumeBtn = document.getElementById('hero-resume-btn');
        const downloadResumeBtn = document.getElementById('download-resume-btn');
        if (heroResumeBtn) heroResumeBtn.href = data.resume.link;
        if (downloadResumeBtn) downloadResumeBtn.href = data.resume.link;
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
        const projectsContainer = document.getElementById('projects-target');
        let projectsHTML = '';
        
        data.projects.forEach(project => {
            projectsHTML += `
                <div class="project-card">
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-tagline">${project.tagline}</p>
                        <p>${project.description}</p>
                        <div class="project-tech">
                            ${project.tech ? project.tech.map(t => `<span>${t}</span>`).join('') : ''}
                        </div>
                        <div class="project-links">
                            ${project.links && project.links.github ? `<a href="${project.links.github}" target="_blank"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        projectsContainer.innerHTML = projectsHTML;
    }

    // Hackathons
    if (data.hackathons && data.hackathons.length > 0) {
        const experienceContainer = document.getElementById('experience-target');
        let hackathonHTML = '';
        
        data.hackathons.forEach(hackathon => {
            hackathonHTML += `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <h3>${hackathon.name}</h3>
                        <h4>${hackathon.organizer}</h4>
                        <p class="date"><i class="fa-regular fa-calendar"></i> ${hackathon.date} | <i class="fa-solid fa-location-dot"></i> ${hackathon.location}</p>
                        <p>${hackathon.description}</p>
                        ${hackathon.certificate ? `<div style="margin-top:1rem;"><a href="${hackathon.certificate}" target="_blank" class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.5rem 1rem;"><i class="fa-solid fa-certificate"></i> View Certificate</a></div>` : ''}
                    </div>
                </div>
            `;
        });
        
        experienceContainer.innerHTML = hackathonHTML;
    }
}
