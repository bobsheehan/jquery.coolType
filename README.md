# Usage

    <script type="text/javascript" src="/scripts/jquery.min.js"></script>
    <script type="text/javascript" src="/scripts/jquery.coolType.js"></script>

## Default Options

Using jquery.coolType with default options is extremely simple.

    var msg = 'This line is being typed out character by character with the default coolType options.';
    $('body').coolType(msg);

## Custom Options

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
    };
    $('body').coolType(msg, options);