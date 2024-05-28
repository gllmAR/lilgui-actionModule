// actionModule.js

export function addActionOptions(gui, controllers, defaultSettings, updateFunction, context) {
    const storageKey = `settings_${context}`;

    const options = {
        action: 'None',
        default: () => {
            controllers.forEach(controller => {
                const key = controller.property;
                controller.object[key] = defaultSettings[key];
                controller.updateDisplay();
            });
            updateFunction();
        },
        save: () => {
            const settingsToSave = {};
            controllers.forEach(controller => {
                const key = controller.property;
                settingsToSave[key] = controller.object[key];
            });
            localStorage.setItem(storageKey, JSON.stringify(settingsToSave));
        },
        restore: () => {
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
        }
    };

    const actionOptions = {
        'None': 'None',
        'Set to Default': 'default',
        'Save Settings': 'save',
        'Restore Settings': 'restore'
    };

    gui.add(options, 'action', actionOptions).name('Actions').onChange(value => {
        if (value !== 'None') {
            options[value]();
            options.action = 'None'; // Reset to 'None' after action is executed
        }
    });

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
