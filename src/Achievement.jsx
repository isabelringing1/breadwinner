import './Achievements.css'

import lock from '/images/lock.png'
import corner from '/images/corner.png'

function Achievement(props) {
    const { achievement, toggleTooltip, claimAchievement } = props
    var state = "locked"
    if (achievement.claimed) {
        state = "claimed";
    }
    else if (achievement.achieved) {
        state = "achieved"
    }
    else if (achievement.revealed) {
        state = "revealed"
    }

    const onHover = () => {
        if (!achievement.achieved || achievement.claimed) {
            return;
        }
        document.getElementById(achievement.id).classList.add("ready-to-claim")
    }

    const onHoverEnd = () => {
        if (document.getElementById(achievement.id).classList.contains("ready-to-claim")) {
            document.getElementById(achievement.id).classList.remove('ready-to-claim');
        }
    }

    const onClick = (e) => {
        e.stopPropagation();
        if (achievement.achieved && !achievement.claimed) {
            claimAchievement(achievement);
        }
    }

    return (<div className={achievement.category + "-category achievement " + state} id={achievement.id}
        onMouseMove={(e) => {
            onHover();
            var x = e.clientX < window.innerWidth - 300 ? e.clientX + 30 : e.clientX - 240
            toggleTooltip(true, [x, e.clientY + 30], achievement);
        }}
        onMouseLeave={() => {
            onHoverEnd()
            toggleTooltip(false);
        }}
        onClick={onClick}>
        {achievement.revealed ? <img src={achievement.image_path} className="achievement-img" /> : null}
        {!achievement.revealed ? <div className="question-mark">?</div> : null}
        {achievement.revealed && !achievement.achieved ? <div className='shadow'><img src={lock} className="lock" /></div> : null}
        {achievement.achieved && !achievement.claimed ? <img src={corner} className="corner" /> : null}
    </div>)
}

export default Achievement;