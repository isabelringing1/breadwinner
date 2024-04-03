import { useState } from "react";
import './BlockingScreen.css'

function BlockingScreen(props){
    const { isMobile, delay } = props

    const [delayPassed, setDelayPassed] = useState(false)

    setTimeout(() => {
        setDelayPassed(true);
    }, delay)

    return (<div id="blocking-screen">
        <div id="blocking-div">
            { isMobile ? 
            "Sorry, but Bread Game does not work on mobile!\nPlease visit on Desktop to play." :
            (
                delayPassed ? 
                    <div>
                        <div className='blocking-screen-text'>Hey! We noticed you don't have the Bank of Bread extension installed. You'll need that to play.</div>
                        <div className='blocking-screen-text'>Go ahead and install it and we'll be waiting for you when you get back!</div>
                        <div className='blocking-screen-link'> Chrome&emsp;Firefox </div>
                    </div>
                : <div className="loader"></div>
            )

            }

        </div>
    </div>)
}

export default BlockingScreen;