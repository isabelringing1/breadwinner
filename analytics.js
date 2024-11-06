function reportLoafBought(loaf, breadBaked, ovenSize, id) {
    gtag('event', 'loaf-bought', {
        'player_id': id,
        'loaf_id': loaf.id,
        'times_purchased': loaf.purchase_count,
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
        'times_purchased': loaf.purchase_count,
        'total_loaves': breadBaked,
        'oven_size': ovenSize,
        'time_since_finish': timeSinceFinish
      });
}


function reportTimerUsed(loaf, timers, percentFinished, breadBaked, ovenSize, id) {
    gtag('event', 'timer-used', {
        'player_id': id,
        'loaf_id': loaf.id,
        'timers_used': timers,
        'percent_finished': Math.round(percentFinished),
        'times_purchased': loaf.purchase_count,
        'total_loaves': breadBaked,
        'oven_size': ovenSize
      });
}

function reportAchievementClaimed(achievement, achievementSize) {
    gtag("event", "unlock_achievement", {
        achievement_id: achievement.id,
        "achievements_total": achievementSize
    });
}

function reportEnvelopeAnswer(buttonId) {
    gtag("event", "select_content", {
        content_type: "envelope-button-selection",
        content_id: buttonId
    });
}


export { reportLoafBought, reportSupplyBought, reportLoafSold, reportTimerUsed, reportAchievementClaimed, reportEnvelopeAnswer }