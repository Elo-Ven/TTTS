INSERT_TTTS_CORE_HERE;

if ('speechSynthesis' in window) {
    //attempt to import the game profile
    const profile = document.createElement('script');
    profile.src = 'ttts/ttts-profile.js';
    profile.type = 'text/javascript';
    document.querySelector('head').appendChild(profile);

    //wait for the page to load and move to the end of the render queue before init
    const ttts = new TwineTextToSpeech();
    window.onload = function () {
        setTimeout(() => {
            ttts.init();
        }, 1);
    };
} else {
    console.log('TTTS | Failed to load, speechSynthesis is not available in your browser');
}
