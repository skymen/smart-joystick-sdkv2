export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();

      const b = this._runtime.GetDispatcher();
      this._disposables = [
        b.addEventListener("pointerdown", (e) => this._OnPointerDown(e)),
        b.addEventListener("pointermove", (e) => this._OnPointerMove(e)),
        b.addEventListener("pointerup", (e) => this._OnPointerUp(e, false)),
        b.addEventListener("pointercancel", (e) => this._OnPointerUp(e, true)),
        b.addEventListener("mousemove", (e) => this._OnMouseMove(e)),
        b.addEventListener("mousedown", (e) => this._OnMouseDown(e)),
        b.addEventListener("mouseup", (e) => this._OnMouseUp(e)),
      ];

      this.AllObjectClasses = [];
    }

    _release() {
      if (this._disposables) {
        for (const disposable of this._disposables) {
          if (disposable && disposable.remove) {
            disposable.remove();
          }
        }
        this._disposables = null;
      }
      super._release();
    }

    GetInstances() {
      const arr = [];
      if (this.AllObjectClasses.length === 0) {
        this.AllObjectClasses = this._runtime
          .GetAllObjectClasses()
          .filter((a) => a.GetPlugin() === this);
      }

      for (const objClass of this.AllObjectClasses) {
        arr.push(...objClass.GetInstances());
      }
      return arr;
    }

    _OnPointerDown(e) {
      if (e.pointerType === "mouse") {
        this._OnMouseDown(e);
      } else {
        this._OnInputDown(
          e.pointerId.toString(),
          e.clientX - this._runtime.GetCanvasManager().GetCanvasClientX(),
          e.clientY - this._runtime.GetCanvasManager().GetCanvasClientY()
        );
      }
    }

    _OnPointerMove(e) {
      if (e.pointerType === "mouse") {
        this._OnMouseMove(e);
      } else {
        this._OnInputMove(
          e.pointerId.toString(),
          e.clientX - this._runtime.GetCanvasManager().GetCanvasClientX(),
          e.clientY - this._runtime.GetCanvasManager().GetCanvasClientY()
        );
      }
    }

    _OnPointerUp(e) {
      if (e.pointerType === "mouse") {
        this._OnMouseUp(e);
      } else {
        this._OnInputUp(e.pointerId.toString());
      }
    }

    _OnMouseDown(e) {
      if (e.button !== 0) return;
      this._OnInputDown(
        "mouse",
        e.clientX - this._runtime.GetCanvasManager().GetCanvasClientX(),
        e.clientY - this._runtime.GetCanvasManager().GetCanvasClientY()
      );
    }

    _OnMouseMove(e) {
      this._OnInputMove(
        "mouse",
        e.clientX - this._runtime.GetCanvasManager().GetCanvasClientX(),
        e.clientY - this._runtime.GetCanvasManager().GetCanvasClientY()
      );
    }

    _OnMouseUp(e) {
      if (e.button !== 0) return;
      this._OnInputUp("mouse");
    }

    _OnInputDown(source, canvasX, canvasY) {
      const instances = this.GetInstances();
      let selectedInst = null;
      let selectedSdkInst = null;
      let selectedX = 0;
      let selectedY = 0;

      for (const inst of instances) {
        const sdkInst = inst.GetSdkInstance();
        if (sdkInst.IsDragging()) continue;

        const wi = inst.GetWorldInfo();
        const layer = wi.GetLayer();
        const [layerX, layerY] = layer.CanvasCSSToLayer(canvasX, canvasY);

        if (!sdkInst.CanDrag(layerX, layerY, source)) continue;

        if (!selectedInst) {
          selectedInst = inst;
          selectedSdkInst = sdkInst;
          selectedX = layerX;
          selectedY = layerY;
          continue;
        }

        const selectedWi = selectedInst.GetWorldInfo();
        if (
          layer.GetIndex() > selectedWi.GetLayer().GetIndex() ||
          (layer.GetIndex() === selectedWi.GetLayer().GetIndex() &&
            wi.GetZIndex() > selectedWi.GetZIndex())
        ) {
          selectedInst = inst;
          selectedSdkInst = sdkInst;
          selectedX = layerX;
          selectedY = layerY;
        }
      }

      if (selectedInst && selectedSdkInst) {
        selectedSdkInst.OnDown(source, selectedX, selectedY);
      }
    }

    _OnInputMove(source, canvasX, canvasY) {
      const instances = this.GetInstances();
      for (const inst of instances) {
        const sdkInst = inst.GetSdkInstance();
        if (
          !sdkInst.IsDragging() ||
          (sdkInst.IsDragging() && sdkInst.GetDragSource() !== source)
        )
          continue;

        const wi = inst.GetWorldInfo();
        const layer = wi.GetLayer();
        const [layerX, layerY] = layer.CanvasCSSToLayer(canvasX, canvasY);
        sdkInst.OnMove(layerX, layerY);
      }
    }

    _OnInputUp(source) {
      const instances = this.GetInstances();
      for (const inst of instances) {
        const sdkInst = inst.GetSdkInstance();
        if (sdkInst.IsDragging() && sdkInst.GetDragSource() === source) {
          sdkInst.OnUp();
        }
      }
    }
  };
}
