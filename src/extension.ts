import * as vscode from 'vscode';

/**
 * Used for debugging positions.
 * @param position The vscode position to stringify.
 * @returns```
 * `(${x},${y})`
 * ```
 */
const positionStr = (position: vscode.Position): string => `(${position.character.toString().padStart(3,'0')},${position.line.toString().padStart(3,'0')})`;

/**
 * Used for debugging ranges.
 * @param range The vscode range/selection to stringify.
 * @returns```
 * `[(${x1},${y1})..(${x2},${y2})]:"${text}"`
 * ```
 */
const rangeStr = (range: vscode.Selection | vscode.Range): string => `[${positionStr(range.start)}..${positionStr(range.end)}]:"${vscode.window.activeTextEditor?.document.getText(range)}"`;

/**
 * Used for debugging ranges.
 * @param range The vscode ranges/selections to stringify.
 * @returns```
 * `[[(${[0].x1},${[0].y1})..(${[0].x2},${[0].y2})]:"${[0].text}",`  
 * ` [(${[1].x1},${[1].y1})..(${[1].x2},${[1].y2})]:"${[1].text}",`  
 * ` [(${[2].x1},${[2].y1})..(${[2].x2},${[2].y2})]:"${[2].text}",`  
 * ...  
 * ` [(${[n].x1},${[n].y1})..(${[n].x2},${[n].y2})]:"${[n].text}"]`
 * ```
 */
const rangeArrayStr = (ranges: readonly vscode.Selection[] | vscode.Range[]): string =>  '[' + ranges.map(rangeStr).join(',\n ') + ']';

export function activate(context: vscode.ExtensionContext) {
	console.log('Henry Refactors is now active');

	let disposable = vscode.commands.registerCommand('henryrefactors.henryAlign', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selections = editor.selections;
			console.log("Selections:\n",rangeArrayStr(selections));

			try {
				/**
				 * The delimiter symbols alone.
				 * It should be assumed that each array should have 1 fewer element than the related segment.
				 * 
				 * @example```
				 * // Selection:
				 * const abcd: string = aaa(1234) + bb
				 * const abcde: number = aa(123) + bb
				 * const abc: number = aaaa(12345) + bbb
				 * // Result:
				 * delimiters = [
				 * [':', '=', '(', ')', '+'],
				 * [':', '=', '(', ')', '+'],
				 * [':', '=', '(', ')', '+']]
				 * ```
				 */
				let delimiters: string[][] = []; // ! Wait, what happens if the first or last segment is a delimiter? I hadn't thought of that...

				/**
				 * The delimited strings to be aligned.
				 * Note that the results are trimmed, but empty strings are not excluded.
				 * 
				 * @example```
				 * // Selection:
				 * const abcd: string = aaa(1234) + bb
				 * const abcde: number = aa(123) + bb
				 * const abc: number = aaaa(12345) + bbb
				 * // Result:
				 * segments = [
				 * ['const abcd', 'string', 'aaa', '1234', '', 'bb'],
				 * ['const abcde', 'number', 'aa', '123', '', 'bb'],
				 * ['const abc', 'number', 'aaa', '12345', '', 'bbb']]
				 * ```
				 */
				let segments: string[][] = [];

				for (const range of selections) {
					const rangeText = document.getText(range);
					const rxDelim = /[\.:,\(\)=\+\-]/g;
					delimiters.push(rangeText.split('').filter((str: string) => rxDelim.test(str)));
					segments.push(rangeText.split(rxDelim).map((str: string) => str.trim()));
				}
				console.log("delimiters:", delimiters);
				console.log("segments:", segments);

				/**
				 * The largest number of splits in any selection.
				 * 
				 * @example```
				 * // Selection:
				 * const abcd: string
				 * const abcde: number = aa(123) + bb
				 * const abc: number = aaaa(12345)
				 * // Result:
				 * maxSegments = 6 // ['const abcde','number','aa','123','','bb']
				 * ```
				 */
				let maxSegments = 0;

				for (const seg of segments) {
					if (seg.length > maxSegments) {
						maxSegments = seg.length;
					}
				}
				console.log("maxSegments:", maxSegments);

				/**
				 * Greatest length of each segment.
				 * 
				 * @example```
				 * // Selection:
				 * const abcd: string = aaa(1234) + bb
				 * const abcde: number = aa(123) + bb
				 * const abc: number = aaaa(12345) + bbb
				 * // Result:
				 * longest = [11, 6, 4, 5, 0, 3] // ['const abcde','string','aaaa','12345','','bbb']
				 * ```
				 */
				let longest: number[] = Array(maxSegments).fill(0);

				// Find the length each subsegment should pad to
				for (let /** segment index */ x: number = 0; x < maxSegments; ++x) {
					for (let /** selection index */ y: number = 0; y < segments.length; ++y) {

						/** The current segment (y) */
						const segment: string[] = segments[y];
						if (segment.length < x) {
							continue;
						}

						/** The current sub-segment (x) */
						const subSegment: string = segment[x];

						/** The length of the current sub-segment */
						const segSize: number = subSegment.length;

						if (segSize > longest[x]) {
							longest[x] = segSize;
						}
					}
				}
				console.log("longest:", longest);

				/**
				 * The padded segments.
				 * 
				 * @example```
				 * // Input:
				 * segments = [
				 * ['const abcd', 'string', 'aaa', '1234', '', 'bb'],
				 * ['const abcde', 'number', 'aa', '123', '', 'bb'],
				 * ['const abc', 'number', 'aaa', '12345', '', 'bbb']]
				 * // Result:
				 * result = [
				 * ['const abcd ', 'string', 'aaa', '1234 ', '', 'bb '],
				 * ['const abcde', 'number', 'aa ', '123  ', '', 'bb '],
				 * ['const abc  ', 'number', 'aaa', '12345', '', 'bbb']]
				 * ```
				 */
				let result: string[][] = [];

				// Pad each subsegment
				for (let /** selection index */ y: number = 0; y < segments.length; ++y) {
					const segment: string[] = segments[y];
					result.push([]);
					for (let /** segment index */ x: number = 0; x < segment.length; ++x) {
						const subsegment = segment[x];
						result[y].push(subsegment.padEnd(longest[x],' '));
					}
				}
				console.log("result:", result);

				/**
				 * The recombined selections with the original delimiters.
				 * Surrounds delimiters with spaces.
				 * 
				 * @example```
				 * // Input:
				 * result = [
				 * ['const abcd ', 'string', 'aaa', '1234 ', '', 'bb '],
				 * ['const abcde', 'number', 'aa ', '123  ', '', 'bb '],
				 * ['const abc  ', 'number', 'aaa', '12345', '', 'bbb']]
				 * delimiters = [
				 * [':', '=', '(', ')', '+'],
				 * [':', '=', '(', ')', '+'],
				 * [':', '=', '(', ')', '+']]
				 * // Result:
				 * recombined = [
				 * ['const abcd  : string = aaa ( 1234  ) + bb '],
				 * ['const abcde : number = aa  ( 123   ) + bb '],
				 * ['const abc   : number = aaa ( 12345 ) + bbb']]
				 * ```
				 * 
				 * @todo```
				 * // Fix bug that occurs when the input is like this:
				 * + 5 * af
				 * + 55321 * a
				 * + 511 * e
				 * ```
				 * @todo```
				 * // Fix bug that occurs when the input is like this:
				 * +++++++++
				 * ```
				 */
				const recombined: string[] = new Array(segments.length).fill('');

				for (let /** selection index */ y: number = 0; y < segments.length; ++y) {
					const resultSegment: string[] = result[y];
					const delimiterSegment: string[] = delimiters[y];
					for (let /** segment index */ x: number = 0; x < resultSegment.length - 1; ++x) {
						const res: string = resultSegment[x];
						const delim: string = delimiterSegment[x];
						recombined[y] += res + ' ' + delim + ' ';
					}
					recombined[y] += resultSegment[resultSegment.length - 1]; // There is one fewer delimiter than there are segments
				}
				console.log("recombined:", recombined);

				editor.edit((editBuilder) => {
					for (let i = 0; i < selections.length; ++i) {
						editBuilder.replace(selections[i], recombined[i]);
					}
				});

			} catch (err) {
				console.error(err);
			}
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
