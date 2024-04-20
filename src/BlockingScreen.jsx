import { useState } from "react";
import './BlockingScreen.css'

function BlockingScreen(props){
    const { isMobile, delay } = props

    const [delayPassed, setDelayPassed] = useState(false)

    setTimeout(() => {
        setDelayPassed(true);
    }, delay)

    return (<div className="blocking-screen">
        <div className="blocking-div">
                <div className="inner-border">
                { isMobile ? 
                "Sorry, but Bread Winner does not work on mobile!\nPlease visit on Desktop to play." :
                (
                    delayPassed ? 
                        <div>
                            <div className='blocking-screen-text'>Hey! We noticed you don't have the Bread Winner extension installed. You'll need that to play.</div>
                            <div className='blocking-screen-text'>Follow these links to the right extension page and we'll be waiting for you when you get back!</div>
                            <div className='blocking-screen-link'><a className="extension-link" href="https://chromewebstore.google.com/detail/bread-winner-companion/mlfplmodeiemagcbcfofdmfcahjaafel" target="_blank" rel="noreferrer">Chrome</a>&emsp;<a className="extension-link" href="https://addons.mozilla.org/en-US/firefox/addon/bread-winner-companion/">Firefox</a></div>
                        </div>
                    : <div className="loader"></div>
                )

                }

            </div>
        </div>
    </div>)
}

export default BlockingScreen;