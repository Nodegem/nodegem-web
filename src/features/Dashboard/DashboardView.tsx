import * as React from "react";
import { observer } from "mobx-react";
import { graphService } from "src/services/graph/graph-service";
import { Tabs, Button, Row, Card, Col, Icon } from "antd";
import './Dashboard.less';
import AddGraphForm from "./AddGraphForm";
import { withRouter, RouteComponentProps } from "react-router";
import { Meta } from "antd/lib/list/Item";

interface DashboardViewState {
    graphs: Array<Graph>;
    macros: Array<any>,
    key: string,
    modalVisible: boolean,
}

const AddButton = ({content, onClick} : { content: string, onClick: (e) => void }) => (
    <Button className="btn btn-add" type="primary" onClick={onClick}>{content}</Button>
)

const operations = (onClick: (e) => void) => ({
    graph: <AddButton content="Add Graph" onClick={onClick} />,
    macro: <AddButton content="Add Macro" onClick={onClick} />
})

const modalTitles = ({
    graph: "Create Graph",
    macro: "Create Macro"
})

const modalContent = (visible: boolean, onSubmit: (success: boolean, values: any) => void, onCancel: () => void) => ({
    graph: <AddGraphForm visible={visible} onSubmit={onSubmit} onCancel={onCancel} />,
    macro: <AddGraphForm visible={visible} onSubmit={onSubmit} onCancel={onCancel} />
})

const cardActions = ([
    <Icon type="build" theme="twoTone" />,
    <Icon type="edit" theme="twoTone" />,
    <Icon type="ellipsis" />
])

const TabPane = Tabs.TabPane;

@observer
class DashboardView extends React.Component<RouteComponentProps<any>, DashboardViewState> {
    state: DashboardViewState = {
        graphs: [],
        macros: [],
        key: "graph",
        modalVisible: false,
    };

    public async componentDidMount() {
        this.setState({
            graphs: await graphService.getAllGraphs()
        }, () => console.log(this.state.graphs));
    }

    private onButtonClick = (e: React.MouseEvent) => {
        this.setState({ modalVisible: true })
    }

    private onModalOk = async (success: boolean, values: any) => {

        if(success) {
            try {
                const newGraph = await graphService.createGraph(values);
                this.setState({ 
                    modalVisible: false,
                    graphs: [...this.state.graphs, newGraph]
                });
            } catch(err) {
                console.warn(err.response);
            }
        } else {

        }
    }

    private onModalCancel = () => {
        this.setState({ modalVisible: false })
    }

    private onTabChange = (key) => {
        this.setState({ key });
    }

    public render() {
        const { graphs, key, modalVisible } = this.state;

        return (
            <div className="dashboard">
                <Tabs size="large" activeKey={key} onChange={this.onTabChange} tabBarExtraContent={operations(this.onButtonClick)[key]}>
                    <TabPane tab="Graphs" key="graph">
                        <div className="content">
                            <Row gutter={16}>
                                {graphs.map((g, index) => (
                                    <Col span={3} key={index}>
                                        <Card
                                            bordered
                                            actions={cardActions}>
                                            <Meta 
                                                title={g.name}
                                                description={g.description}
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </TabPane>
                    <TabPane tab="Macros" key="macro">
                    </TabPane>
                </Tabs>
                {modalContent(modalVisible, this.onModalOk, this.onModalCancel)[key]}
            </div>
        );
    }
}

export default withRouter(DashboardView);
