import WitcherItemSheet from './WitcherItemSheet.js';
import WitcherValuableConfigurationSheet from './configurations/WitcherValuableConfigurationSheet.js';

export default class WitcherValuableSheet extends WitcherItemSheet {
    configuration = new WitcherValuableConfigurationSheet({ document: this.item });
}
