function reportLoafBought(loaf, breadBaked, ovenSize, id) {
    gtag('event', 'loaf-bought', {
        'player_id': id,
        'loaf_id': loaf.id,
        'times-purchased': loaf.purchase_count,
        'total_loaves': breadBaked,
        'oven_size': ovenSize,
      });
}

function reportSupplyBought(supply, breadBaked, ovenSize, id) {
    gtag('event', 'supply-bought', {
        'player_id': id,
        'total_loaves': breadBaked,
        'oven_size': ovenSize,
        'supply_id': supply.id,
      });
}

function reportLoafSold(loaf, breadBaked, ovenSize, timeSinceFinish, id) {
    gtag('event', 'loaf-sold', {
        'player_id': id,
        'loaf_id': loaf.id,
        'times-purchased': loaf.purchase_count,
        'total_loaves': breadBaked,
        'oven_size': ovenSize,
        'time-since-finish': timeSinceFinish
      });
}


function reportTimerUsed(loaf, timers, percentFinished, breadBaked, ovenSize, id) {
    gtag('event', 'timer-used', {
        'player_id': id,
        'loaf_id': loaf.id,
        'timers_used': timers,
        'percent-finished': Math.round(percentFinished),
        'times-purchased': loaf.purchase_count,
        'total_loaves': breadBaked,
        'oven_size': ovenSize
      });
}


export { reportLoafBought, reportSupplyBought, reportLoafSold, reportTimerUsed }