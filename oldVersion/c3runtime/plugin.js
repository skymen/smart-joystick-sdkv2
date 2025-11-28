"use strict";
{
    C3.Plugins.skymen_smartJoystick = class SmartJoystickPlugin extends C3.SDKPluginBase
    {
        constructor(opts)
        {
            super(opts);
            const b = this._runtime.Dispatcher();
            this._disposables = new C3.CompositeDisposable(
            C3.Disposable.From(b, "pointerdown", (a) => this._OnPointerDown(a.data)),
            C3.Disposable.From(b, "pointermove", (a) => this._OnPointerMove(a.data)),
            C3.Disposable.From(b, "pointerup", (a) => this._OnPointerUp(a.data, !1)),
            C3.Disposable.From(b, "pointercancel", (a) => this._OnPointerUp(a.data, !0)),
            C3.Disposable.From(b, "mousemove", (a) => this._OnMouseMove(a.data)),
            C3.Disposable.From(b, "mousedown", (a) => this._OnMouseDown(a.data)),
            C3.Disposable.From(b, "mouseup", (a) => this._OnMouseUp(a.data)))
            this.AllObjectClasses = []
        }

        Release()
        {
            this._disposables.Release(), this._disposables = null, super.Release()
        }

        GetInstances()
        {
            let arr = []
            if (this.AllObjectClasses.length === 0) this.AllObjectClasses = this._runtime._allObjectClasses.filter(a => a._plugin instanceof C3.Plugins.skymen_smartJoystick)

            for (const i of this.AllObjectClasses)
            {
                arr.push.apply(arr, i._instances)
            }
            return arr
        }

        _OnPointerDown(a)
        {
            if ("mouse" === a.pointerType) this._OnMouseDown(a)
            else this._OnInputDown(a.pointerId.toString(), a.clientX - this._runtime.GetCanvasClientX(), a.clientY - this._runtime.GetCanvasClientY())
        }
        _OnPointerMove(a)
        {
            if ("mouse" === a.pointerType) this._OnMouseMove(a)
            else this._OnInputMove(a.pointerId.toString(), a.clientX - this._runtime.GetCanvasClientX(), a.clientY - this._runtime.GetCanvasClientY())
        }
        _OnPointerUp(a)
        {
            if ("mouse" === a.pointerType) this._OnMouseUp(a)
            else this._OnInputUp(a.pointerId.toString())
        }
        _OnMouseDown(a)
        {
            0 !== a.button || this._OnInputDown("mouse", a.clientX - this._runtime.GetCanvasClientX(), a.clientY - this._runtime.GetCanvasClientY())
        }
        _OnMouseMove(a)
        {
            this._OnInputMove("mouse", a.clientX - this._runtime.GetCanvasClientX(), a.clientY - this._runtime.GetCanvasClientY())
        }
        _OnMouseUp(a)
        {
            0 !== a.button || this._OnInputUp("mouse")
        }

        _OnInputDown(a, b, c)
        {
            const d = this.GetInstances();
            let e = null,
            f = null,
            g = 0,
            h = 0,
            type = a;
            for (const i of d)
            {
                const a = i._sdkInst;
                if (a.IsDragging()) continue;
                const d = i.GetWorldInfo(),
                j = d.GetLayer(), [k, l] = j.CanvasCssToLayer(b, c);
                if (!a.CanDrag(k, l, type)) continue;
                if (!e)
                {
                    e = i, f = a, g = k, h = l;
                    continue
                }
                const m = e.GetWorldInfo();
                (j.GetIndex() > m.GetLayer().GetIndex() || j.GetIndex() === m.GetLayer().GetIndex() && d.GetZIndex() > m.GetZIndex()) && (e = i, f = a, g = k, h = l)
            }
            e && f.OnDown(a, g, h)
        }
        _OnInputMove(a, b, c)
        {
            const d = this.GetInstances();
            for (const e of d)
            {
                const d = e._sdkInst;
                if (!d.IsDragging() || d.IsDragging() && d.GetDragSource() !== a) continue;
                const f = e.GetWorldInfo().GetLayer(), [g, h] = f.CanvasCssToLayer(b, c);
                d.OnMove(g, h)
            }
        }
        _OnInputUp(a)
        {
            const b = this.GetInstances();
            for (const c of b)
            {
                const b = c._sdkInst;
                b.IsDragging() && b.GetDragSource() === a && b.OnUp()
            }
        }
    };
}