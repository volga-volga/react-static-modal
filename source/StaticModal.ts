import Modal from "./Modal";
import React, { Component, ComponentType } from "react";

import {
  IModalProps,
  TObjectAny,
  IStaticModalProps,
  IStaticModalState
} from "./types";

const showModal = (instance: any) => () => {
  if (instance && instance.modal) {
    const { clickReady, state } = instance.modal;
    if (clickReady && !state.visible) instance.modal.onShow();
  }
};

const withStatic = (WrappedContent: ComponentType) => {
  class StaticModal extends Component<IStaticModalProps, IStaticModalState> {
    public state: IStaticModalState;
    private modal: Modal;

    static instance?: StaticModal = undefined;
    constructor(props: IStaticModalProps) {
      super(props);
      this.state = {
        afterShow: undefined,
        afterHide: undefined,
        beforeShow: undefined,
        beforeHide: undefined
      };

      this.modal = undefined;
      this.afterShow = this.afterShow.bind(this);
      this.afterHide = this.afterHide.bind(this);
      this.beforeHide = this.beforeHide.bind(this);
      this.beforeShow = this.beforeShow.bind(this);
    }

    static show(additionalShowProps: TObjectAny = {}) {
      const { instance } = StaticModal;
      if (instance) {
        instance.setState({ ...additionalShowProps }, showModal(instance));
      }
    }

    static hide(withoutScrollBrake?: boolean) {
      const { instance } = StaticModal;
      if (instance && instance.modal) instance.modal.onHide(withoutScrollBrake);
    }

    componentDidMount() {
      StaticModal.instance = this;
    }

    onRefModal(modal: any) {
      this.modal = modal;
    }

    getModalProps() {
      const { name } = this.props;
      const { afterShow, afterHide, beforeShow, beforeHide } = this;
      const children: ComponentType = <WrappedContent {...this.state} />;

      const props: IModalProps = {
        name,
        children,
        afterShow,
        afterHide,
        beforeShow,
        beforeHide,
        onRef: this.onRefModal
      };

      return props;
    }

    beforeShow() {
      if (this.state.beforeShow) {
        this.state.beforeShow();
      }
    }

    beforeHide() {
      if (this.state.beforeHide) {
        this.state.beforeHide();
      }
    }

    afterShow() {
      if (this.state.afterShow) {
        this.state.afterShow();
      }
    }

    afterHide() {
      if (this.state.afterHide) {
        this.state.afterHide();
      }
    }

    render() {
      return <Modal {...this.getModalProps()} />;
    }
  }

  return StaticModal;
};

export default withStatic;
