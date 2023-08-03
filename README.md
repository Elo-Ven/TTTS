# TTTS - Twine Text To Speech

Version: 2.2.0 \
Licence: MIT

## Summary

If you are that sort of person that prefers listening to audiobooks over reading books, this mod will make Twine story games much more enjoyable for you.

Your web browser already has text-to-speech tools built into it right now. Your Twine game just isn't using them. This mod adds a small control panel to the game that hooks into those tools, letting you play the game, just as before, but now with voice-overs.

The mod is very simple to install and can also be added by anyone, developer or player.

<a href="https://elo-ven.github.io/TTTS/">Demo</a>

![Screenshot](docs/screenshots/1.png 'Screenshot')

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
    -   [Compatibility](#compatibility)
        -   [System](#system)
        -   [Twine](#twine)
        -   [Games](#games)
    -   [Game Profiles](#game-profiles)
        -   [What are Game Profiles](#what-are-game-profiles)
        -   [Where to find pre-made profiles](#where-to-find-pre-made-profiles)
        -   [How to import an existing profile](#how-to-import-an-existing-profile)
        -   [How to create a new profile](#how-to-create-a-new-profile)
        -   [How to silence non-story text](#how-to-silence-non-story-text)
    -   [Default Options](#default-options)
    -   [Donate](#donate)
    -   [FAQ (a.k.a what i think you might have questions about)](#faq-aka-what-i-think-you-might-have-questions-about)
        -   [Its acting weird](#its-acting-weird)
    -   [Thank You For Reading](#thank-you-for-reading)

## Installation

### 1 - Download

Download the zip file with the latest version from the project GitHub page \
https://github.com/Elo-Ven/TTTS/raw/main/dist/ttts.zip

### 2 - Locate

Find the game directory for the game you want to mod. This is the folder where the .html file is that you use to run the game.

### 3 - Unpack

Copy the 'ttts' directory into the game directory, next to the games .html. (go to the docs directory to see an example) \
https://github.com/Elo-Ven/TTTS/tree/main/docs

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
<script src="ttts/core/ttts.js"></script>
```

And paste it just before the `</body>` tag in the html file you just opened

```
    </script>
	<script src="ttts/core/ttts.js"></script>
</body>
</html>
```

### Updating

Follow steps 1 and 2 of the install guide and then come back here.

Open the `ttts` folder in your download and find the folder named `core`. Copy this into your games `ttts` folder and overwrite everything.

Enjoy a mandatory moment of satisfaction and then thats the update complete.

## Compatibility

### System

Working - Windows \
Presumed working - Mac, Linux \
Unknown - other

### Twine

Working - Sugarcube, Harlowe \
Unknown - other

### Games

| Game                 | Compatibility Score | Profile Needed | Version Tested |
| -------------------- | ------------------- | -------------- | -------------- |
| A Spell For All      | ⭐                  | n/a            | 14.13          |
| Adam & Gaia          | ⭐⭐⭐⭐⭐          | No             | 3.0            |
| College Daze         | ⭐⭐⭐⭐⭐          | No             | .390a          |
| Degrees of Lewdity   | ⭐⭐⭐⭐            | Yes            | 0.4.1.7        |
| Female Agent         | ⭐⭐⭐⭐⭐          | Yes            | 118            |
| Friends of Mine      | ⭐⭐⭐⭐⭐          | No             | 1.2.4          |
| Incubus City by Wape | ⭐⭐⭐⭐⭐          | Yes            | 1.15.0         |
| Lost in Laminate     | ⭐⭐⭐⭐⭐          | No             | 10.0e          |
| Master of Rana       | ⭐⭐⭐⭐            | Yes            | 0.8.19         |
| Perverted Education  | ⭐⭐⭐⭐⭐          | Yes            | 1.3200         |
| The Company          | ⭐⭐⭐              | No             | 5.0            |
| X-Change-Life        | ⭐⭐⭐⭐            | Yes            | 1.15.0         |

⭐ Not currently compatible \
⭐⭐ Not a good match \
⭐⭐⭐ Has some issues but worth trying \
⭐⭐⭐⭐ Not perfect but still works really well \
⭐⭐⭐⭐⭐Works great

## Game Profiles

### What are Game Profiles

These are custom settings that help TTTS work better with specific games so it is highly recommended you create or import a game profile when using TTTS.

### Where to find pre-made profiles

There are some pre-made game profiles available for download.

You can download the pre-made profiles from here: \
https://github.com/Elo-Ven/TTTS/tree/main/dist/profile

### How to import an existing profile

To import a pre-made profile, download the profile file and rename it to `ttts-profile.js`. Then place it in the ttts folder, overwriting the existing copy of `ttts-profile.js`.

Then open your game and the new settings will be automatically applied.

### How to create a new profile

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

### How to silence non-story text

Some games have additional menus and navigation that we would rather are not read every time a passage loads. We can exclude them from being spoken using the `silence` option.

Use your web browsers 'Element Inspector' to find the id or class name of an element that encloses the text you want to exclude. Then add a JS selector to the silence array in `ttts-profile.js` and then refresh the page.

This method isn't always possible, it depends a lot on the game and what you want to silence. It also requires some basic knowledge of html.

## Default Options

| Option Name     | Type    | Description                                                                                                    |
| --------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| container       | string  | the id or other JS selector of element containing the story text                                               |
| debug           | boolean | When `true`, additional comments will be displayed in the browser console                                      |
| overwriteParams | array   | A list of options that should be overwritten with the profile option instead of being appended to              |
| pitch           | float   | same as SpeechSynthesisUtterance.pitch                                                                         |
| rate            | float   | same as SpeechSynthesisUtterance.rate                                                                          |
| silence         | array   | list of JS selectors for elements that will be removed removed                                                 |
| trigger         | array   | list of JS selectors for elements that should trigger TTTS to autoplay (e.g. story navigation)                 |
| triggerIgnore   | array   | list of JS selectors for elements that are included in the `trigger` option but shouldn't trigger the autoplay |
| voice           | integer | the array key of the active SpeechSynthesisUtterance voice. full array in `window.speechSynthesis.getVoices()` |
| volume          | float   | same as SpeechSynthesisUtterance.volume                                                                        |

## Donate

I made this tool for myself, not to make any money from. I don't personally need your money but i do know of some people that would really appreciate it. So if you find this tool useful, please send your donation to the RSPB.

<a href="https://www.rspb.org.uk/join-and-donate/donate/make-a-donation-to-the-rspb/make-a-donation/">Donate to the RSPB</a>

The RSPB (Royal Society for the Protection of Birds) is a wonderful conservation charity based in the U.K. Despite it's name, it looks after all forms wildlife and habitats. They are a highly ethical organization that will use your money wisely.

_The RSPB is not linked or affilliated with TTTS in any way_

## FAQ (a.k.a what i think you might have questions about)

### Its acting weird

Yeah... depending on how the game developer has set up their passages it's really difficult to predict what text structure will be used. The `trigger` and `silence` options can help or completely fix issues, but sometimes you just have to live with some inconvenience, soz...

## Thank You For Reading

"**It doesn't stop being magic just because you know how it works.**"\
_Terry Pratchett / The Wee Free Men_
