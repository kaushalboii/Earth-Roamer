export class SettingsModal {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.isOpen = false;
    this.render();
  }

  render() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-backdrop settings-modal-backdrop';
    this.modalEl.style.display = 'none';

    const savedIonToken = localStorage.getItem('cesium_ion_token') || '';
    const savedGoogleKey = localStorage.getItem('google_3d_tiles_key') || '';
    const savedImagery = localStorage.getItem('earth_imagery') || 'satellite';
    const savedSuitTheme = localStorage.getItem('earth_suit_theme') || 'spider';

    this.modalEl.innerHTML = `
      <div class="modal-box settings-modal-box">
        <div class="modal-header">
          <div class="modal-title">
            <span class="icon">⚙️</span>
            <h3>Simulation & Graphics Settings</h3>
          </div>
          <button class="modal-close-btn" id="closeSettingsBtn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="settings-section">
            <h4>Real-World 3D Photorealism</h4>
            <p class="section-desc">By default, high-resolution satellite imagery is streamed worldwide without keys. You can optionally connect Cesium Ion or Google Photorealistic 3D Tiles below.</p>
            
            <div class="form-group">
              <label for="cesiumIonInput">Cesium Ion Access Token (Optional)</label>
              <input type="password" id="cesiumIonInput" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..." value="${savedIonToken}" />
              <small>Enables Cesium World 3D Buildings, global terrain & assets. Free from <a href="https://ion.cesium.com" target="_blank" rel="noreferrer">cesium.com</a></small>
            </div>

            <div class="form-group">
              <label for="googleKeyInput">Google Maps API Key (Optional)</label>
              <input type="password" id="googleKeyInput" placeholder="AIzaSy..." value="${savedGoogleKey}" />
              <small>Enables Google Photorealistic 3D Tiles in 2500+ cities.</small>
            </div>
          </div>

          <div class="settings-section">
            <h4>Human Flyer Suit Theme</h4>
            <div class="imagery-options">
              <label class="radio-label">
                <input type="radio" name="suitTheme" value="spider" ${savedSuitTheme === 'spider' ? 'checked' : ''} />
                <span>🕷️ Spider-Suit (Crimson & Slate with Cyan Web-Wings)</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="suitTheme" value="stealth" ${savedSuitTheme === 'stealth' ? 'checked' : ''} />
                <span>🌑 Stealth Cyber (Electric Blue & Carbon)</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="suitTheme" value="gold" ${savedSuitTheme === 'gold' ? 'checked' : ''} />
                <span>⚡ Golden Phoenix (Solar Amber & Gold)</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="suitTheme" value="phantom" ${savedSuitTheme === 'phantom' ? 'checked' : ''} />
                <span>❄️ Ghost Phantom (Clean Silver & White)</span>
              </label>
            </div>
          </div>

          <div class="settings-section">
            <h4>Earth Imagery Provider</h4>
            <div class="imagery-options">
              <label class="radio-label">
                <input type="radio" name="imageryProvider" value="satellite" ${savedImagery === 'satellite' ? 'checked' : ''} />
                <span>🛰️ Satellite Photorealistic (ESRI World Imagery)</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="imageryProvider" value="osm" ${savedImagery === 'osm' ? 'checked' : ''} />
                <span>🗺️ OpenStreetMap Global (Streets & Borders)</span>
              </label>
            </div>
          </div>

          <div class="settings-section">
            <h4>Audio Simulation</h4>
            <div class="form-group">
              <label for="masterVolumeRange">Flight Audio Volume</label>
              <input type="range" id="masterVolumeRange" min="0" max="1" step="0.05" value="0.7" />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" id="saveAndReloadBtn">SAVE & RESTART</button>
            <button class="btn btn-primary" id="applySettingsBtn">APPLY</button>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(this.modalEl);

    // Event listeners
    this.modalEl.querySelector('#closeSettingsBtn').addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    this.modalEl.querySelector('#applySettingsBtn').addEventListener('click', () => {
      this.saveValues();
      this.close();
    });

    this.modalEl.querySelector('#saveAndReloadBtn').addEventListener('click', () => {
      this.saveValues();
      window.location.reload();
    });

    const volSlider = this.modalEl.querySelector('#masterVolumeRange');
    volSlider.addEventListener('input', (e) => {
      if (this.options.onVolumeChange) {
        this.options.onVolumeChange(parseFloat(e.target.value));
      }
    });

    const imageryRadios = this.modalEl.querySelectorAll('input[name="imageryProvider"]');
    imageryRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        localStorage.setItem('earth_imagery', e.target.value);
        if (this.options.onImageryChange) {
          this.options.onImageryChange(e.target.value);
        }
      });
    });

    const suitRadios = this.modalEl.querySelectorAll('input[name="suitTheme"]');
    suitRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        localStorage.setItem('earth_suit_theme', e.target.value);
        if (this.options.onSuitThemeChange) {
          this.options.onSuitThemeChange(e.target.value);
        }
      });
    });
  }

  saveValues() {
    const ionToken = this.modalEl.querySelector('#cesiumIonInput').value.trim();
    const googleKey = this.modalEl.querySelector('#googleKeyInput').value.trim();

    localStorage.setItem('cesium_ion_token', ionToken);
    localStorage.setItem('google_3d_tiles_key', googleKey);
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

