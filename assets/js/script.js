// Load all sections
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize components
    const companyComponent = new CompanyComponent();
    await companyComponent.loadTemplate();
    
    const blogComponent = new BlogComponent();
    await blogComponent.loadTemplate();

    const sections = [
        { id: 'header', path: 'assets/html/header.html' },
        { id: 'profile', path: 'assets/html/profile.html' },
        { id: 'skills', path: 'assets/html/skills.html' },
        { 
            id: 'experience', 
            path: 'assets/html/experience.html',
            postProcess: async (element) => {
                // Initialize experience section with company components
                const container = element.querySelector('#experience-container');
                if (container) {
                    experienceData.forEach(data => {
                        const li = document.createElement('li');
                        li.innerHTML = companyComponent.render(data);
                        container.appendChild(li);
                    });
                }
            }
        },
        { id: 'domains', path: 'assets/html/domains.html' },
        { id: 'education', path: 'assets/html/education.html' },
        { id: 'projects', path: 'assets/html/projects.html' },
        { 
            id: 'blogs', 
            path: 'assets/html/blogs.html',
            postProcess: async (element) => {
                // Initialize blogs section with blog components
                const container = element.querySelector('#blogs-container');
                if (container) {
                    blogData.forEach(data => {
                        const li = document.createElement('li');
                        li.innerHTML = blogComponent.render(data);
                        container.appendChild(li);
                    });
                }
            }
        }
    ];

    for (const section of sections) {
        try {
            const response = await fetch(section.path);
            const content = await response.text();
            const element = document.getElementById(`${section.id}-placeholder`);
            element.innerHTML = content;

            // Run post-processing if defined
            if (section.postProcess) {
                await section.postProcess(element);
            }
        } catch (error) {
            console.error(`Error loading ${section.id}:`, error);
        }
    }

    // Set up click handlers for job and blog descriptions
    document.addEventListener('click', (e) => {
        const jobTitle = e.target.closest('.job-title');
        const blogTitle = e.target.closest('.blog-title');
        
        if (jobTitle) {
            const isExpanded = jobTitle.getAttribute('aria-expanded') === 'true';
            jobTitle.setAttribute('aria-expanded', !isExpanded);
            jobTitle.classList.toggle('expanded');
            
            const description = document.getElementById(jobTitle.getAttribute('aria-controls'));
            if (description) {
                description.classList.toggle('expanded');
                description.setAttribute('aria-hidden', isExpanded);
            }
        }
        
        if (blogTitle) {
            const isExpanded = blogTitle.getAttribute('aria-expanded') === 'true';
            
            // If clicking on a collapsed blog, first collapse all other blogs
            if (!isExpanded) {
                // Find all blog titles and collapse them
                const allBlogTitles = document.querySelectorAll('.blog-title');
                allBlogTitles.forEach(title => {
                    if (title !== blogTitle) {
                        title.setAttribute('aria-expanded', 'false');
                        title.classList.remove('expanded');
                        
                        const desc = document.getElementById(title.getAttribute('aria-controls'));
                        if (desc) {
                            desc.classList.remove('expanded');
                            desc.setAttribute('aria-hidden', 'true');
                        }
                    }
                });
            }
            
            // Toggle the clicked blog
            blogTitle.setAttribute('aria-expanded', !isExpanded);
            blogTitle.classList.toggle('expanded');
            
            const description = document.getElementById(blogTitle.getAttribute('aria-controls'));
            if (description) {
                description.classList.toggle('expanded');
                description.setAttribute('aria-hidden', isExpanded);
            }
        }
    });
});
