import { getInteractActor } from '../../scripts/helper.js'
import { RollConfig } from '../../scripts/rollConfig.js'
import { extendedRoll } from '../../scripts/rolls/extendedRoll.js'
import { ItemEditMixin } from './mixins/itemEditMixin.js'

const ActorSheetV2 = foundry.applications.sheets.ActorSheetV2
const { HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api

export default class WitcherForageSheet extends HandlebarsApplicationMixin(ItemEditMixin(ActorSheetV2)) {
    static PARTS = {
        form: {
            template: 'systems/TheWitcherTRPG/templates/sheets/actor/forage-sheet.hbs'
        }
    }

    static DEFAULT_OPTIONS = {
        classes: ['witcher', 'sheet', 'actor'],
        position: {
            height: 1024,
            width: 768,
        },
        dragDrop: [{ dragSelector: '[data-drag]', dropSelector: null }],
        actions: {
            forage: WitcherForageSheet._onForage,
            importFromCompendium: WitcherForageSheet._fromCompendium,
            editItem: WitcherForageSheet._onItemEdit
        }
    }

    #dragDrop;

    constructor(options = {}) {
        super(options);
        this.#dragDrop = this.#createDragDropHandlers();
    }

    #createDragDropHandlers() {
        return this.options.dragDrop.map((d) => {
            d.permissions = {
                dragstart: this._canDragStart.bind(this),
                drop: this._canDragDrop.bind(this),
            };
            d.callbacks = {
                dragstart: this._onDragStart.bind(this),
                dragover: this._onDragOver.bind(this),
                drop: this._onDrop.bind(this),
            };
            return new DragDrop(d);
        });
    }

    async _prepareContext() {
        return {
            allComponents: this.actor.getList('component'),
            isGM: game.user.isGM,
        }
    }

    static async _onForage(event, target) {
        let itemId = target.closest('.item').dataset.itemId
        let item = this.actor.items.get(itemId)

        let actor = await getInteractActor()

        const rollFormula = this.prepareRollFormula(actor)

        let config = this.prepareRollConfig(item)
        let messageData = await this.initMessageData(actor)

        let roll = await extendedRoll(rollFormula, messageData, config)
        const success = roll.total > config.threshold

        if (success) {
            const itemsCount = await new Roll(item.system.quantityObtainable).evaluate()
            messageData.flavor += `<h3>${itemsCount.total} штук</h3>`
            actor.addItem(item, itemsCount.total)
        }

        roll.toMessage(messageData)
    }

    static async _fromCompendium(event, target) {
        const compendiums = [game.packs.get("wtrpg-complete-compendium.crafting"), game.packs.get("wtrpg-complete-compendium.gear")]

        if (compendiums.length === 2) {

            const dialogTemplate = await renderTemplate(
                'systems/TheWitcherTRPG/templates/dialog/forage-import.hbs'
            )

            const { location } = await DialogV2.prompt({
                window: { title: `${game.i18n.localize('WITCHER.Spell.MagicCost')}` },
                content: dialogTemplate,
                modal: true,
                ok: {
                    callback: (event, button, dialog) => {
                        return {
                            location: button.form.elements.location?.value
                        };
                    }
                }
            });

            const promises = compendiums.map(c => c.getDocuments({ type: 'component' }))

            const foundItems = (await Promise.all(promises)).flat().filter(c => c.system.location.toLowerCase().includes(location))

            foundItems.forEach(f => this.actor.addItem(f, 1))

        }
    }

    prepareRollFormula(actor) {
        const stat = actor.system.stats.cra.current
        const statName = game.i18n.localize(CONFIG.WITCHER.statMap.int.label)

        const skill = actor.system.skills.int.wilderness.value
        const skillName = game.i18n.localize(CONFIG.WITCHER.skillMap.wilderness.label)

        const displayRollDetails = game.settings.get("TheWitcherTRPG", "displayRollsDetails")

        let rollFormula = displayRollDetails
            ? `1d10+${stat}[${statName}]+${skill}[${skillName}]`
            : `1d10 + ${stat} + ${skill}`

        rollFormula += actor.addAllModifiers("wilderness")

        return rollFormula
    }

    prepareRollConfig(item) {
        let config = new RollConfig()

        config.showCrit = true
        config.showSuccess = true
        config.showResult = false
        config.threshold = parseInt(item.system.forage)
        config.thresholdDesc = `Wilderness survival`
        config.messageOnSuccess = 'Success!'
        config.messageOnFailure = 'Failure'

        return config
    }

    async initMessageData(actor) {
        return {
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            flavor: `<p>SOBIRALKA</p>`
        }
    }

    _onItemHide(event) {
        event.preventDefault();
        let itemId = event.currentTarget.closest('.item').dataset.itemId;
        let item = this.actor.items.get(itemId);
        item.update({ 'system.isHidden': !item.system.isHidden });
    }

    _onRender(context, options) {
        this.#dragDrop.forEach((d) => d.bind(this.element));
    }

    async _onDrop(event) {
        const data = TextEditor.getDragEventData(event)
        console.log(event, data)
        this._onDropItem(event, data)
    }

    _onDragOver(event) { }

    _onDragStart(event) {
        const el = event.currentTarget;
        if ('link' in event.target.dataset) return;

        // Extract the data you need
        let dragData = null;

        if (!dragData) return;

        // Set data transfer
        event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    }

    _canDragStart(selector) {
        // game.user fetches the current user
        return this.isEditable;
    }


    _canDragDrop(selector) {
        // game.user fetches the current user
        return this.isEditable;
    }

    _onRender(context, options) {
        // Inputs with class `item-quantity`
        Array.from(this.element.querySelectorAll('.inline-edit')).forEach((input) => {
            input.addEventListener("change", this._onItemInlineEdit.bind(this))
        })
    }
}