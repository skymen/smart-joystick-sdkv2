import { id, addonType } from "../../config.caw.js";
import AddonTypeMap from "../../template/addonTypeMap.js";

export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();
      const properties = this._getInitProperties();
      if (properties) {
        this.properties = properties;
      }

      this.handle = null;
      this.handleUID = -1;
      this.originX = this._inst.GetWorldInfo().GetX();
      this.originY = this._inst.GetWorldInfo().GetY();
      this.touchEvent = this.properties[0];
      this.initVisible = this.touchEvent !== 1 || this.properties[1] === 0;

      if (!this.initVisible) {
        this._inst.GetWorldInfo().SetOpacity(0);
      }

      this.mode = this.properties[2];
      this.zoneRadius = this.properties[3];
      this.fadeTime = this.properties[5];
      this.fadeIn = false;
      this.fadeOut = false;
      this.dragging = false;
      this.justLoaded = false;

      // Touch Values
      this.dragSource = "<none>";
      this.useMouseInput = this.properties[4] === 0;

      this._startTicking();
    }

    _trigger(method) {
      this.dispatch(method);
      super._trigger(self.C3[AddonTypeMap[addonType]][id].Cnds[method]);
    }

    on(tag, callback, options) {
      if (!this.events[tag]) {
        this.events[tag] = [];
      }
      this.events[tag].push({ callback, options });
    }

    off(tag, callback) {
      if (this.events[tag]) {
        this.events[tag] = this.events[tag].filter(
          (event) => event.callback !== callback
        );
      }
    }

    dispatch(tag) {
      if (this.events[tag]) {
        this.events[tag].forEach((event) => {
          if (event.options && event.options.params) {
            const fn = self.C3[AddonTypeMap[addonType]][id].Cnds[tag];
            if (fn && !fn.call(this, ...event.options.params)) {
              return;
            }
          }
          event.callback();
          if (event.options && event.options.once) {
            this.off(tag, event.callback);
          }
        });
      }
    }

    IsDragging() {
      return this.dragging;
    }

    CanDrag(x, y, type) {
      if (type === "mouse" && !this.useMouseInput) return false;

      const dist = this.distance(
        this._inst.GetWorldInfo().GetX(),
        this._inst.GetWorldInfo().GetY(),
        x,
        y
      );
      const joyRadius = this.joystickRadius();
      let maxDist = joyRadius;
      if (this.mode !== 0) {
        maxDist = Math.max(this.zoneRadius, joyRadius);
      }
      return dist < maxDist;
    }

    joystickRadius() {
      return (
        Math.min(
          Math.abs(this._inst.GetWorldInfo().GetWidth()),
          Math.abs(this._inst.GetWorldInfo().GetHeight())
        ) / 2
      );
    }

    distance(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    angleDiff(x1, y1, x2, y2) {
      return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    }

    GetDragSource() {
      return this.dragSource;
    }

    OnDown(source, x, y) {
      const wi = this._inst.GetWorldInfo();
      this.dragSource = source;
      const dist = this.distance(wi.GetX(), wi.GetY(), x, y);
      const joyRadius = this.joystickRadius();
      this.dragging = true;

      // Trigger OnDragStart
      this._trigger("OnDragStart");

      if (this.touchEvent === 1) {
        this.fadeOut = false;
        this.fadeIn = true;
      }

      if (dist < this.zoneRadius && (this.mode === 1 || this.mode === 2)) {
        wi.SetXY(x, y);
        wi.SetBboxChanged();
        if (this.handle) {
          this.handle.GetWorldInfo().SetXY(x, y);
          this.handle.GetWorldInfo().SetBboxChanged();
        }
      } else if (dist < joyRadius) {
        if (this.handle) {
          this.handle.GetWorldInfo().SetXY(x, y);
          this.handle.GetWorldInfo().SetBboxChanged();
        }
      }
    }

    OnMove(x, y) {
      if (!this.handle) return;

      const wi = this._inst.GetWorldInfo();
      const dist = this.distance(wi.GetX(), wi.GetY(), x, y);
      const joyRadius = this.joystickRadius();
      const offsetX = x - wi.GetX();
      const offsetY = y - wi.GetY();
      const ratio = joyRadius / dist;

      if (dist <= joyRadius) {
        this.handle.GetWorldInfo().SetXY(x, y);
        this.handle.GetWorldInfo().SetBboxChanged();
      } else {
        if (this.mode === 1) {
          const off2X = offsetX - offsetX * ratio;
          const off2Y = offsetY - offsetY * ratio;
          wi.OffsetXY(off2X, off2Y);
          wi.SetBboxChanged();
          this.handle.GetWorldInfo().SetXY(x, y);
          this.handle.GetWorldInfo().SetBboxChanged();
        } else {
          this.handle
            .GetWorldInfo()
            .SetXY(wi.GetX() + offsetX * ratio, wi.GetY() + offsetY * ratio);
          this.handle.GetWorldInfo().SetBboxChanged();
        }
      }
    }

    OnUp() {
      this.dragging = false;

      // Trigger OnDragStop
      this._trigger("OnDragStop");

      if (this.touchEvent === 1) {
        this.fadeOut = true;
        this.fadeIn = false;
      } else if (this.touchEvent === 2) {
        this._inst.GetWorldInfo().SetXY(this.originX, this.originY);
        this._inst.GetWorldInfo().SetBboxChanged();
      }

      if (this.handle) {
        this.handle
          .GetWorldInfo()
          .SetXY(
            this._inst.GetWorldInfo().GetX(),
            this._inst.GetWorldInfo().GetY()
          );
        this.handle.GetWorldInfo().SetBboxChanged();
      }
    }

    _tick() {
      if (this.justLoaded) this.AfterLoad();

      if (this.fadeIn) {
        if (this._inst.GetWorldInfo().GetOpacity() < 1) {
          const timeInFrames = (60 * this.fadeTime) / 1000;
          const currentOpacity = this._inst.GetWorldInfo().GetOpacity();
          const newOpacity =
            currentOpacity + (1.1 - currentOpacity) / timeInFrames;
          this._inst.GetWorldInfo().SetOpacity(newOpacity);
          this._runtime.UpdateRender();
        }
        if (this._inst.GetWorldInfo().GetOpacity() >= 1) {
          this._inst.GetWorldInfo().SetOpacity(1);
          this.fadeIn = false;
          this.fadeOut = false;
        }
      } else if (this.fadeOut) {
        if (this._inst.GetWorldInfo().GetOpacity() > 0) {
          const timeInFrames = (60 * this.fadeTime) / 1000;
          const currentOpacity = this._inst.GetWorldInfo().GetOpacity();
          const newOpacity =
            currentOpacity + (-0.1 - currentOpacity) / timeInFrames;
          this._inst.GetWorldInfo().SetOpacity(newOpacity);
          this._runtime.UpdateRender();
        }
        if (this._inst.GetWorldInfo().GetOpacity() <= 0) {
          this._inst.GetWorldInfo().SetXY(this.originX, this.originY);
          this._inst.GetWorldInfo().SetBboxChanged();

          if (this.handle) {
            this.handle
              .GetWorldInfo()
              .SetXY(
                this._inst.GetWorldInfo().GetX(),
                this._inst.GetWorldInfo().GetY()
              );
            this.handle.GetWorldInfo().SetBboxChanged();
          }
          this._inst.GetWorldInfo().SetOpacity(0);
          this.fadeIn = false;
          this.fadeOut = false;
        }
      }

      if (
        this.handle &&
        this.handle.GetWorldInfo().GetOpacity() !==
          this._inst.GetWorldInfo().GetOpacity()
      ) {
        this.handle
          .GetWorldInfo()
          .SetOpacity(this._inst.GetWorldInfo().GetOpacity());
      }
    }

    _draw(renderer) {
      const imageInfo = this._objectClass.GetImageInfo();
      const texture = imageInfo.GetTexture();

      if (!texture) return; // dynamic texture load which hasn't completed yet; can't draw anything

      const wi = this._inst.GetWorldInfo();
      const quad = wi.GetBoundingQuad();
      const rcTex = imageInfo.GetTexRect();

      renderer.SetTexture(texture);

      if (this._runtime.IsPixelRoundingEnabled()) {
        const ox = Math.round(wi.GetX()) - wi.GetX();
        const oy = Math.round(wi.GetY()) - wi.GetY();
        const tempQuad = wi.GetBoundingQuad();
        tempQuad.offset(ox, oy);
        renderer.Quad3(tempQuad, rcTex);
      } else {
        renderer.Quad3(quad, rcTex);
      }
    }

    _release() {
      super._release();
    }

    _saveToJson() {
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

    _loadFromJson(o) {
      this.handleUID = o.handleUID;
      this.originX = o.originX;
      this.originY = o.originY;
      this.touchEvent = o.touchEvent;
      this.mode = o.mode;
      this.zoneRadius = o.zoneRadius;
      this.fadeTime = o.fadeTime;
      this.fadeIn = o.fadeIn;
      this.fadeOut = o.fadeOut;
      this.justLoaded = true;

      this.dragging = false;
      this.dragSource = "<none>";
    }

    AfterLoad() {
      this.justLoaded = false;
      this.handle = this._runtime.GetInstanceByUID(this.handleUID);
    }

    _getDebuggerProperties() {
      return [
        {
          title: "Smart Joystick",
          properties: [
            {
              name: "Handle",
              value: this.handle ? "assigned" : "null",
              readonly: true,
            },
            {
              name: "Handle X",
              value: this.handle ? this.handle.GetWorldInfo().GetX() : "null",
              readonly: true,
            },
            {
              name: "Handle Y",
              value: this.handle ? this.handle.GetWorldInfo().GetY() : "null",
              readonly: true,
            },
            {
              name: "Dragging",
              value: this.dragging,
              readonly: true,
            },
          ],
        },
      ];
    }
  };
}
