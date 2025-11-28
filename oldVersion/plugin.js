"use strict";
{
    const PLUGIN_ID = "skymen_smartJoystick";
    const PLUGIN_VERSION = "1.0.0.1";
    const PLUGIN_CATEGORY = "other";

    const PLUGIN_CLASS = SDK.Plugins.skymen_smartJoystick = class SmartJoystickPlugin extends SDK.IPluginBase
    {
        constructor()
        {
            super(PLUGIN_ID);

            SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());

            this._info.SetName(lang(".name"));
            this._info.SetDescription(lang(".description"));
            this._info.SetVersion(PLUGIN_VERSION);
            this._info.SetCategory(PLUGIN_CATEGORY);
            this._info.SetAuthor("skymen");
            this._info.SetHelpUrl(lang(".help-url"));
            this._info.SetIsSingleGlobal(false);
            this._info.SetPluginType("world");
            this._info.SetIsResizable(true); // allow to be resized
            this._info.SetIsRotatable(false); // allow to be rotated
            this._info.SetHasImage(true);
            this._info.SetSupportsEffects(true); // allow effects
            this._info.SetMustPreDraw(false);
            this._info.SetIsTiled(false);
            this._info.AddCommonAppearanceACEs();
            this._info.AddCommonSizeACEs();
            this._info.AddCommonZOrderACEs();

            this._info.SetSupportedRuntimes(["c2", "c3"]);

            SDK.Lang.PushContext(".properties");

            this._info.SetProperties([
                        new SDK.PluginProperty("link", "texture",
            {
                "linkCallback": (type) => {
                    type._objectType.EditImage()
                },
                "callbackType": "once-for-type"
            }),
                        new SDK.PluginProperty("link", "size",
            {
                "linkCallback": (instance) => {
                    let img = instance._sdkType._objectType.GetImage()
                    instance._inst.SetSize(img.GetWidth(), img.GetHeight())
                },
                "callbackType": "for-each-instance"
            }),
                        new SDK.PluginProperty("combo", "touch-event",
            {
                "items": ["None", "Fade", "Reset Position"],
                "initialValue": "None"
            }),
                        new SDK.PluginProperty("combo", "initial-state",
            {
                "items": ["Visible", "Invisible"],
                "initialValue": "Visible"
            }),
                        new SDK.PluginProperty("combo", "mode",
            {
                "items": ["None", "Smart", "Spawn"],
                "initialValue": "Smart"
            }),
                        new SDK.PluginProperty("float", "radius", 50),
                        new SDK.PluginProperty("combo", "use-mouse-input",
            {
                "items": ["Yes", "No"],
                "initialValue": "Yes"
            }),
                        new SDK.PluginProperty("integer", "fade-time", 100)
                    ]);

            SDK.Lang.PopContext(); //.properties
            SDK.Lang.PopContext();
        }
    };

    PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}