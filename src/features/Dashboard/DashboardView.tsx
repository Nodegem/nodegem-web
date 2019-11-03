import 'utils/extensions';
import './Dashboard.less';

import { Button, Card, List, Modal, Spin, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import routerHistory from '../../utils/history';

import { GraphForm, IGraphFormValues } from 'components';
import { IMacroFormValues, MacroForm } from 'components/MacroForm/MacroForm';
import { FormikHelpers } from 'formik';
import { GraphService, MacroService } from 'services';
import { appStore } from 'stores';
import { isMacro } from 'utils';
import DashboardCard from './DashboardCard';

interface IButtonProps {
    onClick: (type: GraphType) => void;
    type: GraphType;
}

const AddButton: React.FC<IButtonProps> = ({ onClick, type }) => (
    <Tooltip title="Add">
        <Button
            icon="plus"
            shape="circle"
            type="primary"
            onClick={() => onClick(type)}
        />
    </Tooltip>
);

interface IRefreshButtonProps extends IButtonProps {
    loading: boolean;
}

const RefreshButton: React.FC<IRefreshButtonProps> = ({
    loading,
    onClick,
    type,
}) => (
    <Tooltip title="Refresh">
        <Button
            loading={loading}
            icon="sync"
            shape="circle"
            type="primary"
            ghost
            onClick={() => onClick(type)}
        />
    </Tooltip>
);

export const DashboardView: React.FC = () => {
    const [loadingGraphs, setLoadingGraphs] = useState(false);
    const [loadingMacros, setLoadingMacros] = useState(false);
    const [graphModalVisible, setGraphModalVisible] = useState(false);
    const [macroModalVisible, setMacroModalVisible] = useState(false);
    const [graphToEdit, setGraphToEdit] = useState<Graph | Macro | undefined>(
        undefined
    );
    const [graphs, setGraphs] = useState<Graph[]>([]);
    const [macros, setMacros] = useState<Macro[]>([]);

    const fetchGraphs = async () => {
        setLoadingGraphs(true);
        const fetchedGraphs = await GraphService.getAll();
        setLoadingGraphs(false);
        setGraphs(fetchedGraphs);
    };

    const fetchMacros = async () => {
        setLoadingMacros(true);
        const fetchedMacros = await MacroService.getAll();
        setLoadingMacros(false);
        setMacros(fetchedMacros);
    };

    const onAdd = (type: GraphType) => {
        if (type === 'graph') {
            setGraphModalVisible(true);
        } else {
            setMacroModalVisible(true);
        }
    };

    const handleSaveGraph = async (
        values: IGraphFormValues,
        actions: FormikHelpers<IGraphFormValues>
    ) => {
        try {
            if (graphToEdit !== undefined) {
                const editedGraph = await GraphService.update({
                    ...graphToEdit!,
                    ...values,
                });
                graphs.addOrUpdate(editedGraph, x => x.id === editedGraph.id);
                setGraphs([...graphs]);
                setGraphModalVisible(false);
                appStore.openNotification({
                    title: `Successfully edited ${values.name}!`,
                    description: '',
                    type: 'success',
                });
                setGraphToEdit(undefined);
            } else {
                const newGraph = await GraphService.create({
                    ...values,
                    userId: appStore.userStore.user.id,
                });
                setGraphs([...graphs, newGraph]);
                appStore.openNotification({
                    title: `Successfully created ${values.name}!`,
                    description: '',
                    type: 'success',
                });
            }
            setGraphModalVisible(false);
        } catch (e) {
            if (graphToEdit !== undefined) {
                appStore.openNotification({
                    title: 'Unable to edit graph',
                    description: `An error occurred while editing ${values.name}`,
                    type: 'error',
                });
            } else {
                appStore.openNotification({
                    title: 'Unable to create graph',
                    description: `An error occurred while creating ${values.name}`,
                    type: 'error',
                });
            }
        } finally {
            actions.setSubmitting(false);
        }
    };

    const handleSaveMacro = async (
        values: IMacroFormValues,
        actions: FormikHelpers<IMacroFormValues>
    ) => {
        try {
            if (graphToEdit !== undefined) {
                const editedMacro = await MacroService.update({
                    ...graphToEdit!,
                    ...values,
                });
                macros.addOrUpdate(editedMacro, x => x.id === editedMacro.id);
                setMacros([...macros]);
                setMacroModalVisible(false);
                appStore.openNotification({
                    title: `Successfully edited ${values.name}!`,
                    description: '',
                    type: 'success',
                });
                setGraphToEdit(undefined);
            } else {
                const newMacro = await MacroService.create({
                    ...values,
                    userId: appStore.userStore.user.id,
                });
                setMacros([...macros, newMacro]);
                appStore.openNotification({
                    title: `Successfully created ${values.name}!`,
                    description: '',
                    type: 'success',
                });
            }
            setMacroModalVisible(false);
        } catch (e) {
            if (graphToEdit !== undefined) {
                appStore.openNotification({
                    title: 'Unable to edit macro',
                    description: `An error occurred while editing ${values.name}`,
                    type: 'error',
                });
            } else {
                appStore.openNotification({
                    title: 'Unable to create macro',
                    description: `An error occurred while creating ${values.name}`,
                    type: 'error',
                });
            }
        } finally {
            actions.setSubmitting(false);
        }
    };

    const onRefresh = (type: GraphType) => {
        if (type === 'graph') {
            fetchGraphs();
        } else {
            fetchMacros();
        }
    };

    const onDelete = async (item: Graph | Macro, type: GraphType) => {
        if (type === 'graph') {
            await GraphService.delete(item.id);
            setGraphs(graphs.filter(x => x.id !== item.id));
        } else {
            await MacroService.delete(item.id);
            setMacros(macros.filter(x => x.id !== item.id));
        }
    };

    const onEditSettings = (item: Graph | Macro) => {
        setGraphToEdit(item);

        if (isMacro(item)) {
            setMacroModalVisible(true);
        } else {
            setGraphModalVisible(true);
        }
    };

    const onEdit = (item: Graph | Macro) => {
        appStore.setSelectedGraph(item);
        routerHistory.push('/sandbox');
    };

    useEffect(() => {
        try {
            fetchGraphs();
            fetchMacros();
        } catch (e) {
            console.error(e);
            appStore.toast('Unable to retrieve graphs and/or macros', 'error');
        }
    }, []);

    const combined = [
        {
            key: 'graph' as GraphType,
            name: 'Graphs',
            collection: graphs,
            loading: loadingGraphs,
            message: 'Fetching Graphs...',
        },
        {
            key: 'macro' as GraphType,
            name: 'Macros',
            collection: macros,
            loading: loadingMacros,
            message: 'Fetching Macros...',
        },
    ];
    return (
        <div className="dashboard">
            {combined.map((x, index) => (
                <div key={index}>
                    <Card
                        title={x.name}
                        extra={
                            <div className="additional-actions">
                                <AddButton type={x.key} onClick={onAdd} />
                                <RefreshButton
                                    loading={x.loading}
                                    type={x.key}
                                    onClick={onRefresh}
                                />
                            </div>
                        }
                    >
                        <Spin spinning={x.loading} tip={x.message} delay={500}>
                            <List
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 2,
                                    md: 4,
                                    lg: 4,
                                    xl: 6,
                                }}
                                dataSource={x.collection}
                                renderItem={(item: Graph) => (
                                    <List.Item key={item.id}>
                                        <DashboardCard
                                            item={item}
                                            type={x.key}
                                            onDelete={onDelete}
                                            onEdit={onEditSettings}
                                            onBuild={onEdit}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Spin>
                    </Card>
                </div>
            ))}
            <Modal
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
            </Modal>
        </div>
    );
};

export default DashboardView;
