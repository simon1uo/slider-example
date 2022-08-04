class Slider {
  constructor(id) {
    this.container = document.getElementById(id);
    this.items = this.container.querySelectorAll(
      ".slider-list__item, .slider-list__item--selected"
    );

    const controller = this.container.querySelector(".slider-list__control");
    const controlBtns = this.container.querySelectorAll(
      ".slider-list__control-buttons, .slider-list__control-buttons--selected"
    );

    controller.addEventListener("mouseover", (event) => {
      const index = Array.from(controlBtns).indexOf(event.target);
      if (index >= 0) {
        this.slideTo(index);
        this.stop();
      }
    });

    controller.addEventListener("mouseout", () => {
      this.start();
    });

    this.container.addEventListener("slide", (event) => {
      const index = event.detail.index;
      const selected = controller.querySelector(
        ".slider-list__control-buttons--selected"
      );
      if (selected) {
        selected.className = "slider-list__control-buttons";
        controlBtns[index].className = "slider-list__control-buttons--selected";
      }
    });

    const prevBtn = document.querySelector("#slider-btn__prev");
    const nextBtn = document.querySelector("#slider-btn__next");

    prevBtn.addEventListener("click", (event) => {
      console.log("prev");
      this.stop();
      this.slidePrevious();
      this.start();
      event.preventDefault();
    });

    nextBtn.addEventListener("click", (event) => {
      console.log("next");
      this.stop();
      this.slideNext();
      this.start();
      event.preventDefault();
    });
  }

  getSelectedItem() {
    const selected = this.container.querySelector(
      ".slider-list__item--selected"
    );
    return selected;
  }

  getSelectedItemIndex() {
    return Array.from(this.items).indexOf(this.getSelectedItem());
  }

  slideTo(index) {
    const selected = this.getSelectedItem();
    if (selected) {
      selected.className = "slider-list__item";
    }
    const item = this.items[index];
    if (item) {
      item.className = "slider-list__item--selected";
    }

    const detail = { index: index };
    const event = new CustomEvent("slide", { bubbles: true, detail });
    this.container.dispatchEvent(event);
  }

  slideNext() {
    const currentIndex = this.getSelectedItemIndex();
    const nextIndex = (currentIndex + 1) % this.items.length;
    this.slideTo(nextIndex);
  }

  slidePrevious() {
    const currentIndex = this.getSelectedItemIndex();
    const previousIndex =
      (this.items.length + currentIndex - 1) % this.items.length;
    this.slideTo(previousIndex);
  }

  start() {
    this.stop();
    this._timer = setInterval(() => {
      this.slideNext();
    }, 2000);
  }

  stop() {
    clearInterval(this._timer);
  }
}

const slider = new Slider("my-slider");
slider.start();
