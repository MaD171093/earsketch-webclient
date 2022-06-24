// CAI Dialogue Tree
export interface CaiTreeNode {
    id: number, // arbitrary ID used to identify nodes.
    title: string, // User input button label.
    utterance: string, // Message presented by CAI.
    parameters: { genre?: string, instrument?: string, property?: string, propertyValue?: string, changePropertyValue?: string, section?: string },
    options: (string | number) [], // node numbers presented as options for users to respond with.
    event?: string [], // trigger specific events in dialogue module.
    dropup?: string, // label for dropup menu (for nodes with large numbers of response options).
    slashCommand?: string, // commands for Wizard of Oz studies.
}

export const CAI_TREE_NODES: { [key: number]: CaiTreeNode } = {
    0: {
        id: 0,
        title: "",
        utterance: "[GREETING]",
        parameters: {},
        options: [1],
    },
    1: {
        id: 1,
        title: "Okay",
        utterance: "let's get started",
        slashCommand: "get_started",
        parameters: {},
        options: [76, 77, 3, 4],
    },
    2: {
        id: 2,
        title: "Maybe later",
        utterance: "OK, I'll wait till you're ready to collaborate",
        slashCommand: "do_your_thing",
        parameters: {},
        options: [],
    },
    3: {
        id: 3,
        title: "let me add some sounds",
        utterance: "sounds good. go ahead and run it when you're done so i can listen.[WAIT|11]",
        slashCommand: "sounds_good_sound",
        parameters: {},
        options: [],
    },
    4: {
        id: 4,
        title: "you should suggest sounds",
        utterance: "i think we should start with [sound_rec]",
        slashCommand: "suggest_start_sound",
        parameters: {},
        event: ["soundRequest"],
        options: [5, 6],
    },
    5: {
        id: 5,
        title: "ok, i'll add it",
        utterance: "should we add more samples?",
        slashCommand: "suggest_more_samples",
        parameters: {},
        options: [8, 91],
    },
    6: {
        id: 6,
        title: "how about something else?",
        utterance: "we could use one of these\n\n[sound_rec]\n[sound_rec]\n[sound_rec]",
        parameters: {},
        slashCommand: "suggest_multi_sound",
        event: ["soundRequest"],
        options: [15, 16, 91],
    },
    7: {
        id: 7,
        title: "I want to add a different sound.",
        utterance: "Okay! Whenever you are ready, you can run it and we can see how it sounds.",
        slashCommand: "play_when_ready",
        parameters: {},
        options: [],
    },
    8: {
        id: 8,
        title: "yeah, go ahead",
        utterance: "our next move could be [sound_rec].[SOUNDWAIT|10]",
        parameters: {},
        slashCommand: "suggest_sound",
        event: ["soundRequest"],
        options: [],
    },
    9: {
        id: 9,
        title: "no thanks, i've got the next one.",
        utterance: "ok, i'll have a listen next time you run the code.",
        parameters: {},
        options: [],
    },
    10: {
        id: 10,
        title: "",
        utterance: "that sounds good.",
        slashCommand: "sounds_good",
        parameters: {},
        options: [],
    },
    11: {
        id: 11,
        title: "",
        utterance: "sounds good. wanna try [sound_rec] next?",
        slashCommand: "sounds_good_suggest_sound",
        parameters: {},
        options: [12, 13],
    },
    12: {
        id: 12,
        title: "sounds good to me",
        utterance: "cool. let me see what that sounds like when you run it. [WAIT|10]",
        parameters: {},
        options: [],
    },
    13: {
        id: 13,
        title: "no thanks",
        utterance: "ok, i'll let you add some stuff and see where we go from there",
        slashCommand: "do_your_thing_2",
        parameters: {},
        options: [],
    },
    14: {
        id: 14,
        title: "I have a specific instrument in mind.",
        utterance: "Sure! Which instrument do you want to add?",
        slashCommand: "request_instrument",
        parameters: {},
        dropup: "Instruments",
        options: [37, 38, 39, 40, 41, 42, 43, 44, 45],
    },
    15: {
        id: 15,
        title: "ok, i like one of those",
        utterance: "i have another one we could add if you want",
        slashCommand: "suggest_another_sound",
        parameters: {},
        options: [18, 19, 91],
    },
    16: {
        id: 16,
        title: "can i see some more ideas?",
        utterance: "what about\n\n[sound_rec]\n[sound_rec]",
        slashCommand: "suggest",
        parameters: {},
        event: ["soundRequest"],
        options: [15, 16, 91],
    },
    17: {
        id: 17,
        title: "The third one is best",
        utterance: "Awesome choice! Would you like me to suggest another sound?",
        parameters: {},
        options: [18, 19, 20],
    },
    18: {
        id: 18,
        title: "sure",
        utterance: "we could try [sound_rec][SOUNDWAIT|10]",
        parameters: {},
        event: ["soundRequest"],
        options: [19, 6],
    },
    19: {
        id: 19,
        title: "no thanks",
        utterance: "no worries",
        parameters: {},
        options: [],
    },
    20: {
        id: 20,
        title: "what about something else?",
        utterance: "Sure! Will these suggestions work?\n[sound_rec]\n[sound_rec]\n[sound_rec]",
        parameters: {},
        options: [15, 16, 17, 91],
    },
    21: {
        id: 21,
        title: "The first one works.",
        utterance: "Great! Would you like me to pick a sound?",
        parameters: {},
        options: [18, 19, 20],
    },
    22: {
        id: 22,
        title: "I like the second one.",
        utterance: "Great! Would you like me to pick a sound?",
        parameters: {},
        options: [18, 19, 20],
    },
    23: {
        id: 23,
        title: "The third one is best.",
        utterance: "Great! Would you like me to pick a sound?",
        parameters: {},
        options: [18, 19, 20],
    },
    24: {
        id: 24,
        title: "",
        utterance: "Do you need some help with the code?[ERRORWAIT|28]",
        parameters: {},
        options: [25, 26],
    },
    25: {
        id: 25,
        title: "No, I want to try and fix it.",
        utterance: "[ERRORWAIT|28]",
        parameters: {},
        options: [31],
    },
    26: {
        id: 26,
        title: "do you know anything about the error i'm getting?",
        utterance: "[ERROREXPLAIN][ERRORWAIT|28]",
        parameters: {},
        event: ["errorRequest"],
        options: [],
    },
    27: {
        id: 27,
        title: "Yes, can you help fix the error?",
        utterance: "[ERRORFIX|29|30]",
        parameters: {},
        options: [],
    },
    28: {
        id: 28,
        title: "",
        utterance: "good, it works now.",
        parameters: {},
        options: [],
    },
    29: {
        id: 29,
        title: "",
        utterance: "I was able to fix the error. Let's see if it runs now.[ERRORWAIT|28]",
        parameters: {},
        options: [],
    },
    30: {
        id: 30,
        title: "",
        utterance: "I am not sure how to fix this error. I think we should look at the curriculum for help.[ERRORWAIT|28]",
        parameters: {},
        options: [],
    },
    31: {
        id: 31,
        title: "Can you help me?",
        utterance: "Sure. What can I help with?",
        parameters: {},
        options: [32],
    },
    32: {
        id: 32,
        title: "How do I fix it?",
        utterance: "[ERROREXPLAIN][ERRORWAIT|28]",
        parameters: {},
        options: [],
    },
    33: {
        id: 33,
        title: "Can you fix the error?",
        utterance: "[ERRORFIX|29|30]",
        parameters: {},
        options: [],
    },
    34: {
        id: 34,
        // - BEGIN CODE SUGGESTION TREE
        title: "begin suggestion tree",
        utterance: "[SUGGESTION][RESET_PARAMS]",
        event: ["codeRequest"],
        parameters: {},
        options: [35, 92],
    },
    35: {
        id: 35,
        title: "can you explain more?",
        utterance: "[SUGGESTIONEXPLAIN]",
        parameters: {},
        options: [36, 92],
    },
    36: {
        id: 36,
        title: "i'm still not 100% on that. do you have an example?",
        utterance: "[SUGGESTIONEXAMPLE]",
        parameters: {},
        options: [],
    },
    37: {
        id: 37,
        title: "Bass",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { instrument: "BASS" },
        options: [19, 6, 5],
    },
    38: {
        id: 38,
        title: "Drums",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { instrument: "DRUMS" },
        options: [19, 6, 5],
    },
    39: {
        id: 39,
        title: "Freesound[WAIT|34]",
        utterance: "How about [sound_rec]?",
        parameters: { instrument: "FREESOUND" },
        options: [19, 6, 5],
    },
    40: {
        id: 40,
        title: "Keyboard",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { instrument: "KEYBOARD" },
        options: [19, 6, 5],
    },
    41: {
        id: 41,
        title: "SFX",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { instrument: "SFX" },
        options: [19, 6, 5],
    },
    42: {
        id: 42,
        title: "Strings",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { instrument: "STRINGS" },
        options: [19, 6, 5],
    },
    43: {
        id: 43,
        title: "Synth",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { instrument: "SYNTH" },
        options: [19, 6, 5],
    },
    44: {
        id: 44,
        title: "Vocals",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { instrument: "VOCALS" },
        options: [19, 6, 5],
    },
    45: {
        id: 45,
        title: "Winds",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { instrument: "WINDS" },
        options: [19, 6, 5],
    },
    46: {
        id: 46,
        title: "Alt Pop",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "ALT POP" },
        options: [19, 6, 5],
    },
    47: {
        id: 47,
        title: "Cinematic Score",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "CINEMATIC SCORE" },
        options: [19, 6, 5],
    },
    48: {
        id: 48,
        title: "Dubstep",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "DUBSTEP" },
        options: [19, 6, 5],
    },
    49: {
        id: 49,
        title: "EDM",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "EDM" },
        options: [19, 6, 5],
    },
    50: {
        id: 50,
        title: "EIGHTBIT",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "EIGHTBIT" },
        options: [19, 6, 5],
    },
    51: {
        id: 51,
        title: "Electro",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "ELECTRO" },
        options: [19, 6, 5],
    },
    52: {
        id: 52,
        title: "FUNK",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "FUNK" },
        options: [19, 6, 5],
    },
    53: {
        id: 53,
        title: "Free Sound",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "FreeSound" },
        options: [19, 6, 5],
    },
    54: {
        id: 54,
        title: "Gospel",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "GOSPEL" },
        options: [19, 6, 5],
    },
    55: {
        id: 55,
        title: "Hip Hop",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "HIP HOP" },
        options: [19, 6, 5],
    },
    56: {
        id: 56,
        title: "House",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "HOUSE" },
        options: [19, 6, 5],
    },
    57: {
        id: 57,
        title: "New Funk",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "NEW FUNK" },
        options: [19, 6, 5],
    },
    58: {
        id: 58,
        title: "New Hip Hop",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "NEW HIP HOP" },
        options: [19, 6, 5],
    },
    59: {
        id: 59,
        title: "Pop",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "POP" },
        options: [19, 6, 5],
    },
    60: {
        id: 60,
        title: "R & B",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "RNB" },
        options: [19, 6, 5],
    },
    61: {
        id: 61,
        title: "R & B Funk",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "RNB FUNK" },
        options: [19, 6, 5],
    },
    62: {
        id: 62,
        title: "Rock",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "ROCK" },
        options: [19, 6, 5],
    },
    63: {
        id: 63,
        title: "Techno",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "TECHNO" },
        options: [19, 6, 5],
    },
    64: {
        id: 64,
        title: "Trap",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "TRAP" },
        options: [19, 6, 5],
    },
    65: {
        id: 65,
        title: "UK House",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "UK HOUSE" },
        options: [19, 6, 5],
    },
    66: {
        id: 66,
        title: "West Coast Hip Hop",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "WEST COAST HIP HOP" },
        options: [19, 6, 5],
    },
    67: {
        id: 67,
        title: "World Percussion",
        utterance: "How about [sound_rec]?[WAIT|34]",
        parameters: { genre: "WORLD PERCUSSION" },
        options: [19, 6, 5],
    },
    68: {
        id: 68,
        title: "",
        utterance: "Sounds good. thanks for working with me!",
        parameters: {},
        options: [69, 70],
    },
    69: {
        id: 69,
        title: "bye!",
        utterance: "see ya",
        parameters: {},
        options: [],
    },
    70: {
        id: 70,
        title: "wait, I want to work on it some more",
        utterance: "ok, go ahead",
        parameters: {},
        options: [],
    },
    71: {
        id: 71,
        title: "",
        utterance: "What instrument should we add?",
        parameters: {},
        dropup: "Instruments",
        options: [37, 38, 39, 40, 41, 42, 43, 44, 45],
    },
    72: {
        id: 72,
        title: "do you want to come up with some sound ideas",
        utterance: "[SECTIONSELECT|73,74|75][RESET_PARAMS]",
        parameters: {},
        options: [73, 74],
    },
    73: {
        id: 73,
        title: "no",
        utterance: "we could try [sound_rec][SOUNDWAIT|10]",
        parameters: {},
        event: ["soundRequest"],
        options: [19, 6, 92],
    },
    74: {
        id: 74,
        title: "yeah",
        utterance: "which one?",
        parameters: {},
        options: ["SECTIONS|75"],
    },
    75: {
        id: 75,
        title: "",
        utterance: "we could try [sound_rec][SOUNDWAIT|10]",
        parameters: {},
        event: ["soundRequest"],
        options: [19, 6, 92],
    },
    76: {
        id: 76,
        title: "i have some ideas",
        utterance: "cool, what were you thinking?",
        parameters: {},
        options: ["PROPERTIES|78"],
    },
    77: {
        id: 77,
        title: "i'm not sure. do you have any ideas?",
        utterance: "sure. [SUGGESTPROPERTY]",
        parameters: {},
        options: [82, 84, 85],
    },
    78: {
        id: 78,
        title: "",
        utterance: "what were you thinking for [CURRENTPROPERTY]?",
        parameters: {},
        options: ["PROPERTYOPTIONS|79"],
    },
    79: {
        id: 79,
        title: "",
        utterance: "[STOREPROPERTY]sounds good. do you have more ideas, or do you want to start working?",
        parameters: {},
        options: [80, 81],
    },
    80: {
        id: 80,
        title: "i have some other thoughts",
        utterance: "ok, what else are you thinking?",
        parameters: {},
        options: ["PROPERTIES|78"],
    },
    81: {
        id: 81,
        title: "let's start working",
        utterance: "sounds good. do you want to pick sounds first, or should i?",
        parameters: {},
        options: [3, 4],
    },
    82: {
        id: 82,
        title: "yeah, i like that",
        utterance: "[STOREPROPERTY]great. do you wanna get started?",
        parameters: {},
        options: [83, 86],
    },
    83: {
        id: 83,
        title: "wait, i have an idea about our project",
        utterance: "ok, what were you thinking?",
        parameters: {},
        options: ["PROPERTIES|78"],
    },
    84: {
        id: 84,
        title: "i don't know. what about something else?",
        utterance: "[SUGGESTPROPERTY]",
        parameters: {},
        options: [83, 87, 85],
    },
    85: {
        id: 85,
        title: "we can just get started",
        utterance: "ok. do you wanna pick some sounds?",
        parameters: {},
        options: [3, 4, 14, 88, 91],
    },
    86: {
        id: 86,
        title: "ok",
        utterance: "do you want to start off by picking some sounds?",
        parameters: {},
        options: [3, 4, 14, 88, 91],
    },
    87: {
        id: 87,
        title: "sounds good",
        utterance: "[STOREPROPERTY]ok. do you wanna get started?",
        parameters: {},
        options: [83, 86],
    },
    88: {
        id: 88,
        title: "i want to tell you what i think we should make",
        utterance: "sure, what were you thinking?",
        parameters: {},
        options: ["PROPERTIES|78"],
    },
    89: {
        id: 89,
        title: "i want to change one of our ideas about the project",
        utterance: "which of these do you want to remove from our list?",
        parameters: {},
        options: [94, 95],
    },
    90: {
        id: 90,
        title: "",
        utterance: "[CLEARPROPERTY]sounds good. do you have more ideas, or do you want to start working?",
        parameters: {},
        options: [80, 81],
    },
    91: {
        id: 91,
        title: "let's start working",
        utterance: "sounds good",
        parameters: {},
        options: [],
    },
    92: {
        id: 92,
        title: "ok",
        utterance: "cool, go ahead",
        parameters: {},
        options: [],
    },
    93: {
        id: 93,
        title: "How can I add these?",
        utterance: "you can use the [LINK|fitMedia] function",
        parameters: {},
        options: [],
    },
    94: {
        id: 94,
        title: "i want to remove one of our ideas",
        utterance: "which of these do you want to remove from our list?",
        parameters: {},
        options: ["CLEARPROPERTYOPTIONS|90"],
    },
    95: {
        id: 95,
        title: "i want to change one of our ideas",
        utterance: "which of these do you want to change?",
        parameters: {},
        options: ["[CHANGEPROPERTYOPTIONS|96]"],
    },
    96: {
        id: 96,
        title: "",
        utterance: "ok, what do you want to change it out for?",
        parameters: {},
        options: ["[SWAPPROPERTYOPTIONS|97]"],
    },
    97: {
        id: 97,
        title: "",
        utterance: "[REPLACEPROPERTY]ok, got it.",
        parameters: {},
        options: [81, 100, 94, 101],
    },
    98: {
        id: 98,
        title: "i don't think i like that",
        utterance: "no worries",
        parameters: {},
        options: [],
    },
    99: {
        id: 99,
        title: "yeah, that sounds good",
        utterance: "ok sweet.[SOUNDWAIT|10]",
        parameters: {},
        options: [],
    },
    100: {
        id: 100,
        title: "i want to change something else",
        utterance: "what do you want to change?",
        parameters: {},
        options: ["[CHANGEPROPERTYOPTIONS|96]"],
    },
    101: {
        id: 101,
        title: "i've got another idea",
        utterance: "what should we add?",
        parameters: {},
        options: ["PROPERTIES|78"],
    },
    102: {
        id: 102,
        title: "I have a specific instrument I want to add",
        utterance: "what instrument?",
        slashCommand: "request_instrument_2",
        parameters: {},
        dropup: "Instruments",
        options: [37, 38, 39, 40, 41, 42, 43, 44, 45],
    },
    103: {
        id: 103,
        title: "okay",
        utterance: "sounds good",
        parameters: {},
        options: [],
    },
}

// Starting indices of CAI_TREE_NODES by conversation topic.
export const CAI_TREES: { [key: string]: number } = { "Chat with CAI": 0, error: 26, begin: 1, sound_select: 72, suggest: 34, wrapup: 68, selectinstr: 71, properties: 88 }

// error explanations for CAI to use, based upon error type
export const CAI_ERRORS: { [key: string]: string } = {
    ParseError: "looks like you've got a [LINK|parse error]. I think we might be missing something.",
    ImportError: "something's not [LINK|importing] right. do we have the right package name up top?",
    IndentationError: "looks like one of our lines isn't [LINK|indented] right.",
    IndexError: "i think this means we're trying to use an [LINK|index] that doesn't exist.",
    NameError: "i think we're trying to use a variable or function that we haven't defined, or maybe we misspelled a [LINK|name].",
    SyntaxError: "we have a [LINK|syntax error], which might mean that we're using the wrong operator.",
    TypeError: "it's saying [LINK|type error], which means that we put in the wrong kind of data, or we're missing something.",
    ValueError: "i think something is wrong with one of our [LINK|function arguments].",
    ServerError: "this is an issue with the ES server, and not with your code. we might have to make some changes.",
}
