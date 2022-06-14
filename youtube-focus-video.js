// ===
// YouTube: [SPACE]で動画にフォーカスする
// ===
"use strict";

/**
 * - [Space] で動画にフォーカス + 画面スクロール
 * - [ArrowUp] [ArrowDown] で動画にフォーカス
 */

if (document.getElementsByClassName('youtube-focus-video')[0]) {
    // 作動メッセージ：既にに作動しています
    console.log(
        '%cYouTube Focus Video is Already %cACTIVE%c!',
        'font-weight: bold', 'color: orange; font-weight: bold', 'font-weight: bold');
    alert('YouTube Ads Remover is Already RUNNING!');
} else {
    // 作動メッセージ
    console.log('%cYouTube Focus Video is %cACTIVE...', 'font-weight: bold', 'color: orange');

    // HTML5動画プレイヤーの要素を取得
    const player = document.getElementsByClassName('html5-video-container')[0];

    // HTML5 video要素を取得
    const video = document.querySelector('.html5-main-video');

    // 動画のスライダー要素を所得
    const slider = document.querySelector('.ytp-progress-bar');

    // スクリプトを実行
    try {
        // YouTube動画プレイヤー要素が存在しなければエラーメッセージ終了
        if (player === undefined) {
            throw new Error('YouTube Focus Video is Failed to running!');
        }

        // player に 'youtube-ads-remover' クラスを付与する（起動状態）
        player.classList.add('youtube-focus-video');

        // 初期化
        document.addEventListener('keydown', function (e) {
            switch (e.key) {
                case ' ':
                    // Spaceを押すとフォーカス+画面スクロール
                    video.focus();  // { preventScroll: false }
                    break;

                case 'ArrowUp':
                case 'ArrowDown':
                    // 動画フォーカス中に上下キーで音量調整
                    if (document.activeElement === slider) {
                        video.focus({ preventScroll: true });
                    }
                    break;
            }
            return false;
        });

    } catch (e) {
        console.error('[FATAL!]: ' + e.message);
        alert(e.message);
    }
}
