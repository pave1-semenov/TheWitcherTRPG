export default class WitcherConfigurationSheet extends foundry.applications.api.HandlebarsApplicationMixin(
    foundry.applications.sheets.ItemSheetV2
) {
    static DEFAULT_OPTIONS = {
        tag: 'div',
        position: {
            width: 520,
            height: 480
        },
        window: {
            contentClasses: ['witcher', 'sheet', 'item']
        }
    };

    /** @override */
    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        context.config = CONFIG.WITCHER;

        context.item = this.document;
        context.system = this.document.system;
        return context;
    }
}
