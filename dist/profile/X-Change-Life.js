/**
 * TTTS - Twine Text To Speech
 * Custom Config
 *
 * See the main JS file for more info about this project
 *
 * INSTRUCTIONS
 * Remove the // from the start of a line and change its value to enable the custom setting
 *
 */

var tttsConfig = {
	container: ".center_screen",
	//pitch: 1,
	//rate: 1.0,
	silence: [
		".link-internal",
		"tw-link",
		"script",
		".bar",
		'tw-hook[name="timer"]',
		'tw-hook[name="result"]',
		'tw-hook[name="cursor"]',
		'tw-expression[type="variable"]',
		"select",
	],
	trigger: [".link-internal", "tw-link"],
	//voice: 0,
	//volume: 1,
};

window.onload = function () {
	const config = document.createElement("script");
	config.src = "ttts/core/ttts.js";
	config.type = "text/javascript";
	document.querySelector("body").appendChild(config);
};
