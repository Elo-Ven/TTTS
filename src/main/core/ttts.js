/**
 * TTTS - Twine Text To Speech
 * Version: 2.4.0
 *
 * Licence: MIT (https://github.com/Elo-Ven/TTTS/blob/main/LICENSE)
 *
 * This is a mod for Twine HTML games that work in an internet browser.
 * It provides automated support for playing back the game story text via the browsers in-built TTS tools.
 *
 * "It doesn't stop being magic just because you know how it works."
 * Terry Pratchett / The Wee Free Men
 */

class TwineTextToSpeech {
    version = '2.5';

    // Speech Synthesis options
    pitch = 1;
    rate = 1;
    voice = 0;
    volume = 1;

    // usage options
    autoplay = true;
    container = '#passages, tw-passage';
    overwriteParams = [
        //'trigger',
        //'silence'
    ];
    position = 'tr';
    mediaDir = './ttts/media';
    debug = false;
    highlighter = false;
    silence = [
        '.link-internal',
        'tw-link',
        'tw-sidebar',
        'script',
        'table',
        'select',
        'textarea',
        'img',
        'svg',
        'object',
        'iframe',
        '.error-view',
        '.error',
    ];
    trigger = ['.link-internal', 'tw-link'];
    triggerIgnore = [];

    // Speech Synthesis objects
    voices = [];
    utter;
    synth = window.speechSynthesis;

    // text management
    htmlBackup = '';
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
    tttsContainer;

    //other
    framework = '';

    /**
     * initialize the module, only run once
     */
    init() {
        console.log('TTTS | Running setup');
        this.loadSynth().then(() => {
            this.importProfile();
            this.getParams();
            this.initHtml();
            this.fetchVoices();
            this.initEvents();
            this.onLoaded();
        });
    }

    /**
     * imports support data from other files
     */
    importProfile() {
        //set default config params if supplied
        if (typeof tttsProfile !== 'undefined') {
            const imported = [];
            const arrays = ['silence', 'trigger', 'triggerIgnore'];
            for (const key in tttsProfile) {
                if (arrays.includes(key)) {
                    if (this.overwriteParams.includes(key)) {
                        this[key] = tttsProfile[key];
                    } else {
                        this[key] = this[key].concat(tttsProfile[key]);
                    }
                } else {
                    this[key] = tttsProfile[key];
                }
                imported.push(key);
            }
            if (imported.length > 0) {
                console.log('TTTS | Imported profile with ' + imported.join(','));
            }
        }

        //import the css file
        const css = '<link rel="stylesheet" type="text/css" href="ttts/core/ttts-style.css" />';
        document.querySelector('head').insertAdjacentHTML('beforeend', css);
    }

    /**
     * generate html elements needed for the module to function
     */
    initHtml() {
        const configHtml =
            '<div id="ttts-config-container">' +
            '<div id="ttts-config-body">' +
            '<p id="ttts-title">Twine Screen Reader Settings (v' +
            this.version +
            ')</p>' +
            '<div id="ttts-controls">' +
            '<p class="ttts-title-field">Shortcuts</p>' +
            '<ul><li>Play: 0 / Numpad 0</li>' +
            '<li>Next: > (right arrow)</li>' +
            '<li>Back: < (left arrow)</li></ul>' +
            '</div>' +
            '<div id="ttts-autoplay"><p class="ttts-autoplay-field">Autoplay: ' +
            '<button class="ttts-autoplay-btn">' +
            (this.autoplay ? 'On' : 'Off') +
            '</button>' +
            '</p></div>' +
            // '<div id="ttts-highlighter"><p class="ttts-highlighter-field">Highlighter: ' +
            // '<button class="ttts-highlighter-btn">' +
            // (this.highlighter ? 'On' : 'Off') +
            // '</button>' +
            // '</p></div>' +
            '<div id="ttts-volume">' +
            '<p class="ttts-title-field">Volume: <span class="ttts-config-slider-val">' +
            this.volume +
            '</span></p>' +
            '<input data-id="volume" type="range" class="ttts-config-slider" min="0" max="1" step="0.1" value="' +
            this.volume +
            '">' +
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
        buttonContainer.classList.add('ttts-player-' + this.position);

        //add player buttons to the container
        const buttons = [
            { id: 'ttts-config', alt: '?', icon: 'config.png' },
            { id: 'ttts-prev', disabled: true, alt: '<', icon: 'next.png' },
            { id: 'ttts-next', disabled: true, alt: '>', icon: 'next.png' },
            { id: 'ttts-play', alt: '+', icon: 'play.png' },
        ];
        buttons.map((item) => {
            const button = document.createElement('div');
            button.id = item.id;
            if (item.disabled) {
                button.classList.add('disabled');
            }

            //const span = document.createElement('<span>' + item.alt + '</span>');
            const alt = document.createElement('span');
            alt.textContent = item.alt;
            button.appendChild(alt);

            const icon = document.createElement('img');
            icon.src = this.mediaDir + '/' + item.icon;
            icon.classList.add(item.id + '-sprite');
            button.appendChild(icon);

            if (item.id === 'ttts-play') {
                const icon = document.createElement('img');
                icon.src = this.mediaDir + '/pause.png';
                icon.classList.add('ttts-pause-sprite');
                button.appendChild(icon);
            }

            buttonContainer.appendChild(button);
        });

        //output to page
        const tttsContainer = document.createElement('div');
        tttsContainer.id = 'ttts';
        tttsContainer.classList.add('ttts-enable');

        tttsContainer.insertAdjacentHTML('beforeend', configHtml);
        tttsContainer.appendChild(buttonContainer);
        document.querySelector('body').appendChild(tttsContainer);

        buttons.map((item) => {
            this.checkImage(
                this.mediaDir + '/' + item.icon,
                () => {
                    document.querySelector('#' + item.id + ' span').remove();
                },
                () => {
                    document.querySelector('#' + item.id + ' img').remove();
                }
            );
        });

        this.tttsContainer = document.querySelector('#ttts');
        this.playBtn = document.querySelector('#ttts-play');
        this.nextBtn = document.querySelector('#ttts-next');
        this.prevBtn = document.querySelector('#ttts-prev');
        this.configBtn = document.querySelector('#ttts-config');
        this.configContainer = document.querySelector('#ttts-config-container');
    }

    /**
     * set all of the user trigger event listeners
     */
    initEvents() {
        //click the play/pause button in the player
        this.playBtn.addEventListener('click', (event) => {
            if (this.synth.speaking) {
                this.reset();
            } else {
                this.onPlay();
            }
        });

        //click the next button in the player
        this.nextBtn.addEventListener('click', (event) => {
            if (!event.target.classList.contains('disabled')) {
                this.onNext();
            }
        });

        //click the back button in the player
        this.prevBtn.addEventListener('click', (event) => {
            if (!event.target.classList.contains('disabled')) {
                this.onPrev();
            }
        });

        //click the settings button in the player
        this.configBtn.addEventListener('click', (event) => {
            if (this.configContainer.classList.contains('open')) {
                this.configContainer.classList.remove('open');
            } else {
                this.configContainer.classList.add('open');
            }
        });

        //triggers for the settings popup
        this.configContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('ttts-autoplay-btn')) {
                this.autoplay = !this.autoplay;
                this.saveParam('autoplay', this.autoplay);
                if (this.autoplay) {
                    event.target.innerHTML = 'On';
                } else {
                    event.target.innerHTML = 'Off';
                }
            } else if (event.target.classList.contains('ttts-highlighter-btn')) {
                this.highlighter = !this.highlighter;
                this.saveParam('highlighter', this.highlighter);
                if (this.highlighter) {
                    event.target.innerHTML = 'On';
                } else {
                    event.target.innerHTML = 'Off';
                }
            } else if (event.target.classList.contains('ttts-voice-sample')) {
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

        //triggers for the settings popup slider bars
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

        //keyboard triggers
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

        window.addEventListener('ttts-enable', (event) => {
            this.tttsContainer.classList.add('ttts-enable');
        });
        window.addEventListener('ttts-disable', (event) => {
            this.tttsContainer.classList.remove('ttts-enable');
            this.reset();
        });
        window.addEventListener('unload', (event) => {
            this.reset();
        });
    }

    checkImage(imageSrc, good = false, bad = false) {
        const img = new Image();

        if (good === false) {
            good = () => {};
        }
        if (bad !== false) {
            img.onerror = bad;
        }

        img.onload = good;
        img.src = imageSrc;
    }

    /**
     * Import speechSynthesis from the browser
     * @returns Promise
     */
    loadSynth() {
        return new Promise(function (resolve, reject) {
            let synth = window.speechSynthesis;
            let id;

            id = setInterval(() => {
                if (synth.getVoices().length > 0) {
                    resolve();
                    clearInterval(id);
                }
            }, 10);
        });
    }

    /**
     * Get the latest version of the story content.
     * Add an event to check for story navigation interactions
     */
    getPassages() {
        //re-fetch the story content
        this.passagesContainer = document.querySelector(this.container);

        //add an event listener if it doesn't already exist (can be removed when using story navigation)
        if (this.passagesContainer && this.passagesContainer.getAttribute('listening') !== '1') {
            this.passagesContainer.setAttribute('listening', '1');
            this.passagesContainer.addEventListener('mouseup', (e) => {
                let valid = false;

                if (!this.autoplay) {
                    return false;
                }

                //is the thing being clicked in the trigger list
                this.trigger.map((selector) => {
                    if (!valid && e.target.closest(selector)) {
                        valid = true;
                    }
                });

                //is the things being click in the ignore list
                this.triggerIgnore.map((selector) => {
                    if (valid && e.target.closest(selector)) {
                        valid = false;
                    }
                });

                //play if the thing being clicked if valid
                if (valid) {
                    this.onPlay();
                }
            });
        }
    }

    /**
     * get the stored module options if it exists
     */
    getParam(id) {
        var stored = localStorage.getItem('ttts-' + id);
        if (typeof stored !== 'undefined' && stored !== null) {
            switch (id) {
                case 'autoplay':
                case 'highlighter':
                    stored = stored === 'true';
                    break;
                case 'voice':
                    stored = parseInt(stored);
                    break;
                case 'rate':
                case 'pitch':
                case 'volume':
                    stored = parseFloat(stored);
                    break;
            }

            this[id] = stored;
        }
    }

    /**
     * attempt to get module options form the browsers local storage
     */
    getParams() {
        const params = ['voice', 'rate', 'pitch', 'volume', 'autoplay', 'highlighter'];
        params.map((param) => {
            this.getParam(param);
        });
    }

    /**
     * get the voices available in the browser and update the list in the config section
     * @returns bool
     */
    fetchVoices() {
        if (this.voices.length > 0) {
            return false;
        }

        this.voices = this.synth.getVoices();
        if (this.debug) {
            console.log('TTTS | VOICE | ', this.voice);
            console.log('TTTS | VOICES | ', this.voices);
        }
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
            } else {
                if (typeof document.querySelector('#story > #passages') !== 'undefined') {
                    this.framework = 'sugarcube';
                } else if (typeof document.querySelector('tw-story > tw-passage') !== 'undefined') {
                    this.framework = 'harlowe';
                }
                console.log('TTTS | Setup complete');

                const evt = new CustomEvent('ttts-onloaded', { ttts: this });
                window.dispatchEvent(evt);
            }
        }, 500);
    }

    /**
     * move to the next Utterance
     */
    onNext() {
        if (this.debug) {
            console.log('TTTS | Next');
        }
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
            if (this.debug) {
                console.log('TTTS | Run');
            }
            this.processPassages();
            this.run();
        }, 500);
    }

    /**
     * format the passages to be more readable, split text into an array of lines and add each to the play queue
     */
    processPassages() {
        this.getPassages();

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
        if (this.debug) {
            console.log('TTTS | LINES | ', lines);
        }

        if (lines !== null && lines.length > 0) {
            lines.map((line) => {
                const lineFormatted = document.createElement('div');
                lineFormatted.innerHTML = line;
                let text = lineFormatted.innerText;

                text = text.replaceAll('..', '.');
                //text = text.replaceAll('.', ',');
                text = text.replaceAll(',,', ',');
                text = text.trim();

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
    }

    /**
     * move to the previously ran Utterance in the queue
     */
    onPrev() {
        if (this.debug) {
            console.log('TTTS | Prev');
        }
        this.synth.cancel();
        this.queueCount--;
        this.run();
    }

    /**
     * process the play queue and update the next/prev buttons
     */
    run() {
        // if (this.htmlBackup === '') {
        //     this.htmlBackup = this.passagesContainer.innerHTML;
        // }

        if (!this.tttsContainer.classList.contains('ttts-enable')) {
            return false;
        }

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
            this.speak(this.queue[this.queueCount]);
        } else {
            this.reset();
        }
    }

    /**
     * reset back to idle mode
     */
    reset = () => {
        if (this.debug) {
            console.log('TTTS | Reset');
        }
        this.synth.cancel();
        this.queue = [];
        this.queueCount = 0;

        this.nextBtn.classList.add('disabled');
        this.prevBtn.classList.add('disabled');
        this.playBtn.classList.remove('play');

        //if using the highlighter, put the html back to its original state incase the highlighter has broken the html
        // if (this.highlighter) {
        //     this.passagesContainer.innerHTML = this.htmlBackup;
        //     this.passagesContainer
        //         .querySelectorAll('.ttts-highlight')
        //         .forEach((el) => el.classList.remove('ttts-highlight'));
        // }
        // this.htmlBackup = '';
    };

    /**
     * save user preferences and update the current instance with the new params
     * @param {*} val
     */
    saveParam(param, val) {
        localStorage.setItem('ttts-' + param, val);
        this.getParam(param);
        //this[param] = localStorage.getItem('ttts-' + param);
    }

    /**
     * run and manage SpeechSynthesis in the browser
     * @param {string} msg
     * @param {object} opts
     */
    speak(msg) {
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

        if (this.debug) {
            console.log('TTTS | SPEAK | ' + msg.text);
        }

        this.synth.speak(this.utter);
    }
}
