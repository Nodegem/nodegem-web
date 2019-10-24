import { Button, Modal } from 'antd';
import GraphModalFormController from 'components/Modals/GraphModal/GraphModalForm';
import MacroModalFormController from 'components/Modals/MacroModal/MacroModalForm';
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
            <GraphModalFormController
                onSave={graphModifyOrCreate}
                onGoBack={goBack}
            />
            <MacroModalFormController
                onSave={graphModifyOrCreate}
                onGoBack={goBack}
            />
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
