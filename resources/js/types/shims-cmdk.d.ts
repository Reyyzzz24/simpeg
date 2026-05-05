declare module 'cmdk' {
  import * as React from 'react';

  export const Command: React.ComponentType<any> & {
    Input: React.ComponentType<any>;
    List: React.ComponentType<any>;
    Empty: React.ComponentType<any>;
    Group: React.ComponentType<any>;
    Separator: React.ComponentType<any>;
    Item: React.ComponentType<any>;
  };

  export const Input: React.ComponentType<any>;
  export const List: React.ComponentType<any>;
  export const Empty: React.ComponentType<any>;
  export const Group: React.ComponentType<any>;
  export const Separator: React.ComponentType<any>;
  export const Item: React.ComponentType<any>;

  export default Command;
}
