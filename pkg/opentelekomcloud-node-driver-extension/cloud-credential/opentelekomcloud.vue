<script setup lang="ts">
// Minimal cloud credential form for OTC (AK/SK or user/password + domain + project)
import { ref, computed } from 'vue';

// Rancher passes a `credential` model to this component.
// It has a `data` object where you store key/value pairs.
const props = defineProps<{ credential: { data: Record<string, any> } }>();

const d = props.credential.data;

// model fields (keys become Cloud Credential data keys)
const accessKey   = ref(d['otc-access-key']   || '');
const secretKey   = ref(d['otc-secret-key']   || '');
const username    = ref(d['otc-username']     || '');
const password    = ref(d['otc-password']     || '');
const domainName  = ref(d['otc-domain-name']  || '');
const projectName = ref(d['otc-project-name'] || '');
const region      = ref(d['otc-region']       || '');
const authURL     = ref(d['otc-auth-url']     || '');

// keep the model in sync
watchEffect(() => {
  d['otc-access-key']   = accessKey.value.trim();
  d['otc-secret-key']   = secretKey.value.trim();
  d['otc-username']     = username.value.trim();
  d['otc-password']     = password.value;
  d['otc-domain-name']  = domainName.value.trim();
  d['otc-project-name'] = projectName.value.trim();
  d['otc-region']       = region.value.trim();
  d['otc-auth-url']     = authURL.value.trim();
});

// Simple guard: require region + one auth shape
const hasAKSK  = computed(() => accessKey.value && secretKey.value);
const hasUser  = computed(() => username.value && password.value && domainName.value && projectName.value);
const valid    = computed(() => region.value && (hasAKSK.value || hasUser.value));
</script>

<template>
  <div class="space-y-3">
    <h3 class="text-lg font-semibold">OpenTelekomCloud credentials</h3>

    <div class="grid md:grid-cols-2 gap-3">
      <div>
        <label>Region</label>
        <input class="form-control" v-model="region" placeholder="eu-de" />
      </div>

      <div>
        <label>Auth URL (optional)</label>
        <input class="form-control" v-model="authURL" placeholder="https://iam.eu-de.otc.t-systems.com/v3" />
      </div>
    </div>

    <details class="mt-2">
      <summary class="font-medium">Authenticate with Access Key / Secret Key</summary>
      <div class="grid md:grid-cols-2 gap-3 pt-2">
        <div>
          <label>Access Key</label>
          <input class="form-control" v-model="accessKey" />
        </div>
        <div>
          <label>Secret Key</label>
          <input class="form-control" type="password" v-model="secretKey" />
        </div>
      </div>
    </details>

    <details class="mt-2">
      <summary class="font-medium">Or with Username / Password / Domain / Project</summary>
      <div class="grid md:grid-cols-2 gap-3 pt-2">
        <div><label>Username</label><input class="form-control" v-model="username" /></div>
        <div><label>Password</label><input class="form-control" type="password" v-model="password" /></div>
        <div><label>Domain Name</label><input class="form-control" v-model="domainName" /></div>
        <div><label>Project Name</label><input class="form-control" v-model="projectName" /></div>
      </div>
    </details>

    <p class="text-sm text-muted">
      Rancher will validate these credentials via the driver’s <code>PreCreateCheck()</code> before saving your node template.
    </p>

    <!-- Rancher enables the Save button; this shows users what's missing -->
    <p v-if="!valid" class="text-warning">Enter Region and either AK/SK or Username/Password/Domain/Project.</p>
  </div>
</template>

<style scoped>
.form-control { @apply w-full border rounded px-3 py-2; }
.text-warning { color: #b45309; }
.text-muted { color: #6b7280; }
</style>
