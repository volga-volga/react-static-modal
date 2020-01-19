import ReactDOM from "react-dom";
import React, { Component } from "react";
import { IModalProps, IModalState, TObjectString } from "./types";

import "./style/style.scss";

const SCROLL_BRAKE_CLASS = "scroll-brake";

const DELAY = 500;

class Modal extends Component<IModalProps, IModalState> {
  public state: IModalState;
  private clickReady: boolean;

  constructor(props: IModalProps) {
    super(props);
    this.state = {
      isShow: false,
      isVisible: false
    };

    this.clickReady = true;

    this.onShow = this.onShow.bind(this);
    this.onHide = this.onHide.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.renderCross = this.renderCross.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.getClassName = this.getClassName.bind(this);
    this.onPressedKey = this.onPressedKey.bind(this);
  }

  componentDidMount() {
    const { onRef } = this.props;

    if (onRef) onRef(this);
    window.addEventListener("keydown", this.onPressedKey.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onPressedKey.bind(this));
  }

  onShow(newState: TObjectString = {}) {
    this.brakeEnable();
    this.setState({ isShow: true }, () => {
      setTimeout(() => {
        this.setState({
          ...newState,
          isVisible: true
        });
      }, 0);
    });
  }

  onHide(withoutScrollBrake?: boolean) {
    const { afterHide, beforeHide } = this.props;

    if (this.clickReady) {
      this.clickReady = false;
      this.setState({ isVisible: false });

      if (beforeHide) beforeHide();

      setTimeout(() => {
        if (!withoutScrollBrake) this.brakeDisable();

        this.setState({ isShow: false }, () => {
          this.clickReady = true;
          if (afterHide) afterHide();
        });
      }, DELAY);
    }
  }

  onPressedKey(event: any) {
    const { isShow } = this.state;
    if (isShow && event.key === "Escape") this.onHide();
  }

  brakeEnable() {
    document.body.classList.add(SCROLL_BRAKE_CLASS);
  }

  brakeDisable() {
    document.body.classList.remove(SCROLL_BRAKE_CLASS);
  }

  toggleModal() {
    const { isShow } = this.state;

    if (this.clickReady) {
      if (isShow) this.onHide();
      else this.onShow();
    }
  }

  getClassName() {
    const { isVisible } = this.state;

    let className = this.classNames.modal;
    if (isVisible) className += ` ${this.classNames.modalVisible}`;

    return className;
  }

  renderCross() {
    return (
      <div
        className={this.classNames.crossContainer}
        onClick={() => this.onHide()}
      >
        <div className={this.classNames.crossContainerWrapper}>
          <div className={this.classNames.crossContainerWrapperContent} />
        </div>
      </div>
    );
  }

  renderModal() {
    const { children, name } = this.props;

    return (
      <div className={this.getClassName()} data-modal={name}>
        <div className={this.classNames.scrollContainer}>
          <div className={this.classNames.scrollContainerWrapper}>
            <div className={this.classNames.scrollContainerWrapperContent}>
              {this.renderCross()}
              {children || null}
            </div>
            <div
              className={this.classNames.fade}
              onClick={() => this.onHide()}
            />
          </div>
        </div>
      </div>
    );
  }

  classNames = {
    modal: "modal",
    modalVisible: "modal_visible",

    fade: "modal__fade",

    scrollContainer: "scroll-container",
    scrollContainerWrapper: "scroll-container__wrapper",
    scrollContainerWrapperContent: "scroll-container__wrapper-content content",

    crossContainer: "cross-container",
    crossContainerWrapper: "cross-container__wrapper",
    crossContainerWrapperContent: "cross-container__wrapper-content"
  };

  render = () => {
    if (!this.state.isShow) return null;
    return ReactDOM.createPortal(this.renderModal(), document.body);
  };
}

export default Modal;
