import WitcheActiveEffectConfigurationSheet from './templates/WitcherActiveEffectConfigurationSheet.js';

export default class WitcherArmorConfigurationSheet extends WitcheActiveEffectConfigurationSheet {
    static DEFAULT_OPTIONS = {
        classes: ['item-armor']
    };

    static PARTS = {
        armorConfiguration: {
            template: `systems/TheWitcherTRPG/templates/sheets/item/configuration/armorConfiguration.hbs`
        }
    };
}
