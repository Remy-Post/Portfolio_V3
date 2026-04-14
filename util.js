"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proficiency = exports.TAILWIND_COLOR_CLASS_REGEX = exports.URL_REGEX = void 0;
exports.URL_REGEX = /^(https?:\/\/)(localhost(:\d{1,5})?|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))(\/[^\s]*)?$/i;
exports.TAILWIND_COLOR_CLASS_REGEX = /^(?:bg|text|border|from|to|via|ring|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)$/;
var Proficiency;
(function (Proficiency) {
    Proficiency[Proficiency["Beginner"] = 1] = "Beginner";
    Proficiency[Proficiency["Intermediate"] = 2] = "Intermediate";
    Proficiency[Proficiency["Advanced"] = 3] = "Advanced";
    Proficiency[Proficiency["Expert"] = 4] = "Expert";
})(Proficiency || (exports.Proficiency = Proficiency = {}));
