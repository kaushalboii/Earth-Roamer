import { LANDMARKS } from '../config.js';
import { SCENIC_TOURS } from '../tours/ScenicTours.js';

export class LandmarkModal {
  constructor(container, options = {}) {
    this.container = container;
    this.onSelect = options.onSelect;
    this.onStartTour = options.onStartTour;
    this.isOpen = false;
    this.activeTab = 'landmarks'; // 'landmarks' or 'tours'
    this.render();
  }

  render() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-backdrop landmark-modal-backdrop';
    this.modalEl.style.display = 'none';

    this.modalEl.innerHTML = `
      <div class="modal-box landmark-modal-box">
        <div class="modal-header">
          <div class="modal-title">
            <span class="icon">🌍</span>
            <h3>World Exploration & Scenic Flight Tours</h3>
          </div>
          <button class="modal-close-btn" id="closeLandmarkBtn">&times;</button>
        </div>

        <!-- TABS -->
        <div class="modal-tabs">
          <button class="tab-btn active" id="tabLandmarks">Famous Destinations</button>
          <button class="tab-btn" id="tabTours">Scenic Discovery Tours 🕊️</button>
        </div>

        <div class="modal-body">
          <!-- LANDMARKS PANE -->
          <div id="paneLandmarks">
            <p class="modal-subtitle">Instantly warp anywhere on Earth. Mach 20 travel allows orbiting the entire globe in 90 minutes.</p>
            <div class="landmark-grid" id="landmarkGrid">
              ${LANDMARKS.map(lm => `
                <div class="landmark-card" data-id="${lm.id}">
                  <div class="landmark-card-top">
                    <span class="landmark-icon">${lm.icon}</span>
                    <div class="landmark-info">
                      <h4>${lm.name}</h4>
                      <span class="landmark-alt">Elevation: ${lm.alt.toLocaleString()}m</span>
                    </div>
                  </div>
                  <p class="landmark-desc">${lm.desc}</p>
                  <button class="fly-here-btn">FLY HERE ⚡</button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- TOURS PANE -->
          <div id="paneTours" style="display: none;">
            <p class="modal-subtitle">Follow aerial glowing rings on peaceful sightseeing flights. Skim waterways, weave between skyscrapers, and carve canyons.</p>
            <div class="tours-grid">
              ${SCENIC_TOURS.map(t => `
                <div class="tour-card" data-tour-id="${t.id}">
                  <div class="tour-header">
                    <h4>${t.name}</h4>
                    <span class="rings-badge">${t.rings.length} RINGS</span>
                  </div>
                  <p class="tour-desc">${t.desc}</p>
                  <button class="start-tour-btn" data-tour-id="${t.id}">START FLIGHT TOUR 🕊️</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(this.modalEl);

    // Tab switching
    const tabL = this.modalEl.querySelector('#tabLandmarks');
    const tabT = this.modalEl.querySelector('#tabTours');
    const paneL = this.modalEl.querySelector('#paneLandmarks');
    const paneT = this.modalEl.querySelector('#paneTours');

    tabL.addEventListener('click', () => {
      tabL.classList.add('active');
      tabT.classList.remove('active');
      paneL.style.display = 'block';
      paneT.style.display = 'none';
    });

    tabT.addEventListener('click', () => {
      tabT.classList.add('active');
      tabL.classList.remove('active');
      paneT.style.display = 'block';
      paneL.style.display = 'none';
    });

    // Close button
    this.modalEl.querySelector('#closeLandmarkBtn').addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    // Landmark clicks
    const cards = this.modalEl.querySelectorAll('.landmark-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const lm = LANDMARKS.find(l => l.id === id);
        if (lm && this.onSelect) {
          this.onSelect(lm);
          this.close();
        }
      });
    });

    // Tour start clicks
    const tourBtns = this.modalEl.querySelectorAll('.start-tour-btn');
    tourBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tourId = btn.getAttribute('data-tour-id');
        const tour = SCENIC_TOURS.find(t => t.id === tourId);
        if (tour) {
          const firstRing = tour.rings[0];
          if (this.onSelect) {
            this.onSelect({
              lon: firstRing.lon,
              lat: firstRing.lat,
              alt: firstRing.alt + 30,
              heading: 45,
              pitch: -5
            });
          }
          if (this.onStartTour) {
            this.onStartTour(tourId);
          }
          this.close();
        }
      });
    });
  }

  open() {
    this.isOpen = true;
    this.modalEl.style.display = 'flex';
  }

  close() {
    this.isOpen = false;
    this.modalEl.style.display = 'none';
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }
}
