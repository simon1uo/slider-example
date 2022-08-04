class Slider {
  constructor(id) {
    this.container = document.getElementById(id);
    this.items = this.container.querySelectorAll(
      ".slider-list__item, .slider-list__item--selected"
    );
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

  registerPlugins(...plugins) {
    plugins.forEach((plugin) => plugin(this));
  }
}

const pluginController = (slider) => {
  const controller = slider.container.querySelector(".slider-list__control");
  const controlBtns = slider.container.querySelectorAll(
    ".slider-list__control-buttons, .slider-list__control-buttons--selected"
  );

  controller.addEventListener("mouseover", (event) => {
    const index = Array.from(controlBtns).indexOf(event.target);
    if (index >= 0) {
      slider.slideTo(index);
      slider.stop();
    }
  });

  controller.addEventListener("mouseout", () => {
    slider.start();
  });

  slider.container.addEventListener("slide", (event) => {
    const index = event.detail.index;
    const selected = controller.querySelector(
      ".slider-list__control-buttons--selected"
    );
    if (selected) {
      selected.className = "slider-list__control-buttons";
      controlBtns[index].className = "slider-list__control-buttons--selected";
    }
  });
};

const pluginPrevious = (slider) => {
  const prevBtn = document.querySelector("#slider-btn__prev");
  prevBtn.addEventListener("click", (event) => {
    slider.stop();
    slider.slidePrevious();
    slider.start();
    event.preventDefault();
  });
};

const pluginNext = (slider) => {
  const nextBtn = document.querySelector("#slider-btn__next");
  nextBtn.addEventListener("click", (event) => {
    slider.stop();
    slider.slideNext();
    slider.start();
    event.preventDefault();
  });
};

const slider = new Slider("my-slider");
slider.registerPlugins(pluginController, pluginPrevious, pluginNext);
slider.start();
