import { action, condition, expression } from "../template/aceDefine.js";

const category = "general";

// Conditions
condition(
  category,
  "IsDragging",
  {
    id: "is-dragging",
    c2id: 0,
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
    id: "on-drag-start",
    c2id: 1,
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
    id: "on-drag-stop",
    c2id: 2,
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
    id: "bind-handle",
    c2id: 0,
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Bind Handle",
    displayText: "Bind {0} to joystick handle",
    description: "Bind Handle",
    params: [
      {
        id: "param0",
        name: "Handle",
        desc: "The Handle to bind.",
        type: "object",
        allowedPluginIds: ["<world>"],
      },
    ],
  },
  function (objectClass) {
    if (this.handle) {
      this.handle.destroy();
    }
    this.handle = objectClass.createInstance(this.layer.name, this.x, this.y);
    if (this.handle) {
      this.handleUID = this.handle.uid;
    }
  }
);

action(
  category,
  "SetRadius",
  {
    id: "set-radius",
    c2id: 1,
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Radius",
    displayText: "Set radius to {0}",
    description: "Set radius",
    params: [
      {
        id: "param0",
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
    id: "set-mode",
    c2id: 2,
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Mode",
    displayText: "Set mode to {0}",
    description: "Set Mode",
    params: [
      {
        id: "param3",
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
    id: "set-event",
    c2id: 3,
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Touch Event",
    displayText: "Set touch event to {0}",
    description: "Set Touch Event",
    params: [
      {
        id: "param3",
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
    id: "joystick-angle",
    c2id: 0,
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's angle",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    return this.angleDiff(this.x, this.y, this.handle.x, this.handle.y);
  }
);

expression(
  category,
  "JoystickDistance",
  {
    id: "joystick-distance",
    c2id: 1,
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's distance",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    return this.distance(this.x, this.y, this.handle.x, this.handle.y);
  }
);

expression(
  category,
  "JoystickForce",
  {
    id: "joystick-force",
    c2id: 2,
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's force",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    const dist = this.distance(this.x, this.y, this.handle.x, this.handle.y);
    const radius = this.joystickRadius();
    return dist / radius;
  }
);

expression(
  category,
  "JoystickRadius",
  {
    id: "joystick-radius",
    c2id: 3,
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
    id: "joystick-x",
    c2id: 4,
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's X position",
    params: [],
  },
  function () {
    return this.x;
  },
  false
);

expression(
  category,
  "JoystickY",
  {
    id: "joystick-y",
    c2id: 5,
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's Y position",
    params: [],
  },
  function () {
    return this.y;
  },
  false
);

expression(
  category,
  "JoystickDirX",
  {
    id: "joystick-dir-x",
    c2id: 6,
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's X displacement",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    return this.handle.x - this.x;
  }
);

expression(
  category,
  "JoystickDirY",
  {
    id: "joystick-dir-y",
    c2id: 7,
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's Y displacement",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    return this.handle.y - this.y;
  }
);

expression(
  category,
  "JoystickForceX",
  {
    id: "joystick-force-x",
    c2id: 8,
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's X force",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    const dist = this.handle.x - this.x;
    const radius = this.joystickRadius();
    return dist / radius;
  }
);

expression(
  category,
  "JoystickForceY",
  {
    id: "joystick-force-y",
    c2id: 9,
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Returns the joystick's Y force",
    params: [],
  },
  function () {
    if (!this.handle) return 0;
    const dist = this.handle.y - this.y;
    const radius = this.joystickRadius();
    return dist / radius;
  }
);
