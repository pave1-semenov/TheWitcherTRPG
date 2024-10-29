const DialogV2 = foundry.applications.api.DialogV2;

export const deprecationWarnings = function () {
    globalModifiers();
};

async function globalModifiers() {
    let affectedActors = game.actors
        .filter(actor => actor.isOwner)
        .filter(actor => actor.items.some(item => item.type == 'globalModifier'));

    let affectedItems = game.items.filter(item => item.type == 'globalModifier');

    if (affectedActors.length > 0 || affectedItems.length > 0) {
        const dialogTemplate = await renderTemplate(
            'systems/TheWitcherTRPG/templates/dialog/deprecations/globalModifiers.hbs',
            { affectedActors, affectedItems }
        );
        DialogV2.prompt({
            window: { title: `${game.i18n.localize('WITCHER.Deprecations.globalModifier.title')}` },
            content: dialogTemplate
        });
    }
}