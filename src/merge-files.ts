function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsText(file);
  });
}

export async function mergeFiles(files: File[], startIndex: number) {
  const start = files[startIndex];
  const others = [...files];
  others.splice(startIndex, 1);
  let result = await readFile(start);

  if (!result.includes('<tw-storydata')) {
    throw new Error(
      `${start.name} doesn't seem to contain a <tw-storydata> element. Make sure it's a Twine story.`
    );
  }

  const root = document.createElement('div');

  root.innerHTML = result;

  const passages = Array.from(root.querySelectorAll('tw-passagedata'));
  let pid = passages.reduce((result, passage) => {
    const thisPid = parseInt(passage.getAttribute('pid') ?? '');

    if (!isNaN(thisPid) && thisPid > result) {
      return thisPid + 1;
    }

    return result;
  }, 0);

  for (const other of others) {
    const root = document.createElement('div');

    root.innerHTML = await readFile(other);

    const passageData = Array.from(root.querySelectorAll('tw-passagedata'));

    if (passageData.length === 0) {
      throw new Error(
        `${other.name} doesn't seem to contain any <tw-passagedata> elements. Make sure it's a Twine story.`
      );
    }

    for (const passage of passageData) {
      passage.setAttribute('pid', (++pid).toString());
      result = result.replace(
        '</tw-storydata>',
        passage.outerHTML + '</tw-storydata>'
      );
    }
  }

  return result;
}
