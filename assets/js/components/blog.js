class BlogComponent {
    constructor() {
        this.template = '';
        this.markdownCache = new Map();
    }

    async loadTemplate() {
        try {
            const response = await fetch('assets/html/components/blog.html');
            this.template = await response.text();
        } catch (error) {
            console.error('Error loading blog template:', error);
        }
    }

    async loadMarkdown(markdownFile) {
        if (this.markdownCache.has(markdownFile)) {
            return this.markdownCache.get(markdownFile);
        }

        try {
            const response = await fetch(markdownFile);
            const markdown = await response.text();
            const html = MarkdownParser.parse(markdown);
            this.markdownCache.set(markdownFile, html);
            return html;
        } catch (error) {
            console.error('Error loading markdown file:', error);
            return '<p>Error loading blog content.</p>';
        }
    }

    render(data) {
        return this.template
            .replace(/\${id}/g, data.id)
            .replace(/\${title}/g, data.title)
            .replace(/\${date}/g, data.date);
    }
}
