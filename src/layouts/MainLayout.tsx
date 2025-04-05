import {ConfigProvider, Drawer, FloatButton, Layout, theme} from 'antd'; // Импортируем theme
import React, { useState, useEffect } from 'react'; // Добавляем useEffect
import { Typography } from 'antd';
import cookies from 'js-cookie';
import 'dayjs/locale/ru';
import enUs from 'antd/es/locale/en_US';
import { logout } from '../utils/axios';
import FAQTreePage from '../components/FAQTreePage';
import {HighlightOutlined, MoreOutlined, QrcodeOutlined, SearchOutlined} from '@ant-design/icons';
import QRPage from "../components/QRPage";

const { Text } = Typography;
const { Header, Sider, Content, Footer } = Layout;

const lightTheme = {
    algorithm: theme.defaultAlgorithm,
    components: {
        Tree: {
            directoryNodeSelectedBg: 'rgba(9,50,192,0.66)',
            directoryNodeSelectedColor: '#fafafa',
            indentSize: 5,
            titleHeight: 26,
            borderRadius: 1,
        },
        Card: {
            borderRadiusLG: 2,
            colorBorderSecondary: 'rgba(204,204,204,0)',
            colorBgContainer: 'rgba(255,255,255,0.93)',
        },
        Splitter:{
            controlItemBgActiveHover: 'rgb(178,178,178)',
            controlItemBgHover: 'rgb(171,171,171)',
            colorPrimary: 'rgb(171,171,171)',
            colorFill: 'rgb(171,171,171)',
            controlItemBgActive: 'rgb(126,126,126)',
        }
    },
};

const darkTheme = {
    algorithm: theme.darkAlgorithm,
    components: {
        Tree: {
            directoryNodeSelectedBg: 'rgb(31,31,31)',
            directoryNodeSelectedColor: '#ffffff',
            indentSize: 5,
            titleHeight: 26,
            borderRadius: 1,
        },
        Card: {
            borderRadiusLG: 0,
            colorBorderSecondary: 'rgba(51,51,51,0.87)',
            colorBgContainer: '#1f1f1f',
            colorText: '#f0f0f0',
        },
    },
};

export const MainLayout: any = () => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    const languageCode = cookies.get('i18next') || 'en';
    const [locale, setLocal] = useState(enUs);

    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme === 'dark' : false;
    });

    const logOut = () => logout();

    const toggleTheme = () => {
        setIsDarkTheme((prev) => {
            const newTheme = !prev;
            localStorage.setItem('theme', newTheme ? 'dark' : 'light');
            return newTheme;
        });
    };

    return (
        <ConfigProvider
            locale={locale}
            theme={isDarkTheme ? darkTheme : lightTheme}
        >
            <Layout>
                <FAQTreePage />
                <FloatButton.Group trigger="click" icon={<MoreOutlined />}>
                    <FloatButton icon={<SearchOutlined />}  />
                    <FloatButton icon={<QrcodeOutlined />} onClick={showDrawer} />
                    <FloatButton
                        icon={<HighlightOutlined />}
                        onClick={toggleTheme}
                    />
                </FloatButton.Group>
                <Drawer title="QR CODE" onClose={onClose} open={open}>
                    <QRPage></QRPage>
                </Drawer>
            </Layout>
        </ConfigProvider>
    );
};