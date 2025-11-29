export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();
    }

    _onCreate() {
      this.runtime.assets.loadImageAsset(this.getImageInfo());
    }

    _loadTextures(renderer) {
      return renderer.loadTextureForImageInfo(this.getImageInfo(), {
        sampling: this.runtime.sampling,
      });
    }

    _releaseTextures(renderer) {
      renderer.releaseTextureForImageInfo(this.getImageInfo());
    }
  };
}
