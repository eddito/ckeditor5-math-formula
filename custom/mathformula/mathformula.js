// mathformula.js
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
import BalloonPanelView from '@ckeditor/ckeditor5-ui/src/panel/balloon/balloonpanelview';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import katex from 'katex';

export default class MathFormula extends Plugin {
    static get requires() {
        return [ Widget ];
    }

    init() {
  
        const editor = this.editor;
        editor.ui.componentFactory.add('mathFormula', locale => {
            const view = new ButtonView(locale);
            const balloon = new BalloonPanelView(locale);

            view.set({
                label: 'Math Formula',
                tooltip: true
            });

            view.on('execute', () => {
                // Create a <div> element that will be used as the content of the balloon panel.
                const div = document.createElement('div');
                div.innerHTML = '<input type="text" placeholder="Enter a math formula...">';

                // Add the <div> element to the balloon panel.
                balloon.content.add(div);

                // Show the balloon panel.
                editor.ui.view.body.add(balloon);
                editor.ui.view.body._element.appendChild(balloon.element);
                balloon.pin({ target: view.element, limiter: editor.ui.getEditableElement() });

                // Close the balloon panel when clicking outside of it.
                clickOutsideHandler({
                    emitter: balloon,
                    activator: () => balloon.visible,
                    contextElements: [ balloon.element ],
                    callback: () => this._hidePanel()
                });
            });

            return view;
        });

        // Convert the math formula to a widget.
        editor.conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: 'math-formula'
            },
            model: 'mathFormula'
        });

        editor.conversion.for('dataDowncast').elementToElement({
            model: 'mathFormula',
            view: {
                name: 'span',
                classes: 'math-formula'
            }
        });

        editor.conversion.for('editingDowncast').elementToElement({
            model: 'mathFormula',
            view: (modelElement, viewWriter) => {
                const span = viewWriter.createContainerElement('span', { class: 'math-formula' });
                return toWidget(span, viewWriter);
            }
        });

        // Add the conversion for the math formula.
    editor.conversion.for('downcast').add(dispatcher => {
    dispatcher.on('insert:mathFormula', (evt, data, conversionApi) => {
        // Get the math formula model element.
        const mathFormula = data.item;

        // Get the math formula text.
        const formula = conversionApi.writer.getAttribute('formula', mathFormula);

        // Render the math formula using KaTeX.
        const html = katex.renderToString(formula);

        // Create a view element for the math formula.
        const viewElement = conversionApi.writer.createRawElement('span', {
            class: 'math-formula'
        }, domElement => {
            // Set the inner HTML of the DOM element.
            domElement.innerHTML = html;
        });

        // Convert the view element to a model element.
        const modelElement = conversionApi.writer.toModelElement(viewElement);

        // Insert the model element into the model.
        conversionApi.writer.insert(conversionApi.writer.createPositionBefore(mathFormula), modelElement);

        // Prevent further conversion.
        evt.stop();
    });
});

        // Create the mathFormula model element.
        editor.model.schema.register('mathFormula', {
            isObject: true,
            allowWhere: '$text'
        });

        // Handle the Enter key press event to insert a math formula.
        editor.editing.view.document.on('enter', (evt, data) => {
            if (editor.editing.view.document.selection.isCollapsed && editor.editing.view.document.selection.hasAttribute('mathFormula')) {
                editor.model.change(writer => {
                    const mathFormula = writer.createElement('mathFormula');
                    editor.model.insertContent(mathFormula);
                    writer.setSelection(mathFormula, 'on');
                });

                data.preventDefault();
                evt.stop();
            }
        });
    }

    _hidePanel() {
        // Hide the balloon panel.
        this.editor.ui.view.body.remove(this.balloon);
        this.editor.ui.view.body._element.removeChild(this.balloon.element);
    }
}

// Add the conversion for the math formula.
// this.editor.conversion.for('downcast').add(dispatcher => {
//     dispatcher.on('insert:mathFormula', (evt, data, conversionApi) => {
//         // Get the math formula model element.
//         const mathFormula = data.item;

//         // Get the math formula text.
//         const formula = conversionApi.writer.getAttribute('formula', mathFormula);

//         // Render the math formula using KaTeX.
//         const html = katex.renderToString(formula);

//         // Create a view element for the math formula.
//         const viewElement = conversionApi.writer.createRawElement('span', {
//             class: 'math-formula'
//         }, domElement => {
//             // Set the inner HTML of the DOM element.
//             domElement.innerHTML = html;
//         });

//         // Convert the view element to a model element.
//         const modelElement = conversionApi.writer.toModelElement(viewElement);

//         // Insert the model element into the model.
//         conversionApi.writer.insert(conversionApi.writer.createPositionBefore(mathFormula), modelElement);

//         // Prevent further conversion.
//         evt.stop();
//     });
// });
