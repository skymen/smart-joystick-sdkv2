"use strict";
{
    C3.Plugins.skymen_smartJoystick.Cnds = {
        IsDragging()
        {
            return this.dragging;
        },

        OnDragStart()
        {
            return true;
        },

        OnDragStop()
        {
            return true;
        }
    };
}