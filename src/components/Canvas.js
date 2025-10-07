
export default class Canvas {

    constructor(width, height) {
        this.canvas = document.createElement('canvas');
        this.width = width || 640;
        this.height = height || 480;
        this.canvas.width = this.width; 
        this.canvas.height = this.height; 
        this.context = this.canvas.getContext('2d');
    }

    static init(width, height) {
        const instance = new Canvas(width, height);
        return instance; 
    }

    clear(focus) {
        this.context.clearRect(
            focus.x - this.canvas.width,
            focus.y - this.canvas.height,
            focus.x + 2 * this.canvas.width,
            focus.y + 2 * this.canvas.height
        )
    }

    shift(dx, dy) {
        this.context.translate(dx, dy);
    }

    drawPoint(x, y, radius, color) {
        this.context.fillStyle = color || "rgba(0, 0, 0, 1)";
        this.context.beginPath();
        this.context.arc(x, y, radius , 0, 2 * Math.PI);
        this.context.fill();
    }

    drawLine(from_x, from_y, to_x, to_y, width, color) {
        color = color || "rgb(0, 0, 0)";
        width = width || 1;
        this.context.strokeWidth = width;
        this.context.strokeStyle = color;
        this.context.beginPath(); 
        this.context.moveTo(from_x + 0.5, from_y + 0.5);
        this.context.lineTo(to_x + 0.5, to_y + 0.5);
        this.context.stroke(); 
    }

    drawHLine(from_x, to_x, y, width, color) {
        this.drawLine(
            from_x, y,
            to_x, y,
            width,
            color
        );
    }

    drawVLine(x, from_y, to_y, width, color) {
        this.drawLine(
            x, from_y,
            x, to_y,
            width,
            color
        );
    }

}
