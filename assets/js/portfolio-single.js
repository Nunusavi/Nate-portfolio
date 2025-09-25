class PortfolioSingle {
    constructor() {
        this.projects = [];
        this.currentProject = null;
        this.currentProjectIndex = -1;
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.loadProjectFromURL();
        this.renderProjectDetails();
        this.setupNavigation();
        this.initLightbox();
    }

    async loadProjects() {
        try {
            const response = await fetch('../assets/data/portfolio.json');
            const data = await response.json();
            this.projects = data.projects;
        } catch (error) {
            console.error('Error loading portfolio data:', error);
        }
    }

    loadProjectFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');

        this.currentProjectIndex = this.projects.findIndex(project => project.id === projectId);

        if (this.currentProjectIndex !== -1) {
            this.currentProject = this.projects[this.currentProjectIndex];
        } else {
            // Redirect to portfolio if project not found
            window.location.href = 'index.html#portfolio';
        }
    }

    renderProjectDetails() {
        if (!this.currentProject) return;

        // Update page title
        document.title = `Nate - ${this.currentProject.title}`;

        // Update main title and description
        document.getElementById('project-title').innerHTML =
            `${this.currentProject.title} <span class="text-gradient">Details</span>`;
        document.getElementById('project-description').textContent = this.currentProject.description;

        // Render meta information (keeping your original design structure)
        this.renderMetaInformation();

        // Render full description (journal content)
        this.renderFullDescription();

        // Render project media (keeping your original lightbox design)
        this.renderProjectMedia();
    }

    renderMetaInformation() {
        const metaContainer = document.getElementById('project-meta');
        metaContainer.innerHTML = `
            <div class="col-12 col-md-6 col-lg-3">
                <div class="fancy-box">
                    <h6 class="sm-heading mb-1">Services:</h6>
                    <ul class="list-inline-dot">
                        ${this.currentProject.services.map(service => `<li>${service}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <div class="fancy-box">
                    <h6 class="sm-heading mb-1">Client:</h6>
                    <p>${this.currentProject.client}</p>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <div class="fancy-box">
                    <h6 class="sm-heading mb-1">Project link:</h6>
                    ${this.currentProject.liveUrl ?
                `<a class="link-hover" href="${this.currentProject.liveUrl}" target="_blank">
                            <span data-text="${this.currentProject.liveUrl}">${this.currentProject.liveUrl}</span>
                        </a>` :
                '<p>No live demo</p>'
            }
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <div class="fancy-box">
                    <h6 class="sm-heading mb-1">Duration:</h6>
                    <p>${this.currentProject.duration}</p>
                </div>
            </div>
        `;
    }

    renderFullDescription() {
        const descriptionContainer = document.getElementById('project-full-description');

        // Responsive grid layout and larger font using Tailwind CSS
        descriptionContainer.innerHTML = `
            <div class="project-journal grid grid-cols-1 md:grid-cols-2 gap-5 text-lg md:text-xl">
                <div>
                    <h4 class="text-gradient mb-3 text-2xl font-bold">Project Overview</h4>
                    <p class="mb-4">${this.currentProject.description}</p>
                </div>
                <div>
                    <h4 class="text-gradient mb-3 text-2xl font-bold">The Challenge</h4>
                    <p class="mb-4">${this.currentProject.challenges}</p>
                </div>
                <div>
                    <h4 class="text-gradient mb-3 text-2xl font-bold">The Solution</h4>
                    <p class="mb-4">${this.currentProject.solution}</p>
                </div>
                <div>
                    <h4 class="text-gradient mb-3 text-2xl font-bold">Key Features</h4>
                    <ul class="mb-4 list-disc list-inside space-y-2">
                        ${this.currentProject.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h4 class="text-gradient mb-3 text-2xl font-bold">Technologies Used</h4>
                    <p class="mb-4">${this.currentProject.technologies.join(', ')}</p>
                </div>
                ${this.currentProject.testimonial ? `
                <div class="md:col-span-2">
                    <h4 class="text-gradient mb-3 text-2xl font-bold">Client Feedback</h4>
                    <blockquote class="mb-4 border-l-4 pl-4 italic">
                        <p>"${this.currentProject.testimonial.text}"</p>
                        <cite class="block mt-2 text-base">- ${this.currentProject.testimonial.author}</cite>
                    </blockquote>
                </div>
                ` : ''}
            </div>
        `;
    }

    renderProjectMedia() {
        const mediaContainer = document.getElementById('project-media');

        // If there are no images, hide the media section
        if (!this.currentProject.images || this.currentProject.images.length === 0) {
            mediaContainer.style.display = 'none';
            return;
        }

        let mediaHTML = '';

        // Main wide image (first image)
        if (this.currentProject.images[0]) {
            mediaHTML += `
                <div class="col-12">
                    <img class="border-radius" src="${this.currentProject.images[0]}" alt="${this.currentProject.title}">
                </div>
            `;
        }

        // Additional images (second and third)
        if (this.currentProject.images[1]) {
            mediaHTML += `
                <div class="col-12 col-md-6">
                    <!-- Image Lightbox -->
                    <a class="lightbox-image-box border-radius" href="${this.currentProject.images[1]}">
                        <img src="${this.currentProject.images[1]}" alt="${this.currentProject.title} - Detail 1">
                        <div class="lightbox-icon">
                            <i class="bi bi-arrows-fullscreen"></i>
                        </div>
                    </a>
                </div>
            `;
        }

        // Third image or video
        if (this.currentProject.images[2]) {
            if (this.currentProject.videoUrl) {
                mediaHTML += `
                    <div class="col-12 col-md-6">
                        <!-- Video Lightbox -->
                        <a class="lightbox-media-box border-radius icon-lg" href="${this.currentProject.videoUrl}">
                            <img src="${this.currentProject.images[2]}" alt="${this.currentProject.title} - Video">
                            <div class="lightbox-icon">
                                <i class="bi bi-play-fill"></i>
                            </div>
                        </a>
                    </div>
                `;
            } else {
                mediaHTML += `
                    <div class="col-12 col-md-6">
                        <!-- Image Lightbox -->
                        <a class="lightbox-image-box border-radius" href="${this.currentProject.images[2]}">
                            <img src="${this.currentProject.images[2]}" alt="${this.currentProject.title} - Detail 2">
                            <div class="lightbox-icon">
                                <i class="bi bi-arrows-fullscreen"></i>
                            </div>
                        </a>
                    </div>
                `;
            }
        }

        mediaContainer.innerHTML = mediaHTML;
    }

    initLightbox() {
    }

    setupNavigation() {
        const prevButton = document.getElementById('prev-project');
        const nextButton = document.getElementById('next-project');

        if (this.currentProjectIndex > 0) {
            const prevProject = this.projects[this.currentProjectIndex - 1];
            prevButton.href = `portfolio-single.html?id=${prevProject.id}`;
        } else {
            prevButton.style.visibility = 'hidden';
        }

        if (this.currentProjectIndex < this.projects.length - 1) {
            const nextProject = this.projects[this.currentProjectIndex + 1];
            nextButton.href = `portfolio-single.html?id=${nextProject.id}`;
        } else {
            nextButton.style.visibility = 'hidden';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioSingle();
});