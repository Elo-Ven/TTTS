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
    //The volume the voice will speak at. Change with increments of 0.1. Min 0, Max 1
    //volume: 1,

    //The pitch the voice will speak at. Change with increments of 0.1. Min 0
    //pitch: 1,

    //The speed the voice will speak at. Change with increments of 0.1. Min 0
    //rate: 1.0,

    //The ID number of the voice that you want to use. Click the cog while TTTS is open to view TTTS settings, there you will find a list of the voices you have available and their ID numbers.
    //voice: 0,

    //The 'JS selectors' that you want TTTS to ignore (useful for removing menus, etc from the reader)
    ignores: ['.link-internal', '.passageHeader'],
};

window.onload = function () {
    const config = document.createElement('script');
    config.src = 'ttts/ttts.js';
    config.type = 'text/javascript';
    document.querySelector('body').appendChild(config);
};
