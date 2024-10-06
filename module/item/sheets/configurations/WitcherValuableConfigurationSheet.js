import WitcherConsumableConfigurationSheet from './templates/WitcherConsumableConfigurationSheet.js';

export default class WitcherValuableConfigurationSheet extends WitcherConsumableConfigurationSheet {
    static DEFAULT_OPTIONS = {
        classes: ['item-valuable']
    };

    static PARTS = {
        valuableConfiguration: {
            template: `systems/TheWitcherTRPG/templates/sheets/item/configuration/valuableConfiguration.hbs`
        }
    };
}
