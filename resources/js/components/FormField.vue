<template>
  <default-field
    :field="field"
    :errors="errors"
    :full-width-content="field.width"
  >
    <template slot="field">
      <quill-editor
        :style="css"
        v-model="value"
        ref="myQuillEditor"
        :options="editorOption"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"
      ></quill-editor>
    </template>
  </default-field>
</template>

<script>
import { FormField, HandlesValidationErrors } from "laravel-nova";
import { quillEditor, Quill } from "vue-quill-editor";
import BlotFormatter from "quill-blot-formatter";

import Tooltip from "quill/ui/tooltip";
import "quill/dist/quill.snow.css";
import htmlEditButton from "quill-html-edit-button";
import SoftLineBreakBlot from "../soft_break";
import Delta from 'quill-delta';

Quill.register({
  "modules/blotFormatter": BlotFormatter,
  "ui/tooltip": Tooltip,
  "modules/htmlEditButton": htmlEditButton,
});

Quill.register(SoftLineBreakBlot);

export default {
  mixins: [FormField, HandlesValidationErrors],
  components: {
    quillEditor,
  },
  props: ["resourceName", "resourceId", "field"],
  data() {
    return {
      persisted: [],
      toolbarTips: this.field.tooltip,
      editorOption: {
        placeholder: this.field.placeholder,
        modules: {
          htmlEditButton: {},
          keyboard: {
            bindings: {
              "shift enter": {
                key: 13,
                shiftKey: true,
                handler: this.shiftEnterHandler
              }
            }
          },
          clipboard: {
            matchers: [
              [ "BR", this.brMatcher ]
            ],
          },

          toolbar: {
            container: this.field.options,
            handlers: {
            },
          },
        },
      },
    };
  },
  methods: {
    _uuid() {
      var d = Date.now();
      if (
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
      ) {
        d += performance.now(); //use high-precision timer if available
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
        c
      ) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
    },
    /*
     * Set the initial, internal value for the field.
     */
    setInitialValue() {
      this.value = this.field.value || "";
    },

    /**
     * Fill the given FormData object with the field's internal value.
     */
    fill(formData) {
      formData.append(this.field.attribute, this.value || "");
      if (!formData.has('persisted')) {
        formData.append('persisted', JSON.stringify(this.persisted));
      }
    },

    /**
     * Handle a shift enter
     */
    shiftEnterHandler(range)
    {
      this.editor.insertEmbed(range.index, 'softbreak', true, Quill.sources.USER);
      this.editor.setSelection(range.index + 1, Quill.sources.SILENT);
      return false;
    },

    /**
     * I think if a <br> is pasted into the field this will handle it
     */
    brMatcher(node, delta) {
      let newDelta = new Delta();
      newDelta.insert({softbreak: true});
      return newDelta;
    },

    /**
     * Update the field's internal value.
     */
    handleChange(value) {
      this.value = value;
    },

    onEditorBlur(quill) {
      // console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      // console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      // console.log("editor ready!", quill);
    },
    onEditorChange({ quill, html, text }) {
      // console.log("editor change!", quill, html, text);
      this.content = html;
    },
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
    css() {
      return {
        height: this.field.height + 41 + "px",
        "padding-bottom": this.field.paddingBottom + 40 + "px",
      };
    },
  },
  mounted() {
    autotip: {
      if (this.toolbarTips) {
        for (let item of this.toolbarTips) {
          let tip = document.querySelector(".quill-editor " + item.Choice);
          if (!tip) continue;
          tip.setAttribute("title", item.title);
        }
      }
    }
  },
};
</script>

<style>
.ql-editor p {
  margin-top: 18px;
  font-size: 18px;
}
</style>
