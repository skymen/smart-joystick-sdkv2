import {
  ADDON_CATEGORY,
  ADDON_TYPE,
  PLUGIN_TYPE,
  PROPERTY_TYPE,
} from "./template/enums.js";
import _version from "./version.js";
export const addonType = ADDON_TYPE.PLUGIN;
export const type = PLUGIN_TYPE.WORLD;
export const id = "skymen_smartJoystick";
export const name = "Smart Joystick";
export const version = _version;
export const minConstructVersion = undefined;
export const author = "skymen";
export const website = "https://www.construct.net";
export const documentation = "https://www.construct.net";
export const description = "A smart joystick plugin";
export const category = ADDON_CATEGORY.INPUT;

export const hasDomside = false;
export const files = {
  extensionScript: {
    enabled: false, // set to false to disable the extension script
    watch: true, // set to true to enable live reload on changes during development
    targets: ["x86", "x64"],
    // you don't need to change this, the build step will rename the dll for you. Only change this if you change the name of the dll exported by Visual Studio
    name: "MyExtension",
  },
  fileDependencies: [],
  cordovaPluginReferences: [],
  cordovaResourceFiles: [],
};

// categories that are not filled will use the folder name
export const aceCategories = {};

export const info = {
  icon: "icon.svg",
  // PLUGIN world only
  // defaultImageUrl: "default-image.png",
  Set: {
    // COMMON to all
    CanBeBundled: true,
    IsDeprecated: false,
    GooglePlayServicesEnabled: false,

    // BEHAVIOR only
    IsOnlyOneAllowed: false,

    // PLUGIN world only
    IsResizable: true,
    IsRotatable: true,
    Is3D: false,
    HasImage: true,
    IsTiled: false,
    SupportsZElevation: false,
    SupportsColor: true,
    SupportsEffects: true,
    MustPreDraw: false,

    // PLUGIN object only
    IsSingleGlobal: false,
  },
  // PLUGIN only
  AddCommonACEs: {
    Position: true,
    SceneGraph: false,
    Size: true,
    Angle: true,
    Appearance: true,
    ZOrder: true,
  },
};

export const properties = [
  {
    type: PROPERTY_TYPE.LINK,
    id: "texture",
    options: {
      linkText: "Edit",
      callbackType: "once-for-type",
      linkCallback: function (instOrObj) {
        instOrObj.EditImage();
      },
    },
    name: "Texture",
    desc: "Click to edit the object's texture.",
  },
  {
    type: PROPERTY_TYPE.LINK,
    id: "size",
    options: {
      linkText: "Make 1:1",
      callbackType: "for-each-instance",
      linkCallback: function (inst) {
        const img = inst.GetObjectType().GetImage();
        inst.SetSize(img.GetWidth(), img.GetHeight());
      },
    },
    name: "Size",
    desc: "Click to set the object to the same size as its image.",
  },
  {
    type: PROPERTY_TYPE.COMBO,
    id: "touch_event",
    options: {
      initialValue: "none",
      items: [{ none: "None" }, { fade: "Fade" }, { reset: "Reset Position" }],
    },
    name: "Touch Event",
    desc: "What to do on touch start and touch end",
  },
  {
    type: PROPERTY_TYPE.COMBO,
    id: "initial_state",
    options: {
      initialValue: "visible",
      items: [{ visible: "Visible" }, { invisible: "Invisible" }],
    },
    name: "Initial State",
    desc: "If Fade, decides if the joystick starts visible or not.",
  },
  {
    type: PROPERTY_TYPE.COMBO,
    id: "mode",
    options: {
      initialValue: "none",
      items: [{ none: "None" }, { smart: "Smart" }, { spawn: "Spawn" }],
    },
    name: "Mode",
    desc: "None behaves like a regular joystick. Smart follows the handle if it gets too far. Spawn spawns the joystick if clicked anywhere within the radius then behaves like a regular joystick.",
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "radius",
    options: {
      initialValue: 100,
      interpolatable: false,
      minValue: 0,
    },
    name: "Radius",
    desc: "Only if smart or spawn. Decides the radius in which the joystick gets triggered anyway.",
  },
  {
    type: PROPERTY_TYPE.COMBO,
    id: "use_mouse_input",
    options: {
      initialValue: "yes",
      items: [{ yes: "Yes" }, { no: "No" }],
    },
    name: "Use Mouse Input",
    desc: "Whether to use mouse input or only touch input",
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "fade_time",
    options: {
      initialValue: 300,
      interpolatable: false,
      minValue: 0,
    },
    name: "Fade time",
    desc: "Only if Touch event is set to fade. The time is in milliseconds.",
  },
];
