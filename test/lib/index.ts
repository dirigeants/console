import { Writable } from 'stream';

export class MockWritable extends Writable {

	public writtenData: string[] = [];

	public _write(chunk: Buffer | string, _encoding: string, next: () => void): void {
		this.writtenData.push(chunk.toString());
		return next();
	}

}
