import { cmdHenryAlign } from './henryAlign';
import { cmdCssPreview } from './cssPreview';
import * as utils from './utils';

/** The list of commands to register for the extension. */
export const hwCommands: { name: string, func: utils.TypeOLambda }[] = [
    { name: "henryAlign", func: utils.editorCommand(cmdHenryAlign)},
    { name: "cssPreview", func: utils.editorCommand(cmdCssPreview)},
];
