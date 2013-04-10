## Usage

    <script type="text/javascript" src="/scripts/jquery.min.js"></script>
    <script type="text/javascript" src="/scripts/jquery.coolType.js"></script>

### Default Options

Using jquery.coolType with default options is extremely simple.

    var msg = 'This line is being typed out character by character with the default coolType options.';
    $('body').coolType(msg);

### Custom Options

It is possible to get finer control over how the text is typed if you supply custom options. All values in the sample below are the default values.

    var msg = 'This line is being typed out character by character with the default coolType options.';
    var options = {
        typeSpeed: 10, // Adjusts the speed (in milliseconds) that the characters are typed out.
        cursorChar: '&#9608;', // The character to use as the cursor.
        cursorBlinkSpeed: 300, // The speed (in milliseconds) that the cursor should blink.
        delayBeforeType: 1000, // The time to wait (in milliseconds) before typing the text.
        delayAfterType: 3000, // The time to wait (in milliseconds) after typing the text.
        onComplete: false, // A function that will be called when coolType is finished.
        onBeforeType: false, // A function that will be called right before typing begins.
        onAfterType: false, // A function that will be called right after typing finishes.
        expansions: [
            '&nbsp;',
            '&gt;',
            '&lt;',
            '&quot;',
            '&amp;'
        ] // An array containing strings that should be typed as a single character.
    };
    $('body').coolType(msg, options);
    
### Character Expansions

Sometimes you don't want a sequence of characters to be typed out, such as `&gt;`. `&gt;` is an HTML entity for the "greater than" character. If coolType were to type it out character by character then you would see `&gt;` on the page instead of `>` like you were probably expecting. By adding `&gt;` to the expansions array (which it is by default) coolType knows to insert all the characters at the same time as if they were a single character.

To add new expansions simply pass in a string array containing the expansions.

    $('body').coolType('Hello&nbsp;world!', {
        expansions: [ '&nbsp;' ]
    });
