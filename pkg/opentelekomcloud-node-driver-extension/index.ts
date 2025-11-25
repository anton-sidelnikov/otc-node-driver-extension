// pkg/otc-node-driver-extension/index.ts
import CloudCredential from './cloud-credential/opentelekomcloud.vue';
import MachineConfig   from './machine-config/opentelekomcloud.vue';

export default function(plugin: any) {
  plugin.register('cloud-credential', 'opentelekomcloud', CloudCredential);
  plugin.register('machine-config',   'opentelekomcloud', MachineConfig);
}
