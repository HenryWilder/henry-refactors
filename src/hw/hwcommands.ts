import { henryAlign } from './henryAlign';
import { cssPreview } from './cssPreview';

/** The list of commands to register for the extension. */
export const hwCommands: (() => void)[] = [
    henryAlign,
    cssPreview,
];
