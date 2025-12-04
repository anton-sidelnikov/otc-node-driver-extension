import { importTypes } from '@rancher/auto-import';
import { IPlugin } from '@shell/core/types';

// Init the package
export default function(plugin: IPlugin) {
  // Auto-import localization file(s)
  importTypes(plugin);

  const metadata = require('./package.json');
  plugin.register('image', 'opentelekomcloud.svg', require('./opentelekomcloud.svg'));

  // Attach metadata and tell Rancher which registered image to use as the extension icon
  plugin.metadata = {
    ...metadata,
    icon: 'opentelekomcloud.svg',
  };
}
