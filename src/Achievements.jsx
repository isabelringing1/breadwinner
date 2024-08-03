import { useState, useRef, useEffect } from "react";
import { formatNumber } from "./Util";

import "./Achievements.css";

import Achievement from "./Achievement";
import Markdown from "react-markdown";

import spiral from "/images/spiral.png";
import bookmarkBody from "/images/bookmark-body.png";
import bookmarkRibbon from "/images/bookmark-ribbon.png";

function Achievements(props) {
  const {
    showAchievements,
    setShowAchievements,
    AchievementsObject,
    setAchievementsObject,
    toggleTooltip,
    events,
    breadCoin,
    setBreadCoin,
    totalEarned,
    setTotalEarned,
    loaded
  } = props;

  const animating = useRef(false);

  var achievements = [];
  for (var categoryName in AchievementsObject) {
    var category = AchievementsObject[categoryName];
    for (var a in category) {
      achievements.push(category[a]);
    }
  }

  const [alertAchievement, setAlertAchievement] = useState(achievements[0]);

  useEffect(() => {
    var newAchievements = { ...AchievementsObject };
    for (var i = 0; i < events.length; i++) {
      var event = events.pop();
      console.log("listening to event ", event);
      switch (event.id) {
        case 'total-conversions':
          var productivityAchievements = AchievementsObject["productivity"];
          // if we've reached half of 1st goal, show the bookmark for the first time.
          if (
            !productivityAchievements[0].revealed &&
            event.amount >= productivityAchievements[0].amount / 2
          ) {
            newAchievements["productivity"][0].revealed = true;
            peek_in();
          }

          productivityAchievements.forEach((a, i) => {
            if (!a.achieved && a.amount != null) {
              var newAchievements = { ...AchievementsObject };
              newAchievements["productivity"][i].progress = event.amount;
              if (event.amount >= a.amount) {
                achieve("productivity", i, newAchievements);
              }
            }
          });
          break;
        case "keys-unlocked":
          achieve("keys", 0, newAchievements);
          break;
        case "keys-converted":
          var keyAchievements = AchievementsObject["keys"].slice(1);
          keyAchievements.forEach((a, i) => {
            newAchievements["keys"][i].progress = event.amount;
            if (event.amount >= a.amount) {
              achieve("keys", i, newAchievements);
            }
          });
          break;
        case "oven-finished":
          achieve("unlocking", 0, newAchievements);
          break;
        case "bread-finished":
          achieve("unlocking", 2, newAchievements);
          break;
        case "supply-finished":
          achieve("unlocking", 1, newAchievements);
          break;
        case "bread-baked":
          var loafAchievements = AchievementsObject["loaves"];
          loafAchievements.forEach((a, i) => {
            newAchievements["loaves"][i].progress = event.amount;
            if (event.amount >= a.amount) {
              achieve("loaves", i, newAchievements);
            }
          });
        case "current-balance":
            var medalAchievements = AchievementsObject["medals"];
            if (
                !medalAchievements[0].revealed &&
                event.amount >= medalAchievements[0].amount / 2
              ) {
                newAchievements["medals"][0].revealed = true;
            }
            medalAchievements.forEach((a, i) => {
                newAchievements["medals"][i].progress = event.amount;
                if (event.amount >= a.amount) {
                    achieve("medals", i, newAchievements);
                }
            });

      }
    }
    setAchievementsObject(newAchievements);
  }, [events]);

  const achieve = (category, index, newAchievements, revealNext = true) => {
    if (newAchievements[category][index].achieved){
        return;
    }
    newAchievements[category][index].revealed = true;
    newAchievements[category][index].achieved = true;
    if (revealNext && newAchievements[category].length > index + 1) {
        newAchievements[category][index + 1].revealed = true;
    }
    show_alert(newAchievements[category][index]);
  };

  const claimAchievement = (achievement) => {
    if (!achievement.achieved || achievement.claimed) {
      return;
    }
    var newAchievements = { ...AchievementsObject };
    for (var categoryName in newAchievements) {
      var category = newAchievements[categoryName];
      for (var i in category) {
        if (category[i].id == achievement.id) {
          category[i].claimed = true;
          console.log("Claiming ", achievement);
        }
      }
    }
    setAchievementsObject(newAchievements);
    setBreadCoin(breadCoin + achievement.reward);
    setTotalEarned(totalEarned + achievement.reward);
    animateReward(achievement.reward, achievement.id);
  };

  const animateReward = (amount, id) => {
    var num = document.getElementById("reward-anim");
    num.innerHTML = "+" + formatNumber(amount);
    var boundingBox = document.getElementById(id).getBoundingClientRect();
    num.style.left = boundingBox.left + "px";
    num.style.top = boundingBox.top - 40 + "px";

    num.classList.remove("float-up");
    void num.offsetWidth;
    num.classList.add("float-up");
  };

  var achievementsDiv = document.getElementById("achievements");
  var achievementsContainer = document.getElementById("achievements-container");
  var bookmarkDiv1 = document.getElementById("bookmark-div-1");
  var bookmarkDiv2 = document.getElementById("bookmark-div-2");
  var bookmarkRibb = document.getElementById("bookmark-ribbon");
  var bookmarkBod = document.getElementById("bookmark-body");
  var achievementAlert = document.getElementById("achievement-alert");

  useEffect(() => {
    if (
      loaded &&!AchievementsObject["productivity"][0].revealed
    ) {
        console.log("hi 2")
      document.getElementById("bookmark-div-1").style.transform =
        "translateY(20vh)";
      document.getElementById("bookmark-div-2").style.transform =
        "translateY(20vh)";
    }
  }, [loaded]);

  var peek_in = () => {
    document.getElementById("bookmark-div-1").classList.add("peek-in-bookmark");
    document.getElementById("bookmark-div-2").classList.add("peek-in-bookmark");
    setTimeout(() => {
      document
        .getElementById("bookmark-div-1")
        .classList.remove("peek-in-bookmark");
      document
        .getElementById("bookmark-div-2")
        .classList.remove("peek-in-bookmark");
      document.getElementById("bookmark-div-1").style.transform =
        "translateY(0vh)";
      document.getElementById("bookmark-div-2").style.transform =
        "translateY(0vh)";
    }, 500);
  };

  var animate_in = () => {
    if (animating.current || showAchievements) return;
    achievementsDiv.classList.add("bounce-in");
    bookmarkDiv1.classList.add("bounce-in-bookmark");
    bookmarkDiv2.classList.add("bounce-in-bookmark");
    animating.current = true;
    achievementsContainer.style.pointerEvents = "auto";
    bookmarkRibb.style.pointerEvents = "none";
    setTimeout(() => {
      achievementsDiv.classList.remove("bounce-in");
      bookmarkDiv1.classList.remove("bounce-in-bookmark");
      bookmarkDiv2.classList.remove("bounce-in-bookmark");
      achievementsDiv.style.transform = "translateY(0px)";
      bookmarkDiv1.style.transform = "translateY(-80.8vh)";
      bookmarkDiv2.style.transform = "translateY(-80.8vh)";
      animating.current = false;
    }, 1000);
    setShowAchievements(true);
  };

  var animate_out = () => {
    if (animating.current || !showAchievements) return;
    achievementsDiv.classList.add("bounce-out");
    bookmarkDiv1.classList.add("bounce-out-bookmark");
    bookmarkDiv2.classList.add("bounce-out-bookmark");
    animating.current = true;
    setTimeout(() => {
      bookmarkDiv1.classList.remove("bounce-out-bookmark");
      bookmarkDiv2.classList.remove("bounce-out-bookmark");
      achievementsDiv.classList.remove("bounce-out");
      achievementsDiv.style.transform = "translateY(100vh)";
      bookmarkDiv1.style.transform = "translateY(0vh)";
      bookmarkDiv2.style.transform = "translateY(0vh)";
      achievementsContainer.style.pointerEvents = "none";
      bookmarkRibb.style.pointerEvents = "auto";
      animating.current = false;
    }, 1000);
    setShowAchievements(false);
  };

  var jiggle_bookmark = () => {
    if (animating.current || showAchievements) return;
    bookmarkBod.classList.add("jiggle-bookmark");
    bookmarkRibb.classList.add("jiggle-bookmark");
    setTimeout(() => {
      bookmarkBod.classList.remove("jiggle-bookmark");
      bookmarkRibb.classList.remove("jiggle-bookmark");
    }, 250);
  };

  var show_alert = (achievement) => {
    setAlertAchievement(achievement);
    achievementAlert.classList.add("slide-in-out");
    setTimeout(() => {
      achievementAlert.classList.remove("slide-in-out");
    }, 2800);
    jiggle_bookmark();
  };

  return (
    <div id="achievements-container" onClick={() => animate_out()}>
      <span id="reward-anim"><b>
        <span id="reward-anim-text">100</span></b>
      </span>
      <div id="achievement-alert">
        <img
          id="alert-img"
          src={window.location.origin + alertAchievement.image_path}
        />
        <div id="alert-text">
          <div id="alert-title">
            <Markdown>__Achievement Unlocked__</Markdown>
          </div>
          <div id="alert-name">{alertAchievement.display_name}</div>
        </div>
      </div>
      <div className="bookmark-div" id="bookmark-div-1">
        <img id="bookmark-body" className="bookmark-img" src={bookmarkBody} />
      </div>
      <div className="bookmark-div" id="bookmark-div-2">
        <img
          id="bookmark-ribbon"
          className="bookmark-img"
          src={bookmarkRibbon}
          onClick={() => animate_in()}
          onMouseEnter={() => jiggle_bookmark()}
        />
      </div>
      <div id="achievements">
        <div id="spirals">
          {Array.from(Array(15), (e, i) => {
            return <img src={spiral} key={i} className="spiral" />;
          })}
        </div>
        <div id="achievement-grid">
          {achievements.map((a, i) => {
            return (
              <Achievement
                key={"achievement-" + i}
                achievement={a}
                toggleTooltip={toggleTooltip}
                claimAchievement={claimAchievement}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Achievements;
