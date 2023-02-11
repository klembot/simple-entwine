import {ChangeEvent, FormEvent, useState} from 'react';
import {mergeFiles} from './mergeFiles';
import { saveAs } from 'file-saver';

export function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [startFileIndex, setStartFileIndex] = useState(-1);

  async function handleMerge(event: FormEvent) {
    event.preventDefault();

    const result = await mergeFiles(files, startFileIndex);

    saveAs(new Blob([result], {type: 'text/html'}), 'Merged Story.html');
  }

  function handleChangeFiles(event: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(event.target.files ?? []));
    setStartFileIndex(0);
  }

  return (
    <>
      <p>This merges multiple Twine stories into one.</p>
      <form onSubmit={handleMerge}>
        <input
          accept="file"
          multiple
          onChange={handleChangeFiles}
          type="file"
        />
        {files.length > 0 && (
          <>
            <label htmlFor="startStory">
              Where should the merged story start?
            </label>
            <select onChange={event => setStartFileIndex(parseInt(event.target.value))} id="startStory">
              {files.map((file, index) => (
                <option key={file.name} value={index}>{file.name}</option>
              ))}
            </select>
          </>
        )}
        <button disabled={files.length === 0 || startFileIndex == -1} type="submit">
          Merge
        </button>
      </form>
    </>
  );
}
