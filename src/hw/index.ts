import { cmdHenryAlign } from './henryAlign';
import { cssPreview } from './cssPreview';
import * as utils from './utils';

/** The list of commands to register for the extension. */
export const hwCommands: utils.TypeOLambda[] = [
    utils.editorCommand(cmdHenryAlign),
    utils.editorCommand(cssPreview),
];