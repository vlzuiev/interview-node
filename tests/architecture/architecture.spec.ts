import {
  createLayerAccessFromLeftToRight,
  doesNotMatchRegex,
} from './utils/architectureHelpers';
import { filesOfProject } from 'tsarch';

import 'tsarch/dist/jest';

jest.setTimeout(120_000);

describe('server architecture rules', () => {
  it('layers in the direction of the facades', async () => {
    const folderAccesses = createLayerAccessFromLeftToRight([
      'controller',
      'services',
      'facades',
    ]);

    for (const access of folderAccesses) {
      const rule = filesOfProject()
        .inFolder(access.source)
        .shouldNot()
        .dependOnFiles()
        .inFolder(access.target);
      expect(rule).toPassAsync();
    }
  });

  it('the server should not access the client', async () => {
    const rule = filesOfProject()
      .matchingPattern('^src')
      .shouldNot()
      .dependOnFiles()
      .inFolder('client')
      .matchingPattern(doesNotMatchRegex(['shared']));

    expect(rule).toPassAsync();
  });

  describe('http requests shall go through facades as anti corruption layer', () => {
    it('axios shall only be used by tests, the request handler, and external dependencies', async () => {
      const rule = filesOfProject()
        .matchingPattern(
          doesNotMatchRegex(['spec.ts$', 'tests', 'node_modules', 'build'])
        )
        .shouldNot()
        .dependOnFiles()
        .matchingPattern('.*axios.*');

      expect(rule).toPassAsync();
    });

    it('the request handler shall only be used by facades', async () => {
      const rule = filesOfProject()
        .matchingPattern(
          doesNotMatchRegex([
            'spec.ts$',
            'facades',
            'tests',
            'node_modules',
            'build',
          ])
        )
        .shouldNot()
        .dependOnFiles()
        .matchingPattern('RequestHandler');

      expect(rule).toPassAsync();
    });

    it('the bsh request handler shall only be used by the RequestHandler', async () => {
      const rule = filesOfProject()
        .matchingPattern(
          doesNotMatchRegex(['node_modules', 'RequestHandler.ts'])
        )
        .shouldNot()
        .dependOnFiles()
        .matchingPattern('axios');
      expect(rule).toPassAsync();
    });
  });
});
