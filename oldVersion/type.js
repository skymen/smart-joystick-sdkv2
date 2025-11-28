"use strict";
{
    const PLUGIN_CLASS = SDK.Plugins.skymen_smartJoystick;

    PLUGIN_CLASS.Type = class SmartJoystickType extends SDK.ITypeBase
    {
        constructor(sdkPlugin, iObjectType)
        {
            super(sdkPlugin, iObjectType);
        }
    };
}