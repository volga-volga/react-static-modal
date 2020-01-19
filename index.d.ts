/// <reference types="react" />
declare module 'react-static-modal';

type TObjectAny = { [key: string]: any };
type TObjectString = { [key: string]: string };

interface IModalEvents {
  afterShow?: () => void;
  afterHide?: () => void;
  beforeShow?: () => void;
  beforeHide?: () => void;
}

interface IModalProps extends IModalEvents {
  name: string;
  children: React.ReactElement | React.ComponentType<any>;
  
  onRef?: (component: Modal) => void;
}

interface IModalState {
  isShow: boolean;
  isVisible: boolean;
}

interface IStaticModalState extends IModalEvents {}

interface IStaticModalProps {
  name: string;
}

export class Modal {
  public state: IModalState;
}

// export class StaticModal {
//   public state: IModalState;
// }

type StaticModal = any;

export default StaticModal;