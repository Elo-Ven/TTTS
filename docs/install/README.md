# Installation

## Gamer Version

### 1 - Download

Download the zip file with the latest version from the project GitHub page \
https://github.com/Elo-Ven/TTTS/raw/main/dist

### 2 - Unpack

Copy the 'ttts' directory into the game directory, next to the games .html. (go to the docs directory to see an example) \
https://github.com/Elo-Ven/TTTS/tree/main/docs

### 3A - Automatic Import (recommended)

Run `install.bat` (_require access to Python_) and when asked, enter the filename of your games main html file (the one you open the game with). The original file will not be altered, instead a new copy of that file will be created that ends `-ttts.html`.

All done, the game is now ready to play. Open the newly created file to play the game with TTTS enabled.

### 3B - Manual Import

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

## Creator Twine Version

### 1 - Download

Download the zip file with the latest version from the project GitHub page \
https://github.com/Elo-Ven/TTTS/raw/main/dist

### 2 - Unpack

Copy the 'ttts' directory into the game directory, next to the games .html. (go to the docs directory to see an example) \
https://github.com/Elo-Ven/TTTS/tree/main/docs

### 3 - Import

Copy the contents of `StoryJavaScript.js` to the StoryJavaScript section of the game in the Twine App.

Copy the contents of `StoryStylesheet.js` to the StoryStylesheet section of the game in the Twine App.

## Creator Twee Version

### 1 - Download

Download the zip file with the latest version from the project GitHub page \
https://github.com/Elo-Ven/TTTS/raw/main/dist

### 2 - Unpack

Copy the 'ttts' directory into the section of your game directory where you keep your media files, and will be output next to the games .html.

### 3 - Import

Copy the contents of `StoryInit.twee` to an appropriate location within your build (e.g. StoryInit). Ideally a location where the script will one once when the game loads and has rendered the initial Twine HTML structure.

## Developer Varsion

If you have need for this version, then you are at a level where you don't need me to tell you have to install it.

This is an unminified version of the Gamer version and has no launcher. `ttts.js` only contains the `TwineTextToSpeech` class. you need to run `TwineTextToSpeech.init()` yourself.

# Updating

Follow steps 1 and 2 of the install guide and then come back here.

Open the `ttts` folder in your download and find the folder named `core`. Copy this into your games `ttts` folder and overwrite everything.

Enjoy a mandatory moment of satisfaction and then thats the update complete.
