/**
 * TTTS - Twine Text To Speech
 * Custom Config
 *
 * See the main JS file for more info about this project
 *
 * INSTRUCTIONS
 * Remove the // from the start of a line and change its value to enable the custom setting
 *
 */

var tttsConfig = {
    //pitch: 1,
    //rate: 1.0,
    //silence: ['.link-internal', '.passageHeader'],
    //trigger: ['.link-internal'],
    //voice: 0,
    //volume: 1,
};

window.onload = function () {
    const config = document.createElement('script');
    config.src = 'ttts/ttts.js';
    config.type = 'text/javascript';
    document.querySelector('body').appendChild(config);
};
