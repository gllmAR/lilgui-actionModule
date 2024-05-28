// actionModule.js

export function addActionOptions(folder, controllers, defaultSettings, updateFunction, context) {
    const storageKey = `settings_${context}`;

    folder.add({ setToDefault: () => {
        controllers.forEach(controller => {
            const key = controller.property;
            controller.object[key] = defaultSettings[key];
            controller.updateDisplay();
        });
        updateFunction();
    } }, 'setToDefault').name('Set to Default');

    folder.add({ saveSettings: () => {
        const settingsToSave = {};
        controllers.forEach(controller => {
            const key = controller.property;
            settingsToSave[key] = controller.object[key];
        });
        localStorage.setItem(storageKey, JSON.stringify(settingsToSave));
    } }, 'saveSettings').name('Save Settings');

    folder.add({ restoreSettings: () => {
        const savedSettings = JSON.parse(localStorage.getItem(storageKey));
        if (savedSettings) {
            controllers.forEach(controller => {
                const key = controller.property;
                if (savedSettings.hasOwnProperty(key)) {
                    controller.object[key] = savedSettings[key];
                    controller.updateDisplay();
                }
            });
            updateFunction();
        }
    } }, 'restoreSettings').name('Restore Settings');

    function loadSavedSettings() {
        const savedSettings = JSON.parse(localStorage.getItem(storageKey));
        if (savedSettings) {
            controllers.forEach(controller => {
                const key = controller.property;
                if (savedSettings.hasOwnProperty(key)) {
                    controller.object[key] = savedSettings[key];
                    controller.updateDisplay();
                }
            });
        }
    }

    // Load saved settings on init
    loadSavedSettings();
}
