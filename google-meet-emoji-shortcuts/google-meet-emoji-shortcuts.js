function keyUpEvent(e) {   
    const tag = document.activeElement.tagName.toLowerCase();
    
    // Don't activate while in text fields (e.g. chat)
    if (tag == "textarea" || tag == "input") {
        return;
    }
    
    var keyInt = parseInt(e.key);
    
    if (keyInt == NaN || keyInt < 0 || keyInt > 9) {
        return;
    }
    
    if (keyInt == 0) { keyInt = 10; }
    keyInt--;
    
    const buttons = getEmojiButtons();
    var emojis = [];
    
    if (buttons.length >= 9) {
        emojis = buttons.map(b => b.getAttribute("aria-label"));
    }
    else {
        emojis = ['💖', '👍', '🎉', '👏', '😂', '😮', '😢', '🤔', '👎'];
    }
    
    clickEmoji(emojis[keyInt]);
}

function getEmojiButtons() {
    const reactionBar = document.querySelector("[aria-label='Send a reaction']");
    if (reactionBar == null) { return []; }
    
    return Array.from(reactionBar.querySelectorAll("button"));
}
 
function addShortcutNumberLabels() {
    const className = "google-meet-emoji-shortcut-label";
    const buttons = getEmojiButtons();
    buttons.forEach((button, index) => {
        if (button.getElementsByClassName(className).length > 0) { return; }
        const labelElement = document.createElement("span");
        labelElement.textContent = index + 1;
        labelElement.className = className;
        button.prepend(labelElement);
    });
}   

function clickEmoji(emoji) {
    const button = document.querySelector(`button[aria-label="${emoji}"]`);
    if (button == null) { return; }
    button.click();
}

// Monitor key up events for shortcuts
document.addEventListener('keyup', keyUpEvent, false);

// Monitor for reactions appearing, and add shortcut labels when we see them.
var addShortcutLabelsTimer = null;
const observer = new MutationObserver(function(mutationsList) {
    mutationsList.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(addedNode) {
            if(addedNode.getAttribute && addedNode.getAttribute('data-emoji')) {
                clearTimeout(addShortcutLabelsTimer);
                addShortcutLabelsTimer = setTimeout(addShortcutNumberLabels, 100);
            }
        });
    });
});

observer.observe(document, { subtree: true, childList: true });
