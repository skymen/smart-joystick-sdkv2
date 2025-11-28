export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();
    }

    _onCreate() {
      this.GetImageInfo().LoadAsset(this._runtime);
    }

    _loadTextures(renderer) {
      return this.GetImageInfo().LoadStaticTexture(renderer, {
        linearSampling: this._runtime.IsLinearSampling(),
      });
    }

    _releaseTextures() {
      this.GetImageInfo().ReleaseTexture();
    }
  };
}
