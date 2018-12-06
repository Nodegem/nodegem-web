import * as React from "react";
import { observer } from "mobx-react";
import { graphService } from "src/services/graph/graph-service";
import { Button, Card, List } from "antd";
import './Dashboard.less';
import { withRouter, RouteComponentProps } from "react-router";
import { DashboardItem } from "./DashboardItem";
import { dashboardStore } from "./dashboard-store";
import ModalMacroForm from "./Modals/ModalMacroForm";
import ModalGraphForm from "./Modals/ModalGraphForm";

interface ButtonProps { name: string, onAdd: (e: React.MouseEvent) => void }
const AddButton : React.SFC<ButtonProps> = props => 
    <Button type="primary" onClick={props.onAdd}>{`Add ${props.name}`}</Button>

const closeModal = (key: string) => {
    dashboardStore.modalOptions[key] = { visible: false };
}

const onSuccess = async (key: string, values: any, resetFields) => {

    try {

        const newGraph = await graphService.createGraph(values);
        dashboardStore.addGraph(newGraph);

    } catch(e) {
        
    }

    resetFields();
    closeModal(key);
}

const onFailure = (key: string, values: any, error: any) => {
    closeModal(key);
}

const onOpenModal = (key: string, value?: object) => {
    dashboardStore.modalOptions[key] = { visible: true, value };
}

const onCancel = (key: string) => {
    closeModal(key);
}

const onBuild = () => {

}

const onEdit = (item) => {
    if(isMacro(item)) {
        onOpenModal("macro", item);
    } else {
        onOpenModal("graph", item);
    }
}

const onDelete = async (item) => {
    try {
        await graphService.deleteGraph(item.id);
        dashboardStore.removeGraph(item);
    } catch(e) {

    }
}

function isMacro(arg: any): arg is Macro {
    return arg.flowInputs !== undefined;
} 

dashboardStore.loadGraphs();

export const DashboardView : React.SFC = observer(props => {

    const { graphs, macros, modalOptions } = dashboardStore;
    const modalProps = { onSuccess, onFailure, onCancel };

    const data = [
        {
            modalKey: "graph",
            title: "Graph",
            collection: graphs,
        },
        {
            modalKey: "macro",
            title: "Macro",
            collection: macros
        }
    ]

    return (
        <div className="dashboard">
            {
                data.map((x, index) => 
                    (
                        <Card
                        key={index}
                        title={`${x.title}s`}
                        extra={<AddButton name={x.title} onAdd={e => onOpenModal(x.modalKey)} />}>
                            <List
                                grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6 }}
                                dataSource={x.collection}
                                renderItem={(item: any) => (
                                    <List.Item>
                                        <DashboardItem item={...item} onBuild={onBuild} onEdit={onEdit} onDelete={onDelete} />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    )
                )
            }
            <ModalGraphForm modalkey="graph" visible={modalOptions["graph"].visible} model={modalOptions["graph"].value} {...modalProps} />
            <ModalMacroForm modalkey="macro" visible={modalOptions["macro"].visible} model={modalOptions["macro"].value} {...modalProps} />
        </div>
    );
})