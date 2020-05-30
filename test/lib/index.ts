import { Writable as WritableStream } from 'stream';

class MockWritable extends WritableStream {

	public writtenData: string[] = [];

	private written = 0;

	public constructor(private amountToWrite: number = Infinity) {
		super();
	}

	public _write(chunk: Buffer | string, _encoding: string, next: () => void): void {
		this.writtenData.push(chunk.toString());
		if (++this.written >= this.amountToWrite) return this.end();
		else return next();
	}

}

export function makeWritable(amountToWrite?: number): NodeJS.WriteStream & MockWritable {
	return new MockWritable(amountToWrite) as unknown as NodeJS.WriteStream & MockWritable;
}
