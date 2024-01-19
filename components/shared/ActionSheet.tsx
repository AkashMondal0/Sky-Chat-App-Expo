import React, { useState } from 'react';
import { FC } from 'react';
import { Text, View } from 'react-native';
import { ActionSheet } from 'react-native-ui-lib';
import MyText from './My-Text';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface options {
  label: string;
  onPress: () => void;
}
interface ActionSheetProps {
  children?: React.ReactNode;
  title: string;
  message?: string;
  cancelButtonIndex?: number;
  destructiveButtonIndex?: number;
  onPressDismiss?: () => void;
  options: options[]
  visible?: boolean | undefined;
}
const MyActionSheet: FC<ActionSheetProps> = ({
  title,
  options,
  visible,
  onPressDismiss
}) => {
  const {
    ThemeMode: { currentTheme },
  } = useSelector((state: RootState) => state)


  return (
    <ActionSheet
      renderTitle={() => {
        return <View style={{
          height: 50,
          alignItems: 'center',
          marginTop: 20,
        }}>
          <Text style={{
            fontSize: 20,
            color: currentTheme.textColor,
          }}>{title}</Text>
        </View>
      }}
      message={'Message goes here'}
      onDismiss={onPressDismiss}
      options={options || []}
      visible={visible || false}
      showCancelButton
      containerStyle={{
        backgroundColor: currentTheme.background,
        borderRadius: 25,
        height: 300,
      }}
      dialogStyle={{
        borderRadius: 25,
        backgroundColor: currentTheme.background,
      }}
      optionsStyle={{
        borderRadius: 25,
        backgroundColor: currentTheme.background,
      }}
      renderAction={(action, index) => {
        return <>
          <View style={{
            margin: 15,
          }}>
            <Text style={{
              color: currentTheme.textColor,
              fontSize: 20,
            }}>{action.label || ""}</Text>
          </View>
        </>
      }}
    />
  );
};

export default MyActionSheet;