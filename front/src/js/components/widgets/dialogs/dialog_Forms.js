import { getText } from '../../../helpers/lang';
import { Component } from '../../../LIGHTER';
import FormCreator from '../../forms/FormCreator';

class DialogForms extends Component {
    constructor(data) {
        super(data);
        this.appState = this.Router.commonData.appState;
        this.Dialog = this.appState.get('Dialog');
    }

    createEditDialog = (params) => {
        const { id, title, addToMessage, afterFormSentFn, onErrorFn } = params;
        this.Dialog.appear({
            component: FormCreator,
            componentData: {
                id,
                appState: this.appState,
                beforeFormSendingFn: () => {
                    this.Dialog.lock();
                },
                afterFormSentFn: () => {
                    this.Dialog.disappear();
                    if(afterFormSentFn) afterFormSentFn();
                },
                addToMessage,
                onErrorsFn: (ex, res) => {
                    this.Dialog.unlock();
                    if(onErrorFn) onErrorFn();
                    if(res && res.status === 401) this.Router.changeRoute('/');
                },
                onFormChanges: () => { this.Dialog.changeHappened(); },
                formLoadedFn: () => { this.Dialog.onResize(); },
                extraButton: {
                    label: getText('cancel'),
                    clickFn: (e) => {
                        e.preventDefault();
                        this.Dialog.disappear();
                    },
                },
            },
            title,
        });
    }
}

export default DialogForms;