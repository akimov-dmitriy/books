export default class Slider {
    /**
     *
     * @param {array} photos - array photos to view
     */
    constructor(photos) {
        this.photos = photos;
        this.count = 0;
        this.render();
        this.photoElem = document.querySelector('.photo');
        this.photoElem && (this.photoElem.src = photos[0]);
        this.setHandlers();
    }

    /**
     * removes the slider
     */
    destroy() {
        document.querySelector('.slider_wrap').innerHTML = '';
    }

    /**
     * sets events to slider buttons
     */
    setHandlers() {
        document.querySelector('.rightArrow').addEventListener('click', (e) => {
            e.preventDefault();
            this.photos.length > 1 && this.movePhotosRight();
            e.stopPropagation()
        });
        document.querySelector('.leftArrow').addEventListener('click', (e) => {
            e.preventDefault();
            this.photos.length > 1 && this.movePhotosLeft();
            e.stopPropagation()
        });
        document.querySelector('.substrate').addEventListener('click', () => {
            this.destroy();
        });
        document.querySelector('.close_slider').addEventListener('click', () => {
            this.destroy();
        });
    }

    /**
     *
     show next right photo
     */
    movePhotosRight() {
        this.count++;
        this.count >= this.photos.length && (this.count = 0);
        this.photoElem.src = this.photos[this.count];
    }

    /**
     * show next left photo
     */
    movePhotosLeft() {
        this.count--;
        this.count < 0 && (this.count = this.photos.length - 1);
        this.photoElem.src = this.photos[this.count];
    }

    /**
     *
     * @returns {boolean|string} - returns class 'hidden' to hide arrows
     */
    hideArrow() {
        return this.photos.length === 1 && 'hidden'
    }

    /**
     * render slider to 'slider_wrap'
     */
    render() {
        document.querySelector('.slider_wrap').innerHTML = `
            <div class="slider">
            <div class="close_slider-wrap">
                <div class="close_slider"></div>
            </div>
                <div class="substrate"></div>
                <div class="leftArrow ${this.hideArrow()}">
                    <img src="./assets/img/arrow.png" alt="arrow">
                </div>
                <div class="block_photo">
                    <img src="" alt="book photo" class="photo">
                </div>
                <div class="rightArrow ${this.hideArrow()}">
                    <img src="./assets/img/arrow.png" alt="arrow">
                </div>
            </div>
    `
    }
}
