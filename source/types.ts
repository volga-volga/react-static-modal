import Modal from "./Modal";
import { ReactElement, ComponentType } from "react";

export type TObjectAny = { [key: string]: any };
export type TObjectString = { [key: string]: string };

interface IModalEvents {
  afterShow?: () => void;
  afterHide?: () => void;
  beforeShow?: () => void;
  beforeHide?: () => void;
}

export interface IModalProps extends IModalEvents {
  name: string;
  children: ReactElement | ComponentType<any>;
  
  onRef?: (component: Modal) => void;
}

export interface IModalState {
  isShow: boolean;
  isVisible: boolean;
}

export interface IStaticModalState extends IModalEvents {}

export interface IStaticModalProps {
  name: string;
}
