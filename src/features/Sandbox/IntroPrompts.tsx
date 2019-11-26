import { Button, Modal } from 'antd';
import {
    GraphForm,
    IGraphFormValues,
    IMacroFormValues,
    MacroForm,
} from 'components';
import { FormikHelpers } from 'formik';
import { useStore } from 'overstated';
import React from 'react';
import { GraphService, MacroService } from 'services';
import { appStore } from 'stores';
import { IMacroRunFormValues, MacroRunForm } from './MacroRunForm';
import PromptGraph from './PromptGraph/PromptGraph';
import SelectGraph from './PromptGraph/SelectGraph';
import { IntroStore } from './stores/intro-store';

interface IIntroPromptsProps {
    introStore: IntroStore;
}

export const IntroPrompts: React.FC<IIntroPromptsProps> = ({ introStore }) => {
    const {
        isChoosingGraphState,
        isInStartPrompt,
        hasTabs,
        goBack,
        graphModifiedOrCreated,
        onGraphCreate,
        graphSelect,
        graphSelected,
        isGraphModalOpen,
        isMacroModalOpen,
        graphToEdit,
        activeTab,
        isMacroRunModalOpened,
        runGraph,
        toggleMacroRunModal,
    } = useStore(introStore, store => ({
        graphModifiedOrCreated: store.ctx.graphModifiedOrCreated,
        goBack: store.goBack,
        hasTabs: store.ctx.tabsStore.hasTabs,
        activeTab: store.ctx.tabsStore.activeTab,
        runGraph: store.ctx.sandboxHeaderStore.runGraph,
        graphSelect: store.onGraphSelect,
        graphSelected: store.onGraphSelected,
        onGraphCreate: store.onGraphCreate,
        toggleMacroRunModal: store.toggleMacroRunModal,
        ...store.state,
    }));

    const graphSubmitted = async (
        values: IGraphFormValues,
        actions: FormikHelpers<IGraphFormValues>
    ) => {
        try {
            let graph: Graph;
            if (graphToEdit) {
                const { initial } = activeTab;
                graph = await GraphService.update({
                    ...initial,
                    ...values,
                });
            } else {
                graph = await GraphService.create({
                    ...values,
                    userId: appStore.userStore.user.id,
                });
            }
            graphModifiedOrCreated(graph);
        } catch (e) {
            console.error(e);
            appStore.toast('Unable to create/modify graph', 'error');
        } finally {
            actions.setSubmitting(false);
        }
    };

    const macroSubmitted = async (
        values: IMacroFormValues,
        actions: FormikHelpers<IMacroFormValues>
    ) => {
        try {
            let macro: Macro;
            if (graphToEdit) {
                const { initial } = activeTab;
                macro = await MacroService.update({
                    ...initial,
                    ...values,
                });
            } else {
                macro = await MacroService.create({
                    ...values,
                    userId: appStore.userStore.user.id,
                });
            }
            graphModifiedOrCreated(macro);
        } catch (e) {
            console.error(e);
            appStore.toast('Unable to create/modify macro', 'error');
        } finally {
            actions.setSubmitting(false);
        }
    };

    const runMacroSubmitted = async (
        values: IMacroRunFormValues,
        actions: FormikHelpers<IMacroRunFormValues>
    ) => {
        runGraph(values.flowInputField, []);
        actions.setSubmitting(false);
        toggleMacroRunModal(false);
    };

    return (
        <>
            <Modal
                title="Run Macro"
                className="macro-run-form-modal"
                visible={isMacroRunModalOpened}
                footer={null}
                centered
                onCancel={() => toggleMacroRunModal(false)}
                closable={false}
            >
                {activeTab && (
                    <MacroRunForm
                        flowInputs={(activeTab.graph as Macro).flowInputs}
                        valueInputs={(activeTab.graph as Macro).valueInputs}
                        handleRun={runMacroSubmitted}
                        handleCancel={() => toggleMacroRunModal(false)}
                    />
                )}
            </Modal>
            <Modal
                className="graph-form-modal"
                visible={isGraphModalOpen}
                footer={null}
                centered
                maskClosable={false}
                onCancel={goBack}
            >
                <GraphForm
                    initialValue={graphToEdit}
                    handleSubmit={graphSubmitted}
                />
            </Modal>
            <Modal
                className="macro-form-modal"
                visible={isMacroModalOpen}
                footer={null}
                centered
                maskClosable={false}
                onCancel={goBack}
            >
                <MacroForm
                    initialValue={graphToEdit as Macro}
                    handleSubmit={macroSubmitted}
                />
            </Modal>
            <Modal
                className="sandbox-modal prompt-graph-modal"
                maskClosable={hasTabs}
                visible={isInStartPrompt}
                footer={null}
                onCancel={goBack}
                centered
                closable={hasTabs}
            >
                <PromptGraph
                    onSelectGraph={graphSelect}
                    onTypeSelect={onGraphCreate}
                />
            </Modal>
            <Modal
                className="sandbox-modal select-graph-modal"
                title="Select Graph or Macro"
                maskClosable={hasTabs}
                visible={isChoosingGraphState}
                footer={
                    <Button onMouseDown={goBack} icon="left">
                        Go Back
                    </Button>
                }
                onCancel={goBack}
                centered
                closable={hasTabs}
            >
                <SelectGraph onGraphSelect={graphSelected} />
            </Modal>
        </>
    );
};
