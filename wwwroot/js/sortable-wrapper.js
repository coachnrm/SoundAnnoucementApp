window.initializeSortable = (columnId, dotNetHelper) => {
    const el = document.getElementById(columnId);
    Sortable.create(el, {
        group: 'shared',
        animation: 150,
        onEnd: function (evt) {
            const fromColumn = evt.from.dataset.column;
            const toColumn = evt.to.dataset.column;
            const cardId = evt.item.dataset.card;
            dotNetHelper.invokeMethodAsync('OnCardDropped', fromColumn, toColumn, cardId);
        }
    });
};
