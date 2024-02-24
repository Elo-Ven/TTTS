# Options

| Option Name     | Type    | Description                                                                                                    |
| --------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| autoplay        | boolean | determines if TTTS should start automatically when moving to the next passage                                  |
| container       | string  | the id or other JS selector of element containing the story text                                               |
| debug           | boolean | When `true`, additional comments will be displayed in the browser console                                      |
| overwriteParams | array   | A list of options that should be overwritten with the profile option instead of being appended to              |
| pitch           | float   | same as SpeechSynthesisUtterance.pitch                                                                         |
| position        | string  | Placement of the player in browser, default is top-right (tr), possible options are tl, tc, tr, bl, bc, br     |
| rate            | float   | same as SpeechSynthesisUtterance.rate                                                                          |
| silence         | array   | list of JS selectors for elements that will be removed removed                                                 |
| trigger         | array   | list of JS selectors for elements that should trigger TTTS to autoplay (e.g. story navigation)                 |
| triggerIgnore   | array   | list of JS selectors for elements that are included in the `trigger` option but shouldn't trigger the autoplay |
| voice           | integer | the array key of the active SpeechSynthesisUtterance voice. full array in `window.speechSynthesis.getVoices()` |
| volume          | float   | same as SpeechSynthesisUtterance.volume                                                                        |
