# TTTS - Twine Text To Speech

Version: 2.1.0

Licence: Creative Common Attribution 4.0 International \
https://creativecommons.org/licenses/by/4.0/

## Summary

If you are that sort of person that prefers listening to audiobooks over reading books, this mod will make Twine story games much more enjoyable for you.

Your web browser already has text-to-speech tools built into it right now. Your Twine game just isn't using them. This mod add a small control panel where you can play the story text in the game via those built-in tools.

The mod can also be added to a Twine game by anyone, dev or player.

![Screenshot](demo/screenshots/1.png 'Screenshot')

## Table of Contents

-   [TTTS - Twine Text To Speech](#ttts---twine-text-to-speech)
    -   [Summary](#summary)
    -   [Table of Contents](#table-of-contents)
    -   [Installation](#installation)
        -   [1 - Download](#1---download)
        -   [2 - Locate](#2---locate)
        -   [3 - Unpack](#3---unpack)
        -   [4A - Automatic Import (recommended)](#4a---automatic-import-recommended)
        -   [4B - Manual Import](#4b---manual-import)
        -   [Updating](#updating)
    -   [Game Profiles](#game-profiles)
        -   [What are Game Profiles](#what-are-game-profiles)
        -   [Where to find pre-made profiles](#where-to-find-pre-made-profiles)
        -   [How to import an existing profile](#how-to-import-an-existing-profile)
        -   [How to create a new profile](#how-to-create-a-new-profile)
        -   [How to silence non-story text](#how-to-silence-non-story-text)
    -   [Default Options](#default-options)
    -   [FAQ (a.k.a what i think you might have questions about)](#faq-aka-what-i-think-you-might-have-questions-about)
        -   [Compatibility](#compatibility)
        -   [Its acting weird](#its-acting-weird)
    -   [Thank You For Reading](#thank-you-for-reading)

## Installation

### 1 - Download

Download the zip file with the latest version from the project GitHub page \
https://github.com/Elo-Ven/TTTS/raw/main/dist/ttts.zip

### 2 - Locate

Find the game directory for the game you want to mod. This is the folder where the .html file is that you use to run the game.

### 3 - Unpack

Copy the 'ttts' directory into the game directory, next to the games .html. (go to the demo directory to see an example) \
https://github.com/Elo-Ven/TTTS/tree/main/demo

### 4A - Automatic Import (recommended)

Run `install.bat` (_require access to Python_) and when asked, enter the filename of your games main html file (the one you open the game with). The original file will not be altered, instead a new copy of that file will be created that ends `-mod.html`.

All done, the game is now ready to play. Open the newly created file to play the game with TTTS enabled.

### 4B - Manual Import

Alternatively, you can manually import TTTS. \
<b>You don't need to do this if you successfully did 4A</b>

Find your games main html file and make a backup copy of it.

Now, open the file in a suitable text editor such as Notepad++ and navigate to the very end of the file (there maybe a delay depending on the size of the html file).

Copy this line of code

```
<script src="ttts/ttts-config.js"></script>
```

And paste it just before the `</body>` tag in the html file you just opened

```
    </script>
	<script src="ttts/ttts.js"></script>
</body>
</html>
```

### Updating

Follow steps 1 and 2 of the install guide and then come back here.

Open the `ttts` folder in your download and find the folder named `core`. Copy this into your games `ttts` folder and overwrite everything.

Enjoy a mandatory moment of satisfaction and then thats the update complete.

## Game Profiles

### What are Game Profiles

These are custom settings that help TTTS work better with specific games so it is highly recommended you create or import a game profile when using TTTS.

### Where to find pre-made profiles

There are some pre-made game profiles available for download.

You can download the pre-made profiles from here: \
https://github.com/Elo-Ven/TTTS/tree/main/dist/profile

### How to import an existing profile

To import a pre-made profile, download the profile file and rename it to `ttts-config.js`. Then place it in the ttts folder, overwriting the existing copy of `ttts-config.js`.

Then open your game and the new settings will be automatically applied.

### How to create a new profile

Open `ttts-config.js` in a suitable text editor and then remove the `//` from the beginning of the line to enable an option. Then change the value to have it always applied.

In the case of Pitch, Rate and Voice, these options act as default settings and can be overridden in-game using the settings popup.

```
var tttsConfig = {
    //container: '#passages',
    //pitch: 1,
    //rate: 1.0,
    //silence: ['.link-internal'],
    //trigger: ['.link-internal'],
    //voice: 0,
    //volume: 1,
};
```

### How to silence non-story text

Some games have additional menus and navigation that we would rather are not read every time a passage loads. We can exclude them from being spoken using the `silence` option.

Use your web browsers 'Element Inspector' to find the id or class name of an element that encloses the text you want to exclude. Then add a JS selector to the silence array in `ttts-config.js` and then refresh the page.

This method isn't always possible, it depends a lot on the game and what you want to silence. It also requires some basic knowledge of html.

## Default Options

| Option Name | Type    | Default              | Description                                                                                                    |
| ----------- | ------- | -------------------- | -------------------------------------------------------------------------------------------------------------- |
| container   | string  | `'#passages'`        | the id or other JS selector of element containing the story text                                               |
| pitch       | float   | `1`                  | value is passed directly to SpeechSynthesisUtterance.pitch                                                     |
| rate        | float   | `1`                  | value is passed directly to SpeechSynthesisUtterance.rate                                                      |
| silence     | array   | `['.link-internal']` | list of css style selectors for elements that should not be included in the play queue                         |
| trigger     | array   | `['.link-internal']` | list of css style selectors for elements that should trigger TTTS to autoplay (e.g. passage navigation)        |
| voice       | integer | `0`                  | the array key of the active SpeechSynthesisUtterance voice. full array in `window.speechSynthesis.getVoices()` |
| volume      | float   | `1`                  | value is passed directly to SpeechSynthesisUtterance.volume                                                    |

## FAQ (a.k.a what i think you might have questions about)

### Compatibility

#### System

Tested and working on Windows. Not tested on Mac but I can't think of a major reason why it wouldn't work.

#### Twine

Tested and working with Sugarcube and Harlowe based games.

### Its acting weird

Yeah... depending on how the game developer has set up their passages it's really difficult to predict what text structure will be used. The `trigger` and `silence` options can help or completely fix issues, but sometimes you just have to live with some inconvenience, soz...

## Thank You For Reading

"**It doesn't stop being magic just because you know how it works.**"\
_Terry Pratchett / The Wee Free Men_
