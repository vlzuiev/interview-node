interface FolderAccess {
  source: string;
  target: string;
}

export function createLayerAccessFromLeftToRight(layers: string[]) {
  const reversedLayers = layers.reverse();
  const accesses: FolderAccess[] = [];
  reversedLayers.forEach((source, i) => {
    const slicedReversedLayers = reversedLayers.slice(i + 1);
    for (const target of slicedReversedLayers) {
      accesses.push({ source, target });
    }
  });
  return accesses;
}

export function doesNotMatchRegex(tokens: string[]): string {
  const joinedTokens = tokens.join('|');
  return `^((?!${joinedTokens}).)+$`;
}

export function createTsProjectPathRelativeToTest(
  dirname: string,
  path: string = '.'
) {
  if (!dirname.endsWith('/')) {
    dirname += '/.';
  }
  if (path.startsWith('/')) {
    dirname += path;
  } else {
    dirname += '/' + path;
  }
  if (!path.endsWith('/')) {
    dirname += '/';
  }
  return dirname;
}
