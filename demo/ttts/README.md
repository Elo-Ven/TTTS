# TTTS - Twine Text To Speech

Version: 2.1.0

Licence: Creative Common Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0/)

## Summary

If you are that sort of person that prefers listening to audiobooks over reading books, this mod will make Twine story games much more enjoyable for you.

Your web browser already has text-to-speech tools built into it right now. Your Twine game just isn't using them. This mod add a small control panel where you can play the story text in the game via those built-in tools.

The mod can also be added to a Twine game by anyone, dev or player.

## Installation

### 1 - Download

Download from the project GitHub page - TBC

### 2 - Locate

Find the game directory for the game you want to mod (it's the directory that you games main .hmtl file is, the one you use to open the game)

### 3 - Unpack

Copy the 'mod' directory in your download to the game directory.

### 4 - Import

Open your games `game_name.html` file in a text editor such as Notepad++ and navigate to the very end of the file (this can cause a small delay depending on the size of the html file).

If you don't already have a text editor that works well with html files, you will need to get one. A simple and reputable one is Notepadd++ (https://notepad-plus-plus.org/downloads/)

Copy this line of code

```
<script src="ttts/ttts.js"></script>
```

And paste it just before the `</body>` tag in the html file you just opened

```
    </script>
	<script src="ttts/ttts.js"></script>
</body>
</html>
```

#### 4 - optional

In step 3, use `ttts-config.js` instead of `ttts.js` to set a permanent default

## Default Params

| Option Name | Type    | Default Value        | Description                                                                                                    |
| ----------- | ------- | -------------------- | -------------------------------------------------------------------------------------------------------------- |
| ignores     | array   | `['.link-internal']` | list of css style selectors for elements that should not be included in the play queue                         |
| pitch       | float   | `1`                  | value is passed directly to SpeechSynthesisUtterance.pitch                                                     |
| rate        | float   |                      | value is passed directly to SpeechSynthesisUtterance.rate                                                      |
| trigger     | array   | `['.link-internal']` | list of css style selectors for elements that should trigger TTTS to autoplay (e.g. passage navigation)        |
| volume      | float   | `1`                  | value is passed directly to SpeechSynthesisUtterance.volume                                                    |
| voice       | integer | `0`                  | the array key of the active SpeechSynthesisUtterance voice. full array in `window.speechSynthesis.getVoices()` |

### Overriding Default Params

Follow the optional step under Import in the installation guide and then open `ttts-config.js` in a suitable text editor.

```
var tttsConfig = {
    //volume: 1,
    //pitch: 1,
    rate: 1.5,
    voice: 15,
    ignores: [
        '.link-internal',
        '#wardrobe',
        'label',
    ],
};
```

### Silence Non-Story Text

Some games have additional menus and navigation that you would rather they are not read every time the page loads.

We can exclude them from being spoken using the `silence` option. Use your web browsers 'Element Inspector' to find the id or class name of an element that encloses the text you want to exclude. Add a css style selector to the silence array in `ttts-config.js` and then refresh the page.

This method isn't always possible, it depends a lot on the game and what you want to `silence`. It also requires some basic knowledge of html so if you create a config file, please share it online with the rest of community so that they can download it and replace their copy with the improved version for that game.

## FAQ (a.k.a what i think you might have questions about)

### Compatibility

#### System

Tested and working on Windows. Not tested on Mac but I can't think of a major reason why it wouldn't work.

#### Twine

Tested and working with Sugarcube and Harlowe based games.

### Its acting weird

Yeah... depending on how the game dev has set up their passages it's really difficult to predict what text structure or names will be used. The `trigger` and `ignore` options can help or completely fix issues, but sometimes you just have to put up with some inconvenience, soz...

## Thank You For Reading

"It doesn't stop being magic just because you know how it works." - Terry Pratchett / The Wee Free Men
