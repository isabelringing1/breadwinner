import { useState, useRef, useEffect } from "react";

import envelope_open from '/images/envelope_open.png'
import envelope_closed from '/images/envelope_closed.png'
import dough_logo from '/images/dough-logo.png'

import './Envelope.css'

function Envelope(props) {
    const { cat, setCat, showEnvelope, setShowEnvelope, emitEvent } = props;
    const animating = useRef(false);
    const [cards, setCards] = useState([])
    const [cardIndex, setCardIndex] = useState(0)

    const introCard =
        (<div className="envelope-card-body">
            <div className="env-line">Dear Baker,</div>
            <div className="env-line">Welcome to Bread Winner! Where no matter what you do... you can't NOT be productive.</div>
            <div className="env-line">Looks like you got the extension, and you’re settling into the bakery. We’re glad you’re here.</div>
            <div className="env-line-signature">Cheers,</div>
            <div className="env-line-signature">Dough & Co <img src={dough_logo} className="dough-logo" /></div>
        </div>)

    const endingCards =
        [
            (<div className="envelope-card-body">
                <div className="env-line">Dear Baker,</div>
                <div className="env-line">Congrats! You’ve completed all of our achievements. From all of us at Dough & Co, we wanted to send our heartfelt congratulations.</div>
            </div>),
            (<div className="envelope-card-body">
                <div className="env-line">After all this time, you might be wondering who exactly you’ve been selling your bread to.</div>
            </div>),
            (<div className="envelope-card-body">
                <div className="env-line">You might think we’re some evil, greedy corporation.</div>
                <div className="env-line">After all, who makes banana bread that expensive?</div>
            </div>),
            (<div className="envelope-card-body">
                <div className="env-line">But the truth is...</div>
            </div>),
            (<div className="envelope-card-body">
                <div className="env-line">...we’re just like you. And we just want to help people like you help themselves. </div>
            </div>),
            (<div className="envelope-card-body">
                <div className="env-line">All that liking, reacting, doomscrolling... what if it was WORTH something? What if it could be exchanged for fresh, delicious bread?</div>
            </div>),
             (<div className="envelope-card-body">
                <div className="env-line">(Never mind you can’t actually eat it-- we believe in your imagination.)</div>
            </div>),
             (<div className="envelope-card-body">
                <div className="env-line">But you felt it, right? The giddiness in watching your multiplier double? The anticipation in watching a loaf tick down its final seconds? The satisfaction of turning your hard-earned clicks into cold, hard cash?</div>
            </div>),
             (<div className="envelope-card-body">
                <div className="env-line">And it’s not like we didn’t make some real good in your life, either. (Has that person responded to you yet?)</div>
            </div>),
            (<div className="envelope-card-body">
                <div className="env-line">Anyways, congrats on making it all the way to the “end”. Don’t worry; we won’t take this away from you, even if we’ve spilled all our beans.</div>
            </div>),
            (<div className="envelope-card-body">
                <div className="env-line">For as long as the internet is still alive--there will still be bread to bake.</div>
                <div className="env-line-signature">Cheers,</div>
                <div className="env-line-signature">Dough & Co <img src={dough_logo} className="dough-logo" /></div>            
            </div>),
            (<div className="envelope-card-body">
                <div className="env-line">(P.S. We've added a few new challenges for you to sink your teeth into. Enjoy!)</div> 
            </div>)
        ]

    useEffect(() => {
        switch (cat) {
            case "intro":
                setCards([introCard]);
                peek_in_envelope();
                break;
            case "ending":
                setCards(endingCards);
                peek_in_envelope();
        }
    }, [cat]);

    const peek_in_envelope = () => {
        if (animating.current || showEnvelope) return;
        document.getElementById("small-envelope").classList.add("peek-in-small");
        setTimeout(() => {
            document.getElementById("small-envelope").classList.remove("peek-in-small");
            document.getElementById("small-envelope").style.bottom = "-3vh";
            jiggle_envelope();
        }, 400)
    }

    const jiggle_envelope = () => {
        if (animating.current || showEnvelope) return;
        document.getElementById("small-envelope").classList.add("jiggle-envelope");
        setTimeout(() => {
            document.getElementById("small-envelope").classList.remove("jiggle-envelope");
        }, 250);
    };

    const animate_open = () => {
        if (animating.current || showEnvelope) return;
        setCardIndex(0);

        animating.current = true;
        document.getElementById("small-envelope").classList.add("peek-out-small");
        setTimeout(() => {
            document.getElementById("small-envelope").style.bottom = "-15vh";
            document.getElementById("small-envelope").classList.remove("peek-out-small");
            document.getElementById("big-envelope").classList.add("bounce-in-big");
            setTimeout(() => {
                document.getElementById("big-envelope").classList.remove("bounce-in-big");
                document.getElementById("big-envelope").style.transform = "translateY(0)";
                animating.current = false;
                document.getElementById("envelope-container").style.pointerEvents = "auto";
                setShowEnvelope(true);
            }, 750);
        }, 250)
    }

    const on_click = () => {
        if (animating.current || !showEnvelope) return;
        var card = document.getElementById("envelope-card-" + cardIndex);
        setCardIndex(cardIndex + 1);
        if (cardIndex + 1 >= cards.length) {
            animate_close();
        }
        else {
            animate_next_card(card);
        }
    }

    const animate_next_card = (currentCard) => {
        if (animating.current || !showEnvelope) return;
        animating.current = true;
        currentCard.classList.add("flip-out");
        setTimeout(() => {
            currentCard.style.zIndex = 1;
        }, 250)
        setTimeout(() => {
            currentCard.classList.remove("flip-out");
            animating.current = false;
        }, 500)
        return;
    }

    const animate_close = () => {
        if (animating.current || !showEnvelope) return;
        animating.current = true;
        document.getElementById("big-envelope").classList.add("bounce-out-big");
        setTimeout(() => {
            document.getElementById("big-envelope").style.transform = "translateY(100vh)";
            document.getElementById("envelope-container").style.pointerEvents = "none";
            animating.current = false;
            setShowEnvelope(false);
            console.log(cat)
            if (cat == "ending"){
                emitEvent("reveal-epilogue")
            }
        }, 750);
    }


    return (<div id="envelope-container" onClick={() => on_click()}>
        <div id="small-envelope" src={envelope_closed}
            onClick={() => animate_open()}
            onMouseEnter={() => jiggle_envelope()}
        >
            <img className="small-envelope-bg-image" src={envelope_closed} />
        </div>

        <div id="big-envelope">
            <img className="big-envelope-bg-image" src={envelope_open} />
            {
                cards.map((body, i) => {
                    var dropValue = 0.45 / cards.length;
                    return (<div 
                    className="envelope-card" 
                    key={"envelope-card-" + i} 
                    id={"envelope-card-" + i} 
                    style={{ 
                        zIndex: (cards.length - i + 1),
                        filter: "drop-shadow(0px 5px 6px rgba(0, 0, 0, " + dropValue + "))"
                    }}>
                        <div className="envelope-inner-border">
                            {body}
                        </div>
                    </div>)
                })
            }

        </div>

    </div>)
}

export default Envelope;