import * as Cesium from 'cesium';

export class GlobeManager {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.viewer = null;
    this.heroEntity = null;
    this.tileset = null;
    this.ionToken = localStorage.getItem('cesium_ion_token') || '';

    this.initViewer();
    this.initHeroModel();
    this.setupAtmosphere();
  }

  initViewer() {
    // If user provided a Cesium Ion token in settings, set it
    if (this.ionToken) {
      Cesium.Ion.defaultAccessToken = this.ionToken;
    }

    // Initialize Cesium Viewer with clean minimalist game settings
    this.viewer = new Cesium.Viewer(this.containerId, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      shouldAnimate: true,
      contextOptions: {
        webgl: {
          alpha: false,
          depth: true,
          stencil: false,
          antialias: true,
          powerPreference: 'high-performance'
        }
      }
    });

    const scene = this.viewer.scene;
    const globe = scene.globe;

    // Enable high-fidelity lighting, day/night cycles, and atmospheric scattering
    globe.enableLighting = true;
    globe.showGroundAtmosphere = true;
    globe.depthTestAgainstTerrain = true;
    scene.highDynamicRange = true;

    // Performance tuning for Mach 20 high-speed terrain streaming
    globe.maximumScreenSpaceError = 2.0;
    globe.tileCacheSize = 2500;
    globe.preloadSiblings = true;
    globe.preloadAncestors = true;

    // Default Imagery Layer: ESRI World Imagery (High-res satellite)
    this.setImageryProvider('satellite');

    // Try to load World Terrain if Ion token exists or use default terrain
    this.loadTerrain();
  }

  async loadTerrain() {
    try {
      const terrain = await Cesium.createWorldTerrainAsync({
        requestWaterMask: true,
        requestVertexNormals: true
      });
      this.viewer.terrainProvider = terrain;
    } catch (e) {
      console.log('Using default ellipsoidal terrain:', e.message);
    }
  }

  setupAtmosphere() {
    const scene = this.viewer.scene;
    if (scene.skyAtmosphere) {
      scene.skyAtmosphere.show = true;
      scene.skyAtmosphere.hueShift = 0.0;
      scene.skyAtmosphere.saturationShift = 0.1;
      scene.skyAtmosphere.brightnessShift = 0.05;
    }
  }

  initHeroModel() {
    const position = Cesium.Cartesian3.fromDegrees(-73.9857, 40.7484, 450);
    const heading = Cesium.Math.toRadians(45.0);
    const pitch = 0;
    const roll = 0;
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

    // Add superhero 3D model entity
    this.heroEntity = this.viewer.entities.add({
      name: 'Superhero',
      position: position,
      orientation: orientation,
      model: {
        uri: './models/superhero.glb',
        minimumPixelSize: 48,
        maximumScale: 50,
        scale: 1.0,
        runAnimations: true,
        shadows: Cesium.ShadowMode.ENABLED
      }
    });

    const savedTheme = localStorage.getItem('earth_suit_theme');
    if (savedTheme) {
      this.setSuitTheme(savedTheme);
    }
  }

  updateHero(physics, viewMode) {
    if (!this.heroEntity) return;

    // 1. Position on Earth
    const position = Cesium.Cartesian3.fromDegrees(physics.lon, physics.lat, physics.alt);
    this.heroEntity.position = position;

    // 2. Orientation in ENU Frame
    // In our GLB model, forward is +Y (North), Up is +Z, Right is +X.
    // In Cesium HeadingPitchRoll:
    // Heading: 0 = North (+Y), 90 = East (+X).
    // Cesium's HeadingPitchRoll assumes model forward is +X East by default.
    // Offset heading by -90° (or -Math.PI / 2) to align model +Y with Heading 0.
    const headingRad = Cesium.Math.toRadians(physics.heading) - Math.PI / 2;
    const pitchRad = Cesium.Math.toRadians(-physics.pitch);
    const rollRad = Cesium.Math.toRadians(physics.roll);

    const hpr = new Cesium.HeadingPitchRoll(headingRad, pitchRad, rollRad);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
    this.heroEntity.orientation = orientation;

    // 3. Visibility in first-person vs third-person
    if (viewMode === 'firstPerson') {
      this.heroEntity.model.scale = 0.9;
      this.heroEntity.show = true;
    } else {
      this.heroEntity.model.scale = 1.0;
      this.heroEntity.show = true;
    }
  }

  setTimeOfDay(hour) {
    // hour from 0.0 to 24.0
    const now = new Date();
    const targetDate = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      Math.floor(hour),
      Math.floor((hour % 1) * 60)
    ));
    this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(targetDate);
  }

  setSuitTheme(themeName) {
    if (!this.heroEntity || !this.heroEntity.model) return;
    if (themeName === 'spider') {
      this.heroEntity.model.color = Cesium.Color.WHITE;
      this.heroEntity.model.colorBlendMode = Cesium.ColorBlendMode.HIGHLIGHT;
    } else if (themeName === 'stealth') {
      this.heroEntity.model.color = Cesium.Color.fromCssColorString('#0284c7');
      this.heroEntity.model.colorBlendMode = Cesium.ColorBlendMode.MIX;
      this.heroEntity.model.colorBlendAmount = 0.55;
    } else if (themeName === 'gold') {
      this.heroEntity.model.color = Cesium.Color.fromCssColorString('#f59e0b');
      this.heroEntity.model.colorBlendMode = Cesium.ColorBlendMode.MIX;
      this.heroEntity.model.colorBlendAmount = 0.6;
    } else if (themeName === 'phantom') {
      this.heroEntity.model.color = Cesium.Color.fromCssColorString('#e2e8f0');
      this.heroEntity.model.colorBlendMode = Cesium.ColorBlendMode.HIGHLIGHT;
    }
  }

  async setImageryProvider(type) {
    this.viewer.imageryLayers.removeAll();

    if (type === 'satellite') {
      try {
        if (Cesium.ArcGisMapServerImageryProvider.fromUrl) {
          const provider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
          );
          this.viewer.imageryLayers.addImageryProvider(provider);
        } else {
          const esri = new Cesium.ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
          });
          this.viewer.imageryLayers.addImageryProvider(esri);
        }
      } catch (e) {
        console.warn('Satellite imagery load fallback:', e);
      }
    } else if (type === 'osm') {
      try {
        const osm = new Cesium.UrlTemplateImageryProvider({
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          maximumLevel: 19
        });
        this.viewer.imageryLayers.addImageryProvider(osm);
      } catch (e) {
        console.warn('OSM imagery fallback:', e);
      }
    }
  }

  async loadGoogle3DTiles(apiKey) {
    try {
      const tileset = await Cesium.createGooglePhotorealistic3DTileset({
        key: apiKey
      });
      this.viewer.scene.primitives.add(tileset);
      this.tileset = tileset;
      console.log('Google Photorealistic 3D Tiles loaded successfully!');
      return true;
    } catch (e) {
      console.error('Failed to load Google 3D Tiles:', e);
      throw e;
    }
  }
}
