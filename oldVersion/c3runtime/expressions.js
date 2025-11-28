"use strict";
{
    C3.Plugins.skymen_smartJoystick.Exps = {
        JoystickAngle()
        {
            if (this.handle === null) return 0;
            else
            {
                return this.angleDiff(
                this._worldInfo.GetX(),
                this._worldInfo.GetY(),
                this.handle._worldInfo.GetX(),
                this.handle._worldInfo.GetY());
            }
        },

        JoystickDistance()
        {
            if (this.handle === null) return 0;
            else
            {
                return this.distance(
                this._worldInfo.GetX(),
                this._worldInfo.GetY(),
                this.handle._worldInfo.GetX(),
                this.handle._worldInfo.GetY());
            }
        },

        JoystickForce()
        {
            if (this.handle === null) return 0;
            else
            {
                var dist = this.distance(
                this._worldInfo.GetX(),
                this._worldInfo.GetY(),
                this.handle._worldInfo.GetX(),
                this.handle._worldInfo.GetY());
                var radius = this.joystickRadius();
                return dist / radius;
            }
        },

        JoystickRadius()
        {
            this.joystickRadius()
        },

        JoystickX()
        {
            this._worldInfo.GetX()
        },

        JoystickY()
        {
            this._worldInfo.GetX()
        },

        JoystickDirX()
        {
            if (this.handle === null) return 0;
            else return this.handle._worldInfo.GetX() - this._worldInfo.GetX();
        },

        JoystickDirY()
        {
            if (this.handle === null) return 0;
            else return this.handle._worldInfo.GetY() - this._worldInfo.GetY();
        },

        JoystickForceX()
        {
            if (this.handle === null) return 0;
            else
            {
                var dist = this.handle._worldInfo.GetX() - this._worldInfo.GetX();
                var radius = this.joystickRadius();
                return dist / radius;
            }
        },

        JoystickForceY()
        {
            if (this.handle === null) return 0;
            else
            {
                var dist = this.handle._worldInfo.GetY() - this._worldInfo.GetY();
                var radius = this.joystickRadius();
                return dist / radius;
            }
        }
    };
}