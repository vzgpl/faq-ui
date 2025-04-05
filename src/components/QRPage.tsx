import React from 'react';
import { Input, QRCode, Space } from 'antd';
import { Typography } from 'antd';

const { Paragraph, Text } = Typography;

const QRPage: React.FC = () => {
    const currentUrl = window.location.href;

    const [Url, setText] = React.useState(currentUrl);

    return (
        <Space direction="vertical" align="center">
            <QRCode value={Url || '-'} />
            <Text>Url:</Text>
            <Paragraph copyable={{ tooltips: false }}>{Url}</Paragraph>
        </Space>
    );
};

export default QRPage;