"use strict";
{
    C3.Plugins.skymen_smartJoystick.Acts = {
        BindHandle(type)
        {
            if (this.handle) this._runtime.DestroyInstance(this.handle)
            this.handle = this._runtime.CreateInstance(type,
            this._worldInfo.GetLayer(),
            this._worldInfo.GetX(),
            this._worldInfo.GetY());
            this.handleUID = this.handle.GetUID()
        },

        SetRadius(radius)
        {
            this.zoneRadius = radius;
        },

        SetMode(mode)
        {
            this.mode = mode;
        },

        SetEvent(event)
        {
            this.touchEvent = event;
        }
    };
}