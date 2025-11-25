<script setup lang="ts">
// Rancher supplies a `machine` model with a .spec of type <your driver>Config
// This component should set keys that match your flags (e.g., otc-region, otc-flavor-id, etc.)
import { ref, watchEffect } from 'vue';

const props = defineProps<{ machine: { spec: Record<string, any> } }>();
const spec = props.machine.spec;

// Bind fields (use the same names your driver reads)
const region     = ref(spec['opentelekomcloud-region']       || '');
const az         = ref(spec['opentelekomcloud-availability-zone'] || '');
const vpcId      = ref(spec['opentelekomcloud-vpc-id']       || '');
const subnetId   = ref(spec['opentelekomcloud-subnet-id']    || '');
const flavorId   = ref(spec['opentelekomcloud-flavor-id']    || '');
const flavorName = ref(spec['opentelekomcloud-flavor-name']  || 's3.large.2');
const imageId    = ref(spec['opentelekomcloud-image-id']     || '');
const imageName  = ref(spec['opentelekomcloud-image-name']   || 'Standard_Ubuntu_24.04_amd64_uefi_latest');
const sshUser    = ref(spec['opentelekomcloud-ssh-user']     || 'ubuntu');
const sshPort    = ref(spec['opentelekomcloud-ssh-port']     || 22);
const keypair    = ref(spec['opentelekomcloud-keypair-name'] || '');
const rootSize   = ref(spec['opentelekomcloud-root-volume-size'] || 40);
const rootType   = ref(spec['opentelekomcloud-root-volume-type'] || 'SAS');
const secGroups  = ref<string[]>(spec['opentelekomcloud-sec-groups'] ? String(spec['opentelekomcloud-sec-groups']).split(',') : []);
const eipSkip    = ref(!!spec['opentelekomcloud-skip-eip']);
const eipType    = ref(spec['opentelekomcloud-eip-type'] || '5_bgp');
const bwType     = ref(spec['opentelekomcloud-bandwidth-type'] || 'PER');
const bwSize     = ref(spec['opentelekomcloud-bandwidth-size'] || 100);

// sync back to spec
watchEffect(() => {
  spec['opentelekomcloud-region']             = region.value.trim();
  spec['opentelekomcloud-availability-zone']  = az.value.trim();
  spec['opentelekomcloud-vpc-id']             = vpcId.value.trim();
  spec['opentelekomcloud-subnet-id']          = subnetId.value.trim();
  spec['opentelekomcloud-flavor-id']          = flavorId.value.trim();
  spec['opentelekomcloud-flavor-name']        = flavorName.value.trim();
  spec['opentelekomcloud-image-id']           = imageId.value.trim();
  spec['opentelekomcloud-image-name']         = imageName.value.trim();
  spec['opentelekomcloud-ssh-user']           = sshUser.value.trim();
  spec['opentelekomcloud-ssh-port']           = Number(sshPort.value) || 22;
  spec['opentelekomcloud-keypair-name']       = keypair.value.trim();
  spec['opentelekomcloud-root-volume-size']   = Number(rootSize.value) || 40;
  spec['opentelekomcloud-root-volume-type']   = rootType.value.trim();
  spec['opentelekomcloud-sec-groups']         = secGroups.value.join(',');
  spec['opentelekomcloud-skip-eip']           = !!eipSkip.value;
  spec['opentelekomcloud-eip-type']           = eipType.value;
  spec['opentelekomcloud-bandwidth-type']     = bwType.value;
  spec['opentelekomcloud-bandwidth-size']     = Number(bwSize.value) || 100;
});
</script>

<template>
  <div class="space-y-6">
    <h3 class="text-lg font-semibold">OpenTelekomCloud machine options</h3>

    <div class="grid md:grid-cols-2 gap-3">
      <div><label>Region</label><input class="form-control" v-model="region" placeholder="eu-de" /></div>
      <div><label>Availability Zone</label><input class="form-control" v-model="az" placeholder="eu-de-01" /></div>
      <div><label>VPC ID</label><input class="form-control" v-model="vpcId" /></div>
      <div><label>Subnet ID</label><input class="form-control" v-model="subnetId" /></div>
    </div>

    <div class="grid md:grid-cols-2 gap-3">
      <div><label>Flavor ID (or Name)</label><input class="form-control" v-model="flavorId" placeholder="s3.large.2 id" /></div>
      <div><label>Flavor Name</label><input class="form-control" v-model="flavorName" placeholder="s3.large.2" /></div>
      <div><label>Image ID (or Name)</label><input class="form-control" v-model="imageId" /></div>
      <div><label>Image Name</label><input class="form-control" v-model="imageName" /></div>
    </div>

    <div class="grid md:grid-cols-3 gap-3">
      <div><label>SSH User</label><input class="form-control" v-model="sshUser" /></div>
      <div><label>SSH Port</label><input class="form-control" type="number" v-model="sshPort" /></div>
      <div><label>Keypair Name</label><input class="form-control" v-model="keypair" /></div>
    </div>

    <div class="grid md:grid-cols-3 gap-3">
      <div><label>Root Volume Size (GiB)</label><input class="form-control" type="number" v-model="rootSize" /></div>
      <div>
        <label>Root Volume Type</label>
        <select class="form-control" v-model="rootType">
          <option>SAS</option><option>SSD</option><option>SATA</option>
        </select>
      </div>
      <div>
        <label>Security Groups (IDs, comma-separated)</label>
        <input class="form-control" :value="secGroups.join(',')" @input="e=>secGroups=e.target.value.split(',').map(x=>x.trim()).filter(Boolean)" />
      </div>
    </div>

    <details>
      <summary class="font-medium">Elastic IP (optional)</summary>
      <div class="grid md:grid-cols-3 gap-3 pt-2">
        <div><label>Skip EIP</label><input type="checkbox" v-model="eipSkip" /></div>
        <div><label>EIP Type</label><input class="form-control" v-model="eipType" /></div>
        <div><label>Bandwidth (Type / Size)</label>
          <div class="grid grid-cols-2 gap-2">
            <select class="form-control" v-model="bwType"><option>PER</option><option>WHOLE</option></select>
            <input class="form-control" type="number" v-model="bwSize" />
          </div>
        </div>
      </div>
    </details>

    <p class="text-sm text-muted mt-2">
      On save, Rancher uses your Cloud Credential and runs the driver’s <code>PreCreateCheck()</code> to validate the config.
    </p>
  </div>
</template>

<style scoped>
.form-control { @apply w-full border rounded px-3 py-2; }
.text-muted { color: #6b7280; }
</style>
