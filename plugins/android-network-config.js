const { withAndroidManifest } = require("expo/config-plugins");

module.exports = function withAndroidNetworkConfig(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    
    // 1. Add INTERNET permission (outside <application>)
    const internetPermission = {
      $: {
        "android:name": "android.permission.INTERNET"
      }
    };
    
    // Check if INTERNET permission already exists
    const existingPermissions = androidManifest.manifest["uses-permission"] || [];
    const hasInternetPermission = existingPermissions.some(
      permission => permission.$["android:name"] === "android.permission.INTERNET"
    );
    
    if (!hasInternetPermission) {
      if (!androidManifest.manifest["uses-permission"]) {
        androidManifest.manifest["uses-permission"] = [];
      }
      androidManifest.manifest["uses-permission"].push(internetPermission);
    }
    
    // 2. Add usesCleartextTraffic to <application> tag
    const application = androidManifest.manifest.application[0];
    application.$["android:usesCleartextTraffic"] = "true";
    
    return config;
  });
};