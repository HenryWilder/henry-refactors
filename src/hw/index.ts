import { henryAlign } from './henryAlign';
import { cssPreview } from './cssPreview';
import * as utils from './utils';

/** The list of commands to register for the extension. */
export const hwCommands: { name: string, func: utils.TypeOLambda }[] = [
    { name: "henryAlign", func: utils.editorCommand(henryAlign)},
    { name: "cssPreview", func: utils.editorCommand(cssPreview)},
];
