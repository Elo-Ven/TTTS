# Events

| Event         | Action                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------ |
| ttts-disable  | Trigger this event to turn off and hide TTTS                                                     |
| ttts-enable   | Trigger this event to re-enable TTTS after being disabled                                        |
| ttts-onloaded | This event is triggered once TTTS has completed initializing. Returned params include event.ttts |

## Example Event in Twine

Below is an example usage of the events used in the Sugarcube demo where it toggles TTTS on/off.

Passage Content:

```
<<button "Enable TTTS">><<script>>tttsEnable();<</script>><</button>>
<<button "Disable TTTS">><<script>>tttsDisable();<</script>><</button>>
```

Story JavaScript:

```
window.tttsEnable = function(){
  window.dispatchEvent(new Event("ttts-enable"));
}

window.tttsDisable = function(){
  window.dispatchEvent(new Event("ttts-disable"));
}
```

TTTS is enabled by default after initializing. If you would rather it is disabled after initializing, you can listen for the ttts-onloaded event and disable it at that point.

```
window.addEventListener('ttts-onloaded', (event) => {
    window.dispatchEvent(new Event("ttts-disable"));
});
```
