"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
var TwineTextToSpeech = /*#__PURE__*/function () {
  function TwineTextToSpeech() {
    var _this = this;
    _classCallCheck(this, TwineTextToSpeech);
    _defineProperty(this, "version", '2.5');
    // Speech Synthesis options
    _defineProperty(this, "pitch", 1);
    _defineProperty(this, "rate", 1);
    _defineProperty(this, "voice", 0);
    _defineProperty(this, "volume", 1);
    // usage options
    _defineProperty(this, "autoplay", true);
    _defineProperty(this, "container", '#passages, tw-passage');
    _defineProperty(this, "overwriteParams", [
      //'trigger',
      //'silence'
    ]);
    _defineProperty(this, "position", 'tr');
    _defineProperty(this, "mediaDir", './ttts/media');
    _defineProperty(this, "debug", false);
    _defineProperty(this, "highlighter", false);
    _defineProperty(this, "silence", ['.link-internal', 'tw-link', 'tw-sidebar', 'script', 'table', 'select', 'textarea', 'img', 'svg', 'object', 'iframe', '.error-view', '.error']);
    _defineProperty(this, "trigger", ['.link-internal', 'tw-link']);
    _defineProperty(this, "triggerIgnore", []);
    // Speech Synthesis objects
    _defineProperty(this, "voices", []);
    _defineProperty(this, "utter", void 0);
    _defineProperty(this, "synth", window.speechSynthesis);
    // text management
    _defineProperty(this, "htmlBackup", '');
    _defineProperty(this, "passagesContainer", void 0);
    _defineProperty(this, "queue", []);
    _defineProperty(this, "queueCount", 0);
    _defineProperty(this, "queueCountManual", false);
    _defineProperty(this, "rawText", '');
    //html elements
    _defineProperty(this, "playBtn", void 0);
    _defineProperty(this, "nextBtn", void 0);
    _defineProperty(this, "prevBtn", void 0);
    _defineProperty(this, "configBtn", void 0);
    _defineProperty(this, "configContainer", void 0);
    _defineProperty(this, "tttsContainer", void 0);
    //other
    _defineProperty(this, "framework", '');
    /**
     * reset back to idle mode
     */
    _defineProperty(this, "reset", function () {
      if (_this.debug) {
        console.log('TTTS | Reset');
      }
      _this.synth.cancel();
      _this.queue = [];
      _this.queueCount = 0;
      _this.nextBtn.classList.add('disabled');
      _this.prevBtn.classList.add('disabled');
      _this.playBtn.classList.remove('play');

      //if using the highlighter, put the html back to its original state incase the highlighter has broken the html
      // if (this.highlighter) {
      //     this.passagesContainer.innerHTML = this.htmlBackup;
      //     this.passagesContainer
      //         .querySelectorAll('.ttts-highlight')
      //         .forEach((el) => el.classList.remove('ttts-highlight'));
      // }
      // this.htmlBackup = '';
    });
  }
  _createClass(TwineTextToSpeech, [{
    key: "init",
    value:
    /**
     * initialize the module, only run once
     */
    function init() {
      var _this2 = this;
      console.log('TTTS | Running setup');
      this.loadSynth().then(function () {
        _this2.importProfile();
        _this2.getParams();
        _this2.initHtml();
        _this2.fetchVoices();
        _this2.initEvents();
        _this2.onLoaded();
      });
    }

    /**
     * imports support data from other files
     */
  }, {
    key: "importProfile",
    value: function importProfile() {
      //set default config params if supplied
      if (typeof tttsProfile !== 'undefined') {
        var imported = [];
        var arrays = ['silence', 'trigger', 'triggerIgnore'];
        for (var key in tttsProfile) {
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
      var css = '<link rel="stylesheet" type="text/css" href="ttts/core/ttts-style.css" />';
      document.querySelector('head').insertAdjacentHTML('beforeend', css);
    }

    /**
     * generate html elements needed for the module to function
     */
  }, {
    key: "initHtml",
    value: function initHtml() {
      var _this3 = this;
      var configHtml = '<div id="ttts-config-container">' + '<div id="ttts-config-body">' + '<p id="ttts-title">Twine Screen Reader Settings (v' + this.version + ')</p>' + '<div id="ttts-controls">' + '<p class="ttts-title-field">Shortcuts</p>' + '<ul><li>Play: 0 / Numpad 0</li>' + '<li>Next: > (right arrow)</li>' + '<li>Back: < (left arrow)</li></ul>' + '</div>' + '<div id="ttts-autoplay"><p class="ttts-autoplay-field">Autoplay: ' + '<button class="ttts-autoplay-btn">' + (this.autoplay ? 'On' : 'Off') + '</button>' + '</p></div>' +
      // '<div id="ttts-highlighter"><p class="ttts-highlighter-field">Highlighter: ' +
      // '<button class="ttts-highlighter-btn">' +
      // (this.highlighter ? 'On' : 'Off') +
      // '</button>' +
      // '</p></div>' +
      '<div id="ttts-volume">' + '<p class="ttts-title-field">Volume: <span class="ttts-config-slider-val">' + this.volume + '</span></p>' + '<input data-id="volume" type="range" class="ttts-config-slider" min="0" max="1" step="0.1" value="' + this.volume + '">' + '</div>' + '<div id="ttts-rate">' + '<p class="ttts-title-field">Speed: <span class="ttts-config-slider-val">' + this.rate + '</span></p>' + '<input data-id="rate" type="range" class="ttts-config-slider" min="0.5" max="3" step="0.1" value="' + this.rate + '">' + '</div>' + '<div id="ttts-pitch">' + '<p class="ttts-title-field">Pitch: <span class="ttts-config-slider-val">' + this.pitch + '</span></p>' + '<input data-id="pitch" type="range" class="ttts-config-slider" min="0.5" max="3" step="0.1" value="' + this.pitch + '">' + '</div>' + '<p class="ttts-title-field">Voice</p>' + '<div id="ttts-voices"></div>' + '</div>' + '</div>';

      //container for player button
      var buttonContainer = document.createElement('div');
      buttonContainer.id = 'ttts-player';
      buttonContainer.classList.add('ttts-player-' + this.position);

      //add player buttons to the container
      var buttons = [{
        id: 'ttts-config',
        alt: '?',
        icon: 'config.png'
      }, {
        id: 'ttts-prev',
        disabled: true,
        alt: '<',
        icon: 'next.png'
      }, {
        id: 'ttts-next',
        disabled: true,
        alt: '>',
        icon: 'next.png'
      }, {
        id: 'ttts-play',
        alt: '+',
        icon: 'play.png'
      }];
      buttons.map(function (item) {
        var button = document.createElement('div');
        button.id = item.id;
        if (item.disabled) {
          button.classList.add('disabled');
        }

        //const span = document.createElement('<span>' + item.alt + '</span>');
        var alt = document.createElement('span');
        alt.textContent = item.alt;
        button.appendChild(alt);
        var icon = document.createElement('img');
        icon.src = _this3.mediaDir + '/' + item.icon;
        icon.classList.add(item.id + '-sprite');
        button.appendChild(icon);
        if (item.id === 'ttts-play') {
          var _icon = document.createElement('img');
          _icon.src = _this3.mediaDir + '/pause.png';
          _icon.classList.add('ttts-pause-sprite');
          button.appendChild(_icon);
        }
        buttonContainer.appendChild(button);
      });

      //output to page
      var tttsContainer = document.createElement('div');
      tttsContainer.id = 'ttts';
      tttsContainer.classList.add('ttts-enable');
      tttsContainer.insertAdjacentHTML('beforeend', configHtml);
      tttsContainer.appendChild(buttonContainer);
      document.querySelector('body').appendChild(tttsContainer);
      buttons.map(function (item) {
        _this3.checkImage(_this3.mediaDir + '/' + item.icon, function () {
          document.querySelector('#' + item.id + ' span').remove();
        }, function () {
          document.querySelector('#' + item.id + ' img').remove();
        });
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
  }, {
    key: "initEvents",
    value: function initEvents() {
      var _this4 = this;
      //click the play/pause button in the player
      this.playBtn.addEventListener('click', function (event) {
        if (_this4.synth.speaking) {
          _this4.reset();
        } else {
          _this4.onPlay();
        }
      });

      //click the next button in the player
      this.nextBtn.addEventListener('click', function (event) {
        if (!event.target.classList.contains('disabled')) {
          _this4.onNext();
        }
      });

      //click the back button in the player
      this.prevBtn.addEventListener('click', function (event) {
        if (!event.target.classList.contains('disabled')) {
          _this4.onPrev();
        }
      });

      //click the settings button in the player
      this.configBtn.addEventListener('click', function (event) {
        if (_this4.configContainer.classList.contains('open')) {
          _this4.configContainer.classList.remove('open');
        } else {
          _this4.configContainer.classList.add('open');
        }
      });

      //triggers for the settings popup
      this.configContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('ttts-autoplay-btn')) {
          _this4.autoplay = !_this4.autoplay;
          _this4.saveParam('autoplay', _this4.autoplay);
          if (_this4.autoplay) {
            event.target.innerHTML = 'On';
          } else {
            event.target.innerHTML = 'Off';
          }
        } else if (event.target.classList.contains('ttts-highlighter-btn')) {
          _this4.highlighter = !_this4.highlighter;
          _this4.saveParam('highlighter', _this4.highlighter);
          if (_this4.highlighter) {
            event.target.innerHTML = 'On';
          } else {
            event.target.innerHTML = 'Off';
          }
        } else if (event.target.classList.contains('ttts-voice-sample')) {
          _this4.synth.cancel();
          _this4.speak({
            text: 'The quick brown fox jumps over the lazy dog.',
            voice: event.target.closest('.ttts-voice').dataset.id
          });
        } else if (event.target.classList.contains('ttts-voice-select')) {
          _this4.synth.cancel();
          var container = event.target.closest('.ttts-voice');
          _this4.saveParam('voice', container.dataset.id);
          document.querySelectorAll('.ttts-active').forEach(function (el) {
            return el.classList.remove('ttts-active');
          });
          container.classList.add('ttts-active');
        } else if (event.target == _this4.configContainer) {
          _this4.configContainer.classList.remove('open');
        }
      });

      //triggers for the settings popup slider bars
      this.configContainer.querySelectorAll('.ttts-config-slider').forEach(function (el) {
        return el.addEventListener('change', function (event) {
          var id = event.target.dataset.id;
          if (typeof _this4[id] !== 'undefined') {
            _this4[id] = event.target.value;
            _this4.saveParam(id, event.target.value);
            _this4.configContainer.querySelector('#ttts-' + id + ' .ttts-config-slider-val').innerText = event.target.value;
          }
        });
      });

      //keyboard triggers
      document.addEventListener('keydown', function (e) {
        if (e.which == 96 || e.which == 48) {
          //Numpad0
          if (_this4.synth.speaking) {
            _this4.reset();
          } else {
            _this4.onPlay();
          }
        } else if (e.which == 37) {
          //left arrow
          _this4.onPrev();
        } else if (e.which == 39) {
          //right arrow
          _this4.onNext();
        }
        // } else if (e.which == 110) {
        //     //NumpadDecimal
        //     this.setVolume(volume === 1 ? 0 : 1);
        // }
      });

      window.addEventListener('ttts-enable', function (event) {
        _this4.tttsContainer.classList.add('ttts-enable');
      });
      window.addEventListener('ttts-disable', function (event) {
        _this4.tttsContainer.classList.remove('ttts-enable');
        _this4.reset();
      });
      window.addEventListener('unload', function (event) {
        _this4.reset();
      });
    }
  }, {
    key: "checkImage",
    value: function checkImage(imageSrc) {
      var good = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var bad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var img = new Image();
      if (good === false) {
        good = function good() {};
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
  }, {
    key: "loadSynth",
    value: function loadSynth() {
      return new Promise(function (resolve, reject) {
        var synth = window.speechSynthesis;
        var id;
        id = setInterval(function () {
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
  }, {
    key: "getPassages",
    value: function getPassages() {
      var _this5 = this;
      //re-fetch the story content
      this.passagesContainer = document.querySelector(this.container);

      //add an event listener if it doesn't already exist (can be removed when using story navigation)
      if (this.passagesContainer && this.passagesContainer.getAttribute('listening') !== '1') {
        this.passagesContainer.setAttribute('listening', '1');
        this.passagesContainer.addEventListener('mouseup', function (e) {
          var valid = false;
          if (!_this5.autoplay) {
            return false;
          }

          //is the thing being clicked in the trigger list
          _this5.trigger.map(function (selector) {
            if (!valid && e.target.closest(selector)) {
              valid = true;
            }
          });

          //is the things being click in the ignore list
          _this5.triggerIgnore.map(function (selector) {
            if (valid && e.target.closest(selector)) {
              valid = false;
            }
          });

          //play if the thing being clicked if valid
          if (valid) {
            _this5.onPlay();
          }
        });
      }
    }

    /**
     * get the stored module options if it exists
     */
  }, {
    key: "getParam",
    value: function getParam(id) {
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
  }, {
    key: "getParams",
    value: function getParams() {
      var _this6 = this;
      var params = ['voice', 'rate', 'pitch', 'volume', 'autoplay', 'highlighter'];
      params.map(function (param) {
        _this6.getParam(param);
      });
    }

    /**
     * get the voices available in the browser and update the list in the config section
     * @returns bool
     */
  }, {
    key: "fetchVoices",
    value: function fetchVoices() {
      var _this7 = this;
      if (this.voices.length > 0) {
        return false;
      }
      this.voices = this.synth.getVoices();
      if (this.debug) {
        console.log('TTTS | VOICE | ', this.voice);
        console.log('TTTS | VOICES | ', this.voices);
      }
      if (this.voices.length > 0) {
        this.voices.map(function (item, key) {
          var row = document.createElement('div');
          row.classList.add('ttts-voice');
          row.dataset.id = key;
          var name = document.createElement('p');
          name.classList.add('ttts-voice-title');
          name.innerText = parseInt(key) + ': ' + _this7.voices[key].name;
          var sampleBtn = document.createElement('button');
          sampleBtn.classList.add('ttts-voice-sample');
          sampleBtn.innerText = 'Sample';
          var selectBtn = document.createElement('button');
          selectBtn.classList.add('ttts-voice-select');
          selectBtn.innerText = 'Select';
          row.appendChild(name);
          row.appendChild(sampleBtn);
          row.appendChild(selectBtn);
          if (parseInt(key) === parseInt(_this7.voice)) {
            row.classList.add('ttts-active');
          }
          document.querySelector('#ttts-voices').appendChild(row);
        });
      }
    }

    /**
     * run once Twine has loaded in the Passages content
     */
  }, {
    key: "onLoaded",
    value: function onLoaded() {
      var _this8 = this;
      setTimeout(function () {
        _this8.getPassages();
        if (!_this8.passagesContainer) {
          _this8.onLoaded();
        } else {
          if (typeof document.querySelector('#story > #passages') !== 'undefined') {
            _this8.framework = 'sugarcube';
          } else if (typeof document.querySelector('tw-story > tw-passage') !== 'undefined') {
            _this8.framework = 'harlowe';
          }
          console.log('TTTS | Setup complete');
          var evt = new CustomEvent('ttts-onloaded', {
            ttts: _this8
          });
          window.dispatchEvent(evt);
        }
      }, 500);
    }

    /**
     * move to the next Utterance
     */
  }, {
    key: "onNext",
    value: function onNext() {
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
  }, {
    key: "onPlay",
    value: function onPlay() {
      var _this9 = this;
      if (this.synth.speaking || this.playBtn.classList.contains('play')) {
        this.reset();
      }
      setTimeout(function () {
        if (_this9.debug) {
          console.log('TTTS | Run');
        }
        _this9.processPassages();
        _this9.run();
      }, 500);
    }

    /**
     * format the passages to be more readable, split text into an array of lines and add each to the play queue
     */
  }, {
    key: "processPassages",
    value: function processPassages() {
      var _this10 = this;
      this.getPassages();
      var rawText = document.createElement('div');
      rawText.innerHTML = this.passagesContainer.innerHTML;
      this.silence.map(function (ignore) {
        rawText.querySelectorAll(ignore).forEach(function (el) {
          return el.remove();
        });
      });
      rawText.innerHTML = rawText.innerHTML.replaceAll('<br>', '\n'); //br to line break
      rawText.innerHTML = rawText.innerHTML.replaceAll('<br/>', '\n'); //br to line break
      rawText.innerHTML = rawText.innerHTML.replaceAll(/\n\s*\n/g, '\n'); //double to single line breaks
      rawText.innerHTML = rawText.innerHTML.replaceAll(/\t/g, ' '); //tabs to spaces
      rawText.innerHTML = rawText.innerHTML.replaceAll(/ +(?= )/g, ' '); //double to single spaces
      //console.log('CONTENT | ', rawText.innerHTML);

      var duplicate = [];
      var lines = rawText.innerHTML.trim().match(/[^\r\n]+/g);
      if (this.debug) {
        console.log('TTTS | LINES | ', lines);
      }
      if (lines !== null && lines.length > 0) {
        lines.map(function (line) {
          var lineFormatted = document.createElement('div');
          lineFormatted.innerHTML = line;
          var text = lineFormatted.innerText;
          text = text.replaceAll('..', '.');
          //text = text.replaceAll('.', ',');
          text = text.replaceAll(',,', ',');
          text = text.trim();
          if (text !== '' && !duplicate.includes(text)) {
            duplicate.push(text);
            _this10.queue.push({
              text: text,
              pitch: _this10.pitch,
              voice: _this10.voice,
              orig: line
            });
          }
        });
      }
    }

    /**
     * move to the previously ran Utterance in the queue
     */
  }, {
    key: "onPrev",
    value: function onPrev() {
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
  }, {
    key: "run",
    value: function run() {
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
  }, {
    key: "saveParam",
    value:
    /**
     * save user preferences and update the current instance with the new params
     * @param {*} val
     */
    function saveParam(param, val) {
      localStorage.setItem('ttts-' + param, val);
      this.getParam(param);
      //this[param] = localStorage.getItem('ttts-' + param);
    }

    /**
     * run and manage SpeechSynthesis in the browser
     * @param {string} msg
     * @param {object} opts
     */
  }, {
    key: "speak",
    value: function speak(msg) {
      //create utterance and set params
      this.utter = new SpeechSynthesisUtterance();
      this.utter.rate = this.rate;
      this.utter.volume = this.volume;
      this.utter.voice = this.voices[msg.voice];
      this.utter.text = msg.text;
      this.utter.pitch = this.pitch;

      //set the utterance events, basically if to
      var inst = this;
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
  }]);
  return TwineTextToSpeech;
}();