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

    // Set up click handlers for job descriptions and blog modals
    document.addEventListener('click', async (e) => {
        const jobTitle = e.target.closest('.job-title');
        const blogTitle = e.target.closest('.blog-title');
        const modalClose = e.target.closest('.modal-close');
        const modalOverlay = e.target.closest('.modal-overlay');
        
        // Handle job title clicks (keep existing accordion behavior)
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
        
        // Handle blog title clicks (open modal)
        if (blogTitle) {
            const blogId = blogTitle.getAttribute('data-blog-id');
            const blogTitleText = blogTitle.getAttribute('data-blog-title');
            const blogDate = blogTitle.getAttribute('data-blog-date');
            
            // Find the blog data
            const blog = blogData.find(b => b.id === blogId);
            if (blog) {
                await openBlogModal(blog, blogTitleText, blogDate);
            }
        }
        
        // Handle modal close
        if (modalClose || modalOverlay) {
            closeBlogModal();
        }
    });
    
    // Handle escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeBlogModal();
        }
    });
    
    // Modal functions
    async function openBlogModal(blog, title, date) {
        const modal = document.getElementById('blog-modal');
        const modalTitle = document.getElementById('modal-blog-title');
        const modalDate = document.getElementById('modal-blog-date');
        const modalContent = document.getElementById('modal-blog-content');
        
        // Set title and date
        modalTitle.textContent = title;
        modalDate.textContent = date;
        
        // Load and parse markdown content
        try {
            const markdown = await blogComponent.loadMarkdown(blog.markdownFile);
            modalContent.innerHTML = markdown;
        } catch (error) {
            modalContent.innerHTML = '<p>Error loading blog content.</p>';
        }
        
        // Show modal
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus management
        const closeButton = modal.querySelector('.modal-close');
        closeButton.focus();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    function closeBlogModal() {
        const modal = document.getElementById('blog-modal');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
});
