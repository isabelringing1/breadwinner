import Card from './Card'

function CardList(props){
    const { id, title, items, onCardClicked, shouldShow, shouldDisable, toggleTooltip, maxItems } = props;

    var itemsShown = 0;
    var showArr = []
    items.map(item => {
        var show = itemsShown >= maxItems ? false : shouldShow(item.id)
        showArr.push(show)
        if (show){
            itemsShown++;
        }
    });
    return <div id={id}> 
        { itemsShown > 0 ? <div className="card-section-title" id={id+"-title"}>{title}</div> : null }
        { items.map((item, i) => {
            return showArr[i] ? <Card item={item} onClick={onCardClicked} key={item.id} toggleTooltip={toggleTooltip} isDisabled={shouldDisable(item.id)}/> : null}
        )}
    </div>
}

export default CardList;