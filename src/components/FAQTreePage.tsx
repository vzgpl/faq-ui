import React, {FC, useState, useEffect} from 'react';
import {Card, Flex, Layout, Tree, Watermark} from 'antd';
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
        console.error(`Компонент  ${key} не найден`, error);
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
        const pageKey = searchParams.get('page') || 'main';
        if (pageKey) {
            loadComponents(pageKey);
        }
    }, [location]);

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

    return (
        <Layout>
            <Splitter>
                <Splitter.Panel collapsible={true}
                                defaultSize="15%" min="10%" max="40%"
                                style={{minHeight: '100vh', backgroundColor: token.colorBgContainer}}
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
                </Splitter.Panel>
                <Splitter.Panel style={{
                    backgroundColor: token.colorBgContainer,
                    // backgroundImage: 'url(/bg_1.png)',
                    backgroundRepeat: 'repeat',
                    backgroundSize: 'auto'
                }}>
                    <Flex gap="middle" vertical
                          style={{
                              overflowY: 'auto',
                              maxHeight: '100vh',
                          }}
                    >
                        {components.map(({key, component: Component}, index) => (
                            <Flex justify={"center"} align={"flex-start"} key={'ddd' + key}>
                                <Card style={{width: '80%'}}>
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