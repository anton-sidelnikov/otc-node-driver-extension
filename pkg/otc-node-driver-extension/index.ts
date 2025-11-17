// pkg/otc-node-driver-extension/index.ts
import CloudCredential from './cloud-credential/otc.vue';
import MachineConfig   from './machine-config/otc.vue';

export default function(plugin: any) {
  plugin.register('cloud-credential', 'otc', CloudCredential);
  plugin.register('machine-config',   'otc', MachineConfig);
}
