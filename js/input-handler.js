var InputHandler = (function() {
    var mouse_down = false;

    currently_pressed_keys = {};

    document.onmousedown = handle_mouse_down;
    document.onmouseup = handle_mouse_up;
    document.onmousemove = handle_mouse_move;

    document.onkeydown = handle_key_down;
    document.onkeyup = handle_key_up;

    function handle_mouse_down(event) { mouse_down = true; }
    function handle_mouse_up(event) { mouse_down = false; }
    function handle_key_down(event) { currently_pressed_keys[event.keyCode] = true; }
    function handle_key_up(event) { currently_pressed_keys[event.keyCode] = false; }
    function is_key_pressed(key) { return currently_pressed_keys[key]; }

    function handle_mouse_move(event)
    {
        if (!mouse_down)
            return;
    }

    return
    {
        is_key_pressed: is_key_pressed;
    };

})();
