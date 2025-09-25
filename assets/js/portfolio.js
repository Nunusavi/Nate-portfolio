class PortfolioManager {
    constructor() {
        this.projects = [];
        this.currentProjectIndex = 0;
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.renderPortfolioSlider();
        this.initializeSwiper();
    }

    async loadProjects() {
        try {
            const response = await fetch('./assets/data/portfolio.json');
            const data = await response.json();
            this.projects = data.projects;
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            this.projects = this.getFallbackProjects();
        }
    }

    getFallbackProjects() {
        return [
            {
                id: 'fallback-1',
                title: 'Sample Project',
                shortDescription: 'Web Development Project',
                image: 'assets/images/portfolio-img.jpg',
                liveUrl: '#',
                category: 'Web Development'
            }
        ];
    }

    renderPortfolioSlider() {
        const container = document.getElementById('portfolio-container');
        if (!container) return;

        container.innerHTML = this.projects.map(project => `
            <div class="swiper-slide">
                <div class="portfolio-box">
                    <div class="portfolio-img">
                        <a href="portfolio-single.html?id=${project.id}" data-project-id="${project.id}">
                            <img src="${project.image}" alt="${project.title}" loading="lazy">
                            <div class="portfolio-overlay">
                               
                            </div>
                        </a>
                    </div>
                    <div class="pt-4">
                        <h2>
                            <a class="portfolio-caption" href="portfolio-single.html?id=${project.id}">
                                <i class="bi bi-arrow-right"></i>
                                ${project.title}
                            </a>
                        </h2>
                        <p class="text-white-06 mt-2">${project.shortDescription}</p>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click event listeners for analytics tracking
        this.addPortfolioEventListeners();
    }

    addPortfolioEventListeners() {
        const links = document.querySelectorAll('.portfolio-img a, .portfolio-caption');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const projectId = e.currentTarget.getAttribute('data-project-id') || 
                                e.currentTarget.closest('[data-project-id]')?.getAttribute('data-project-id');
                this.trackPortfolioClick(projectId);
            });
        });
    }

    trackPortfolioClick(projectId) {
        // You can integrate with your analytics here
        if (typeof umami !== 'undefined') {
            umami.track('portfolio_click', { projectId });
        }
    }

    initializeSwiper() {
        if (typeof Swiper !== 'undefined') {
            new Swiper('.portfolio-slider', {
                slidesPerView: 1,
                spaceBetween: 30,
                navigation: {
                    nextEl: '.swiper-portfolio-next',
                    prevEl: '.swiper-portfolio-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                    992: {
                        slidesPerView: 3,
                    }
                }
            });
        }
    }
}

// Initialize portfolio manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
});