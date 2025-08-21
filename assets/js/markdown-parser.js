class MarkdownParser {
    static parse(markdown) {
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        
        // Bold text
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic text
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Code blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
        
        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // Blockquotes
        html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
        
        // Tables
        html = this.parseTables(html);
        
        // Lists
        html = this.parseLists(html);
        
        // Paragraphs
        html = this.parseParagraphs(html);
        
        return html;
    }
    
    static parseTables(html) {
        const tableRegex = /(\|.*\|[\r\n]+\|[-\s|:]+\|[\r\n]+((\|.*\|[\r\n]*)+))/g;
        
        return html.replace(tableRegex, (match) => {
            const lines = match.trim().split('\n');
            const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
            const rows = lines.slice(2).map(row => 
                row.split('|').map(cell => cell.trim()).filter(cell => cell)
            );
            
            let table = '<table>\n<thead>\n<tr>\n';
            headers.forEach(header => {
                table += `<th>${header}</th>\n`;
            });
            table += '</tr>\n</thead>\n<tbody>\n';
            
            rows.forEach(row => {
                table += '<tr>\n';
                row.forEach(cell => {
                    table += `<td>${cell}</td>\n`;
                });
                table += '</tr>\n';
            });
            
            table += '</tbody>\n</table>';
            return table;
        });
    }
    
    static parseLists(html) {
        // Unordered lists
        html = html.replace(/^(\s*)[-*+] (.+)$/gm, (match, indent, content) => {
            const level = Math.floor(indent.length / 2);
            return `<li data-level="${level}">${content}</li>`;
        });
        
        // Ordered lists
        html = html.replace(/^(\s*)\d+\. (.+)$/gm, (match, indent, content) => {
            const level = Math.floor(indent.length / 2);
            return `<li data-level="${level}" data-ordered="true">${content}</li>`;
        });
        
        // Wrap lists in ul/ol tags
        html = this.wrapLists(html);
        
        return html;
    }
    
    static wrapLists(html) {
        const lines = html.split('\n');
        const result = [];
        let inList = false;
        let listType = null;
        let currentLevel = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const liMatch = line.match(/<li data-level="(\d+)"(?: data-ordered="true")?>(.*)<\/li>/);
            
            if (liMatch) {
                const level = parseInt(liMatch[1]);
                const isOrdered = line.includes('data-ordered="true"');
                const content = liMatch[2];
                
                if (!inList) {
                    listType = isOrdered ? 'ol' : 'ul';
                    result.push(`<${listType}>`);
                    inList = true;
                    currentLevel = level;
                }
                
                result.push(`<li>${content}</li>`);
            } else {
                if (inList) {
                    result.push(`</${listType}>`);
                    inList = false;
                }
                result.push(line);
            }
        }
        
        if (inList) {
            result.push(`</${listType}>`);
        }
        
        return result.join('\n');
    }
    
    static parseParagraphs(html) {
        const lines = html.split('\n');
        const result = [];
        let inParagraph = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines, headers, lists, blockquotes, code blocks, tables
            if (!line || 
                line.startsWith('<h') || 
                line.startsWith('<li') || 
                line.startsWith('<ul') || 
                line.startsWith('<ol') || 
                line.startsWith('<blockquote') || 
                line.startsWith('<pre') || 
                line.startsWith('<table') ||
                line.startsWith('</')) {
                
                if (inParagraph) {
                    result.push('</p>');
                    inParagraph = false;
                }
                result.push(lines[i]);
            } else {
                if (!inParagraph) {
                    result.push('<p>');
                    inParagraph = true;
                }
                result.push(lines[i]);
            }
        }
        
        if (inParagraph) {
            result.push('</p>');
        }
        
        return result.join('\n');
    }
}
