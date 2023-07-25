
@ECHO OFF
setlocal enableDelayedExpansion

::PARAMS
set "from=</body>"
set "to=<script src="ttts/ttts-config.js"></script></body>"

set "ext1=.html"
set "ext2=-mod.html"

::INTRO
echo " ____  ____  ____  ____ "
echo "(_  _)(_  _)(_  _)/ ___)"
echo "  )(    )(    )(  \___ \"
echo " (__)  (__)  (__) (____/"
echo    Twine Text To Speech
echo:
echo:

echo Beginning installation...
echo:

::GET GAME FILE
echo Enter the name of the main html file. This will often be MY_GAME.html
set /p "source=The games html filename: ..\"
set "source=..\%source%"
set "output=!source:%ext1%=%ext2%!"

::VALIDATION
IF "%source%"=="..\" GOTO :FAIL
IF EXIST %source% GOTO :RUN
GOTO :FAIL

::RUN IMPORT
:RUN
echo:
echo Copying game...
echo:
echo Importing TTTS...

(
   for /F "tokens=1* delims=:" %%a in ('findstr /N "^" %source%') do (
      set "line=%%b"
      if defined line set "line=!line:%from%=%to%!"
      echo(!line!)
   ) > %output%


)

echo:
echo Saving copied game to %output%
echo Use this file to open the game from now on...
echo:
echo Installation complete...
GOTO :END

::DISPLAY ERROR
:FAIL
echo:
echo Game file not found...
echo %source% 
echo:
echo Installation failed...
GOTO :END

::STOP RUNNING
:END
@pause
endlocal