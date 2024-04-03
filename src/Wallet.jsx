import { useEffect } from 'react'
import { formatNumber } from './Util'
import './Wallet.css'

function Wallet(props){
    const { clicks, keys, multiplier, convertClicks, convertKeys, toggleClicksTooltip, toggleKeysTooltip, keyUnlocked } = props;

    useEffect(() => {
        const num = document.getElementById('click-num')
        num.classList.remove('punch');
        void num.offsetWidth;
        num.classList.add('punch'); 
    }, [clicks])

    useEffect(() => {
        const num = document.getElementById('key-num')
        if (!num){
            return;
        }
        num.classList.remove('punch');
        void num.offsetWidth;
        num.classList.add('punch'); 
    }, [keys])

    const punchMultiplier = () => {
        const num = document.getElementById('multiplier-num');
        num.classList.remove('punch');
        void num.offsetWidth;
        num.classList.add('punch'); 
    }
    
    console.log(formatNumber(multiplier, true))

    return (<div id="wallet">
            <div id="click-wallet">
            <div id="click-container"><span id="click-num">{clicks ? formatNumber(clicks) : "?"}</span> {clicks == 1 ? "click" : "clicks"}</div>
            <div id='multiplier-div'> <span id="multiplier-x">×</span>  <span id="multiplier-num">{String(formatNumber(multiplier, true)) ?? "?"}</span></div>
            <button className="convert-button button" id="convert-clicks" onClick={() => {convertClicks()}}
                onMouseMove={(e) => { 
                    var x = e.clientX < window.innerWidth - 300 ? e.clientX + 30 : e.clientX - 240
                    toggleClicksTooltip(true, [x, e.clientY + 30]);
                }}
                onMouseLeave={() => {
                    toggleClicksTooltip(false)
            }}>
            Convert</button>
            </div><br/>
            {keyUnlocked ? 
            <div id="key-wallet">
            <div id="key-container"><span id="key-num">{formatNumber(keys)}</span> {keys == 1 ? "key" : "keys"}</div>
            <button className="convert-button button" id="convert-keys" onClick={() => { 
                if (keys > 0) { punchMultiplier() }
                convertKeys();
            }}
                onMouseMove={(e) => { 
                    var x = e.clientX < window.innerWidth - 300 ? e.clientX + 30 : e.clientX - 240
                    toggleKeysTooltip(true, [x, e.clientY + 30]);
                }}
                onMouseLeave={() => {
                    toggleKeysTooltip(false)
            }}>
            Convert</button>
            </div> : null}

            </div>)
    }

export default Wallet