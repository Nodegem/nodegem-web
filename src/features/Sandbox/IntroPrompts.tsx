import { Button, Modal } from 'antd';
import { useStore } from 'overstated';
import React from 'react';
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
        graphModifyOrCreate,
        onGraphCreate,
        graphSelect,
        graphSelected,
    } = useStore(introStore, store => ({
        graphModifyOrCreate: store.ctx.graphModifyOrCreate,
        goBack: store.goBack,
        hasTabs: store.ctx.tabsStore.hasTabs,
        graphSelect: store.onGraphSelect,
        graphSelected: store.onGraphSelected,
        onGraphCreate: store.onGraphCreate,
        ...store.state,
    }));

    return (
        <>
            {/* <Modal
                className="graph-form-modal"
                visible={graphModalVisible}
                footer={null}
                centered
                maskClosable={false}
                onCancel={() => {
                    setGraphModalVisible(false);
                    setGraphToEdit(undefined);
                }}
            >
                <GraphForm
                    initialValue={graphToEdit}
                    handleSubmit={handleSaveGraph}
                />
            </Modal>
            <Modal
                className="macro-form-modal"
                visible={macroModalVisible}
                footer={null}
                centered
                maskClosable={false}
                onCancel={() => {
                    setMacroModalVisible(false);
                    setGraphToEdit(undefined);
                }}
            >
                <MacroForm
                    initialValue={graphToEdit as Macro}
                    handleSubmit={handleSaveMacro}
                />
            </Modal> */}
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
