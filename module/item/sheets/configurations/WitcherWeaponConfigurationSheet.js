import WitcherDamagePropertiesConfigurationSheet from './templates/WitcherDamagePropertiesConfigurationSheet.js';

export default class WitcherWeaponConfigurationSheet extends WitcherDamagePropertiesConfigurationSheet {
    static DEFAULT_OPTIONS = {
        classes: ['item-weapon']
    };

    static PARTS = {
        weaponConfiguration: {
            template: `systems/TheWitcherTRPG/templates/sheets/item/configuration/weaponConfiguration.hbs`
        }
    };
}
