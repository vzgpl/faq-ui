import React, {FC, useState, useEffect} from 'react';
import {Card, Drawer, Flex, Layout, Tree, Watermark} from 'antd';
import type {GetProps} from 'antd';
import {Splitter} from 'antd';
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom';
import {theme} from 'antd';

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const {DirectoryTree} = Tree;

interface TreeNode {
    title: string;
    key: string;
    children?: TreeNode[];
    isLeaf?: boolean;
}

const treeData: TreeNode[] = [
    {
        title: 'ParentComp1',
        key: 'ParentComp1',
        children: [
            {title: 'leaf 0-0', key: 'ChildrenComp1', isLeaf: true},
            {title: 'Текст и кортинки', key: 'ChildrenComp2', isLeaf: true},
        ],
    },
    {
        title: 'ParentComp2',
        key: 'ParentComp2',
        children: [
            {title: 'leaf 1-0', key: 'ChildrenComp3', isLeaf: true},
            {title: 'leaf 1-1', key: 'ChildrenComp4', isLeaf: true},
        ],
    },
];

interface WindowSize {
    width: number;
    height: number;
}

function useWindowSize(): WindowSize {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

const findAllParentKeys = (treeData: any[], key: string, path: string[] = []): string[] => {
    for (const node of treeData) {
        if (node.key === key) {
            return path;
        }
        if (node.children) {
            const result = findAllParentKeys(node.children, key, [...path, node.key]);
            if (result.length) {
                return result;
            }
        }
    }
    return [];
};

const findParentNode = (treeData: any[], key: string): any => {
    for (const node of treeData) {
        if (node.key === key) {
            return node;
        }
        if (node.children) {
            const result = findParentNode(node.children, key);
            if (result) {
                return result;
            }
        }
    }
    return null;
};

const loadComponent = async (key: string) => {
    try {
        const module = await import(`./sheets_paper/${key}`);
        return module.default;
    } catch (error) {
        console.error(`Компонент ${key} не найден`, error);
        return null;
    }
};

const {useToken} = theme;

const FAQTreePage: FC = () => {
    const {token} = useToken();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [components, setComponents] = useState<{ key: string; component: React.ComponentType }[]>([]);
    const windowSize = useWindowSize();
    const isMobile = windowSize.width < 768;
    const cardWidth = isMobile ? '99%' : '80%';
    const [panelSize, setPanelSize] = useState<string | number>(isMobile ? 0 : 300);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageKey = searchParams.get('page');
        if (pageKey) {
            setSelectedKeys([pageKey]);
            const parentKeys = findAllParentKeys(treeData, pageKey);
            setExpandedKeys(parentKeys);
        }
    }, []);

    useEffect(() => {
        setPanelSize(isMobile ? 0 : 300);
    }, [isMobile]);

    useEffect(() => {
        const pageKey = searchParams.get('page') || 'main';
        if (pageKey) {
            loadComponents(pageKey);
        }
    }, [location, searchParams]);

    const loadComponents = async (key: string) => {
        const parentNode = findParentNode(treeData, key);
        if (!parentNode) return;

        const parentComponent = await loadComponent(parentNode.key);
        if (!parentComponent) return;

        let childComponents: { key: string; component: React.ComponentType }[] = [];
        if (parentNode.children && parentNode.children.length > 0) {
            childComponents = await Promise.all(
                parentNode.children.map(async (child: any) => {
                    const component = await loadComponent(child.key);
                    return {key: child.key, component};
                })
            );
        }

        const validChildComponents = childComponents.filter((child) => child.component !== null);

        setComponents([
            {key: parentNode.key, component: parentComponent},
            ...validChildComponents,
        ]);
    };

    const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
        setSelectedKeys(keys.map(key => key.toString()));
        navigate(`?page=${keys[0]}`);
    };

    const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
        setExpandedKeys(keys.map(key => key.toString()));
    };

    const handleResize = (sizes: (number | string)[]) => {
        if (!isMobile) {
            setPanelSize(sizes[0]);
        } else {
            setOpen(true);
        }
    };
    const [open, setOpen] = useState(false);
    const onClose = () => {
        setOpen(false);
    };
    return (
        <Layout>
            <Splitter onResize={handleResize}>
                <Splitter.Panel
                    resizable={!isMobile}
                    collapsible={true}
                    size={panelSize}
                    max={isMobile ? 0 : 300}
                    style={{
                        minHeight: '100vh',
                        backgroundColor: token.colorBgContainer,
                        display: isMobile && panelSize === 0 ? 'none' : 'block'
                    }}
                >
                    <Drawer placement={'left'} onClose={onClose} open={open}
                            closable={false}
                            styles={{
                                header: { display: 'none' },
                                body: { padding: 0 }
                            }}
                    >
                        <Watermark
                            style={{backgroundColor: token.colorBgContainer}}
                            height={30}
                            width={100}
                            image="https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*lkAoRbywo0oAAAAAAAAAAAAADrJ8AQ/original"
                        >
                            <DirectoryTree
                                multiple
                                style={{minHeight: '100vh'}}
                                onSelect={onSelect}
                                onExpand={onExpand}
                                treeData={treeData}
                                selectedKeys={selectedKeys}
                                expandedKeys={expandedKeys}
                            />
                        </Watermark>
                    </Drawer>

                    <Watermark
                        style={{backgroundColor: token.colorBgContainer}}
                        height={30}
                        width={100}
                        image="https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*lkAoRbywo0oAAAAAAAAAAAAADrJ8AQ/original"
                    >
                        <DirectoryTree
                            multiple
                            style={{minHeight: '100vh'}}
                            onSelect={onSelect}
                            onExpand={onExpand}
                            treeData={treeData}
                            selectedKeys={selectedKeys}
                            expandedKeys={expandedKeys}
                        />
                    </Watermark>
                </Splitter.Panel>
                <Splitter.Panel style={{
                    backgroundColor: token.colorBgContainer,
                    backgroundRepeat: 'repeat',
                    backgroundSize: 'auto'
                }}>
                    <Flex gap="middle" vertical
                          style={{
                              overflowY: 'auto',
                              maxHeight: '100vh',
                              height: '100vh',
                          }}
                    >
                        {components.map(({key, component: Component}, index) => (
                            <Flex justify={"center"} align={"flex-start"} key={'flex' + key}>
                                <Card style={{width: cardWidth}}>
                                    <Component key={key}/>
                                </Card>
                            </Flex>
                        ))}
                    </Flex>
                </Splitter.Panel>
            </Splitter>
        </Layout>
    );
};

export default FAQTreePage;