/**
 * TTTS - Twine Text To Speech
 * Game Profile
 *
 * GAME DETAILS
 * =========================
 * NAME: Masters of Raana
 * VERSION: 0.8.19
 *
 * USAGE INSTRUCTIONS
 * =========================
 * Remove the // from the start of a line and change its value to enable the custom setting. For more information, please see the project website
 *
 * https://github.com/Elo-Ven/TTTS/
 */

var tttsProfile = {
    //pitch: 1.5,
    //rate: 1.5,
    //voice: 0,
    //volume: 0.5,
    //
    //container: '#example',
    debug: true,
    //overwriteParams: ['trigger'],
    silence: [
        '.headsign',
        '.acts',
        '.acts2',
        '.ulvendorown',
        '.signvendor',
        '.resholder',
        '.resholderbig',
        '.resholderbig2',
        '.resholderbig3',
        '.introchofilled',
        '.introcho',
        '.combatfield',
        '.combatbottom',
        '.tellbox',
        '.tellbox2',
        '.usedpass',
        '.explorepic2',
        '#passage-crafting',
        '#passage-craftingstation',
        '#passage-followers',
        '#passage-prostengine',
        '#passage-religion',
        '#passage-smenu',
        '#passage-market',
        '#passage-ecolist',
        '#passage-dockgrave',
        '.traitholder',
        '.bellplace',
        '.slaveholder',
        '.travelholderbox',
    ],
    //trigger: ['.example'],
    triggerIgnore: ['.acts2', '.acts .alt3', '.acts .alt4'],
};
