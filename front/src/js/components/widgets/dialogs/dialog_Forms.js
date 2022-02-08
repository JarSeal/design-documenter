import { getText } from '../../../helpers/lang';
import { Component } from '../../../LIGHTER';
import FormCreator from '../../forms/FormCreator';

class DialogForms extends Component {
    constructor(data) {
        super(data);
        this.appState = this.Router.commonData.appState;
        this.Dialog = this.appState.get('Dialog');
    }

    createDeleteDialog = (params) => {
        const { id, title, addToMessage, formDesc, afterFormSentFn, onErrorFn } = params;
        this.Dialog.appear({
            component: FormCreator,
            componentData: {
                id,
                appState: this.appState,
                beforeFormSendingFn: () => {
                    this.Dialog.lock();
                },
                formDesc,
                afterFormSentFn: (response) => {
                    this.Dialog.disappear();
                    if(afterFormSentFn) afterFormSentFn(response);
                },
                addToMessage,
                onErrorsFn: (ex, res) => {
                    this.Dialog.unlock();
                    if(onErrorFn) onErrorFn(ex, res);
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

    createEmptyFormDialog = (params) => {
        const { id, title, afterFormSentFn, onErrorFn } = params;
        this.Dialog.appear({
            component: FormCreator,
            componentData: {
                id,
                appState: this.appState,
                beforeFormSendingFn: () => {
                    this.Dialog.lock();
                },
                afterFormSentFn: (response) => {
                    this.Dialog.disappear();
                    if(afterFormSentFn) afterFormSentFn(response);
                },
                onErrorsFn: (ex, res) => {
                    this.Dialog.unlock();
                    if(onErrorFn) onErrorFn(ex, res);
                    if(res && res.status === 401) this.Router.changeRoute('/');
                },
                onFormChanges: () => { this.Dialog.changeHappened(); },
                formLoadedFn: () => { this.Dialog.onResize(); },
            },
            title,
        });
    }

    createEditDialog = (params) => {
        const { id, title, addToMessage, editDataId, afterFormSentFn, onErrorFn } = params;
        this.Dialog.appear({
            component: FormCreator,
            componentData: {
                id,
                appState: this.appState,
                editDataId,
                beforeFormSendingFn: () => {
                    this.Dialog.lock();
                },
                afterFormSentFn: (response) => {
                    this.Dialog.disappear();
                    if(afterFormSentFn) afterFormSentFn(response);
                },
                addToMessage,
                onErrorsFn: (ex, res) => {
                    this.Dialog.unlock();
                    if(onErrorFn) onErrorFn(ex, res);
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