/**
 * TTTS - Twine Text To Speech
 * Version: 2.1.0
 *
 * Licence: Creative Common Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0/)
 *
 * This is a mod for Twine HTML games that work in an internet browser.
 * It provides automated support for playing back the game story text via the browsers in-built TTS tools.
 *
 * "It doesn't stop being magic just because you know how it works."
 * Terry Pratchett / The Wee Free Men
 */

class TwineTextToSpeech {
    // Speech Synthesis options
    volume = 1;
    pitch = 1;
    rate = 1;
    voice = 0;
    silence = ['.link-internal'];
    trigger = ['.link-internal'];

    // Speech Synthesis objects
    voices = [];
    utter;
    synth = window.speechSynthesis;

    // text management
    passagesContainer;
    queue = [];
    queueCount = 0;
    queueCountManual = false;
    rawText = '';

    //html elements
    playBtn;
    nextBtn;
    prevBtn;
    configBtn;
    configContainer;

    /**
     * initialize the module, only run once
     */
    init() {
        this.importConfig();
        this.getParams();
        this.initHtml();
        this.playBtn = document.querySelector('#ttts-play');
        this.nextBtn = document.querySelector('#ttts-next');
        this.prevBtn = document.querySelector('#ttts-prev');
        this.configBtn = document.querySelector('#ttts-config');
        this.configContainer = document.querySelector('#ttts-config-container');
        this.setVoiceConfig();
        this.initEvents();
        this.onLoaded();
    }

    /**
     * imports support data from other files
     */
    importConfig() {
        //set default config params if supplied
        if (typeof tttsConfig !== 'undefined') {
            for (const key in tttsConfig) {
                this[key] = tttsConfig[key];
            }
        }

        //import the css file
        const css = '<link rel="stylesheet" type="text/css" href="ttts/ttts-style.css" />';
        document.querySelector('head').insertAdjacentHTML('beforeend', css);
    }

    /**
     * generate html elements needed for the module to function
     */
    initHtml() {
        const configHtml =
            '<div id="ttts-config-container">' +
            '<div id="ttts-config-body">' +
            '<p id="ttts-title">Twine Screen Reader Settings</p>' +
            '<div id="ttts-controls">' +
            '<p class="ttts-title-field">Shortcuts</p>' +
            '<ul><li>Play: 0 / Numpad 0</li>' +
            '<li>Stop: 0 / Numpad 0</li>' +
            '<li>Next: > (right arrow)</li>' +
            '<li>Back: < (left arrow)</li></ul>' +
            '</div>' +
            '<div id="ttts-rate">' +
            '<p class="ttts-title-field">Speed: <span class="ttts-config-slider-val">' +
            this.rate +
            '</span></p>' +
            '<input data-id="rate" type="range" class="ttts-config-slider" min="0.5" max="3" step="0.1" value="' +
            this.rate +
            '">' +
            '</div>' +
            '<div id="ttts-pitch">' +
            '<p class="ttts-title-field">Pitch: <span class="ttts-config-slider-val">' +
            this.pitch +
            '</span></p>' +
            '<input data-id="pitch" type="range" class="ttts-config-slider" min="0.5" max="3" step="0.1" value="' +
            this.pitch +
            '">' +
            '</div>' +
            '<p class="ttts-title-field">Voice</p>' +
            '<div id="ttts-voices"></div>' +
            '</div>' +
            '</div>';

        //container for player button
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'ttts-player';

        //add player buttons to the container
        const buttons = [
            { id: 'ttts-config' },
            { id: 'ttts-prev', disabled: true },
            { id: 'ttts-next', disabled: true },
            { id: 'ttts-play' },
        ];
        buttons.map((item) => {
            const button = document.createElement('div');
            button.id = item.id;
            if (item.disabled) {
                button.classList.add('disabled');
            }
            buttonContainer.appendChild(button);
        });

        //output to page
        document.querySelector('body').insertAdjacentHTML('beforeend', configHtml);
        document.querySelector('body').appendChild(buttonContainer);
    }

    /**
     * set all of the user trigger event listeners
     */
    initEvents() {
        this.playBtn.addEventListener('click', (event) => {
            if (this.synth.speaking) {
                this.reset();
            } else {
                this.onPlay();
            }
        });

        this.nextBtn.addEventListener('click', (event) => {
            if (!event.target.classList.contains('disabled')) {
                this.onNext();
            }
        });

        this.prevBtn.addEventListener('click', (event) => {
            if (!event.target.classList.contains('disabled')) {
                this.onPrev();
            }
        });

        this.configBtn.addEventListener('click', (event) => {
            if (this.configContainer.classList.contains('open')) {
                this.configContainer.classList.remove('open');
            } else {
                this.configContainer.classList.add('open');
            }
        });

        this.configContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('ttts-voice-sample')) {
                this.synth.cancel();

                this.speak({
                    text: 'The quick brown fox jumps over the lazy dog.',
                    voice: event.target.closest('.ttts-voice').dataset.id,
                });
            } else if (event.target.classList.contains('ttts-voice-select')) {
                this.synth.cancel();

                const container = event.target.closest('.ttts-voice');
                this.saveParam('voice', container.dataset.id);

                document
                    .querySelectorAll('.ttts-active')
                    .forEach((el) => el.classList.remove('ttts-active'));
                container.classList.add('ttts-active');
            } else if (event.target == this.configContainer) {
                this.configContainer.classList.remove('open');
            }
        });

        this.configContainer.querySelectorAll('.ttts-config-slider').forEach((el) =>
            el.addEventListener('change', (event) => {
                const id = event.target.dataset.id;
                if (typeof this[id] !== 'undefined') {
                    this[id] = event.target.value;
                    this.saveParam(id, event.target.value);

                    this.configContainer.querySelector(
                        '#ttts-' + id + ' .ttts-config-slider-val'
                    ).innerText = event.target.value;
                }
            })
        );

        document.addEventListener('keydown', (e) => {
            if (e.which == 96 || e.which == 48) {
                //Numpad0
                if (this.synth.speaking) {
                    this.reset();
                } else {
                    this.onPlay();
                }
            } else if (e.which == 37) {
                //left arrow
                this.onPrev();
            } else if (e.which == 39) {
                //right arrow
                this.onNext();
            }
            // } else if (e.which == 110) {
            //     //NumpadDecimal
            //     this.setVolume(volume === 1 ? 0 : 1);
            // }
        });

        window.addEventListener('unload', (event) => {
            this.reset();
        });
    }

    /**
     * Get the latest version of the story content.
     * Add an event to check for story navigation interactions
     */
    getPassages() {
        this.passagesContainer = document.querySelector('#passages');
        if (this.passagesContainer) {
            console.log('passagesContainer', this.passagesContainer.innerHTML);
            this.passagesContainer.addEventListener('mouseup', (e) => {
                let valid = true;
                this.trigger.map((selector) => {
                    console.log('getPassages', selector, valid, e.target.closest(selector));
                    if (valid && e.target.closest(selector)) {
                        valid = false;
                        this.onPlay();
                    }
                });
            });
        }
    }

    /**
     * get the stored module options if it exists
     */
    getParam(id) {
        var stored = localStorage.getItem('ttts-' + id);
        if (typeof stored !== 'undefined') {
            this[id] = stored;
        }
    }

    getParams() {
        const params = ['voice', 'rate', 'pitch'];
        params.map((param) => {
            this.getParam(param);
        });
    }

    /**
     * get the voices available in the browser and update the list in the config section
     * @returns bool
     */
    setVoiceConfig() {
        if (this.voices.length > 0) {
            return false;
        }

        this.voices = this.synth.getVoices();
        //console.log('VOICE | ', this.voice);
        //console.log('VOICES | ', this.voices);
        if (this.voices.length > 0) {
            this.voices.map((item, key) => {
                const row = document.createElement('div');
                row.classList.add('ttts-voice');
                row.dataset.id = key;

                const name = document.createElement('p');
                name.classList.add('ttts-voice-title');
                name.innerText = parseInt(key) + ': ' + this.voices[key].name;

                const sampleBtn = document.createElement('button');
                sampleBtn.classList.add('ttts-voice-sample');
                sampleBtn.innerText = 'Sample';

                const selectBtn = document.createElement('button');
                selectBtn.classList.add('ttts-voice-select');
                selectBtn.innerText = 'Select';

                row.appendChild(name);
                row.appendChild(sampleBtn);
                row.appendChild(selectBtn);

                if (parseInt(key) === parseInt(this.voice)) {
                    row.classList.add('ttts-active');
                }

                document.querySelector('#ttts-voices').appendChild(row);
            });
        }
    }

    /**
     * run once Twine has loaded in the Passages content
     */
    onLoaded() {
        setTimeout(() => {
            this.getPassages();
            if (!this.passagesContainer) {
                this.onLoaded();
            }
        }, 500);
    }

    /**
     * move to the next Utterance
     */
    onNext() {
        this.synth.cancel();
        this.queueCount++;
        this.run();
    }

    /**
     * run TTTS on current story passage in the queue
     */
    onPlay() {
        if (this.synth.speaking || this.playBtn.classList.contains('play')) {
            this.reset();
        }
        setTimeout(() => {
            this.processPassages();
            this.run();
        }, 500);
    }

    /**
     * format the passages to be more readable, split text into an array of lines and add each to the play queue
     */
    processPassages() {
        //this.getPassages();

        const rawText = document.createElement('div');
        rawText.innerHTML = this.passagesContainer.innerHTML;

        this.silence.map((ignore) => {
            rawText.querySelectorAll(ignore).forEach((el) => el.remove());
        });

        rawText.innerHTML = rawText.innerHTML.replaceAll('<br>', '\n'); //br to line break
        rawText.innerHTML = rawText.innerHTML.replaceAll('<br/>', '\n'); //br to line break
        rawText.innerHTML = rawText.innerHTML.replaceAll(/\n\s*\n/g, '\n'); //double to single line breaks
        rawText.innerHTML = rawText.innerHTML.replaceAll(/\t/g, ' '); //tabs to spaces
        rawText.innerHTML = rawText.innerHTML.replaceAll(/ +(?= )/g, ' '); //double to single spaces
        //console.log('CONTENT | ', rawText.innerHTML);

        const duplicate = [];
        const lines = rawText.innerHTML.trim().match(/[^\r\n]+/g);
        console.log('LINES | ', lines);

        lines.map((line) => {
            const lineFormatted = document.createElement('div');
            lineFormatted.innerHTML = line;
            let text = lineFormatted.innerText;

            text = text.replaceAll('.', ',');
            text = text.replaceAll(',,', ',');

            if (text !== '' && !duplicate.includes(text)) {
                duplicate.push(text);
                this.queue.push({
                    text: text,
                    pitch: this.pitch,
                    voice: this.voice,
                    orig: line,
                });
            }
        });
    }

    /**
     * move to the previously ran Utterance in the queue
     */
    onPrev() {
        this.synth.cancel();
        this.queueCount--;
        this.run();
    }

    /**
     * process the play queue and update the next/prev buttons
     */
    run() {
        if (this.queueCount === 0) {
            this.prevBtn.classList.add('disabled');
        } else {
            this.prevBtn.classList.remove('disabled');
        }

        if (this.queueCount + 1 >= this.queue.length) {
            this.nextBtn.classList.add('disabled');
        } else {
            this.nextBtn.classList.remove('disabled');
        }

        if (typeof this.queue[this.queueCount] !== 'undefined') {
            this.speak(this.queue[this.queueCount], { events: true });
        } else {
            this.reset();
        }
    }

    /**
     * reset back to idle mode
     */
    reset = () => {
        this.synth.cancel();
        this.queue = [];
        this.queueCount = 0;

        this.nextBtn.classList.add('disabled');
        this.prevBtn.classList.add('disabled');
        this.playBtn.classList.remove('play');
        this.passagesContainer
            .querySelectorAll('.ttts-highlight')
            .forEach((el) => el.classList.remove('ttts-highlight'));
    };

    /**
     * save user preferences and update the current instance with the new params
     * @param {*} val
     */
    saveParam(param, val) {
        localStorage.setItem('ttts-' + param, val);
        this[param] = localStorage.getItem('ttts-' + param);
    }

    /**
     * run and manage SpeechSynthesis in the browser
     * @param {string} msg
     * @param {object} opts
     */
    speak(msg, opts = {}) {
        //create utterance and set params
        this.utter = new SpeechSynthesisUtterance();
        this.utter.rate = this.rate;
        this.utter.volume = this.volume;
        this.utter.voice = this.voices[msg.voice];
        this.utter.text = msg.text;
        this.utter.pitch = this.pitch;

        //set the utterance events, basically if to
        const inst = this;
        this.utter.onstart = function (event) {
            inst.playBtn.classList.add('play');
        };

        this.utter.onend = function (event) {
            inst.playBtn.classList.remove('play');
            if (!inst.queueCountManual) {
                inst.queueCount++;
            }
            inst.queueCountManual = false;
            inst.run();
        };

        this.utter.onpause = function (event) {
            inst.queueCountManual = true;
            inst.synth.cancel();
        };

        this.synth.speak(this.utter);

        //this.highlighter(msg.text);
    }

    /**
     * highlight the story text currently begin spoken, WIP - very temperamental and heavily depends on the story html structure
     * @param {string} msg
     */
    highlighter(msg) {
        document
            .querySelectorAll('.ttts-highlight')
            .forEach((el) => el.classList.remove('ttts-highlight'));

        console.log('msg', msg);
        const words = msg.split(' ');
        let tmp = this.passagesContainer.innerHTML;

        words.map((word) => {
            const highlight = document.createElement('span');
            highlight.className = 'ttts-highlight';
            highlight.innerHTML = word;
            tmp = tmp.replaceAll(word, highlight.outerHTML);
        });

        this.passagesContainer.innerHTML = tmp;

        // let highlight = this.passagesContainer.innerHTML;
        // highlight = highlight.replaceAll(msg, '<span class="ttts-highlight">' + msg + '</span>');
        // this.passagesContainer.innerHTML = highlight;
    }
}

// INIT
if ('speechSynthesis' in window) {
    const ttts = new TwineTextToSpeech();
    if (typeof tttsConfig !== 'undefined') {
        ttts.init();
    } else {
        window.onload = function () {
            ttts.init();
        };
    }
}
