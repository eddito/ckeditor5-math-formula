export default class MathFormula extends Plugin {
    static get requires(): (typeof Widget)[];
    init(): void;
    _hidePanel(): void;
}
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import Widget from "@ckeditor/ckeditor5-widget/src/widget";
