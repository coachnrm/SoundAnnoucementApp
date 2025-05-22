// wwwroot/js/BlazorQuill.js

window.BlazorQuill = {
    quillInstance: null,

    // Initialize the Quill editor on a given element
    init: function (elementId) {
        var container = document.querySelector(elementId);
        if (container) {
            var Size = Quill.import('formats/size');
            Size.whitelist = ['small', false, 'large', 'huge'];
            Quill.register(Size, true);

            this.quillInstance = new Quill(container, {
                theme: 'snow', // Choose theme (snow or bubble)
                modules: {
                    // toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link']] // Example toolbar
                    toolbar: [
                        [{ 'size': ['small', false, 'large', 'huge'] }], // Add this line
                        ['bold', 'italic'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link']
                    ]
                }
            });
        }
    },

    // Get the content from the Quill editor
    getContent: function () {
        if (this.quillInstance) {
            return this.quillInstance.root.innerHTML;
        }
        return '';
    },

    // Get the content from the Quill editor as plain text
    getText: function () {
        if (this.quillInstance) {
            return this.quillInstance.getText(); // returns the plain text content
        }
        return '';
    },

    // Get the Quill Delta format (JSON format for internal representation)
    getQuillContent: function () {
        if (this.quillInstance) {
            return JSON.stringify(this.quillInstance.getContents()); // Returns the content in Delta format (JSON)
        }
        return '{}';
    },

    // Get the plain text from the Quill editor
    getQuillText: function () {
        if (this.quillInstance) {
            return this.quillInstance.getText(); // Plain text content
        }
        return '';
    },

     // Get the HTML content from the Quill editor (as HTML string)
     getQuillHTML: function () {
        if (this.quillInstance) {
            return this.quillInstance.root.innerHTML; // HTML content
        }
        return '';
    },

    // Set content in the Quill editor
    setContent: function (content) {
        if (this.quillInstance) {
            this.quillInstance.root.innerHTML = content;
        }
    },
}
