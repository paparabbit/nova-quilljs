import {Quill} from "vue-quill-editor";
const Embed = Quill.import('blots/embed')

export default class SoftLineBreakBlot extends Embed {

}
SoftLineBreakBlot.blotName = 'softbreak';
SoftLineBreakBlot.tagName = 'br';
