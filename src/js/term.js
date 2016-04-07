/**
 * Builds a message to be given to the commandHandler.
 */
function rep(m, h){
    var resp = [];

    if(m) {
        resp.push({msg:m, className:"jquery-console-message-value"});
    }
    if(h) {
        resp.push({msg:h, className:"jquery-console-message-type"});
    }

    return resp;
}
/*
 * This generator represents every step in the simulation. ALL modifying the
 * state of the simulation will be triggered here. Every time the user hits enter
 * in the simulation, a new step will be run.
 */
function* scriptGen() {
    yield "# Let's learn to use the shell!";
    yield rep("", ":: Comment, not evaluated");
    setMood("NEUTRAL");
    contextWindow();

    yield "ls --get-money --get-paid";
    yield rep("f1.mp3   f2.mp3   f3.mp3   f4.mp3", ":: list directore contents");
    setMood("INFO");
    contextWindow();
    // contextWindow("OPTIONS", "");
    contextWindow("-a, --all", "do not ignore entries starting with .");
    contextWindow("-l", "use a long listing format");

    yield "rm -rvf f1.mp3";
    yield rep("removed 'f1.mp3' undo",":: remove files or directories : f1.mp3");
    setMood("WARN");
    contextWindow();
    // contextWindow("OPTIONS", "");
    contextWindow("-r, -R, --recursive", "remove directories and their contents recursively");
    contextWindow("-v, --verbose", "explain what is being done");
    contextWindow("-f, --force", "ignore nonexistent files and arguments, never prompt");

    yield "mkdir music";
    yield rep("undo", ":: make directories : music");
    setMood("WARN");
    contextWindow();
    // contextWindow("OPTIONS", "");
    contextWindow("-p, --parents", "no error if existing, make parent directories as needed");
    contextWindow("-v, --verbose", "print a message for each created directory");

    yield "mv -vi -t music *.mp3";
    yield rep("'f1.mp3' -> 'music/f1.mp3'\n'f2.mp3' -> 'music/f2.mp3'\n'f3.mp3' -> 'music/f3.mp3' undo", ":: move (rename) files : *.mp3");
    setMood("WARN");
    contextWindow();
    // contextWindow("OPTIONS", "");
    contextWindow("-v, --verbose", "explain what is being done");
    contextWindow("-i, --interactive", "prompt before overwrite");
    contextWindow("-t, --target-directory=\"music\"", "move all SOURCE arguments into \"music\"");

    yield "cd music";
    yield rep("", "No files in the current directory.");
    setMood("NEUTRAL");
    contextWindow();

    yield "mplayer f3.mp3";
    yield rep("MPlayer SVN-r37379 (C) 2000-2015 MPlayer Team\n210 audio & 441 video codecs\ndo_connect: could not connect to socket\nconnect: No such file or directory\nFailed to open LIRC support. You will not be able to use your remote control.\n\nPlaying f3.mp3.\nlibavformat version 56.25.101 (internal)\nAudio only file format detected.\nLoad subtitles in ./\n==========================================================================\nOpening audio decoder: [mpg123] MPEG 1.0/2.0/2.5 layers I, II, III\nAUDIO: 44100 Hz, 2 ch, s16le, 256.0 kbit/18.14% (ratio: 32000->176400)\nSelected audio codec: [mpg123] afm: mpg123 (MPEG 1.0/2.0/2.5 layers I, II, III)\n==========================================================================\n[AO OSS] audio_setup: Can't open audio device /dev/dsp: No such file or directory\nAO: [alsa] 44100Hz 2ch s16le (2 bytes per sample)\nVideo: no video\nStarting playback...\nA:   2.3 (02.2) of 393.0 (06:33.0)  0.4%\n\nExiting... (End of file)", ":: movie player : f3.mp3")
    setMood("INFO");
    contextWindow();
    contextWindow("-quiet", "Make console output less verbose");
    contextWindow("-really-quiet", "Display even less output and status messages than with -quiet");
}

// string of all possible colors
var COLORS = "color_warn_l color_warn_d \
              color_info_l color_info_d \
              color_good_l color_good_d \
              color_neutral_l color_neutral_d";

function setMood(mood) {
    // remove any current color
    $("#bar").removeClass(COLORS);
    $("#bar_button").removeClass(COLORS);

    // set new color
    switch (mood) {
        case "WARN":
            $("#bar").addClass("color_warn_l");
            $("#bar_button").addClass("color_warn_d");
            break;
        case "INFO":
            $("#bar").addClass("color_info_l");
            $("#bar_button").addClass("color_info_d");
            break;
        case "GOOD":
            $("#bar").addClass("color_good_l");
            $("#bar_button").addClass("color_good_d");
            break;
        case "NEUTRAL":
        default:
            $("#bar").addClass("color_neutral_d");
            $("#bar_button").addClass("color_neutral_l");
            break;
    }
}

function contextWindow(title, info) {
    if (!title) {
        $("#context").html("");
    } else {
        if ($("#context").html() == "") {
            var table = $('<table></table>').addClass("context_window");
            $("#context").append(table);
        }

        var row = $('<tr></tr>');
        row = row.append($('<td></td>').attr("align", "right").text(title));
        row = row.append($('<td></td>').attr("align", "left").text(": " + info));
        $(".context_window").append(row);
    }
}

var gen = scriptGen();
var container = $('#console');
var input = gen.next().value;

var controller = container.console({
    welcomeMessage : '',
    promptLabel: 'Asurada > ',
    autofocus:true,
    animateScroll:true,
    promptHistory:true,

    /*
     * This will decide if you can ever hit return. I may use this to make sure
     * the script is being followed.
     */
    commandValidate:function(line){
        if (input == "") return true;
        else return false;
    },

    /*
     * This actually returns a message. It will use a generator to deal with the
     * script. This generator may have side-effects.
     */
    commandHandle:function(line){
        var next = gen.next().value;
        input = gen.next().value;
        return next;
    }
});


/*
 * This grabs all keypresses, and passes them to jquery-term for the
 * 'hacker-typer' effect.
 */
$(controller.typer).keydown(function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (input != "" && e.which != 13) {
        controller.typer.consoleInsert(input[0]);
        input = input.substring(1);
    }
});
