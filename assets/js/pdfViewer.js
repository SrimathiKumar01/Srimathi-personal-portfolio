// PDF viewer implementation
const pdfViewer = {
    currentPage: 1,
    pdf: null,
    totalPages: 0,

    async init(pdfUrl) {
        try {
            const loadingTask = pdfjsLib.getDocument(pdfUrl);
            this.pdf = await loadingTask.promise;
            this.totalPages = this.pdf.numPages;
            document.getElementById('total-pages').textContent = this.totalPages;
            this.renderPage(1);
            this.setupControls();
        } catch (error) {
            console.error('Error loading PDF:', error);
        }
    },

    async renderPage(pageNumber) {
        try {
            const page = await this.pdf.getPage(pageNumber);
            const canvas = document.getElementById('pdf-canvas');
            const context = canvas.getContext('2d');

            const viewport = page.getViewport({ scale: 1.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext);
            this.currentPage = pageNumber;
            document.getElementById('current-page').textContent = pageNumber;
        } catch (error) {
            console.error('Error rendering page:', error);
        }
    },

    setupControls() {
        document.getElementById('prev-page').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.renderPage(this.currentPage - 1);
            }
        });

        document.getElementById('next-page').addEventListener('click', () => {
            if (this.currentPage < this.totalPages) {
                this.renderPage(this.currentPage + 1);
            }
        });

        document.getElementById('zoom-in').addEventListener('click', () => {
            const canvas = document.getElementById('pdf-canvas');
            canvas.style.width = (canvas.offsetWidth * 1.2) + 'px';
        });

        document.getElementById('zoom-out').addEventListener('click', () => {
            const canvas = document.getElementById('pdf-canvas');
            canvas.style.width = (canvas.offsetWidth * 0.8) + 'px';
        });
    }
};

// Initialize the viewer when the page loads
window.addEventListener('load', () => {
    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    // Initialize the viewer with the PDF URL
    pdfViewer.init('./assets/documents/SrimathiResume.pdf');
});