import React, { FC, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, message, Space, Spin, Typography } from 'antd';
import { useMetaMask } from '@/hooks/useMetaMask';
import { CertificateManager__factory } from '@/contract-types';

const { Text } = Typography;

export const OwnerCheck: FC = ({ children }) => {
  const { error, provider, account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState<string>();

  useEffect(() => {
    if (!provider || !account) return;

    setLoading(true);
    const certificateManager = CertificateManager__factory.connect(
      import.meta.env.SNOWPACK_PUBLIC_CONTRACT_ADDRESS,
      provider,
    );
    certificateManager.owner().then((value) => {
      setOwner(value.toLowerCase());
      setLoading(false);
    });
  }, [provider, account]);

  if (error) return null;

  if (account === null || loading)
    return (
      <Space>
        Loading Owner Check <Spin indicator={<LoadingOutlined spin />} />
      </Space>
    );

  if (account === false || !owner) {
    function doConnect() {
      connect().catch(() => message.error('Please accept to continue!'));
    }

    return (
      <Space direction="vertical">
        <Text>Connect your account to modify data</Text>
        <Button type="primary" onClick={doConnect}>
          Connect
        </Button>
      </Space>
    );
  }

  if (account !== owner) {
    return (
      <Space direction="vertical">
        <Text>Can't modify data because your account is not the owner</Text>
        <Text style={{ wordBreak: 'break-word' }}>
          Owner address:
          <br />
          {owner}
        </Text>
        <Text style={{ wordBreak: 'break-word' }}>
          Your account:
          <br />
          {account}
        </Text>
      </Space>
    );
  }

  return <>{children}</>;
};