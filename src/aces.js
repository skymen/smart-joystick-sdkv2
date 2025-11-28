import { action, condition, expression } from "../template/aceDefine.js";

const category = "general";

// Conditions
condition(
  category,
  "IsDragging",
  {
    highlight: false,
    deprecated: false,
    listName: "Is dragging",
    displayText: "Is dragging",
    description: "True when the joystick is used",
    params: [],
  },
  function () {
    return this.dragging;
  }
);

condition(
  category,
  "OnDragStart",
  {
    highlight: false,
    deprecated: false,
    isTrigger: true,
    listName: "On drag start",
    displayText: "On drag start",
    description: "Triggered when the joystick starts being used",
    params: [],
  },
  function () {
    return true;
  }
);

condition(
  category,
  "OnDragStop",
  {
    highlight: false,
    deprecated: false,
    isTrigger: true,
    listName: "On drag end",
    displayText: "On drag end",
    description: "Triggered when the joystick stops being used",
    params: [],
  },
  function () {
    return true;
  }
);

// Actions
action(
  category,
  "BindHandle",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Bind Handle",
    displayText: "Bind {0} to joystick handle",
    description: "Bind Handle",
    params: [
      {
        id: "handle",
        name: "Handle",
        desc: "The Handle to bind.",
        type: "object",
        allowedPluginIds: ["Sprite"],
      },
    ],
  },
  function (type) {
    if (this.handle) {
      this._runtime.DestroyInstance(this.handle);
    }
    this.handle = this._runtime.CreateInstance(
      type,
      this._inst.GetWorldInfo().GetLayer().GetIndex(),
      this._inst.GetWorldInfo().GetX(),
      this._inst.GetWorldInfo().GetY()
    );
    if (this.handle) {
      this.handleUID = this.handle.GetUID();
    }
  }
);

action(
  category,
  "SetRadius",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Radius",
    displayText: "Set radius to {0}",
    description: "Set radius",
    params: [
      {
        id: "radius",
        name: "Radius",
        desc: "The radius to set",
        type: "number",
        initialValue: "50",
      },
    ],
  },
  function (radius) {
    this.zoneRadius = radius;
  }
);

action(
  category,
  "SetMode",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Mode",
    displayText: "Set mode to {0}",
    description: "Set Mode",
    params: [
      {
        id: "mode",
        name: "Mode",
        desc: "The mode to set",
        type: "combo",
        initialValue: "smart",
        items: [{ none: "None" }, { smart: "Smart" }, { spawn: "Spawn" }],
      },
    ],
  },
  function (mode) {
    this.mode = mode;
  }
);

action(
  category,
  "SetEvent",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Touch Event",
    displayText: "Set touch event to {0}",
    description: "Set Touch Event",
    params: [
      {
        id: "event",
        name: "Event",
        desc: "The event to set",
        type: "combo",
        initialValue: "none",
        items: [{ none: "None" }, { fade: "Fade" }, { spawn: "Spawn" }],
      },
    ],
  },
  function (event) {
    this.touchEvent = event;
  }
);

// Expressions
expression(
  category,
  "JoystickAngle",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's angle",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    return this.angleDiff(
      this._inst.GetWorldInfo().GetX(),
      this._inst.GetWorldInfo().GetY(),
      this.handle.GetWorldInfo().GetX(),
      this.handle.GetWorldInfo().GetY()
    );
  },
  false
);

expression(
  category,
  "JoystickDistance",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's distance",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    return this.distance(
      this._inst.GetWorldInfo().GetX(),
      this._inst.GetWorldInfo().GetY(),
      this.handle.GetWorldInfo().GetX(),
      this.handle.GetWorldInfo().GetY()
    );
  },
  false
);

expression(
  category,
  "JoystickForce",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's force",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    const dist = this.distance(
      this._inst.GetWorldInfo().GetX(),
      this._inst.GetWorldInfo().GetY(),
      this.handle.GetWorldInfo().GetX(),
      this.handle.GetWorldInfo().GetY()
    );
    const radius = this.joystickRadius();
    return dist / radius;
  },
  false
);

expression(
  category,
  "JoystickRadius",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's radius",
    params: [],
  },
  function () {
    return this.joystickRadius();
  },
  false
);

expression(
  category,
  "JoystickX",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's X position",
    params: [],
  },
  function () {
    return this._inst.GetWorldInfo().GetX();
  },
  false
);

expression(
  category,
  "JoystickY",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's Y position",
    params: [],
  },
  function () {
    return this._inst.GetWorldInfo().GetY();
  },
  false
);

expression(
  category,
  "JoystickDirX",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's X displacement",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    return this.handle.GetWorldInfo().GetX() - this._inst.GetWorldInfo().GetX();
  },
  false
);

expression(
  category,
  "JoystickDirY",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's Y displacement",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    return this.handle.GetWorldInfo().GetY() - this._inst.GetWorldInfo().GetY();
  },
  false
);

expression(
  category,
  "JoystickForceX",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's X force",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    const dist =
      this.handle.GetWorldInfo().GetX() - this._inst.GetWorldInfo().GetX();
    const radius = this.joystickRadius();
    return dist / radius;
  },
  false
);

expression(
  category,
  "JoystickForceY",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's Y force",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    const dist =
      this.handle.GetWorldInfo().GetY() - this._inst.GetWorldInfo().GetY();
    const radius = this.joystickRadius();
    return dist / radius;
  },
  false
);
