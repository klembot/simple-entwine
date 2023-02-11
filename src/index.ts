import saveAs from 'file-saver';
import {mergeFiles} from './merge-files';

const form = document.querySelector('form');
const sourcesInput = document.querySelector('#sources');
const startFileContainer = document.querySelector('#startFileContainer');
const startFileInput: HTMLSelectElement | null =
  document.querySelector('#startFile');
let files: File[] = [];

if (!form) {
  throw new Error("Can't find form");
}

const submitButton = form.querySelector('button[type="submit"]');

if (!submitButton) {
  throw new Error("Can't find submit button");
}

if (!sourcesInput) {
  throw new Error("Can't find sources input");
}

if (!startFileContainer) {
  throw new Error("Can't find start file container");
}

if (!startFileInput) {
  throw new Error("Can't find start file input");
}

sourcesInput.addEventListener('change', event => {
  files = Array.from((event.target as HTMLInputElement).files ?? []);

  if (files.length > 0) {
    startFileContainer.removeAttribute('hidden');
    startFileInput.innerHTML = files
      .map((file, index) => `<option value="${index}">${file.name}</option>`)
      .join('');
    startFileInput.selectedIndex = 0;
    submitButton.removeAttribute('disabled');
  } else {
    startFileContainer.setAttribute('hidden', '');
    submitButton.setAttribute('disabled', '');
  }
});

form.addEventListener('submit', async event => {
  event.preventDefault();

  if (files.length === 0) {
    return;
  }

  try {
    const result = await mergeFiles(files, startFileInput.selectedIndex);

    saveAs(new Blob([result], {type: 'text/html'}), 'Merged Story.html');
  } catch (error) {
    window.alert(
      `Something went wrong while merging: ${(error as Error).message}`
    );
  }
});
