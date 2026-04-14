export const URL_REGEX =
  /^(https?:\/\/)(localhost(:\d{1,5})?|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))(\/[^\s]*)?$/i;

export const TAILWIND_COLOR_CLASS_REGEX =
  /^(?:bg|text|border|from|to|via|ring|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)$/;

export enum Proficiency {
    Beginner = 1,
    Intermediate = 2,
    Advanced = 3,
    Expert = 4
}

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

