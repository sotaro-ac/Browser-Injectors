// ===
// YouTube: 動画を背景に固定しながらコメントを見れる
// ===
"use strict";

/**
 * TODO:
 * - [ ] ボタンでON/OFFを切り替えられるようにする
 * - [ ] テキストの見やすさ/見栄えを改善する
 * - [ ] ブラウザのフルスクリーンモード時の挙動に対応する
 * - [ ] 半ウィンドウ時にフルスクリーンへ切り替えた際に発生する動画の見切れを修正する
 */

/*
    # Related Elements      : Selector
    + HTML5 Video Container : div.html5-video-container
        -> Add class 'youtube-fix-video-behind' if Script is runned.
    + Video-Stream Element  : video.video-stream.html5-main-video
*/

if (document.querySelector(".html5-video-container").classList.contains("youtube-fix-video-behind")) {
    console.log(
        '%cYouTube Fix Video Behind is Already %cRUNNED%c!',
        'font-weight: bold', 'color: orange; font-weight: bold', 'font-weight: bold');
    alert('YouTube Fix Video Behind is Already RUNNED!');
}
else {
    const initFixVideoBehind = () => {

        const initInterval = setInterval(() => {

            if (document.querySelector("ytd-watch-flexy")) {
                console.log(
                    '%cYouTube Fix Video Behind is %cRunning...',
                    'font-weight: bold', 'color: lime');

                fixVideoBehind();
                clearInterval(initInterval);

            } else {
                console.log('YouTube Fix Video Behind is waiting...');
            }

        }, 500); // Try per 1000ms

    }

    const fixVideoBehind = () => {

        const container = document.querySelector(".html5-video-container");
        const masthead = document.querySelector("#masthead-container");
        const flexy = document.querySelector("ytd-watch-flexy");    // fullscreen | theater-requested_
        const primary = document.querySelector("#primary");
        const secondary = document.querySelector("#secondary");
        const video = document.querySelector(".html5-main-video");
        const columns = document.querySelector("#columns");

        container.classList.add("youtube-fix-video-behind");
        console.log('%cYouTube Fix Video Behind is %cREADY...', 'font-weight: bold', 'color: orange');

        // Option 
        const config = {
            attributeFilter: ['fullscreen', 'theater-requested_', 'role', 'is-two-columns_']
        };

        // MutationObserver
        const MO = new MutationObserver((mutationsList, observer) => {

            for (const mutation of mutationsList) {
                console.log('attrName: ' + mutation.attributeName);
                if (mutation.type === 'attributes') {
                    // ytd-watch-flexy
                    let flg = false;
                    switch (mutation.attributeName) {
                        case 'fullscreen':
                        case 'theater-requested_':
                            if (flexy.hasAttribute('theater-requested_')) {
                                let top = masthead.clientHeight;
                                video.style.position = 'fixed';
                                video.style.zIndex = -1;
                                video.style.marginTop = top + 'px';
                                video.style.marginLeft = '';
                                primary.style.zIndex = 1;
                                primary.style.background = 'rgba(0 0 0 / 50%)';
                                flg = true;
                            }
                            if (flexy.hasAttribute('fullscreen')) {
                                video.style.position = 'fixed';
                                video.style.zIndex = -1;
                                video.style.marginTop = '';
                                video.style.marginLeft = '';
                                primary.style.zIndex = 1;
                                primary.style.background = 'rgba(0 0 0 / 50%)';
                                flg = true;
                            }
                            if (flg) break;
                        case 'is-two-columns_':
                            let ppt = window.getComputedStyle(primary).paddingTop;
                            let mhe = window.getComputedStyle(masthead).height;
                            let pml = window.getComputedStyle(primary).marginLeft;
                            // let cwi = window.getComputedStyle(columns).width;
                            let pwi = window.getComputedStyle(primary).width;
                            let swi = window.getComputedStyle(secondary).width;
                            let fwi = window.getComputedStyle(flexy).width;
                            video.style.position = 'fixed';
                            video.style.zIndex = -1;
                            video.style.marginTop = `calc(${ppt} + ${mhe})`;
                            if (flexy.hasAttribute("is-two-columns_")) {
                                video.style.marginLeft = `calc((${fwi} - ${pwi} - ${swi} - ${pml}) / 2)`;
                            } else {
                                video.style.marginLeft = `calc(${pml})`;
                            }
                            primary.style.zIndex = 1;
                            primary.style.background = 'rgba(0 0 0 / 50%)';
                            break;

                        default:
                            if (!flexy.hasAttribute('role')) {
                                video.style.position = '';
                                video.style.zIndex = '';
                                video.style.marginTop = '';
                                video.style.marginLeft = '';
                                primary.style.zIndex = '';
                                primary.style.background = '';
                            }
                    }
                }
                if (mutation.type === 'childList') {
                    console.log(mutation);
                }
            }
        });

        MO.observe(flexy, config);
    }

    initFixVideoBehind();
}
