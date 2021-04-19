import React, { useCallback, useContext } from 'react';
import { Header as MainHeader, OptionButton, Options, Title } from './styled';
import Context from '../state';
import { Checkbox, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import useBoolean from '@/common/hooks/useBoolean';
import { Types } from '../state/interface';

const Header = () => {
  const {
    state: { arrayOrderSensitive },
    dispatch,
  } = useContext(Context);
  const [visible, { toggle }] = useBoolean(false);
  const menu = useCallback(() => {
    return (
      <Menu>
        <Menu.Item>
          <Checkbox
            defaultChecked={arrayOrderSensitive}
            onChange={() => dispatch({ type: Types.ToggleArrayOrderSensitive })}
          >
            数组顺序敏感
          </Checkbox>
        </Menu.Item>
      </Menu>
    );
  }, []);
  return (
    <MainHeader>
      <Title>JSON比对</Title>
      <Options onVisibleChange={toggle} trigger={['click']} visible={visible} overlay={menu} arrow>
        <OptionButton>
          选项 <DownOutlined />
        </OptionButton>
      </Options>
    </MainHeader>
  );
};
export default Header;
