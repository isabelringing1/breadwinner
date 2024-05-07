import { useState } from "react";
import './BlockingScreen.css'

function BlockingScreen(props){
    const { visited, isMobile, showInfo, setShowInfo, delay } = props

    const [delayPassed, setDelayPassed] = useState(false)

    setTimeout(() => {
        setDelayPassed(true);
    }, delay)

    const onBGClicked = () => {
        if (showInfo){
            setShowInfo(false)
        }
    }

    return (<div className="blocking-screen" onClick={onBGClicked}>
        <div className="blocking-div">
                <div className="inner-border">
                { isMobile ?
                "Sorry, but Bread Winner does not work on mobile!\nPlease visit on Desktop to play." :
                (
                    showInfo ? 
                        <div>
                        <div className='blocking-screen-title'>Welcome to Bread Winner!</div>
                            <div className='blocking-screen-text'>
                                We're glad you're here. This is a game about clicking, baking, and working your way to the top. </div>
                            <div className='blocking-screen-text'>   
                                You'll need the <a href="https://chromewebstore.google.com/detail/bread-winner-companion/mlfplmodeiemagcbcfofdmfcahjaafel" target="_blank" rel="noreferrer">Chrome</a> or <a href="https://addons.mozilla.org/en-US/firefox/addon/bread-winner-companion/" target="_blank" rel="noreferrer">Firefox</a> extension to play (other browsers not supported yet, sorry!)
                            </div>
                            <div className="credits">
                                <div className='blocking-screen-text'>Made with 💪 by <a href="https://isabellee.me" target="_blank" rel="noreferrer">Isabel Lee</a></div>
                                <div className='blocking-screen-text'>Have thoughts, questions, or bugs to report? Any feedback is welcome <a href="https://forms.gle/XZsfyj8Vem2RhEYHA" target="_blank" rel="noreferrer">here</a>!</div>
                            </div>
                        </div>
                    : delayPassed ? 
                        <div>
                            <div className='blocking-screen-title'>Welcome to Bread Winner!</div>
                            <div className='blocking-screen-text'>We noticed you don't have the Bread Winner companion extension installed yet. Follow these links to the right extension page and we'll be waiting for you when you get back!</div>
                            <div className='blocking-screen-link'><a className="extension-link" href="https://chromewebstore.google.com/detail/bread-winner-companion/mlfplmodeiemagcbcfofdmfcahjaafel" target="_blank" rel="noreferrer">Chrome</a>&emsp;<a className="extension-link" href="https://addons.mozilla.org/en-US/firefox/addon/bread-winner-companion/" target="_blank" rel="noreferrer">Firefox</a></div>
                            {visited ? <div className='blocking-screen-hint'>Having trouble? Try refreshing the page, or allowing permissions if you're using the Firefox extension.</div> : null }
                        </div>
                    : <div className="loader"></div>
                )

                }

            </div>
        </div>
    </div>)
}

export default BlockingScreen;