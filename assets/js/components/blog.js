class BlogComponent {
    constructor() {
        this.template = '';
    }

    async loadTemplate() {
        try {
            const response = await fetch('assets/html/components/blog.html');
            this.template = await response.text();
        } catch (error) {
            console.error('Error loading blog template:', error);
        }
    }

    render(data) {
        return this.template
            .replace(/\${id}/g, data.id)
            .replace(/\${title}/g, data.title)
            .replace(/\${date}/g, data.date)
            .replace(/\${description}/g, data.description);
    }
}
