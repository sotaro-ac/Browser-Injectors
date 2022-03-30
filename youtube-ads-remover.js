// ===
// YouTube: 広告除去スクリプト
// ===
"use strict";

/*
    # Related Elements      : Selector
    + HTML5 Video Container : div.html5-video-container
        -> Add class 'youtube-ads-remover' if Script is runned.
    + Video-Stream Element  : video.video-stream.html5-main-video
    + Video-Ads Container   : div.video-ads.ytp-ad-module
    + Video-Ads Unique div  : div.ytp-ad-player-overlay-instream-info
    + Video-Ads SkipBtn     : button.ytp-ad-skip-button
    + Image-Ads CloseBtn    : button.ytp-ad-overlay-close-button
*/

if ( document.getElementsByClassName('youtube-ads-remover')[0] ) {
    // 作動メッセージ：既にに作動しています
    console.log(
        '%cYouTube Ads Remover is Already %cRUNNING%c!',
        'font-weight: bold', 'color: orange; font-weight: bold', 'font-weight: bold');
    alert('YouTube Ads Remover is Already RUNNING!');
} else {
    // 作動メッセージ
    console.log('%cYouTube Ads Remover is %cREADY...', 'font-weight: bold', 'color: orange');

    let killedAds = 0;      // 削除した広告の合計数
    let tipShowTime = 3000; // 広告除去Tipの表示時間
    // let timer = null;

    // HTML5動画プレイヤーの要素を取得
    const player = document.getElementsByClassName('html5-video-container')[0];

    // 広告除去Tipsの要素
    const divTip = '<div id="ads-removed-tip" style="\
            display: none; color: azure; font: normal 1em system-ui;\
            position: absolute; top: 0%; left: 0%; z-index: 1;\
            background: rgb(0 0 0 / 50%); margin: 12px; padding: 6px; \
            border-radius: 4px;box-shadow: 0px 0px 4px 1px rgb(173 255 47 / 40%);">\
            <span style="font-weight: bold; color: inherit;\
            padding: 0px 4px; margin-right: 4px; background: rgb(173 255 47 / 40%);\
            border-radius: 2px;">ADS</span>\
            <span id="ads-removed-msg">Removed XXX</span>\
            </div>';

    // 広告除去Tipを挿入
    player.insertAdjacentHTML('afterbegin', divTip);

    // requestAnimationFrameを使ったアニメーションの枠組
    const animate = ({timing, draw, duration}) => {
        let start = performance.now();

        requestAnimationFrame(function animate(time) {
          // timeFraction は 0 から 1 になります
          let timeFraction = (time - start) / duration;
          if (timeFraction > 1) timeFraction = 1;
      
          // 現在のアニメーションの状態を計算します
          let progress = timing(timeFraction)
      
          draw(progress); // 描画します
      
          if (timeFraction < 1) {
            requestAnimationFrame(animate);
          }
      
        });
    };

    // 広告除去Tipの表示
    const showTip = (message, duration) => {
        // 既に広告除去Tipが存在するかを判定する
        if ( document.getElementById('ads-removed-tip') == null ) {
            // 新しく広告除去Tipを作り直す
            player.insertAdjacentHTML('afterbegin', divTip);
        }

        // // 既存のタイマーをリセット
        // clearInterval(timer);   // timer is global variable
        killedAds++;            // increment sum of killed ads

        // 広告除去Tipの要素を取得
        const elTip = document.getElementById('ads-removed-tip');
        const elMsg = document.getElementById('ads-removed-msg');

        // 広告除去Tipを(再)表示する
        elTip.style.display = 'block';  // display: none -> block
        elMsg.textContent = message;    // メッセージを設定する

        // JavaScript で requestAnimationFrame
        animate({
            duration: duration,
            timing: (timeFraction) => {
                return timeFraction;
            },
            draw: (progress) => {
                // opacity
                let mag = 8;
                if ( 0 <= progress && progress < 0.50 ) {
                    elTip.style.opacity = Math.min(1.00, progress * mag);
                } else if ( 0.50 <= progress && progress < 1.00 ) {
                    elTip.style.opacity = Math.min(1.00, (1.00 - progress) * mag);
                } else {
                    elTip.style.opacity = 0.00;
                }

                // display
                if ( 0 < elTip.style.opacity && elTip.style.display == 'none' ) {
                    elTip.style.display = 'block';
                } else if ( elTip.style.opacity <= 0 && elTip.style.display != 'none' ) {
                    elTip.style.display = 'none';
                }
            }
        });

        // // 一定時間(duration)後に display: block -> none
        // const start = performance.now();
        // timer = setInterval(() => {
        //     let ctime = performance.now() - start;
        //     if ( ctime > duration ) {
        //         elTip.style.display = 'none';   // 再度非表示にする
        //         clearInterval(timer);
        //     }
        // }, 100 );

    };

    // 広告を除去する関数
    const removeAds = () => {

        // Ads (広告コンテナ) に子要素が存在するかを判定
        if (document.getElementsByClassName('video-ads')[0].childElementCount) {
            // console.log('[ADS!]: Ads-event occurrd!');   // [DEBUG]

            let flag = { close: false, skip: false };

            /**
             * バナー広告閉じるボタンを自動で Click
             * */
            const closeBtn = document.getElementsByClassName('ytp-ad-overlay-close-button')[0];
            // 閉じるボタンが存在すればクリックする
            if (closeBtn) {
                closeBtn.click();
                flag.close = true;
                showTip('image-ads closed!', tipShowTime);
                console.log('[%cCLOSE%c]: image-ads closed!', 'color: lime; font-weight: bold', '');
                return;
            }

            /** 
             * 動画スキップボタンを自動で Click
             * */
            const skipBtn = document.getElementsByClassName('ytp-ad-skip-button')[0];
            // スキップボタンが存在すればクリックする
            if (skipBtn) {
                skipBtn.click();
                flag.skip = true;
                showTip('video-ads skipped!', tipShowTime);
                console.log('[%cSKIP%c]: video-ads skipped!', 'color: lime; font-weight: bold', '');
                return;
            }

            /**
             * スキップできない広告動画を強制的に終了させる
             */
            const AdsInfo = document.getElementsByClassName('ytp-ad-player-overlay-instream-info')[0];
            if (AdsInfo) {
                document.getElementsByClassName('video-stream')[0].currentTime = 3600;    // seconds
                showTip('video-ads forced skipped!', tipShowTime);
                console.log('[%cFORCED%c]: video-ads forced skipped!', 'color: lime; font-weight: bold', '');
                return;
            }

        } else {
            // console.log('[END]: Ads-event is over!');    // [DEBUG]
        }

    };

    // MutationObserver（インスタンス）の作成
    const Mo = new MutationObserver(function (record, observer) {
        /* 変更検出時に実行する内容 */
        removeAds()
    });

    // 監視する「もの」の指定（必ず1つ以上trueにする）
    let config = {
        childList: true,        //「子ノード（テキストノードも含む）」の変化
        attributes: true,       //「属性」の変化
        characterData: false,   //「テキストノード」の変化
    };

    // 
    const initAdsRemover = () => {
        // 監視の準備
        const initInterval = setInterval(() => {
            // 広告コンテナ要素の取得をポーリングで試行
            if (document.getElementsByClassName('video-ads')[0] != null) {
    
                // 広告コンテナ要素の取得に成功した場合
                const Ads = document.getElementsByClassName('video-ads')[0];
                console.log(
                    '%cYouTube Ads Remover is %cRunning...',
                    'font-weight: bold', 'color: lime');
    
                // 初期走査を実施
                console.log('[NOTE]: %cInitial scanning ...', 'font-weight: bold');
                removeAds();
    
                // 監視の開始
                clearInterval(initInterval);
                Mo.observe(Ads, config);
    
            } else {
                // 広告コンテナ要素の取得に失敗した場合
                console.log('YouTube Ads Remover is waiting...');
            }
    
        }, 1000); // Try per 1000ms
    }

    // スクリプトを実行
    try {
        // YouTube動画プレイヤー要素が存在しなければエラーメッセージ終了
        if ( player === undefined ) {
            throw new Error('YouTube Ads Remover is Failed to running!');
        }
        
        // player に 'youtube-ads-remover' クラスを付与する（起動状態）
        player.classList.add('youtube-ads-remover');

        // 初期化
        initAdsRemover();

    } catch (e) {
        console.error('[FATAL!]: ' + e.message);
        alert(e.message);
    }

};