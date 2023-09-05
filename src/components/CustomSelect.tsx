import {Dropdown} from 'react-native-element-dropdown';
import React from 'react';

type Props = {
  data: {value: string; text: string}[];
  onChange(value: string): void;
};

const CustomSelect = (props: Props) => {
  return (
    <Dropdown
      data={props.data}
      labelField={'value'}
      valueField={'value'}
      onChange={function (item: {value: string; text: string}): void {
        props.onChange(item.value);
      }}
    />
  );
};

export default CustomSelect;
