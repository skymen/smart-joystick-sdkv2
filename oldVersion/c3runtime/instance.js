"use strict";
{
    C3.Plugins.skymen_smartJoystick.Instance = class SmartJoystickInstance extends C3.SDKWorldInstanceBase
    {
        constructor(inst, properties)
        {
            super(inst);

            //this._testProperty = 0;

            if (properties)
            {
                this.properties = properties;
            }
            this.handle = null;
            this.handleUID = -1;
            this.originX = this._worldInfo.GetX();
            this.originY = this._worldInfo.GetY();
            this.touchEvent = this.properties[0];
            this.initVisible = (this.touchEvent != 1 || this.properties[1] == 0)
            if (!this.initVisible)
            {
                this._worldInfo.SetOpacity(0);
            }
            this.mode = this.properties[2];
            this.zoneRadius = this.properties[3];
            this.fadeTime = this.properties[5];
            this.fadeIn = false;
            this.fadeOut = false;
            this.dragging = false;
            this.justLoaded = false;

            //Touch Values
            this.dragSource = "<none>"
            this.useMouseInput = (this.properties[4] == 0);
            this._StartTicking()
        }

        IsDragging()
        {
            return this.dragging
        }

        CanDrag(x, y, type)
        {
            if (type === "mouse" && !this.useMouseInput) return false;

            let dist = this.distance(this._worldInfo.GetX(), this._worldInfo.GetY(), x, y)
            let joyRadius = this.joystickRadius();
            let maxDist = joyRadius;
            if (this.mode != 0)
            {
                maxDist = Math.max(this.zoneRadius, joyRadius);
            }
            return dist < maxDist;
        }

        joystickRadius()
        {
            return Math.min(Math.abs(this._worldInfo.GetWidth()), Math.abs(this._worldInfo.GetHeight())) / 2;
        }

        distance(x1, y1, x2, y2)
        {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        }

        angleDiff(x1, y1, x2, y2)
        {
            return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        }

        GetDragSource()
        {
            return this.dragSource
        }

        OnDown(source, x, y)
        {
            const wi = this.GetWorldInfo();
            this.dragSource = source
            var dist = this.distance(wi.GetX(), wi.GetY(), x, y)
            var joyRadius = this.joystickRadius();
            this.dragging = true;
            // Trigger OnDragStart
            this.Trigger(C3.Plugins.skymen_smartJoystick.Cnds.OnDragStart)
            if (this.touchEvent == 1)
            {
                this.fadeOut = false;
                this.fadeIn = true;
            }

            if ((dist < this.zoneRadius) && (this.mode == 1 || this.mode == 2))
            {
                wi.SetXY(x, y);
                wi.SetBboxChanged();
                this.handle._worldInfo.SetXY(x, y);
                this.handle._worldInfo.SetBboxChanged();
                //dist = 0;
            }
            else if (dist < joyRadius)
            {
                this.handle._worldInfo.SetXY(x, y);
                this.handle._worldInfo.SetBboxChanged();
            }
        }

        OnMove(x, y)
        {
            const wi = this.GetWorldInfo()
            var dist = this.distance(wi.GetX(), wi.GetY(), x, y)
            var joyRadius = this.joystickRadius();
            var offsetX = x - wi.GetX();
            var offsetY = y - wi.GetY();

            var ratio = joyRadius / dist;

            if (dist <= joyRadius)
            {
                this.handle._worldInfo.SetXY(x, y);
                this.handle._worldInfo.SetBboxChanged();
            }
            else
            {
                if (this.mode == 1)
                {
                    var off2X = offsetX - offsetX * ratio;
                    var off2Y = offsetY - offsetY * ratio;
                    wi.OffsetXY(off2X, off2Y);
                    wi.SetBboxChanged();
                    this.handle._worldInfo.SetXY(x, y);
                    this.handle._worldInfo.SetBboxChanged();
                }
                else
                {
                    this.handle._worldInfo.SetXY(wi.GetX() + offsetX * ratio, wi.GetY() + offsetY * ratio);
                    this.handle._worldInfo.SetBboxChanged();
                }
            }
        }

        OnUp()
        {
            this.dragging = false;
            // Trigger OnDragStop
            this.Trigger(C3.Plugins.skymen_smartJoystick.Cnds.OnDragStop);
            if (this.touchEvent == 1)
            {
                this.fadeOut = true;
                this.fadeIn = false;
            }
            else if (this.touchEvent == 2)
            {
                this._worldInfo.SetXY(this.originX, this.originY)
                this._worldInfo.SetBboxChanged();
            }
            this.handle._worldInfo.SetXY(this._worldInfo.GetX(), this._worldInfo.GetY());
            this.handle._worldInfo.SetBboxChanged();
        }

        Release()
        {
            super.Release();
        }

        Tick()
        {
            if (this.justLoaded) this.AfterLoad()

            if (this.fadeIn)
            {
                if (this._worldInfo.GetOpacity() < 1)
                {
                    var timeInFrames = 60 * this.fadeTime / 1000
                    this._worldInfo.SetOpacity(C3.lerp(this._worldInfo.GetOpacity(), 1.1, 1 / timeInFrames));
                    this._runtime.UpdateRender();
                }
                if (this._worldInfo.GetOpacity() >= 1)
                {
                    this._worldInfo.SetOpacity(1);
                    this.fadeIn = false;
                    this.fadeOut = false;
                }
            }
            else if (this.fadeOut)
            {
                if (this._worldInfo.GetOpacity() > 0)
                {
                    var timeInFrames = 60 * this.fadeTime / 1000
                    this._worldInfo.SetOpacity(C3.lerp(this._worldInfo.GetOpacity(), -0.1, 1 / timeInFrames));
                    this._runtime.UpdateRender();
                }
                if (this._worldInfo.GetOpacity() <= 0)
                {
                    this._worldInfo.SetXY(this.originX, this.originY)
                    this._worldInfo.SetBboxChanged();

                    this.handle._worldInfo.SetXY(this._worldInfo.GetX(), this._worldInfo.GetY());
                    this.handle._worldInfo.SetBboxChanged();
                    this._worldInfo.SetOpacity(0);
                    this.fadeIn = false;
                    this.fadeOut = false;
                }
            }
            if (this.handle && this.handle._worldInfo.GetOpacity() != this._worldInfo.GetOpacity()) this.handle._worldInfo.SetOpacity(this._worldInfo.GetOpacity());
        }

        Draw(renderer)
        {
            const imageInfo = this._objectClass.GetImageInfo();
            const texture = imageInfo.GetTexture();

            if (!texture) return; // dynamic texture load which hasn't completed yet; can't draw anything

            const wi = this.GetWorldInfo();
            const quad = wi.GetBoundingQuad();
            const rcTex = imageInfo.GetTexRect();

            renderer.SetTexture(texture);

            if (this._runtime.IsPixelRoundingEnabled())
            {
                const ox = Math.round(wi.GetX()) - wi.GetX();
                const oy = Math.round(wi.GetY()) - wi.GetY();
                let tempQuad = new C3.Quad();
                tempQuad.copy(quad);
                tempQuad.offset(ox, oy);
                renderer.Quad3(tempQuad, rcTex);
            }
            else
            {
                renderer.Quad3(quad, rcTex);
            }
        }

        SaveToJson()
        {
            return {
                handleUID: this.handleUID,
                originX: this.originX,
                originY: this.originY,
                touchEvent: this.touchEvent,
                mode: this.mode,
                zoneRadius: this.zoneRadius,
                fadeTime: this.fadeTime,
                fadeIn: this.fadeIn,
                fadeOut: this.fadeOut,

            };
        }

        LoadFromJson(o)
        {
            this.handleUID = o.handleUID;
            this.originX = o.originX;
            this.originY = o.originY;
            this.touchEvent = o.touchEvent;
            this.mode = o.mode;
            this.zoneRadius = o.zoneRadius;
            this.fadeTime = o.fadeTime;
            this.fadeIn = o.fadeIn;
            this.fadeOut = o.fadeOut;
            this.justLoaded = true

            this.dragging = false;
            this.dragSource = "<none>"
        }

        AfterLoad()
        {
            this.justLoaded = false
            this.handle = this._runtime.GetInstanceByUID(this.handleUID)
        }

        GetDebuggerProperties()
        {
            return [
            {
                title: "Smart Joystick",
                properties: [
                {
                    "name": "Handle",
                    "value": this.handle ? "assigned" : "null",
                    "readonly": true},
                {
                    "name": "Handle X",
                    "value": this.handle ? this.handle._worldInfo.GetX() : "null",
                    "readonly": true},
                {
                    "name": "Handle Y",
                    "value": this.handle ? this.handle._worldInfo.GetY() : "null",
                    "readonly": true},
                {
                    "name": "Dragging",
                    "value": this.dragging,
                    "readonly": true}
                ]
            }];
        }
    };
}