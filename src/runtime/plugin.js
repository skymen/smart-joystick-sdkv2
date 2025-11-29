export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();

      this.events = [
        ["pointerdown", (e) => this._OnPointerDown(e)],
        ["pointermove", (e) => this._OnPointerMove(e)],
        ["pointerup", (e) => this._OnPointerUp(e, false)],
        ["pointercancel", (e) => this._OnPointerUp(e, true)],
        ["mousemove", (e) => this._OnMouseMove(e)],
        ["mousedown", (e) => this._OnMouseDown(e)],
        ["mouseup", (e) => this._OnMouseUp(e)],
      ];
      this.events.forEach(([event, handler]) =>
        this.runtime.addEventListener(event, handler)
      );

      this.AllObjectClasses = [];
    }

    _release() {
      if (this.events) {
        for (const [event, handler] of this.events) {
          this.runtime.removeEventListener(event, handler);
        }
      }
      super._release();
    }

    GetInstances() {
      const arr = [];
      if (this.AllObjectClasses.length === 0) {
        this.AllObjectClasses = Object.values(this.runtime.objects).filter(
          (x) => x.plugin === this
        );
      }

      for (const objClass of this.AllObjectClasses) {
        arr.push(...objClass.instances());
      }
      return arr;
    }

    _OnPointerDown(e) {
      if (e.pointerType === "mouse") {
        this._OnMouseDown(e);
      } else {
        this._OnInputDown(e.pointerId.toString(), e.clientX, e.clientY);
      }
    }

    _OnPointerMove(e) {
      if (e.pointerType === "mouse") {
        this._OnMouseMove(e);
      } else {
        this._OnInputMove(e.pointerId.toString(), e.clientX, e.clientY);
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
      this._OnInputDown("mouse", e.clientX, e.clientY);
    }

    _OnMouseMove(e) {
      this._OnInputMove("mouse", e.clientX, e.clientY);
    }

    _OnMouseUp(e) {
      if (e.button !== 0) return;
      this._OnInputUp("mouse");
    }

    _OnInputDown(source, canvasX, canvasY) {
      debugger;
      const instances = this.GetInstances();
      let selectedInst = null;
      let selectedX = 0;
      let selectedY = 0;

      for (const inst of instances) {
        if (inst.IsDragging()) continue;

        const layer = inst.layer;
        const [layerX, layerY] = layer.cssCoordsToLayer(canvasX, canvasY);

        if (!inst.CanDrag(layerX, layerY, source)) continue;

        if (!selectedInst) {
          selectedInst = inst;
          selectedX = layerX;
          selectedY = layerY;
          continue;
        }

        if (
          layer.index > selectedInst.layer.index ||
          (layer.index === selectedInst.layer.index &&
            inst.zIndex > selectedInst.zIndex)
        ) {
          selectedInst = inst;
          selectedX = layerX;
          selectedY = layerY;
        }
      }

      if (selectedInst) {
        selectedInst.OnDown(source, selectedX, selectedY);
      }
    }

    _OnInputMove(source, canvasX, canvasY) {
      debugger;
      const instances = this.GetInstances();
      for (const inst of instances) {
        if (
          !inst.IsDragging() ||
          (inst.IsDragging() && inst.GetDragSource() !== source)
        )
          continue;

        const layer = inst.layer;
        const [layerX, layerY] = layer.cssCoordsToLayer(canvasX, canvasY);
        inst.OnMove(layerX, layerY);
      }
    }

    _OnInputUp(source) {
      debugger;
      const instances = this.GetInstances();
      for (const inst of instances) {
        if (inst.IsDragging() && inst.GetDragSource() === source) {
          inst.OnUp();
        }
      }
    }
  };
}
