# Mobile Native Features

This packages includes the following widgets, to be used in a Mendix mobile hybrid application:
- MobileTransitions: transition between pages using transitions
- MobileActionMenu: tap a button to show a list of action options
- MobileDialog: info, warning, and error messages will be shown using native dialog boxes
- MobileHideSplash: hides the mobile splash screen when a page loads
- MobileSpinner: instead of the Mendix default loading dots, use the native loading spinners for your device
- MobileStatusBar: set the text color and background of the status bar (i.e, the bar with time and other settings)

NOTE: This package modifies Mendix internal JavaScript. It could break when new versions of the Mendix platform are released.

TESTED ON: Mendix 6.7.1

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Typical usage scenario

These widgets, with the exception of MobileActionMenu, are designed to be dropped on your master mobile page template. Many of them override functions in the Mendix UI code to hook into Cordova plugins.

Note: any version numbers below are simply the plugin version these widgets were tested on. Newer versions may work as well.

## Dependencies

Be sure that these Cordova plugins are included in your PhoneGap config.xml file. Without them, these widgets will not work.

### MobileTransitions

<gap:plugin name="com.telerik.plugins.nativepagetransitions" source="npm" />

### MobileActionMenu

<gap:plugin name="cordova-plugin-actionsheet" source="npm" />

### MobileDialog

<gap:plugin name="cordova-plugin-dialogs" source="npm" version="1.2.1" />

### MobileHideSplash

<gap:plugin name="cordova-plugin-splashscreen" source="npm" version="3.2.2" />

### MobileSpinner

<gap:plugin name="cordova-plugin-spinnerdialog" source="npm" />

### MobileStatusBar

<gap:plugin name="cordova-plugin-statusbar" source="npm" version="2.1.3" />

## Configuration

These widgets, with the exception of MobileActionMenu, are designed to be dropped on your master mobile page template. Many of them override functions in the Mendix UI code to hook into Cordova plugins.

### MobileTransitions

When navigating the web, it’s normal for your browser screen to flash white before loading the next page. With mobile apps, however, users expect a smooth transition between pages:

![Transition Example](http://developer.telerik.com/wp-content/uploads/2014/10/native-transitions.gif)

The MobileTransitions widget works by taking a screenshot of your current page, loading the new page, and then executing a transition to the new page.

To set up the widget, do the following:
 1. Drop the NativeTransitions Mendix widget onto your page layout
 2. Configure the animation you want to use and the CSS class to target

![Configuration Options](https://github.com/tieniber/MobileNativeFeatures/blob/master/assets/NativeTransitions.png)

 3. Add this class to any clickable region of your Mendix app: buttons, links, list view rows, menu items, etc.
 4. Native transitions work on both Apple and Android devices, though you should test them as there are some quirks.

### MobileStatusBar

Another native component in mobile apps is the status bar. That’s the one with signal strength and battery levels. You may not notice it day-to-day, but almost every app changes the background and text color of this bar based on the app’s color scheme. PhoneGap offers the ability to set the default status bar color using the config.xml file. With the MobileStatusBar widget, you can control the background and text color of the status bar on each page in your Mendix app. This widget is simple, just drop it on any page and select your background and text color:

![Status Bar Sample](https://github.com/tieniber/MobileNativeFeatures/blob/master/assets/StatusBar.png)

### MobileSpinner

Instead of the standard Mendix loading dots, drop the MobileSpinners widget onto your master page template. The widget will replace the dots with native loading screens for both iOS and Android:

All of the same options from your application model apply to these loading screens: you can use modal or non-modal spinners, and optionally include a message below the spinner icon.

![Spinner Sample iOS](https://github.com/tieniber/MobileNativeFeatures/blob/master/assets/SpinneriOS.png)
![Spinner Sample Android](https://github.com/tieniber/MobileNativeFeatures/blob/master/assets/SpinnerAndroid.png)

### MobileDialog

Mendix microflows offer a “Show Message” activity, which you can use to provide information to your user, whether that’s information, a warning, or an error. Simply drop the MobileDialog widget onto your master page template, and the widget does the rest: all Mendix loading screens will automatically become native spinners instead!

### Action Menus

You’ve seen these menus in almost every app: they provide a quick list of actions that you can take, and appropriately are called action menus:

![Action Menu Sample](https://github.com/tieniber/MobileNativeFeatures/blob/master/assets/ActionMenuiOS.png)

To include one in your Mendix application, drop the MobileAction menu, drop it on a page where you want the button that will display the action menu. Next, customize the button text and appearance, then decide what actions you want to display: options include ‘Cancel’ and ‘Delete’ which get special formatting and treatment, and then any other action you want to include. Each of these actions can fire a microflow, giving you maximum flexibility into the outcome of an action.

Action menus work on both Apple and Android devices, and you can expect to the widget to show the native menu for that device.
