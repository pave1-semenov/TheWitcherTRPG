export let ItemEditMixin = (superclass) => class extends superclass {
    static async _onItemEdit(event, target) {
        event.preventDefault()

        const itemId = target.closest('.item').dataset.itemId
        const item = this.actor.items.get(itemId)

        if (item) {
            item.sheet.render(true)
        }
    }

    async _onItemInlineEdit(event) {
        event.preventDefault()
        event.stopPropagation()

        let element = event.currentTarget
        let itemId = element.closest('.item').dataset.itemId
        console.log(itemId, this.actor)
        let item = this.actor.items.get(itemId)
        let field = element.dataset.field
        // Edit checkbox values
        let value = element.value 
        if (value == 'false') {
            value = true;
        }
        if (value == 'true' || value == 'checked') {
            value = false;
        }

        return item.update({ [field]: value })
    }
};