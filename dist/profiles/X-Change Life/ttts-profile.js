/**
 * TTTS - Twine Text To Speech
 * Game Profile
 *
 * GAME DETAILS
 * =========================
 * NAME: X-Change Life
 * VERSION: 1.15.0
 *
 * USAGE INSTRUCTIONS
 * =========================
 * Remove the // from the start of a line and change its value to enable the custom setting. For more information, please see the project website
 *
 * https://github.com/Elo-Ven/TTTS/
 */

var tttsProfile = {
    container: '.center_screen',
    //pitch: 1,
    //rate: 1.0,
    silence: [
        '.link-internal',
        'tw-link',
        'script',
        '.bar',
        'tw-hook[name="timer"]',
        'tw-hook[name="result"]',
        'tw-hook[name="cursor"]',
        'tw-expression[type="variable"]',
        'select',
    ],
    trigger: ['.link-internal', 'tw-link'],
    //voice: 0,
    //volume: 1,
};
