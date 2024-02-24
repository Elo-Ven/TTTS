# Game Profiles

## What are Game Profiles

These are custom settings that help TTTS work better with specific games so it is highly recommended you create or import a game profile when using TTTS.

## Where to find pre-made profiles

There are some pre-made game profiles included in the ttts folder in your download but you can also download them here: \
https://github.com/Elo-Ven/TTTS/tree/main/dist/profiles

## How to import an existing profile

To import a Game Profile, download the profile file and place it in your ttts folder, overwriting the `ttts-profile.js` file already in there.

Then open your game and the new settings will be automatically applied.

## How to create a new profile

Open `ttts-profile.js` in a suitable text editor and then remove the `//` from the beginning of the line to enable an option. Then change the value to have it always applied.

In the case of Pitch, Rate and Voice, these options act as default settings and can be overridden in-game using the settings popup.

```
var tttsProfile = {
    //pitch: 1.5,
    //rate: 1.5,
    //voice: 0,
    //volume: 0.5,
    //
    //container: '#example',
    //debug: true,
    //overwriteParams: ['trigger'],
    //silence: ['.example'],
    //trigger: ['.example'],
    //triggerIgnore: ['.example'],
};
```

## How to silence non-story text

Some games have additional menus and navigation that we would rather are not read every time a passage loads. We can exclude them from being spoken using the `silence` option.

Use your web browsers 'Element Inspector' to find the id or class name of an element that encloses the text you want to exclude. Then add a JS selector to the silence array in `ttts-profile.js` and then refresh the page.

This method isn't always possible, it depends a lot on the game and what you want to silence. It also requires some basic knowledge of html.
