import React from "react";
import Modal from "./Modal";

const showModal = instance => () => {
  if (instance && instance.modal) {
    const { clickReady, state } = instance.modal;
    if (clickReady && !state.visible) instance.modal.onShow();
  }
};

const withStatic = WrappedContent => {
  class StaticModal extends React.Component {
    static instance = undefined;

    static show(additionalShowProps = {}) {
      const { instance } = StaticModal;
      if (instance) {
        instance.setState({ ...additionalShowProps }, showModal(instance));
      }
    }

    static hide(withoutScrollBrake) {
      const { instance } = StaticModal;
      if (instance && instance.modal) instance.modal.onHide(withoutScrollBrake);
    }

    constructor(props) {
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
      this.onRefModal = this.onRefModal.bind(this);
      this.beforeHide = this.beforeHide.bind(this);
      this.beforeShow = this.beforeShow.bind(this);
      this.getModalProps = this.getModalProps.bind(this);
    }

    componentDidMount() {
      StaticModal.instance = this;
    }

    onRefModal(modal) {
      this.modal = modal;
    }

    getModalProps() {
      const { name } = this.props;
      const { afterShow, afterHide, beforeShow, beforeHide } = this;
      const children = <WrappedContent {...this.state} />;

      const props = {
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
