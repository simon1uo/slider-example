class Component {
  constructor(
    id,
    options = {
      name: "",
      data: [],
    }
  ) {
    this.container = document.getElementById(id);
    this.options = options;
    this.container.innerHTML = this.render(options.data);
  }

  registerPlugins(...plugins) {
    plugins.forEach((plugin) => {
      const pluginContainer = document.createElement("div");
      pluginContainer.className = `.${this.options.name}__plugin`;
      pluginContainer.innerHTML = plugin.render(this.options.data);
      this.container.appendChild(pluginContainer);
      plugin.action(this);
    });
  }

  render(data) {
    // abstract
    return "";
  }
}
class Slider extends Component {
  constructor(
    id,
    options = {
      name: "slider-list",
      data: [],
      cycle: 3000,
    }
  ) {
    super(id, options);

    this.items = this.container.querySelectorAll(
      ".slider-list__item, .slider-list__item--selected"
    );
    this.cycle = options.cycle || 3000;
    this.slideTo(0);
  }

  render(data) {
    const content = data.map((image) =>
      `<li class="slider-list__item">
        <img src="${image}"/>
      </li>`.trim()
    );
    return `<ul>${content.join("")}</ul>`;
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

const pluginController = {
  render(images) {
    return `<div class="slider-list__control">
      ${images
        .map(
          (image, i) =>
            `<span class="slider-list__control-buttons${
              i === 0 ? "--selected" : ""
            }"></span>`
        )
        .join("")}
    </div>`.trim();
  },

  action(slider) {
    const controller = slider.container.querySelector(".slider-list__control");
    if (controller) {
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

      controller.addEventListener("mouseout", (event) => {
        slider.start();
      });

      slider.container.addEventListener("slide", (event) => {
        const index = event.detail.index;
        const selected = controller.querySelector(
          ".slider-list__control-buttons--selected"
        );
        if (selected) {
          selected.className = "slider-list__control-buttons";
          controlBtns[index].className =
            "slider-list__control-buttons--selected";
        }
      });
    }
  },
};

const pluginPrevious = {
  render() {
    return `<button class="slider-btn" id="slider-btn__prev">⬅️</button>`;
  },
  action(slider) {
    const prevBtn = slider.container.querySelector("#slider-btn__prev");

    prevBtn.addEventListener("click", () => {
      slider.stop();
      slider.slidePrevious();
      slider.start();
      event.preventDefault();
    });
  },
};

const pluginNext = {
  render() {
    return `<button class="slider-btn" id="slider-btn__next">➡️</button>`;
  },
  action(slider) {
    const nextBtn = slider.container.querySelector("#slider-btn__next");

    nextBtn.addEventListener("click", (event) => {
      slider.stop();
      slider.slideNext();
      slider.start();
      event.preventDefault();
    });
  },
};

const slider = new Slider("my-slider", {
  name: "slider-list",
  data: [
    "https://source.unsplash.com/random/500x500/?ocean",
    "https://source.unsplash.com/random/500x500/?sky",
    "https://source.unsplash.com/random/500x500/?dog",
    "https://source.unsplash.com/random/500x500/?cat",
  ],
  cycle: 2000,
});
slider.registerPlugins(pluginController, pluginNext, pluginPrevious);
slider.start();
