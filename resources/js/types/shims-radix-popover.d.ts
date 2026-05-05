declare module '@radix-ui/react-popover' {
  import * as React from 'react';

  export const Root: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Portal: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
  export const Anchor: React.ComponentType<any>;
  export const Arrow: React.ComponentType<any>;
  export const Close: React.ComponentType<any>;

  const _default: {
    Root: typeof Root;
    Trigger: typeof Trigger;
    Portal: typeof Portal;
    Content: typeof Content;
    Anchor: typeof Anchor;
    Arrow: typeof Arrow;
    Close: typeof Close;
  };

  export default _default;
}
