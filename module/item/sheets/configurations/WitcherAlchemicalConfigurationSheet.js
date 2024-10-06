import WitcherConsumableConfigurationSheet from './templates/WitcherConsumableConfigurationSheet.js';

export default class WitcherAlchemicalConfigurationSheet extends WitcherConsumableConfigurationSheet {
    static DEFAULT_OPTIONS = {
        classes: ['item-alchemical']
    };

    static PARTS = {
        alchemicalConfiguration: {
            template: `systems/TheWitcherTRPG/templates/sheets/item/configuration/alchemicalConfiguration.hbs`
        }
    };
}
