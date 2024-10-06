import WitcherConfigurationSheet from './WitcherConfigurationSheet.js';

export default class WitcheActiveEffectConfigurationSheet extends WitcherConfigurationSheet {
    /** @override */
    async _prepareContext() {
        const context = await super._prepareContext();
        // Prepare active effects for easier access
        context.effects = this.prepareActiveEffectCategories(context.system.effects);

        return context;
    }

    _onRender(context, options) {
        super._onRender(context, options);
        this.activateListeners($(this.element));
    }

    activateListeners(html) {
        // Active Effect management
        html.on('click', '.effect-control', ev => this.onManageActiveEffect(ev, this.item));
    }

    /**
     * Prepare the data structure for Active Effects which are currently embedded in an Actor or Item.
     * @param {ActiveEffect[]} effects    A collection or generator of Active Effect documents to prepare sheet data for
     * @returns {object}                   Data for rendering
     */
    prepareActiveEffectCategories(effects) {
        // Define effect header categories
        const categories = {
            temporary: {
                type: 'temporary',
                label: game.i18n.localize('WITCHER.activeEffect.temporary'),
                effects: []
            },
            passive: {
                type: 'passive',
                label: game.i18n.localize('WITCHER.activeEffect.passive'),
                effects: []
            },
            inactive: {
                type: 'inactive',
                label: game.i18n.localize('WITCHER.activeEffect.inactive'),
                effects: []
            }
        };

        // Iterate over active effects, classifying them into categories
        for (let e of effects) {
            if (e.disabled) categories.inactive.effects.push(e);
            else if (e.isTemporary) categories.temporary.effects.push(e);
            else categories.passive.effects.push(e);
        }
        return categories;
    }

    /**
     * Manage Active Effect instances through an Actor or Item Sheet via effect control buttons.
     * @param {MouseEvent} event      The left-click event on the effect control
     * @param {Actor|Item} owner      The owning document which manages this effect
     * @returns {object}              effect function
     */
    onManageActiveEffect(event, owner) {
        event.preventDefault();
        const a = event.currentTarget;
        const li = a.closest('li');
        const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;
        switch (a.dataset.action) {
            case 'create':
                return owner.createEmbeddedDocuments('ActiveEffect', [
                    {
                        'name': game.i18n.format('DOCUMENT.New', {
                            type: game.i18n.localize('DOCUMENT.ActiveEffect')
                        }),
                        'icon': 'icons/svg/aura.svg',
                        'origin': owner.uuid,
                        'duration.rounds': li.dataset.effectType === 'temporary' ? 1 : undefined,
                        'disabled': li.dataset.effectType === 'inactive'
                    }
                ]);
            case 'edit':
                return effect.sheet.render(true);
            case 'delete':
                return effect.delete();
            case 'toggle':
                return effect.update({ disabled: !effect.disabled });
        }
    }
}