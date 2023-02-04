<script setup lang="ts">
import Cropper from "cropperjs";
import FileUpload, { VueUploadItem } from "vue-upload-component";
import { computed, nextTick, Ref, ref, toRef, watch } from "vue";

import { ImageFieldValue } from "@/interfaces/Forms/MyPageFormAttributes";
import { useField } from "vee-validate";

const props = defineProps<{ name: string }>();

const { value, handleChange, errors } = useField<ImageFieldValue>(
  toRef(props, "name")
);

const files: Ref<VueUploadItem[]> = ref([]);
const showEditDialog = ref(false);
const cropper: Ref<Cropper | false> = ref(false);
const editImage: Ref<HTMLImageElement | null> = ref(null);
const upload: Ref<VueUploadItem | undefined> = ref();

const displayedImage = computed(() => {
  if (files.value?.length) {
    return files.value[0].url;
  } else if (value.value[1]) {
    return value.value[1];
  } else {
    return "https://www.gravatar.com/avatar/default?s=200&r=pg&d=mm";
  }
});

watch(showEditDialog, (show) => {
  if (show) {
    nextTick(() => {
      if (!editImage.value) {
        return;
      }
      let cropperInstance = new Cropper(editImage.value, {
        aspectRatio: 1 / 1,
        viewMode: 1,
      });
      cropper.value = cropperInstance;
    });
  } else {
    if (cropper.value) {
      cropper.value?.destroy();
      cropper.value = false;
    }
  }
});

function inputFile(newFile?: VueUploadItem, oldFile?: VueUploadItem) {
  if (newFile && !oldFile) {
    showEditDialog.value = true;
  }
  if (!newFile && oldFile) {
    showEditDialog.value = false;
  }
}

function inputFilter(
  newFile: VueUploadItem,
  oldFile: VueUploadItem,
  prevent: () => void
) {
  if (newFile && !oldFile) {
    if (!/\.(gif|jpg|jpeg|png|webp)$/i.test(newFile.name || "")) {
      alert("Your choice is not a picture");
      return prevent();
    }
  }
  if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
    newFile.url = "";
    let URL = window.URL || window.webkitURL;
    if (URL && URL.createObjectURL) {
      newFile.url = URL.createObjectURL(newFile.file!);
    }
  }
}

function editSave() {
  showEditDialog.value = false;
  let oldFile = files.value[0];
  let binStr = atob(
    cropper.value!.getCroppedCanvas().toDataURL(oldFile.type).split(",")[1]
  );
  let arr = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) {
    arr[i] = binStr.charCodeAt(i);
  }
  let file = new File([arr], oldFile.name!, { type: oldFile.type });
  upload.value!.update(oldFile.id, {
    file,
    type: file.type,
    size: file.size,
    active: true,
  });

  const reader = new FileReader();
  reader.onload = () => handleChange([file, reader.result]);
  reader.readAsDataURL(file);
}
</script>

<template>
  <div class="example-avatar">
    <div v-show="upload && upload.dropActive" class="drop-active">
      <h3>Drop files to upload</h3>
    </div>
    <div class="avatar-upload" v-show="!showEditDialog">
      <div class="text-center p-2">
        <label for="avatar">
          <img :src="displayedImage" class="rounded-circle" />
          <h4 class="pt-2">or<br />Drop files anywhere to uploadrrrr</h4>
        </label>
      </div>
      <div class="text-center p-2">
        <FileUpload
          extensions="gif,jpg,jpeg,png,webp"
          accept="image/png,image/gif,image/jpeg,image/webp"
          name="avatar"
          class="btn btn-primary"
          post-action="/upload/post"
          :drop="!showEditDialog"
          v-model="files"
          @input-filter="inputFilter"
          @input-file="inputFile"
          ref="upload"
        >
          Upload avatar
        </FileUpload>
      </div>
    </div>

    <v-dialog v-model="showEditDialog">
      <v-card>
        <v-container>
          <div class="avatar-edit">
            <div class="avatar-edit-image" v-if="files.length">
              <img ref="editImage" :src="files[0].url" />
            </div>
            <div class="text-center p-4">
              <button
                type="button"
                class="btn btn-secondary"
                @click.prevent="upload.clear"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                @click.prevent="editSave"
              >
                Save
              </button>
            </div>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.example-avatar .avatar-upload .rounded-circle {
  width: 200px;
  height: 200px;
}
.example-avatar .text-center .btn {
  margin: 0 0.5rem;
}
.example-avatar .avatar-edit-image {
  max-width: 100%;
}

.example-avatar .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: 0.6;
  text-align: center;
  background: #000;
}
.example-avatar .drop-active h3 {
  margin: -0.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
</style>
