export default class WitcherConfigurationSheet extends foundry.applications.api.HandlebarsApplicationMixin(
    foundry.applications.sheets.ItemSheetV2
) {
    static DEFAULT_OPTIONS = {
        tag: 'div',
        position: {
            width: 520,
            height: 480
        },
        classes: ['witcher', 'sheet', 'item'],
        dragDrop: [
            {
                dragSelector: '.items-list .item',
                dropSelector: null
            }
        ]
    };

    static PARTS = {
        WitcherConfigurationSheet: {
            template: './modules/foo/templates/form.hbs'
        }
    };

    #dragDrop;

    /** @override */
    // static get defaultOptions() {
    //     return foundry.utils.mergeObject(super.defaultOptions, {
    //         tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body' }]
    //     });
    // }

    constructor(options = {}) {
        super(options);
        this.#dragDrop = this.#createDragDropHandlers();
    }

    /**
     * Create drag-and-drop workflow handlers for this Application
     * @returns {DragDrop[]}     An array of DragDrop handlers
     * @private
     */
    #createDragDropHandlers() {
        return this.options.dragDrop.map(d => {
            d.permissions = {
                dragstart: this._canDragStart.bind(this),
                drop: this._canDragDrop.bind(this)
            };
            d.callbacks = {
                dragstart: this._onDragStart.bind(this),
                dragover: this._onDragOver.bind(this),
                drop: this._onDrop.bind(this)
            };
            return new DragDrop(d);
        });
    }

    get template() {
        return `systems/TheWitcherTRPG/templates/sheets/item/configuration/${this.object.type}Configuration.hbs`;
    }

    _onRender(context, options) {
        this.#dragDrop.forEach(d => d.bind(this.element));
    }

    /** @override */
    _prepareContext() {
        const data = super._prepareContext();
        data.config = CONFIG.WITCHER;

        this.options.classes.push(`item-${this.item.type}`);
        data.data = data.item?.system;
        return data;
    }
}
